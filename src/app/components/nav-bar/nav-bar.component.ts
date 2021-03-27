import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  tabList = [
    { icon: 'file_upload', route: '/upload', disabled: false },
    { icon: 'assignment', route: '/taxon-list', disabled: false },
    { icon: 'face', route: `/user/${this.userService.user?.uid}`, disabled: !this.userService.user }
  ];

  constructor(public router: Router, private userService: UserService) { }

  ngOnInit(): void {
  }

}
