import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  readonly apiEndpoint =
    'https://us-central1-tuca-app.cloudfunctions.net/tucaModelPredict';
  constructor(private firestore: AngularFirestore, private http: HttpClient) {}

  getTaxonSuggestions(base64Image: string): Promise<any> {
    const request = { base64Image: base64Image };

    return this.http
      .post(this.apiEndpoint, request)
      .toPromise()
      .then((modelResult) => {
        let taxonSuggestions = [];
        for (let [key, value] of Object.entries(modelResult)) {
          let entry = { uid: key, confidence: value };
          taxonSuggestions.push(entry);
        }
        taxonSuggestions.sort((a, b) => {
          return parseFloat(a.confidence) > parseFloat(b.confidence) ? -1 : 1;
        });
        return taxonSuggestions;
      });
  }
}
