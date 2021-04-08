import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { Media } from 'src/app/interfaces';
import { SharedService } from 'src/app/services/shared.service';
import { MediaService } from 'src/app/services/media.service';
import firebase from 'firebase/app';
import { PlacesService } from 'src/app/services/places.service';

@Component({
  selector: 'app-edit-media-modal',
  templateUrl: './edit-media-modal.component.html',
  styleUrls: ['./edit-media-modal.component.scss']
})
export class EditMediaModalComponent implements OnInit {
  visible = false;
  tempPlaceName: string | undefined;
  selectPlaceModalVisible = false;
  @Input() media: Media | undefined;
  @Output() close = new EventEmitter();

  constructor(
    public sharedService: SharedService,
    private mediaService: MediaService,
    private placesService: PlacesService,
    private location: Location
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.visible = true;
    }, 0);
    this.placesService.getPlaceDetails(this.media!.placeUid)
      .then((placeDetails: google.maps.places.PlaceResult) => {
        this.tempPlaceName = placeDetails.name;
      });
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

  setPlace(placeUid: string | undefined): void {
    if (this.media) {
      this.media.placeUid = placeUid;
      this.placesService.getPlaceDetails(placeUid)
        .then((placeDetails: google.maps.places.PlaceResult) => {
          this.tempPlaceName = placeDetails.name;
        });
    }
  }

}
