import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { UserService } from '../services/user.service';
import firebase from 'firebase/app';
import { User } from '../interfaces';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user: User | undefined;

  constructor(
    private sharedService: SharedService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.sharedService.appLabel = 'User';
  }

  ngOnInit(): void {
    this.subscribeToRoute();
  }

  private subscribeToRoute(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const userUid = params.get('userUid');
      if (userUid) {
        this.userService.getUser(userUid)
          .then((userDocSnapshot: firebase.firestore.DocumentSnapshot<User>) => {
            this.user = userDocSnapshot.data();
            console.log('got user: ', this.user);
          });
      }
    });
  }

}
