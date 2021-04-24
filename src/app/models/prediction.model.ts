import { Deserializable } from './deserializable.model';

export class PredictionModel implements Deserializable {
  predictions?: Array<{ uid: string; confidence: string }>;
  imageUrl?: string;
  uid!: string;
  submittedUid?: string;
  predictionDate?: Date;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
