import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import firebase from 'firebase/app';
import { MediaService } from 'src/app/services/media.service';
import { TaxonService } from 'src/app/services/taxon.service';
import { UserService } from 'src/app/services/user.service';
import { Media, Taxon, User } from 'src/app/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  recentMediaList: Media[] = [];

  constructor(
    public sharedService: SharedService,
    private mediaService: MediaService,
    private taxonService: TaxonService,
    private userService: UserService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getRecentMedia();
  }

  getRecentMedia(): void {
    this.mediaService.getRecentMediaList()
      .then((mediaQuerySnapshot: firebase.firestore.QuerySnapshot<Media>) => {
        // iterate over each media
        mediaQuerySnapshot.forEach((mediaDocSnapshot: firebase.firestore.QueryDocumentSnapshot<Media>) => {
          const mediaData: Media = mediaDocSnapshot.data();
          // get taxon and user doc promises
          this.taxonService.getTaxon(mediaData.taxonUid)
            .then((taxonDocSnapshot: firebase.firestore.DocumentSnapshot<Taxon>) => {
              mediaData.taxonDoc = taxonDocSnapshot.data();
            });
          this.userService.getUser(mediaData.ownerUid)
            .then((userDocSnapshot: firebase.firestore.DocumentSnapshot<User>) => {
              mediaData.ownerDoc = userDocSnapshot.data();
            });
          // push media data to media list
          this.recentMediaList.push(mediaData);
        });
      });
  }

}
