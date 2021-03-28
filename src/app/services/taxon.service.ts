import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { Taxon } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class TaxonService {

  constructor(private firestore: AngularFirestore) { }

  public getTaxon(taxonUid: string): Promise<firebase.firestore.DocumentSnapshot<Taxon>> {
    return this.firestore
      .collection<Taxon>('genus')
      .doc(taxonUid)
      .get()
      .toPromise();
  }
}
