import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  screenSize: string | undefined;
  appTheme = 'light';
  appLabel = 'Tuca';
  scrollBottomSubject: Subject<any> = new Subject();

  constructor() { }

  setScreenSize(): void {
    this.screenSize = window.innerWidth <= 768 ? 's' : 'l';
  }

  public capitalizeString(string?: string): string | undefined {
    const wordArray = string?.split(' ');
    if (wordArray) {
      for (let i = 0; i < wordArray?.length; i++) {
        if (wordArray[i]) {
          wordArray[i] = `${wordArray[i][0]?.toUpperCase()}${wordArray[i].substr(1)}`;
        }
      }
    }
    return wordArray?.join(' ');
  }
}
