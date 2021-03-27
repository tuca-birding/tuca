import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Media, Taxon, User } from '../interfaces';
import firebase from 'firebase/app';
import { SharedService } from '../services/shared.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-taxon',
  templateUrl: './taxon.component.html',
  styleUrls: ['./taxon.component.scss']
})
export class TaxonComponent implements OnInit {
  public taxon: Taxon | undefined;
  public mediaList: Media[] = [];

  constructor(
    private route: ActivatedRoute,
    public sharedService: SharedService,
    private firestore: AngularFirestore,
    private userService: UserService
  ) {
    this.sharedService.appLabel = 'Taxon';
  }

  ngOnInit(): void {
    this.subscribeToRoute();
  }

  private subscribeToRoute(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const taxonUid = params.get('taxonUid');
      if (taxonUid) {
        this.getTaxon(taxonUid);
        this.getMediaList(taxonUid);
      }
    });
  }

  private getTaxon(taxonUid: string): void {
    this.firestore
      .collection<Taxon>('genus')
      .doc(taxonUid)
      .get()
      .toPromise()
      .then((taxon: firebase.firestore.DocumentSnapshot<Taxon>) => {
        this.taxon = taxon.data();
      });
  }

  private getMediaList(taxonUid: string) {
    // get all media matching taxon uid
    this.firestore
      .collection<Media>('media', (ref) => ref.where('taxonUid', '==', taxonUid))
      .get()
      .toPromise()
      .then((mediaResults: firebase.firestore.QuerySnapshot<Media>) => {
        // iterate over each media
        mediaResults.forEach((media: firebase.firestore.QueryDocumentSnapshot<Media>) => {
          let mediaData: Media = media.data();
          // get user doc promise
          this.userService.getUser(media.data().ownerUid)
            .then((userDoc: firebase.firestore.DocumentSnapshot<User>) => {
              // assign taxon doc to media doc
              mediaData.ownerDoc = userDoc.data();
            });
          // push media data do media list
          this.mediaList.push(mediaData);
        });
      });
  };

}
