import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { Taxon } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class TaxonService {

  constructor(private firestore: AngularFirestore) { }

  getTaxon(taxonUid: string): Promise<firebase.firestore.DocumentSnapshot<Taxon>> {
    return this.firestore
      .collection<Taxon>('genus')
      .doc(taxonUid)
      .get()
      .toPromise();
  }

  getFeaturedTaxonList(): Promise<firebase.firestore.QuerySnapshot<Taxon>> {
    return this.firestore
      .collection<Taxon>('genus', (ref: CollectionReference) =>
        ref.orderBy('numMedia').limit(8)
      )
      .get()
      .toPromise();
  }
}
