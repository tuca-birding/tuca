import { ElementRef, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  screenSize: string | undefined;
  appTheme = 'light';
  appLabel = 'Tuca';
  scrollBottomSubject: Subject<any> = new Subject();

  constructor(private appTitle: Title) { }

  setScreenSize(): void {
    this.screenSize = window.innerWidth <= 768 ? 's' : 'l';
  }

  setTitle(title: string | undefined): void {
    this.appTitle.setTitle(`Tuca – ${title}`);
  }

  capitalizeString(rawString?: string): string | undefined {
    const wordArray = rawString?.split(' ');
    if (wordArray) {
      for (let i = 0; i < wordArray?.length; i++) {
        if (wordArray[i]) {
          wordArray[i] = `${wordArray[i][0]?.toUpperCase()}${wordArray[
            i
          ].substr(1)}`;
        }
      }
    }
    return wordArray?.join(' ');
  }

  animateTransition(elRef: ElementRef): void {
    elRef.nativeElement.classList.add('transition');
    setTimeout(() => elRef.nativeElement.classList.remove('transition'), 0);
  }

  generateUid(length: number = 4): string {
    return Math.random().toString(36).slice(length * -1);
  }
}
