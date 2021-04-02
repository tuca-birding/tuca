import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Media, Taxon } from 'src/app/interfaces';
import { MediaService } from 'src/app/services/media.service';
import { TaxonService } from 'src/app/services/taxon.service';
import { UserService } from 'src/app/services/user.service';
import { SharedService } from '../../services/shared.service';
import firebase from 'firebase/app';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements AfterViewInit {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  tempImage: string | undefined = 'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8YmlyZHxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80';
  media: Media | undefined;
  suggestedTaxonList: Taxon[] = [];
  searchTaxonList: Taxon[] = [];

  constructor(
    public sharedService: SharedService,
    private mediaService: MediaService,
    private userService: UserService,
    private taxonService: TaxonService
  ) {
    sharedService.appLabel = 'Upload';
  }

  ngAfterViewInit(): void {
    // open upload dialog after init
    this.fileInput?.nativeElement.click();
    this.createMediaObject();
    this.getSuggestedTaxonList();
  }

  private createMediaObject(): void {
    this.media = {
      uid: this.mediaService.createRandomUid(),
      type: 'photo',
      image: undefined,
      thumbnail: undefined,
      date: undefined,
      uploadDate: new Date(),
      ownerUid: this.userService.user?.uid,
      taxonUid: undefined
    };
  }

  uploadImage(tar: EventTarget | null): void {
    const files = (tar as HTMLInputElement).files;
    if (files) {
      this.resizeImage(files[0]).then((res: string) => {
        this.tempImage = res;
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

  getSuggestedTaxonList(): void {
    // TODO: replace hardcoded list with model output
    const suggestedTaxonIds: string[] = ['001pe', '0041e', '006qb', '009j9', '009kd'];
    // get taxon doc for each ID and push to suggested list
    suggestedTaxonIds.forEach((taxonUid: string) => {
      this.taxonService.getTaxon(taxonUid)
        .then((taxonDocSnapshot: firebase.firestore.DocumentSnapshot<Taxon>) => {
          this.suggestedTaxonList.push(taxonDocSnapshot.data()!);
        });
      console.log(this.suggestedTaxonList);
    });
  }

}
