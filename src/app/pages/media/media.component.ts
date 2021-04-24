import { Component, ElementRef, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Media, Taxon, User } from '../../interfaces';
import { UserService } from '../../services/user.service';
import { SharedService } from '../../services/shared.service';
import { TaxonService } from '../../services/taxon.service';
import firebase from 'firebase/app';
import { PlacesService } from 'src/app/services/places.service';
import { MediaService } from 'src/app/services/media.service';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
  media: Media | undefined;
  editMediaModalVisible = false;
  mediaInfo: {
    placeName: string | undefined;
    taxonDoc: Taxon | undefined;
    ownerDoc: User | undefined;
  } = {
      placeName: undefined,
      taxonDoc: undefined,
      ownerDoc: undefined
    };

  constructor(
    public sharedService: SharedService,
    public userService: UserService,
    public router: Router,
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private taxonService: TaxonService,
    private placesService: PlacesService,
    private mediaService: MediaService,
    private elRef: ElementRef
  ) {
    this.sharedService.appLabel = 'Media';
  }

  ngOnInit(): void {
    this.subscribeToRoute();
    // hide page before image is loaded
    this.elRef.nativeElement.classList.add('transition');
  }

  handleLoad(): void {
    // after load, animate the transition
    this.sharedService.animateTransition(this.elRef);
  }

  private subscribeToRoute(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const mediaUid = params.get('mediaUid');
      if (mediaUid) {
        this.setMedia(mediaUid);
      }
    });
  }

  setMedia(mediaUid: string): void {
    this.firestore
      .collection<Media>('media')
      .doc(mediaUid)
      .get()
      .toPromise()
      .then((mediaDocSnapshot: firebase.firestore.DocumentSnapshot<Media>) => {
        // only assign and model media doc if it exists
        if (mediaDocSnapshot.exists) {
          this.media = mediaDocSnapshot.data();
          // get user doc and set userDoc field
          if (this.media?.ownerUid) {
            this.userService
              .getUser(this.media.ownerUid)
              .then(
                (
                  userDocSnapshot: firebase.firestore.DocumentSnapshot<User>
                ) => {
                  const userDoc = userDocSnapshot.data();
                  this.mediaInfo.ownerDoc = userDoc;
                  this.sharedService.setTitle(`${userDoc?.name}'s media`);
                }
              );
          }
          // get taxon doc and set taxonDoc field
          if (this.media?.taxonUid) {
            this.taxonService
              .getTaxon(this.media.taxonUid)
              .then(
                (
                  taxonDocSnapshot: firebase.firestore.DocumentSnapshot<Taxon>
                ) => {
                  this.mediaInfo.taxonDoc = taxonDocSnapshot.data();
                }
              );
          }
          // get place name and set field
          if (this.media?.placeUid) {
            this.placesService
              .getPlaceDetails(this.media?.placeUid)
              .then((placeDetails: google.maps.places.PlaceResult) => {
                this.mediaInfo.placeName = placeDetails.name;
              });
          }
        }
      });
  }

  getLikeActive(): boolean | undefined {
    return this.userService.user && this.media?.likes?.includes(this.userService.user.uid);
  }

  setUserLike(): void {
    const signedUserUid = this.userService.user?.uid;
    if (signedUserUid) {
      // add or remove like depending on if user already liked it
      this.mediaService.setLikes(this.media!.uid, signedUserUid, this.getLikeActive() ? 'remove' : 'add')
        .then((operation) => {
          const newLikes = this.media?.likes ? this.media.likes : [];
          operation === 'add'
            ? newLikes.push(signedUserUid)
            : newLikes.splice(this.media!.likes.indexOf(signedUserUid), 1);
          this.media!.numLikes = newLikes.length;
        });
    } else {
      // open sign in modal if no user is logged in
      this.userService.signInModalVisible = true;
    }
  }
}
