import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { Media } from 'src/app/interfaces';
import { SharedService } from 'src/app/services/shared.service';
import { MediaService } from 'src/app/services/media.service';
import firebase from 'firebase/app';

@Component({
  selector: 'app-edit-media-modal',
  templateUrl: './edit-media-modal.component.html',
  styleUrls: ['./edit-media-modal.component.scss']
})
export class EditMediaModalComponent implements OnInit {
  visible = false;
  @Input() media: Media | undefined;
  @Output() close = new EventEmitter;

  constructor(
    public sharedService: SharedService,
    private mediaService: MediaService,
    private location: Location
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.visible = true;
    }, 0);
  }

  handleConfirm(): void {
    if (this.media) {
      this.mediaService.updateMedia(this.media).then(() => {
        this.closeModal();
      });
    }
  }

  handleDelete(): void {
    if (this.media) {
      this.mediaService.deleteMedia(this.media.uid).then(() => {
        this.closeModal();
        this.location.back();
      });
    }
  }

  closeModal(): void {
    this.visible = false;
    setTimeout(() => {
      this.close.emit();
    }, 100);
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

}
