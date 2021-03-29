import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { UserService } from '../services/user.service';
import firebase from 'firebase/app';
import { Media, Taxon, User } from '../interfaces';
import { MediaService } from '../services/media.service';
import { TaxonService } from '../services/taxon.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user: User | undefined;
  mediaList: Media[] = [];

  constructor(
    public router: Router,
    public sharedService: SharedService,
    private userService: UserService,
    private mediaService: MediaService,
    private taxonService: TaxonService,
    private route: ActivatedRoute
  ) {
    this.sharedService.appLabel = 'User';
  }

  ngOnInit(): void {
    this.subscribeToRoute();
  }

  private subscribeToRoute(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      // get uid from route
      const userUid = params.get('userUid');
      if (userUid) {
        // if set, query corresponding doc and set property
        this.userService.getUser(userUid)
          .then((userDocSnapshot: firebase.firestore.DocumentSnapshot<User>) => {
            this.user = userDocSnapshot.data();
          });
        this.setMediaList(userUid);
      }
    });
  }

  private setMediaList(userUid: string) {
    // get all media matching taxon uid
    this.mediaService
      .getFilteredMediaList('ownerUid', userUid)
      .then((mediaQuerySnapshot: firebase.firestore.QuerySnapshot<Media>) => {
        // iterate over each media
        mediaQuerySnapshot.forEach((mediaDocSnapshot: firebase.firestore.QueryDocumentSnapshot<Media>) => {
          const mediaData: Media = mediaDocSnapshot.data();
          // get user doc promise
          this.taxonService.getTaxon(mediaDocSnapshot.data().taxonUid)
            .then((taxonDocSnapshot: firebase.firestore.DocumentSnapshot<Taxon>) => {
              // assign taxon doc to media doc
              mediaData.taxonDoc = taxonDocSnapshot.data();
            });
          // push media data to media list
          this.mediaList.push(mediaData);
        });
      });
  }

}
