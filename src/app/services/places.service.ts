import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  map: google.maps.Map<Element> = new google.maps.Map(document.getElementById('map') as Element);
  service: google.maps.places.PlacesService = new google.maps.places.PlacesService(this.map);

  constructor() { }

  textSearch(term: string | any): Promise<google.maps.places.PlaceResult[]> {
    const request: google.maps.places.TextSearchRequest = {
      query: term,
      type: 'locality'
    };
    return new Promise<google.maps.places.PlaceResult[]>((resolve) => {
      this.service.textSearch(request, (result: google.maps.places.PlaceResult[]) => {
        resolve(result);
      });
    });
  }

  getPlaceDetails(placeUid: string | undefined): Promise<google.maps.places.PlaceResult> {
    return new Promise((resolve) => {
      if (placeUid) {
        const request: google.maps.places.PlaceDetailsRequest = {
          placeId: placeUid,
          fields: ['name', 'photos']
        };
        this.service.getDetails(request, (result: google.maps.places.PlaceResult) => {
          resolve(result);
        });
      }
    });
  }
}
