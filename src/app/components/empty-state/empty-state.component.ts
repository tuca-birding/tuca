import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent implements OnInit {
  @Input() label: string;
  @Input() header: string;
  @Input() image: string;

  constructor() { }

  ngOnInit(): void {
  }

}
