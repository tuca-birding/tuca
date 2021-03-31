import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
admin.initializeApp();

// runs when media is created
exports.onMediaCreate = functions.firestore
  .document('media/{mediaUid}')
  .onCreate((mediaSnap: functions.firestore.QueryDocumentSnapshot) => {
    const taxonUid = mediaSnap.data().taxonUid;
    // increase numMedia by 1
    if (taxonUid) {
      setNumMedia(taxonUid, 'increase');
    }
    return null;
  });

// runs when media is deleted
exports.onMediaDelete = functions.firestore
  .document('media/{mediaUid}')
  .onDelete((mediaSnap: functions.firestore.QueryDocumentSnapshot) => {
    const taxonUid = mediaSnap.data().taxonUid;
    // decrease numMedia by 1
    if (taxonUid) {
      setNumMedia(taxonUid, 'decrease');
    }
    return null;
  });

function setNumMedia(taxonUid: string, direction: string): void {
  // first, get the current numMedia
  admin
    .firestore()
    .collection('genus')
    .doc(taxonUid)
    .get().then((taxon: functions.firestore.DocumentSnapshot) => {
      const oldNumMedia = taxon.data()?.numMedia ? taxon.data()!.numMedia : 0;
      const newNumMedia = direction === 'increase' ? oldNumMedia + 1 : oldNumMedia - 1;
      // then set the new numMedia
      admin
        .firestore()
        .collection('genus')
        .doc(taxonUid)
        .set({ numMedia: newNumMedia }, { merge: true });
    });
}
