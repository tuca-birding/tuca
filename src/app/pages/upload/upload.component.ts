import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Media, Taxon } from 'src/app/interfaces';
import { MediaService } from 'src/app/services/media.service';
import { TaxonService } from 'src/app/services/taxon.service';
import { UserService } from 'src/app/services/user.service';
import { SharedService } from '../../services/shared.service';
import firebase from 'firebase/app';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PlacesService } from 'src/app/services/places.service';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit, AfterViewInit {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  tempTaxonDoc: Taxon | undefined;
  tempPlaceName: string | undefined;
  media: Media | undefined;
  taxonSuggestions: any[] | undefined;
  suggestedTaxonList: Taxon[] = [];
  searchTaxonList: Taxon[] = [];
  selectPlaceModalVisible = false;

  constructor(
    public sharedService: SharedService,
    public userService: UserService,
    public mediaService: MediaService,
    private imageService: ImageService,
    private placesService: PlacesService,
    private taxonService: TaxonService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    sharedService.appLabel = 'Upload';
  }

  ngOnInit(): void {
    this.createMediaObject();
  }

  ngAfterViewInit(): void {
    this.subscribeToRoute();
  }

  private subscribeToRoute(): void {
    this.route.queryParams.subscribe((params: Params) => {
      const image = params['image'];
      const taxon = params['taxon'];
      const place = params['place'];
      // if place exists, set it
      if (place) {
        this.media!.placeUid = place;
        this.placesService.getPlaceName(place).then((name: string) => {
          this.tempPlaceName = name;
        });
      }
      // if image param exists, set temp image, else trigger upload
      if (image) {
        this.media!.image = image;
        this.media!.thumbnail = image;
        // set suggested taxon
        this.setSuggestedTaxonList();
      } else {
        this.fileInput?.nativeElement.click();
      }
      // if taxon param exists, get and set taxon doc, else reset taxon
      if (taxon) {
        this.taxonService.getTaxon(taxon).then((taxonDocSnapshot: firebase.firestore.DocumentSnapshot<Taxon>) => {
          const taxonDoc = taxonDocSnapshot.data();
          this.tempTaxonDoc = taxonDoc;
          this.media!.taxonUid = taxonDoc?.uid;
        });
      } else {
        this.tempTaxonDoc = undefined;
        this.media!.taxonUid = undefined;
      }
    });
  }

  private createMediaObject(): void {
    this.media = {
      uid: this.mediaService.createRandomUid(),
      type: 'photo',
      image: undefined,
      thumbnail: undefined,
      date: firebase.firestore.Timestamp.fromDate(new Date()),
      uploadDate: firebase.firestore.Timestamp.fromDate(new Date()),
      ownerUid: this.userService.user?.uid,
      taxonUid: undefined,
      placeUid: undefined
    };
  }

  importImage(tar: EventTarget | null): void {
    const files = (tar as HTMLInputElement).files;
    if (files) {
      // resize and get string
      this.imageService.getResizedImgString(files[0]).then((imgString: string) => {
        // then get blob from string
        this.imageService.getBlobFromImgString(imgString)
          .then((imgBlob: Blob) => {
            // then upload blob
            this.mediaService
              .uploadFile(`media/${this.media?.uid}`, imgBlob)
              .then((downloadUrl: string) => {
                // set router param
                this.router.navigate([], {
                  relativeTo: this.route,
                  queryParams: { image: downloadUrl },
                  queryParamsHandling: 'merge'
                });
              });
          });
      });
    }
  }

  private getTaxonSuggestions(): Promise<any> {
    return new Promise((resolve) => {
      resolve([
        { uid: '001pe', confidence: 82 },
        { uid: '0041e', confidence: 32 },
        { uid: '006qb', confidence: 31 },
        { uid: '009j9', confidence: 15 },
        { uid: '009kd', confidence: 8 },
      ]);
    });
  }

  private setSuggestedTaxonList(): void {
    // TODO: replace hardcoded list with model output
    this.getTaxonSuggestions().then(taxonSuggestions => {
      this.taxonSuggestions = taxonSuggestions;
      // get taxon doc for each ID and push to suggested list
      taxonSuggestions.forEach((taxon: any) => {
        this.taxonService.getTaxon(taxon.uid)
          .then((taxonDocSnapshot: firebase.firestore.DocumentSnapshot<Taxon>) => {
            this.suggestedTaxonList.push(taxonDocSnapshot.data()!);
          });
      });
    });
  }

  private setSearchTaxonList(searchTerm?: string): void {
    // query taxon collection
    this.taxonService.searchTaxon('commonName.en', searchTerm)
      .then((taxonQuerySnapshot: firebase.firestore.QuerySnapshot<Taxon>) => {
        taxonQuerySnapshot.docs.forEach((taxonDocSnapshot: firebase.firestore.QueryDocumentSnapshot<Taxon>) => {
          this.searchTaxonList.push(taxonDocSnapshot.data());
        });
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
      this.media.date = isoDate ?
        firebase.firestore.Timestamp.fromDate(new Date(isoDate))
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
      this.mediaService.createMedia(this.media).then(() => {
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
