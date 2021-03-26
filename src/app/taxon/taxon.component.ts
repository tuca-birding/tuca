import { Component, OnInit } from '@angular/core';
import { AngularFirestore, DocumentSnapshot, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Taxon } from '../interfaces';
import firebase from 'firebase';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-taxon',
  templateUrl: './taxon.component.html',
  styleUrls: ['./taxon.component.scss']
})
export class TaxonComponent implements OnInit {
  public taxon: Taxon | undefined;

  constructor(
    private route: ActivatedRoute,
    public sharedService: SharedService,
    private firestore: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.subscribeToRoute();
  }

  private subscribeToRoute(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const taxonUid = params.get('taxonUid');
      if (taxonUid) {
        this.getTaxon(taxonUid);
      }
    });
  }

  private getTaxon(taxonUid: string): void {
    this.firestore.collection<Taxon>('genus')
      .doc(taxonUid)
      .get()
      .toPromise()
      .then((taxon: firebase.firestore.DocumentSnapshot<Taxon>) => {
        this.taxon = taxon.data();
        console.log(taxon.data());
        console.log(taxonUid);
      });
  }

}
