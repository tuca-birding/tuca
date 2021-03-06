import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor() {}

  // from a file, resize image and return string
  getResizedImgString(file: File, max: number = 800): Promise<string> {
    return new Promise((resolve) => {
      // draw img and canvas
      this.createImgAndCanvas(file).then(
        (res: [HTMLImageElement, HTMLCanvasElement]) => {
          const img: HTMLImageElement = res[0];
          const canvas: HTMLCanvasElement = res[1];
          // handle images bigger than max width/height
          let width = img.naturalWidth;
          let height = img.naturalHeight;
          // redimension image based on limits
          if (width >= height && width > max) {
            height *= max / width;
            width = max;
          } else if (height > width && height > max) {
            width *= max / height;
            height = max;
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
          // generate data url from drawn canvas
          resolve(canvas.toDataURL('image/png', 0.95));
        }
      );
    });
  }

  async resizeAndCropImage(
    src: File,
    targetSize: [number, number]
  ): Promise<string> {
    // draw img and canvas
    let img: HTMLImageElement;
    let canvas: HTMLCanvasElement;
    [img, canvas] = await this.createImgAndCanvas(src);
    // handle images bigger than max width/height
    // resize and crop the result
    const [targetWidth, targetHeight] = targetSize;
    const [width, height] = [img.naturalWidth, img.naturalHeight];
    const cropHeight = Math.min(
      Math.floor((width * targetHeight) / targetWidth),
      height
    );
    const cropWidth = Math.min(
      Math.floor((height * targetWidth) / targetHeight),
      width
    );
    const cropBoxHStart = Math.floor((height - cropHeight) / 2);
    const cropBoxWStart = Math.floor((width - cropWidth) / 2);
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(
        img,
        cropBoxWStart,
        cropBoxHStart,
        cropWidth,
        cropHeight,
        0,
        0,
        targetWidth,
        targetHeight
      );
    }
    const result = canvas.toDataURL('image/jpeg', 0.8);
    return result;
  }

  // from file, create image and canvas elements
  private createImgAndCanvas(
    src: File
  ): Promise<[HTMLImageElement, HTMLCanvasElement]> {
    return new Promise((resolve) => {
      // generate a placeholder img element
      const img = document.createElement('img');
      const reader = new FileReader();
      reader.onload = (e: any) => (img.src = e.target.result);
      reader.readAsDataURL(src);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        resolve([img, canvas]);
      };
    });
  }

  getBlobFromImgString(imgString: string): Promise<Blob> {
    return new Promise((resolve) => {
      fetch(imgString).then((response: Response) => {
        response.blob().then((imgBlob) => {
          resolve(imgBlob);
        });
      });
    });
  }
}
