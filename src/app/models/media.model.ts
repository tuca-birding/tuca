import firebase from 'firebase/app';
import { Deserializable } from './deserializable.model';

export class MediaModel implements Deserializable {
  uid: string | undefined;
  type?: string;
  description?: string;
  image: string | undefined;
  thumbnail: string | undefined;
  date: Date | any;
  uploadDate: Date | any;
  ownerUid: string | undefined;
  taxonUid: string | undefined;
  placeUid: string | undefined;
  numLikes: number | undefined;
  likes: string[] | undefined;

  createNew(uid: string, ownerId: string | undefined) {
    this.uid = uid;
    this.type = 'photo';
    this.date = firebase.firestore.Timestamp.fromDate(new Date());
    this.uploadDate = firebase.firestore.Timestamp.fromDate(new Date());
    this.ownerUid = ownerId;
    this.numLikes = 0;
    this.likes = [];
    return this;
  }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
