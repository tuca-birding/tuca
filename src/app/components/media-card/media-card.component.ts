import { Component, Input, OnInit } from '@angular/core';
import { Media } from 'src/app/interfaces';

@Component({
  selector: 'app-media-card',
  templateUrl: './media-card.component.html',
  styleUrls: ['./media-card.component.scss']
})
export class MediaCardComponent implements OnInit {
  @Input() image: string | undefined;
  @Input() header: string | undefined;
  @Input() label: string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
