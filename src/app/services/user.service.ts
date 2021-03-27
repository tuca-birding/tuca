import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../interfaces';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  signInModalVisible: boolean | undefined;
  userDrawerVisible: boolean | undefined;
  user: User | undefined;

  constructor(public auth: AngularFireAuth, public firestore: AngularFirestore) {
    // listen to auth state change and update user
    this.auth.onAuthStateChanged((authUser: firebase.User | null) => {
      this.getUser(authUser?.uid)
        .then((userDocSnapshot: firebase.firestore.DocumentSnapshot<User>) => {
          if (userDocSnapshot.exists) {
            // if user exists, assign it
            this.subscribeToUser(userDocSnapshot.data()!.uid);
          } else {
            // if not, set a new user
            this.setUser(authUser);
          }
        });
    });
  }

  // search user database for authUser uid
  getUser(userUid: string | undefined): Promise<firebase.firestore.DocumentSnapshot<User>> {
    return this.firestore
      .collection<User>('users')
      .doc(userUid)
      .get()
      .toPromise();
  }

  // set a new user
  setUser(authUser: firebase.User | null) {
    if (authUser) {
      const userData: User = {
        name: authUser.displayName!,
        image: authUser.photoURL!,
        email: authUser.email!,
        uid: authUser.uid!
      };
      this.firestore
        .collection<User>('users')
        .doc(authUser.uid)
        .set(userData).then(() => {
          this.subscribeToUser(userData.uid);
        });
    } else {
      this.user = undefined;
    }
  }

  // subscribe to user document
  subscribeToUser(userUid: string): void {
    this.firestore
      .collection<User>('users')
      .doc(userUid)
      .valueChanges()
      .subscribe((user: User | undefined) => {
        this.user = user;
      });
  }

  // sign user out
  signOut(): void {
    this.auth.signOut();
  }
}
