import { Component, OnInit } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { Taxon } from '../interfaces';
import { SharedService } from '../services/shared.service';
import firebase from 'firebase/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-taxon-list',
  templateUrl: './taxon-list.component.html',
  styleUrls: ['./taxon-list.component.scss']
})
export class TaxonListComponent implements OnInit {
  taxonList: Taxon[] = [];
  lastTaxonRef: firebase.firestore.QueryDocumentSnapshot<Taxon> | undefined;
  fetching: boolean | undefined;

  constructor(
    public sharedService: SharedService,
    private firestore: AngularFirestore,
    public router: Router
  ) {
    sharedService.appLabel = 'Taxon List';
  }

  ngOnInit(): void {
    this.getTaxonList();
    // subscribe to 
    this.sharedService.scrollBottomSubject.subscribe(() => {
      if (!this.fetching) {
        this.getTaxonList();
      }
    });
  }

  private getTaxonList(): void {
    // set fetching
    this.fetching = true;
    // query taxon collection
    this.firestore
      .collection<Taxon>('genus', (ref: CollectionReference) => ref
        .orderBy('commonName.en')
        .limit(20)
        .startAfter(this.lastTaxonRef ? this.lastTaxonRef : 0))
      .get()
      .toPromise()
      .then((taxonQuerySnapshot: firebase.firestore.QuerySnapshot<Taxon>) => {
        taxonQuerySnapshot.docs.forEach((taxonDocSnapshot: firebase.firestore.QueryDocumentSnapshot<Taxon>) => {
          this.taxonList.push(taxonDocSnapshot.data());
        });
        // set last taxon ref for pagination
        this.lastTaxonRef = taxonQuerySnapshot.docs[taxonQuerySnapshot.docs.length - 1];
        // reset fetching
        this.fetching = false;
      });
  }

}
