import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Media, Taxon, User } from '../../interfaces';
import { SharedService } from '../../services/shared.service';
import { UserService } from '../../services/user.service';
import { TaxonService } from '../../services/taxon.service';
import firebase from 'firebase/app';
import { MediaService } from '../../services/media.service';

@Component({
  selector: 'app-taxon',
  templateUrl: './taxon.component.html',
  styleUrls: ['./taxon.component.scss']
})
export class TaxonComponent implements OnInit {
  taxon: Taxon | undefined;
  mediaList: Media[] = [];

  constructor(
    public router: Router,
    public sharedService: SharedService,
    private route: ActivatedRoute,
    private userService: UserService,
    private taxonService: TaxonService,
    private mediaService: MediaService
  ) {
    this.sharedService.appLabel = 'Taxon';
  }

  ngOnInit(): void {
    this.subscribeToRoute();
  }

  private subscribeToRoute(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      // get uid from route
      const taxonUid = params.get('taxonUid');
      if (taxonUid) {
        // if set, query corresponding doc and set property
        this.taxonService.getTaxon(taxonUid)
          .then((taxonDocSnapshot: firebase.firestore.DocumentSnapshot<Taxon>) => {
            this.taxon = taxonDocSnapshot.data();
          });
        this.setMediaList(taxonUid);
      }
    });
  }

  private setMediaList(taxonUid: string) {
    // get all media matching taxon uid
    this.mediaService
      .getFilteredMediaList('taxonUid', taxonUid)
      .then((mediaQuerySnapshot: firebase.firestore.QuerySnapshot<Media>) => {
        // iterate over each media
        mediaQuerySnapshot.forEach((mediaDocSnapshot: firebase.firestore.QueryDocumentSnapshot<Media>) => {
          const mediaData: Media = mediaDocSnapshot.data();
          // get user doc promise
          this.userService.getUser(mediaDocSnapshot.data().ownerUid)
            .then((userDocSnapshot: firebase.firestore.DocumentSnapshot<User>) => {
              // assign owner doc to media doc
              mediaData.ownerDoc = userDocSnapshot.data();
            });
          // push media data to media list
          this.mediaList.push(mediaData);
        });
      });
  }

}
