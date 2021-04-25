import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ImageService } from 'src/app/services/image.service';
import { MediaService } from 'src/app/services/media.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.scss']
})
export class EditProfileModalComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;
  visible = false;
  tempImage: string | undefined;
  tempName: string | undefined;
  @Output() close = new EventEmitter();

  constructor(
    public sharedService: SharedService,
    public userService: UserService,
    private imageService: ImageService,
    private mediaService: MediaService
  ) { }

  ngOnInit(): void {
    console.log(this.tempImage);
    setTimeout(() => {
      this.visible = true;
    }, 0);
  }

  closeModal(): void {
    this.visible = false;
    setTimeout(() => {
      this.close.emit();
    }, 100);
  }

  setNewName(tar: EventTarget | null): void {
    this.tempName = (<HTMLInputElement>tar).value;
  }

  importImage(tar: EventTarget | null): void {
    const files = (tar as HTMLInputElement).files;
    if (files) {
      // crop and set temp image
      this.imageService
        .resizeAndCropImage(files[0], [136, 136])
        .then((imgString: string) => {
          this.tempImage = imgString;
        });
    }
  }

  handleConfirm(): void {
    this.closeModal();
    const userId = this.userService.user!.uid;
    // define updated user fields
    const updatedUser: { image?: string, name?: string; } = {};
    if (this.tempName) {
      updatedUser.name = this.tempName;
    }
    const updateUser = () => this.userService.updateUser(userId, updatedUser);
    // if image changed, start upload flow
    if (this.tempImage) {
      const oldImageUrl = this.userService.user?.image;
      this.uploadImage(this.tempImage)
        .then((downloadUrl) => {
          // set image url
          updatedUser.image = downloadUrl;
          // update user document
          updateUser()
            .then(() => {
              // delete old user image, in case it existed
              if (oldImageUrl) {
                this.mediaService.deleteFile(oldImageUrl);
              }
            });
        });
    }
    // else, change name only;
    else if (this.tempName) {
      updateUser();
    }
  }

  uploadImage(imgString: string): Promise<string> {
    return new Promise(resolve => {
      this.imageService
        .getBlobFromImgString(imgString)
        .then((imgBlob: Blob) => {
          this.mediaService
            .uploadFile(`user_avatar/${this.userService.user?.uid}_${this.sharedService.generateUid()}_avatar`, imgBlob)
            .then((downloadUrl: string) => {
              resolve(downloadUrl);
            });
        });
    });
  }

}
