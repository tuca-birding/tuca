import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Prediction } from '../models/prediction.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  readonly apiEndpoint =
    'https://us-central1-tuca-app.cloudfunctions.net/tucaModelPredict';
  constructor(private firestore: AngularFirestore, private http: HttpClient) {}

  createPrediction(prediction: any): Promise<void> {
    return this.firestore
      .collection<Prediction>('predictions')
      .doc(prediction.uid)
      .set(prediction);
  }

  updatePrediction(prediction: any): Promise<void> {
    return this.firestore
      .collection<Prediction>('predictions')
      .doc(prediction.uid)
      .update(prediction);
  }

  createRandomUid(): string {
    return this.firestore.createId();
  }

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

  getPredictionsFrom(docUid: string) {
    return this.firestore
      .collection<Prediction>('predictions')
      .doc(docUid)
      .get()
      .toPromise();
  }
}
