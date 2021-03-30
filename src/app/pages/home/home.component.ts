import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  carousels = [
    { label: 'Recent media' },
    { label: 'Featured species' },
    { label: 'Featured users' },
  ];

  constructor(public sharedService: SharedService, public router: Router) { }

  ngOnInit(): void {
  }

}
