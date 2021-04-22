import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { PlacesService } from 'src/app/services/places.service';
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

  constructor(
    public sharedService: SharedService,
    private placesService: PlacesService
  ) { }

  ngOnInit(): void {
    // start animation
    setTimeout(() => {
      this.visible = true;
    }, 0);
    this.findPlace('');
  }

  findPlace(input: EventTarget | any): void {
    const term = typeof input === 'string'
      ? input
      : input.closest('kor-input[type="search"]').value;
    // reset array, trigger search and then assign result
    this.suggestedPlaces = [];
    this.placesService
      .textSearch(term)
      .then((result: google.maps.places.PlaceResult[]) => {
        this.suggestedPlaces = result;
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
