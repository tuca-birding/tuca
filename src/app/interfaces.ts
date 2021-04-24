export interface User {
  uid: string;
  name: string;
  email: string;
  image: string;
  taxonUid?: string[];
  placeUid?: string[];
  lastUpdated?: Date | any;
}

export interface Taxon {
  uid: string;
  category: string;
  commonFamilyName: string;
  commonName: {
    en: string;
  };
  description: string;
  externalId: string;
  order: string;
  scientificFamilyName: string;
  scientificName: string;
  thumbnail: string;
  lastUpdated?: Date | any;
}

export interface Media {
  uid: string;
  type: string;
  description?: string;
  image: string | undefined;
  thumbnail: string | undefined;
  date: Date | any;
  uploadDate: Date | any;
  ownerUid: string | undefined;
  taxonUid: string | undefined;
  placeUid: string | undefined;
  likes: string[];
  numLikes: number;
}
