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
    { icon: 'home', route: '/home' },
    { icon: 'file_upload', route: '/upload' },
    { icon: 'search', route: '/taxon-list' }
  ];

  constructor(public router: Router, private userService: UserService) { }

  ngOnInit(): void {
  }

  getUserRoute(): string {
    return this.userService.user ? `/user/${this.userService.user?.uid}` : '';
  }

}
