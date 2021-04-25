import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { User } from 'src/app/interfaces';
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
  editingUser: User | undefined;
  tempImage: string | undefined;
  @Output() close = new EventEmitter();

  constructor(
    public sharedService: SharedService,
    public userService: UserService,
    private imageService: ImageService,
    private mediaService: MediaService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.visible = true;
    }, 0);
    this.editingUser = this.userService.user;
  }

  closeModal(): void {
    this.visible = false;
    setTimeout(() => {
      this.close.emit();
    }, 100);
  }

  setNewName(tar: EventTarget | null): void {
    if (this.editingUser) {
      this.editingUser.name = (<HTMLInputElement>tar).value;
    }
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
    if (this.tempImage) {
      const oldImageUrl = this.editingUser?.image;
      this.uploadImage(this.tempImage)
        .then((downloadUrl) => {
          // set user image url
          this.editingUser!.image = downloadUrl;
          // update user document
          this.userService.updateUser({
            uid: this.editingUser?.uid,
            name: this.editingUser?.name,
            image: this.editingUser?.image
          }).then(() => {
            // delete old user image, in case it existed
            if (oldImageUrl) {
              this.mediaService.deleteFile(oldImageUrl);
            }
            this.closeModal();
          });
        });
    }
  }

  uploadImage(imgString: string): Promise<string> {
    return new Promise(resolve => {
      this.imageService
        .getBlobFromImgString(imgString)
        .then((imgBlob: Blob) => {
          this.mediaService
            .uploadFile(`user_avatar/${this.editingUser?.uid}_${this.sharedService.generateUid()}_avatar`, imgBlob)
            .then((downloadUrl: string) => {
              resolve(downloadUrl);
            });
        });
    });
  }

}
