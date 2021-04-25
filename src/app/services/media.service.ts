import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import firebase from 'firebase/app';
import { Media } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  constructor(
    private firestore: AngularFirestore,
    private fireStorage: AngularFireStorage
  ) { }

  getFilteredMediaList(
    filterKey: string,
    filterValue: string
  ): Promise<firebase.firestore.QuerySnapshot<Media>> {
    return this.firestore
      .collection<Media>('media', (ref: CollectionReference) =>
        ref.where(filterKey, '==', filterValue).orderBy('uploadDate', 'desc')
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

  deleteFile(downloadUrl: string): void {
    const mediaRef = this.fireStorage.refFromURL(downloadUrl);
    mediaRef.delete();
  }

  createMedia(media: Media): Promise<void> {
    return this.firestore.collection<Media>('media').doc(media.uid).set(media);
  }

  updateMedia(media: Media): Promise<void> {
    return this.firestore
      .collection<Media>('media')
      .doc(media.uid)
      .update(media);
  }

  deleteMedia(mediaUid: string): Promise<void> {
    return this.firestore.collection<Media>('media').doc(mediaUid).delete();
  }

  getMedia(mediaUid: string): Promise<firebase.firestore.DocumentSnapshot<Media>> {
    return this.firestore
      .collection<Media>('media')
      .doc(mediaUid)
      .get()
      .toPromise();
  }

  setLikes(mediaUid: string, userUid: string, operation: string): Promise<string> {
    return new Promise((resolve) => {
      this.getMedia(mediaUid)
        .then((mediaDocSnapshot) => {
          // add user to array of users
          const mediaDoc = mediaDocSnapshot.data();
          const newLikes = mediaDoc?.likes ? mediaDoc.likes : [];
          operation === 'add' && newLikes.indexOf(userUid) < 0
            ? newLikes.push(userUid)
            : newLikes.splice(newLikes.indexOf(userUid), 1);
          this.firestore
            .collection<Media>('media')
            .doc(mediaUid)
            .update({
              likes: newLikes,
              numLikes: newLikes.length
            }).then(() => {
              // resolve promise if successful
              resolve(operation);
            });
        });
    });
  }
}
