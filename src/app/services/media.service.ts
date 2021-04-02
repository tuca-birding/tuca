import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import firebase from 'firebase/app';
import { Media } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private firestore: AngularFirestore, private fireStorage: AngularFireStorage) { }

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
        ref.orderBy('uploadDate', 'desc').limit(8)
      )
      .get()
      .toPromise();
  }

  uploadFile(path: string, file: File | Blob): Promise<string> {
    return new Promise((resolve) => {
      const mediaRef = this.fireStorage.storage.ref(path);
      mediaRef.put(file).then(() => {
        mediaRef.getDownloadURL().then((downloadUrl: string) => {
          resolve(downloadUrl);
        });
      });
    });
  }

  createMedia(media: Media): Promise<void> {
    return this.firestore
      .collection<Media>('media')
      .doc(media.uid)
      .set(media);
  }

  createRandomUid(): string {
    return this.firestore.createId();
  }

}
