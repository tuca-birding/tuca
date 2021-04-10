import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MediaModel } from '../models/media.model';
import { PredictionModel } from '../models/prediction.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  createDocument(data: PredictionModel | MediaModel) {
    if (data instanceof PredictionModel) {
      return this.firestore
        .collection<PredictionModel>('predictions')
        .doc(data.uid)
        .set(Object.assign({}, data));
    } else if (data instanceof MediaModel) {
      return this.firestore
        .collection<MediaModel>('media')
        .doc(data.uid)
        .set(Object.assign({}, data));
    } else {
      throw Error("Couldn't create Document");
    }
  }

  updateDocument(data: PredictionModel | MediaModel) {
    if (data instanceof PredictionModel) {
      return this.firestore
        .collection<PredictionModel>('predictions')
        .doc(data.uid)
        .update(Object.assign({}, data));
    } else {
      throw Error("Couldn't update Document");
    }
  }

  getDocument(documentUid: string, collectionName: 'predictions') {
    return this.firestore
      .collection<PredictionModel>(collectionName)
      .doc(documentUid)
      .get()
      .toPromise();
  }

  createRandomUid(): string {
    return this.firestore.createId();
  }
}
