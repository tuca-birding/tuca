import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  screenSize: string | undefined;
  appTheme = 'light';
  appLabel = 'Tuca';
  scrollBottomSubject: Subject<any> = new Subject();;

  constructor() { }

  setScreenSize(): void {
    this.screenSize = window.innerWidth <= 768 ? 's' : 'l';
  }
}
