import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Media } from 'src/app/interfaces';
import { MediaService } from 'src/app/services/media.service';
import { UserService } from 'src/app/services/user.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements AfterViewInit {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  uploadedImage: string | undefined;
  media: Media | undefined;

  constructor(
    public sharedService: SharedService,
    private mediaService: MediaService,
    private userService: UserService,
  ) {
    sharedService.appLabel = 'Upload';
  }

  ngAfterViewInit(): void {
    // open upload dialog after init
    this.fileInput?.nativeElement.click();
    this.createMediaObject();
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
        this.uploadedImage = res;
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

}
