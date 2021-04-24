import { Deserializable } from './deserializable.model';

export class GenusModel implements Deserializable {
  category: string;
  commonFamilyName: string;
  commonName: { [key: string]: string; };
  description: string | null;
  externalId: string;
  order: string;
  scientificFamilyName: string;
  scientificName: string;
  thumbnail: string | null;
  uid: string;
  lastUpdated?: Date | any;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
