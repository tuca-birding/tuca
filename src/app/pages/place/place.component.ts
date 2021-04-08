import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Media } from 'src/app/interfaces';
import { MediaService } from 'src/app/services/media.service';
import { PlacesService } from 'src/app/services/places.service';
import { SharedService } from 'src/app/services/shared.service';
import firebase from 'firebase/app';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss']
})
export class PlaceComponent implements OnInit {
  place: {
    name: string | undefined,
    photoUrl: string | undefined;
  } = {
      name: undefined,
      photoUrl: undefined
    };
  mediaList: Media[] = [];

  constructor(
    public router: Router,
    public sharedService: SharedService,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private elRef: ElementRef,
    private mediaService: MediaService
  ) { }

  ngOnInit(): void {
    this.subscribeToRoute();
    this.sharedService.animateTransition(this.elRef);
  }

  private subscribeToRoute(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      // get uid from route
      const placeUid = params.get('placeUid');
      if (placeUid) {
        this.placesService
          .getPlaceDetails(placeUid)
          .then((placeDetails: google.maps.places.PlaceResult) => {
            this.place.name = placeDetails.name;
            if (placeDetails.photos) {
              this.place.photoUrl = placeDetails.photos[0]?.getUrl({ maxHeight: 400, maxWidth: 400 });
            }
          });
        this.setMediaList(placeUid);
      }
    });
  }

  private setMediaList(placeUid: string): void {
    // get all media matching taxon uid
    this.mediaService
      .getFilteredMediaList('placeUid', placeUid)
      .then((mediaQuerySnapshot: firebase.firestore.QuerySnapshot<Media>) => {
        // iterate over each media
        mediaQuerySnapshot.forEach((mediaDocSnapshot: firebase.firestore.QueryDocumentSnapshot<Media>) => {
          // push media data to media list
          this.mediaList.push(mediaDocSnapshot.data());
        });
      });
  }

}
