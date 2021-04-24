import * as functions from 'firebase-functions';
import { Change } from 'firebase-functions/lib/cloud-functions';
import { DocumentSnapshot, QueryDocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
const admin = require('firebase-admin');
admin.initializeApp();

// runs when media is created
exports.onMediaCreate = functions.firestore
  .document('media/{mediaUid}')
  .onCreate((mediaSnap: QueryDocumentSnapshot) => {
    const mediaDoc = mediaSnap.data();
    if (mediaDoc?.taxonUid) {
      // add taxonUid to user array
      updateUserArray('taxonUid', mediaDoc?.ownerUid, mediaDoc?.taxonUid, 'union');
    }
    if (mediaDoc?.placeUid) {
      // add placeUid to user array
      updateUserArray('placeUid', mediaDoc?.ownerUid, mediaDoc?.placeUid, 'union');
    }
    return null;
  });

// runs when media is updated
exports.onMediaUpdate = functions.firestore
  .document('media/{mediaUid}')
  .onUpdate((change: Change<DocumentSnapshot>) => {
    const docBefore = change.before.data();
    const docAfter = change.after.data();
    // if taxonUid changed, remove old one and/or add new one
    if (docAfter?.taxonUid !== docBefore?.taxonUid) {
      if (docBefore?.taxonUid) {
        updateUserArray('taxonUid', docBefore?.ownerUid, docBefore?.taxonUid, 'remove');
      }
      if (docAfter?.taxonUid) {
        updateUserArray('taxonUid', docAfter?.ownerUid, docAfter?.taxonUid, 'union');
      }
    }
    // if placeUid changed, remove old one and/or add new one
    if (docAfter?.placeUid !== docBefore?.placeUid) {
      if (docAfter?.placeUid) {
        updateUserArray('placeUid', docBefore?.ownerUid, docBefore?.placeUid, 'remove');
      }
      if (docAfter?.placeUid) {
        updateUserArray('placeUid', docAfter?.ownerUid, docAfter?.placeUid, 'union');
      }
    }
    return null;
  });

// runs when media is deleted
exports.onMediaDelete = functions.firestore
  .document('media/{mediaUid}')
  .onDelete((mediaSnap: QueryDocumentSnapshot) => {
    const mediaDoc = mediaSnap.data();
    if (mediaDoc?.taxonUid && mediaDoc?.ownerUid) {
      updateUserArray('taxonUid', mediaDoc?.ownerUid, mediaDoc?.taxonUid, 'remove');
    }
    if (mediaDoc?.placeUid) {
      // add placeUid to user array
      updateUserArray('placeUid', mediaDoc?.ownerUid, mediaDoc?.placeUid, 'remove');
    }
    return null;
  });

function updateUserArray(
  arrayKey: string,
  userUid: string,
  docUid: string,
  operation: string
) {
  // defined the user doc ref
  const userDocRef = admin.firestore().collection('users').doc(userUid);
  // then either add or remove item from array, depending on operation
  const updatedFields = <any>{};
  if (operation === 'union') {
    updatedFields[arrayKey] = admin.firestore.FieldValue.arrayUnion(docUid);
    userDocRef.update(updatedFields);
  } else if (operation === 'remove') {
    // before deleting, check if user has another media with same key value
    admin
      .firestore()
      .collection('media')
      .where('ownerUid', '==', userUid)
      .where(arrayKey, '==', docUid)
      .get()
      .then((media: any) => {
        // if not, remove string from array
        if (media.size === 0) {
          updatedFields[arrayKey] = admin.firestore.FieldValue.arrayRemove(docUid);
          userDocRef.update(updatedFields);
        }
      });
  }
}
