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
    // add taxonUid to ownerUid doc array
    if (taxonUid && ownerUid) {
      updateUserTaxonList(ownerUid, taxonUid, 'union');
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
    if (taxonUid && ownerUid) {
      updateUserTaxonList(ownerUid, taxonUid, 'remove');
    }
    return null;
  });

function updateUserTaxonList(userUid: string, taxonUid: string, operation: string) {
  // defined the user doc ref
  const userDocRef = admin.firestore().collection('users').doc(userUid);
  // then either add or remove item from array, depending on operation
  if (operation === 'union') {
    userDocRef.update({
      taxonList: admin.firestore.FieldValue.arrayUnion(taxonUid)
    });
  } else if (operation === 'remove') {
    // before deleting, check if user has another media from same taxon
    admin
      .firestore()
      .collection('media')
      .where('ownerUid', '==', userUid)
      .where('taxonUid', '==', taxonUid)
      .get()
      .then((media: any) => {
        // if no other media from the same taxon & user, remove string from array
        if (media.size === 0) {
          userDocRef.update({
            taxonList: admin.firestore.FieldValue.arrayRemove(taxonUid)
          });
        }
      });
  }
}

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
