export interface User {
  uid: string,
  name: string,
  email: string,
  image: string,
}

export interface Taxon {
  uid: string,
  category: string,
  commonFamilyName: string,
  commonName: {
    en: string;
  },
  description: string,
  externalId: string,
  order: string,
  scientificFamilyName: string,
  scientificName: string,
  thumbnail: string,
}

export interface Media {
  uid: string;
  type: string;
  image: string;
  thumbnail: string;
  date: Date;
  uploadDate: Date;
  ownerUid: string;
  taxonUid: string;
  ownerDoc?: User;
  taxonDoc?: Taxon;
}