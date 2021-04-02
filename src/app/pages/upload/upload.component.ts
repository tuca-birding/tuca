import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Media, Taxon } from 'src/app/interfaces';
import { MediaService } from 'src/app/services/media.service';
import { TaxonService } from 'src/app/services/taxon.service';
import { UserService } from 'src/app/services/user.service';
import { SharedService } from '../../services/shared.service';
import firebase from 'firebase/app';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements AfterViewInit {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  tempImage: string | undefined;
  tempTaxonDoc: Taxon | undefined;
  media: Media | undefined;
  suggestedTaxonList: Taxon[] = [];
  searchTaxonList: Taxon[] = [];

  constructor(
    public sharedService: SharedService,
    private mediaService: MediaService,
    private userService: UserService,
    private taxonService: TaxonService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    sharedService.appLabel = 'Upload';
  }

  ngAfterViewInit(): void {
    this.createMediaObject();
    this.getSuggestedTaxonList();
    this.subscribeToRoute();
  }

  private subscribeToRoute(): void {
    this.route.queryParams.subscribe((params: Params) => {
      const image = params['image'];
      const taxon = params['taxon'];
      // if image param exists, set temp image, else trigger upload
      if (image) {
        this.tempImage = image;
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
      date: new Date(),
      uploadDate: new Date(),
      ownerUid: this.userService.user?.uid,
      taxonUid: undefined
    };
  }

  uploadImage(tar: EventTarget | null): void {
    const files = (tar as HTMLInputElement).files;
    if (files) {
      this.resizeImage(files[0]).then((res: string) => {
        // set router param
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { image: res },
          queryParamsHandling: 'merge'
        });
      });
    }
  }

  private async resizeImage(file: File, max: number = 800): Promise<string> {
    // draw img and canvas
    let img: HTMLImageElement;
    let canvas: HTMLCanvasElement;
    await this.createImgAndCanvas(file).then((res) => {
      img = res[0];
      canvas = res[1];
    });
    // handle images bigger than max width/height
    let width = img!.naturalWidth;
    let height = img!.naturalHeight;
    if (width >= height && width > max) {
      height *= max / width;
      width = max;
    } else if (height > width && height > max) {
      width *= max / height;
      height = max;
    }
    canvas!.width = width;
    canvas!.height = height;
    const ctx = canvas!.getContext('2d');
    ctx!.drawImage(img!, 0, 0, width, height);
    // generate data url from drawn canvas
    return canvas!.toDataURL('image/png', 0.95);
  }

  private async createImgAndCanvas(
    src: File
  ): Promise<[HTMLImageElement, HTMLCanvasElement]> {
    // generate a placeholder img element
    const img = document.createElement('img');
    img.src = await new Promise<any>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e: any) => resolve(e.target.result);
      reader.readAsDataURL(src);
    });
    return new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        resolve([img, canvas]);
      };
    });
  }

  private getSuggestedTaxonList(): void {
    // TODO: replace hardcoded list with model output
    const suggestedTaxonIds: string[] = ['001pe', '0041e', '006qb', '009j9', '009kd'];
    // get taxon doc for each ID and push to suggested list
    suggestedTaxonIds.forEach((taxonUid: string) => {
      this.taxonService.getTaxon(taxonUid)
        .then((taxonDocSnapshot: firebase.firestore.DocumentSnapshot<Taxon>) => {
          this.suggestedTaxonList.push(taxonDocSnapshot.data()!);
        });
    });
    console.log('got suggested taxon list', this.suggestedTaxonList);
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

  private setSearchTaxonList(searchTerm?: string): void {
    // query taxon collection
    this.taxonService.searchTaxon('commonName.en', searchTerm)
      .then((taxonQuerySnapshot: firebase.firestore.QuerySnapshot<Taxon>) => {
        taxonQuerySnapshot.docs.forEach((taxonDocSnapshot: firebase.firestore.QueryDocumentSnapshot<Taxon>) => {
          this.searchTaxonList.push(taxonDocSnapshot.data());
        });
        console.log('got search taxon list', this.searchTaxonList);
      });
  }

  setDate(tar: any): void {
    const isoDate = tar.value;
    if (this.media) {
      this.media.date = isoDate ? new Date(isoDate) : undefined;
    }
  }

  setTaxon(taxonUid: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { taxon: taxonUid },
      queryParamsHandling: 'merge'
    });
  }

}
