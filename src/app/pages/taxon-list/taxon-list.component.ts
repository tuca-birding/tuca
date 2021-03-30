import { Component, OnInit } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { Taxon } from '../../interfaces';
import { SharedService } from '../../services/shared.service';
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
    this.setTaxonList();
    // subscribe to scroll bottom event and set list if not already fetching
    this.sharedService.scrollBottomSubject.subscribe(() => {
      if (!this.fetching) {
        this.setTaxonList();
      }
    });
  }

  private setTaxonList(searchTerm?: string | null): void {
    // set fetching
    this.fetching = true;
    // query taxon collection
    this.firestore
      .collection<Taxon>('genus', (ref: CollectionReference) => ref
        .orderBy('commonName.en')
        .where('commonName.en', '>=', searchTerm ? searchTerm : '')
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

  private capitalizeString(string: string | null): string | undefined {
    const wordArray = string?.split(' ');
    if (wordArray) {
      for (let i = 0; i < wordArray?.length; i++) {
        if (wordArray[i]) {
          wordArray[i] = `${wordArray[i][0]?.toUpperCase()}${wordArray[i].substr(1)}`;
        }
      }
    }
    return wordArray?.join(' ');
  }

  handleSearch(tar: any): void {
    // find input node to get search term
    const searchTerm: string = tar.closest('kor-input').getAttribute('value');
    // reset prior queries
    this.taxonList = [];
    this.lastTaxonRef = undefined;
    // get new query based on capitalized search term
    this.setTaxonList(this.capitalizeString(searchTerm));
  }

}
