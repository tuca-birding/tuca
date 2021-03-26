export interface User {
  uid: string,
  name: string,
  email: string,
  image: string,
}
export interface Taxon {
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
  uid: string,
}