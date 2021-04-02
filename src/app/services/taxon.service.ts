import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, DocumentReference } from '@angular/fire/firestore';
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
        ref.orderBy('numMedia', 'desc').limit(8)
      )
      .get()
      .toPromise();
  }

  searchTaxon(searchKey: string, searchTerm?: string, lastRef?: any): Promise<firebase.firestore.QuerySnapshot<Taxon>> {
    // query taxon collection
    return this.firestore
      .collection<Taxon>('genus', (ref: CollectionReference) => ref
        .orderBy(searchKey)
        .where(searchKey, '>=', searchTerm ? searchTerm : '')
        .limit(20)
        .startAfter(lastRef ? lastRef : 0))
      .get()
      .toPromise();
  }
}
