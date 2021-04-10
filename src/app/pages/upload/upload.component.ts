import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Media, Taxon } from 'src/app/interfaces';
import { MediaService } from 'src/app/services/media.service';
import { TaxonService } from 'src/app/services/taxon.service';
import { UserService } from 'src/app/services/user.service';
import { SharedService } from '../../services/shared.service';
import { PlacesService } from 'src/app/services/places.service';
import { ImageService } from 'src/app/services/image.service';
import firebase from 'firebase/app';
import { PredictionService } from 'src/app/services/prediction.service';
import { PredictionModel } from 'src/app/models/prediction.model';
import { FirestoreService } from 'src/app/services/firestore.service';
import { MediaModel } from 'src/app/models/media.model';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit, AfterViewInit {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  tempTaxonDoc: Taxon | undefined;
  tempPlaceName: string | undefined;
  media: Media | MediaModel | undefined;
  taxonSuggestions: Array<{ uid: string; confidence: string }> | undefined;
  suggestedTaxonList: Taxon[] = [];
  searchTaxonList: Taxon[] = [];
  selectPlaceModalVisible = false;
  thumbnailUrl: string | undefined;
  imageUrl: string | undefined;
  base64Image: string | undefined;
  fetching: boolean | undefined = true;
  routeImage: string | undefined;
  predictionData: PredictionModel | undefined;

  constructor(
    public sharedService: SharedService,
    public userService: UserService,
    public mediaService: MediaService,
    private imageService: ImageService,
    private placesService: PlacesService,
    private taxonService: TaxonService,
    private predictionService: PredictionService,
    private firestoreService: FirestoreService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    sharedService.appLabel = 'Upload';
  }

  ngOnInit(): void {
    this.media = new MediaModel().createNew(
      this.firestoreService.createRandomUid(),
      this.userService.user?.uid
    );
  }

  ngAfterViewInit(): void {
    this.subscribeToRoute();
  }

  private subscribeToRoute(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.routeImage = params.image;
      const taxon = params.taxon;
      const place = params.place;
      // if place exists, set it
      if (place) {
        this.media!.placeUid = place;
        this.placesService
          .getPlaceDetails(place)
          .then((placeDetails: google.maps.places.PlaceResult) => {
            this.tempPlaceName = placeDetails.name;
          });
      }
      // if image param exists, set temp image, else trigger upload
      if (this.routeImage) {
        this.media!.image = this.imageUrl;
        this.media!.thumbnail = this.thumbnailUrl;
        // set suggested taxon
        this.setSuggestedTaxonList();
      } else {
        this.fileInput?.nativeElement.click();
      }
      // if taxon param exists, get and set taxon doc, else reset taxon
      if (taxon) {
        this.taxonService
          .getTaxon(taxon)
          .then(
            (taxonDocSnapshot: firebase.firestore.DocumentSnapshot<Taxon>) => {
              const taxonDoc = taxonDocSnapshot.data();
              this.tempTaxonDoc = taxonDoc;
              this.media!.taxonUid = taxonDoc?.uid;
            }
          );
      } else {
        this.tempTaxonDoc = undefined;
        this.media!.taxonUid = undefined;
      }
    });
  }

  importImage(tar: EventTarget | null): void {
    const files = (tar as HTMLInputElement).files;
    if (files) {
      // crop and upload the thumbnail
      this.imageService
        .resizeAndCropImage(files[0], [300, 300])
        .then((imgString: string) => {
          this.base64Image = imgString.split('base64,')[1];
          this.imageService
            .getBlobFromImgString(imgString)
            .then((imgBlob: Blob) => {
              this.mediaService
                .uploadFile(`media/${this.media?.uid}_thumb`, imgBlob)
                .then((downloadUrl: string) => {
                  this.thumbnailUrl = downloadUrl;
                });
            });
        });

      // resize and get string
      this.imageService
        .getResizedImgString(files[0])
        .then((imgString: string) => {
          // then get blob from string
          this.imageService
            .getBlobFromImgString(imgString)
            .then((imgBlob: Blob) => {
              // then upload blob
              this.mediaService
                .uploadFile(`media/${this.media?.uid}`, imgBlob)
                .then((downloadUrl: string) => {
                  this.imageUrl = downloadUrl;

                  const predictionUid = this.firestoreService.createRandomUid();
                  let predictionModel: PredictionModel = new PredictionModel().deserialize(
                    {
                      imageUrl: downloadUrl,
                      uid: predictionUid
                    }
                  );
                  this.firestoreService.createDocument(predictionModel);
                  // set router param
                  this.router.navigate([], {
                    relativeTo: this.route,
                    queryParams: { image: predictionUid },
                    queryParamsHandling: 'merge'
                  });
                });
            });
        });
    }
  }

  private setSuggestedTaxonList(): void {
    // if the photo is being uploaded now, send it to the model
    if (this.base64Image) {
      this.fetching = true;
      this.predictionService
        .getTaxonSuggestions(this.base64Image)
        .then((modelResult) => {
          this.taxonSuggestions = modelResult;
          this.fetching = false;

          // update prediction on Firestore document
          this.predictionData = new PredictionModel().deserialize({
            uid: this.routeImage,
            predictions: modelResult
          });
          this.firestoreService.updateDocument(this.predictionData);

          this.getTaxonsDocuments();
        });
    }
    // if prediction already exists, load it from the document
    else if (this.routeImage) {
      this.fetching = false;

      this.firestoreService
        .getDocument(this.routeImage, 'predictions')
        .then((predictionDoc: any) => {
          this.predictionData = new PredictionModel().deserialize(
            predictionDoc.data()
          );

          this.taxonSuggestions = this.predictionData.predictions;
          this.media!.image = this.predictionData?.imageUrl;

          this.getTaxonsDocuments();
        });
    }
  }

  private getTaxonsDocuments() {
    // get taxon doc for each ID and push to suggested list
    if (this.taxonSuggestions) {
      this.taxonSuggestions.forEach((taxon: any) => {
        this.taxonService
          .getTaxon(taxon.uid)
          .then(
            (taxonDocSnapshot: firebase.firestore.DocumentSnapshot<Taxon>) => {
              this.suggestedTaxonList.push(taxonDocSnapshot.data()!);
            }
          );
      });
    }
  }

  private setSearchTaxonList(searchTerm?: string): void {
    // query taxon collection
    this.taxonService
      .searchTaxon('commonName.en', searchTerm)
      .then((taxonQuerySnapshot: firebase.firestore.QuerySnapshot<Taxon>) => {
        taxonQuerySnapshot.docs.forEach(
          (
            taxonDocSnapshot: firebase.firestore.QueryDocumentSnapshot<Taxon>
          ) => {
            this.searchTaxonList.push(taxonDocSnapshot.data());
          }
        );
      });
  }

  handleSearch(tar: any): void {
    // find input node to get search term
    const searchTerm: string = tar.closest('kor-input').getAttribute('value');
    // reset prior queries
    this.searchTaxonList = [];
    if (searchTerm) {
      // get new query based on capitalized search term
      this.setSearchTaxonList(this.sharedService.capitalizeString(searchTerm));
    }
  }

  setDate(tar: any): void {
    const isoDate = tar.value;
    if (this.media) {
      this.media.date = isoDate
        ? firebase.firestore.Timestamp.fromDate(new Date(isoDate))
        : undefined;
    }
  }

  setDescription(tar: any): void {
    const description = tar.value;
    if (this.media) {
      this.media.description = description;
    }
  }

  setTaxon(taxonUid: string): void {
    this.media!.taxonUid = taxonUid;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { taxon: taxonUid },
      queryParamsHandling: 'merge'
    });
  }

  setPlace(placeUid: string | undefined): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { place: placeUid },
      queryParamsHandling: 'merge'
    });
  }

  handleConfirm(): void {
    if (!this.userService.user) {
      this.userService.signInModalVisible = true;
    } else if (this.media) {
      this.media.ownerUid = this.userService.user.uid;
      const predictionConfirmed: PredictionModel = new PredictionModel().deserialize(
        {
          uid: this.routeImage,
          submittedUid: this.media!.taxonUid
        }
      );
      this.firestoreService.updateDocument(predictionConfirmed);

      const media = new MediaModel().deserialize(this.media);

      this.firestoreService.createDocument(media).then(() => {
        this.router.navigateByUrl(`media/${this.media?.uid}`);
      });
    }
  }

  getTaxonConfidence(taxonUid: string): number | undefined {
    const taxon = this.taxonSuggestions?.find(({ uid }) => uid === taxonUid);
    return taxon ? parseInt(taxon.confidence) : undefined;
  }

  blur(tar: any): void {
    tar.blur();
  }
}
