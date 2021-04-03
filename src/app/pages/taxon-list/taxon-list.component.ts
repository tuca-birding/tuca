import { Component, ElementRef, OnInit } from '@angular/core';
import { Taxon } from '../../interfaces';
import { SharedService } from '../../services/shared.service';
import firebase from 'firebase/app';
import { Router } from '@angular/router';
import { TaxonService } from 'src/app/services/taxon.service';

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
    private taxonService: TaxonService,
    public router: Router,
    private elRef: ElementRef
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
    this.sharedService.animateTransition(this.elRef);
  }

  private setTaxonList(searchTerm?: string): void {
    // set fetching
    this.fetching = true;
    // query taxon collection
    this.taxonService.searchTaxon('commonName.en', searchTerm, this.lastTaxonRef)
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

  handleSearch(tar: any): void {
    // find input node to get search term
    const searchTerm: string = tar.closest('kor-input').getAttribute('value');
    // reset prior queries
    this.taxonList = [];
    this.lastTaxonRef = undefined;
    // get new query based on capitalized search term
    this.setTaxonList(this.sharedService.capitalizeString(searchTerm));
  }

}
