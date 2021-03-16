import { Component, HostListener } from '@angular/core';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // when resizing, update screen size
  @HostListener('window:resize', ['$event'])
  handleResize() {
    this.sharedService.setScreenSize();
  }

  constructor(public sharedService: SharedService) {
    // when initializing, set screen size
    this.sharedService.setScreenSize();
  }
}
