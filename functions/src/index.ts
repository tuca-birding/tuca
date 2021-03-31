import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
admin.initializeApp();

// runs when media is created
exports.onMediaCreate = functions.firestore
  .document('media/{mediaUid}')
  .onCreate((mediaSnap: functions.firestore.QueryDocumentSnapshot) => {
    const taxonUid = mediaSnap.data().taxonUid;
    const ownerUid = mediaSnap.data().ownerUid;
    // increase numMedia by 1
    if (taxonUid) {
      setNumMedia('genus', taxonUid, 'increase');
    }
    if (ownerUid) {
      setNumMedia('users', ownerUid, 'increase');
    }
    return null;
  });

// runs when media is deleted
exports.onMediaDelete = functions.firestore
  .document('media/{mediaUid}')
  .onDelete((mediaSnap: functions.firestore.QueryDocumentSnapshot) => {
    const taxonUid = mediaSnap.data().taxonUid;
    const ownerUid = mediaSnap.data().ownerUid;
    // decrease numMedia by 1
    if (taxonUid) {
      setNumMedia('genus', taxonUid, 'decrease');
    }
    if (ownerUid) {
      setNumMedia('users', ownerUid, 'decrease');
    }
    return null;
  });

function setNumMedia(colUid: string, docUid: string, direction: string): void {
  // first, get the current numMedia
  admin
    .firestore()
    .collection(colUid)
    .doc(docUid)
    .get().then((docSnap: functions.firestore.DocumentSnapshot) => {
      const oldNumMedia = docSnap.data()?.numMedia ? docSnap.data()!.numMedia : 0;
      const newNumMedia = direction === 'increase' ? oldNumMedia + 1 : oldNumMedia - 1;
      // then set the new numMedia
      admin
        .firestore()
        .collection(colUid)
        .doc(docUid)
        .set({ numMedia: newNumMedia }, { merge: true });
    });
}
