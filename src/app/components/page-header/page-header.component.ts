import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {
  @Input() label: string | undefined;
  @Input() header: string | undefined;
  @Input() image: string | undefined;
  @Input() icon: string | undefined;

  constructor() {}

  ngOnInit(): void {}
}
