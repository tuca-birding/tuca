import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { Media } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private firestore: AngularFirestore) { }

  getFilteredMediaList(filterKey: string, filterValue: string): Promise<firebase.firestore.QuerySnapshot<Media>> {
    return this.firestore
      .collection<Media>('media', (ref: CollectionReference) =>
        ref.where(filterKey, '==', filterValue)
      )
      .get()
      .toPromise();
  }

  getRecentMediaList(): Promise<firebase.firestore.QuerySnapshot<Media>> {
    return this.firestore
      .collection<Media>('media', (ref: CollectionReference) =>
        ref.orderBy('date').limit(8)
      )
      .get()
      .toPromise();
  }

  createRandomUid(): string {
    return this.firestore.createId();
  }

}
