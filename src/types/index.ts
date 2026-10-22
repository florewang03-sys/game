export type WeddingCategory = 'civil' | 'coutumier' | 'religieux' | 'complet_3en1';
export type CeremonyCategory = WeddingCategory | 'anniversaire' | 'bapteme';

export interface CeremonyModel {
  id: string;
  title: string;
  subtitle: string;
  category: CeremonyCategory;
  price: string;
  deliveryTime: string;
  imageUrl: string;
  demoUrl?: string; // Live website link
  videoUrl?: string; // Optional video preview
  details: {
    ceremonyType: string;
    highlights: string[];
    description: string;
  };
}

export interface SaveTheDateItem {
  id: string;
  title: string;
  price: string;
  delay: string;
  desc: string;
  imageUrl?: string;
  demoUrl?: string;
}

export interface GuestGiftItem {
  id: string;
  name: string;
  category: string;
  startingPrice: string;
  minQuantity: string;
  description: string;
  imageUrl?: string;
}

export interface WebProjectItem {
  id: string;
  title: string;
  clientType: string;
  description: string;
  siteUrl?: string; // Live URL
  imageUrl: string;
  tags: string[];
}

export interface InfographieItem {
  id: string;
  title: string;
  type: string; // e.g. 'Tableau & Gravure', 'Identité Visuelle Complète', 'Montage Vidéo', 'Roll-up & Print', 'Objets & Bijoux Personnalisés'
  price: string;
  description: string;
  imageUrl: string;
  demoUrl?: string;
}

export interface StudioCatalogState {
  weddingModels: CeremonyModel[];
  saveTheDateItems: SaveTheDateItem[];
  guestGifts: GuestGiftItem[];
  webProjects: WebProjectItem[];
  infographieItems: InfographieItem[];
}
