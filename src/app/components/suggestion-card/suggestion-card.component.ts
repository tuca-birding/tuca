import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-suggestion-card',
  templateUrl: './suggestion-card.component.html',
  styleUrls: ['./suggestion-card.component.scss']
})
export class SuggestionCardComponent implements OnInit {
  @Input() image: string | undefined;
  @Input() header: string | undefined;
  @Input() label: string | undefined;
  @Input() confidence: number | undefined;

  constructor() {}

  ngOnInit(): void {}
}
