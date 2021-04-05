import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from '../../services/user.service';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-sign-in-modal',
  templateUrl: './sign-in-modal.component.html',
  styleUrls: ['./sign-in-modal.component.scss'],
})
export class SignInModalComponent implements OnInit {
  visible: boolean | undefined;
  @Output() close = new EventEmitter<null>();

  constructor(public userService: UserService, public sharedService: SharedService, public auth: AngularFireAuth) { }

  ngOnInit(): void {
    // start animation
    setTimeout(() => {
      this.visible = true;
    }, 0);
  }

  modalVisibleChanged(tar: any): void {
    if (!tar.visible) {
      this.closeModal();
    }
  }

  closeModal(): void {
    this.visible = false;
    // wait for animation and remove component
    setTimeout(() => (this.close.emit()), 100);
  }

  // triggers firebase auth
  signIn(provider: string): void {
    const providers: { [key: string]: any; } = {
      google: new firebase.auth.GoogleAuthProvider(),
      facebook: new firebase.auth.FacebookAuthProvider()
    };
    this.auth
      .signInWithPopup(providers[provider])
      .then(() => {
        this.closeModal();
      });
  }
}
