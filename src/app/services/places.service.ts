import { Injectable } from '@angular/core';
import { google } from 'google-maps';
declare const google: any;

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

  getPlaceName(placeUid: string | undefined): Promise<string> {
    return new Promise((resolve) => {
      if (placeUid) {
        const request = {
          placeId: placeUid,
          fields: ['name']
        };
        this.service.getDetails(request, (result: google.maps.places.PlaceResult) => {
          resolve(result.name);
        });
      }
    });
  }
}
