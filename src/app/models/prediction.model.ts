import { Deserializable } from './deserializable.model';

export class Prediction implements Deserializable {
  predictions?: Array<{ uid: string; confidence: string }>;
  imageUrl?: string;
  uid!: string;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
