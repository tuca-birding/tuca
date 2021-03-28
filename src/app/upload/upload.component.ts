import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  uploadedImage: string | undefined;

  constructor(public sharedService: SharedService) {
    sharedService.appLabel = 'Tuca';
  }

  ngOnInit(): void {
  }

  triggerUpload(): void {
    this.fileInput?.nativeElement.click();
  }

  uploadImage(tar: EventTarget | null): void {
    const files = (tar as HTMLInputElement).files;
    if (files) {
      this.resizeImage(files[0]).then((res: string) => {
        this.uploadedImage = res;
      });
    }
  }

  async resizeImage(file: File, max: number = 800): Promise<string> {
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
