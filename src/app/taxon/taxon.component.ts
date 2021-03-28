import { Component, OnInit } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Media, Taxon, User } from '../interfaces';
import { SharedService } from '../services/shared.service';
import { UserService } from '../services/user.service';
import firebase from 'firebase/app';

@Component({
  selector: 'app-taxon',
  templateUrl: './taxon.component.html',
  styleUrls: ['./taxon.component.scss']
})
export class TaxonComponent implements OnInit {
  public taxon: Taxon | undefined;
  public mediaList: Media[] = [];

  constructor(
    public sharedService: SharedService,
    public router: Router,
    private route: ActivatedRoute,
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
        this.setTaxon(taxonUid);
        this.setMediaList(taxonUid);
      }
    });
  }

  private setTaxon(taxonUid: string): void {
    this.firestore
      .collection<Taxon>('genus')
      .doc(taxonUid)
      .get()
      .toPromise()
      .then((taxonDocSnapshot: firebase.firestore.DocumentSnapshot<Taxon>) => {
        this.taxon = taxonDocSnapshot.data();
      });
  }

  private setMediaList(taxonUid: string) {
    // get all media matching taxon uid
    this.firestore
      .collection<Media>('media', (ref: CollectionReference) => ref.where('taxonUid', '==', taxonUid))
      .get()
      .toPromise()
      .then((mediaResults: firebase.firestore.QuerySnapshot<Media>) => {
        // iterate over each media
        mediaResults.forEach((mediaDocSnapshot: firebase.firestore.QueryDocumentSnapshot<Media>) => {
          const mediaData: Media = mediaDocSnapshot.data();
          // get user doc promise
          this.userService.getUser(mediaDocSnapshot.data().ownerUid)
            .then((userDocSnapshot: firebase.firestore.DocumentSnapshot<User>) => {
              // assign taxon doc to media doc
              mediaData.ownerDoc = userDocSnapshot.data();
            });
          // push media data do media list
          this.mediaList.push(mediaData);
        });
      });
  }

}
