import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PlacesService } from 'src/app/services/places.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss']
})
export class PlaceComponent implements OnInit {
  placeName: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private sharedService: SharedService,
    private elRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.subscribeToRoute();
    this.sharedService.animateTransition(this.elRef);
  }

  private subscribeToRoute(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      // get uid from route
      const placeUid = params.get('placeUid');
      if (placeUid) {
        this.placesService.getPlaceName(placeUid).then((placeName: string) => {
          this.placeName = placeName;
          console.log(placeName);
        });
      }
    });
  }

}
