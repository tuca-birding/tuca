import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  screenSize: string;
  appTheme = 'light';
  appLabel = 'Tuca';

  constructor() { }

  setScreenSize(): void {
    this.screenSize = window.innerWidth <= 768 ? 's' : 'l';
  }
}
