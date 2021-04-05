import { Component, ElementRef, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Media, Taxon, User } from '../../interfaces';
import { UserService } from '../../services/user.service';
import { SharedService } from '../../services/shared.service';
import { TaxonService } from '../../services/taxon.service';
import firebase from 'firebase/app';
import { PlacesService } from 'src/app/services/places.service';

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
    private elRef: ElementRef
  ) {
    this.sharedService.appLabel = 'Media';
  }

  ngOnInit(): void {
    this.subscribeToRoute();
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
            this.userService.getUser(this.media.ownerUid)
              .then((userDocSnapshot: firebase.firestore.DocumentSnapshot<User>) => {
                this.mediaInfo.ownerDoc = userDocSnapshot.data();
              });
          }
          // get taxon doc and set taxonDoc field
          if (this.media?.taxonUid) {
            this.taxonService.getTaxon(this.media.taxonUid)
              .then((taxonDocSnapshot: firebase.firestore.DocumentSnapshot<Taxon>) => {
                this.mediaInfo.taxonDoc = taxonDocSnapshot.data();
              });
          }
          // get place name and set field
          if (this.media?.placeUid) {
            this.placesService.getPlaceName(this.media?.placeUid)
              .then((placeName: string) => {
                this.mediaInfo.placeName = placeName;
              });
          }
        }
      });
  }

}
