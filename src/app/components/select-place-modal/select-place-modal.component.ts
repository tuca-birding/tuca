import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { google } from 'google-maps';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-select-place-modal',
  templateUrl: './select-place-modal.component.html',
  styleUrls: ['./select-place-modal.component.scss']
})
export class SelectPlaceModalComponent implements OnInit {
  visible: boolean | undefined;
  @ViewChild('searchEl') searchEl: ElementRef<HTMLInputElement> | undefined;
  @Output() select = new EventEmitter<string | undefined>();
  @Output() close = new EventEmitter<null>();
  searchTerm: string | undefined;

  suggestedPlaces: google.maps.places.PlaceResult[] = [];

  constructor(public sharedService: SharedService) { }

  ngOnInit(): void {
    // start animation
    setTimeout(() => {
      this.visible = true;
    }, 0);
  }

  findPlace(tar: EventTarget | any) {
    const searchTerm = tar.value;
    const self = this;
    this.suggestedPlaces = [];
    const map = new google.maps.Map(document.getElementById('map') as Element);
    var request: google.maps.places.TextSearchRequest = {
      query: searchTerm,
      type: 'locality'
    };
    var service = new google.maps.places.PlacesService(map);
    service.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        self.suggestedPlaces = results;
      }
    });
  }

  handleSelect(placeUid: string | undefined): void {
    this.visible = false;
    // wait for animation and remove component
    setTimeout(() => {
      this.select.emit(placeUid);
      this.close.emit();
    }, 100);
  }
}
