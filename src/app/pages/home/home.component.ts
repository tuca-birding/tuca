import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { MediaService } from 'src/app/services/media.service';
import { TaxonService } from 'src/app/services/taxon.service';
import { UserService } from 'src/app/services/user.service';
import { Media, Taxon, User } from 'src/app/interfaces';
import firebase from 'firebase/app';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  recentMediaList: Media[] = [];
  featuredTaxonList: Taxon[] = [];
  featuredUsersList: User[] = [];
  illustrationUrl: string | undefined;

  constructor(
    public sharedService: SharedService,
    private mediaService: MediaService,
    private taxonService: TaxonService,
    private userService: UserService,
    public router: Router,
    private elRef: ElementRef
  ) {
    sharedService.appLabel = 'Tuca';
  }

  ngOnInit(): void {
    this.getRecentMedia();
    this.getFeaturedTaxon();
    this.getFeaturedUsers();
    this.sharedService.animateTransition(this.elRef);
    this.setRandomIllustration();
  }

  getRecentMedia(): void {
    this.mediaService
      .getRecentMediaList()
      .then((mediaQuerySnapshot: firebase.firestore.QuerySnapshot<Media>) => {
        // iterate over each media
        mediaQuerySnapshot.forEach(
          (
            mediaDocSnapshot: firebase.firestore.QueryDocumentSnapshot<Media>
          ) => {
            const mediaData: Media = mediaDocSnapshot.data();
            // push media data to media list
            this.recentMediaList.push(mediaData);
          }
        );
      });
  }

  getFeaturedTaxon(): void {
    this.taxonService
      .getFeaturedTaxonList()
      .then((taxonQuerySnapshot: firebase.firestore.QuerySnapshot<Taxon>) => {
        // iterate over each media
        taxonQuerySnapshot.forEach(
          (
            taxonDocSnapshot: firebase.firestore.QueryDocumentSnapshot<Taxon>
          ) => {
            const taxonData: Taxon = taxonDocSnapshot.data();
            // push taxon data to featured taxon list
            this.featuredTaxonList.push(taxonData);
          }
        );
      });
  }

  getFeaturedUsers(): void {
    this.userService
      .getFeaturedUsersList()
      .then((userQuerySnapshot: firebase.firestore.QuerySnapshot<User>) => {
        // iterate over each media
        userQuerySnapshot.forEach(
          (userDocSnapshot: firebase.firestore.QueryDocumentSnapshot<User>) => {
            const userData: User = userDocSnapshot.data();
            // push taxon data to featured taxon list
            this.featuredUsersList.push(userData);
          }
        );
      });
  }

  setRandomIllustration(): void {
    this.illustrationUrl = `/assets/illustrations/bird_${Math.floor(
      Math.random() * 2
    )}.png`;
  }
}
