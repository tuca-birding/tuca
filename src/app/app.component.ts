import { Component, HostListener } from '@angular/core';
import { SharedService } from './services/shared.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // when resizing, update screen size
  @HostListener('window:resize', ['$event'])
  handleResize(): void {
    this.sharedService.setScreenSize();
  }

  constructor(
    public sharedService: SharedService,
    public userService: UserService
  ) {
    // when initializing, set screen size
    this.sharedService.setScreenSize();
  }

  handlePageScroll(e: Event): void {
    const tar = e.target as Element;
    if (tar.scrollTop + tar.clientHeight + 200 >= tar.scrollHeight) {
      this.sharedService.scrollBottomSubject.next();
    }
  }
}
