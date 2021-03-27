import { Deserializable } from './deserializable.model';

export class Taxon implements Deserializable {
  category: string;
  commonFamilyName: string;
  commonName: { [key: string]: string };
  description: string | null;
  externalId: string;
  order: string;
  scientificFamilyName: string;
  scientificName: string;
  thumbnail: string | null;
  uid: string;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
