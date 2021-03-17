import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from '../services/user.service';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-sign-in-modal',
  templateUrl: './sign-in-modal.component.html',
  styleUrls: ['./sign-in-modal.component.scss'],
})
export class SignInModalComponent implements OnInit {
  visible: boolean;
  @Output() close = new EventEmitter();

  constructor(public userService: UserService, public auth: AngularFireAuth) { }

  ngOnInit(): void {
    // start animation
    setTimeout(() => {
      this.visible = true;
    }, 0);
  }

  closeModal(): void {
    this.visible = false;
    // wait for animation and remove component
    setTimeout(() => (this.close.emit()), 100);
  }

  // triggers firebase auth
  signIn(provider: string): void {
    this.auth
      .signInWithPopup(
        provider === 'google'
          ? new firebase.auth.GoogleAuthProvider()
          : provider === 'facebook'
            ? new firebase.auth.FacebookAuthProvider()
            : undefined
      )
      .then(() => {
        this.closeModal();
      });
  }
}