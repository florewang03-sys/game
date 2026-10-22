import { 
  CeremonyModel, 
  SaveTheDateItem, 
  GuestGiftItem, 
  WebProjectItem, 
  InfographieItem, 
  StudioCatalogState 
} from '../types';

export const STUDIO_INFO = {
  name: 'PIXEL & TRAIT',
  tagline: 'Idées en pixels, émotions en traits',
  location: 'Douala, Bonamoussadi · Quartier Denver (Cameroun)',
  whatsappNumber: '6 51 88 77 22',
  whatsappRaw: '237651887722',
  whatsappUrl: (message: string) => `https://wa.me/237651887722?text=${encodeURIComponent(message)}`,
};

export const WEDDING_PILLARS = [
  { id: '1', title: '1. Notre histoire', desc: 'Récit intime et émouvant de votre rencontre, de la demande et de vos vœux.' },
  { id: '2', title: '2. Compte à rebours', desc: 'Horloge animée en direct jusqu’au grand jour pour faire monter l’émotion.' },
  { id: '3', title: '3. Confirmation de présence (RSVP)', desc: 'Formulaire direct relié à votre WhatsApp pour valider les invités et leurs menus.' },
  { id: '4', title: '4. Dress code & Nuancier', desc: 'Couleurs officielles et inspirations de tenues traditionnelles ou de gala.' },
  { id: '5', title: '5. Localisation GPS', desc: 'Guidage en 1 clic sur Google Maps et Waze vers la mairie, l’église et la salle.' },
  { id: '6', title: '6. Programme détaillé', desc: 'Horaires précis de chaque cérémonie pour le respect parfait du timing.' },
  { id: '7', title: '7. Filtre Snapchat personnalisé', desc: 'Filtre officiel à vos prénoms pour sublimer les stories de tous vos invités.' },
  { id: '8', title: '8. Liste des cadeaux & Cagnottes', desc: 'Coordonnées Orange Money et MTN MoMo pour vos proches et la diaspora.' },
  { id: '9', title: '9. Album photo & Vidéos partagé', desc: 'Galerie interactive où vos invités déposent directement leurs photos et vidéos souvenirs.' },
];

export const INITIAL_WEDDING_MODELS: CeremonyModel[] = [
  {
    id: 'wm-coutumier-1',
    title: 'Tradition Royale & Toghu Or',
    subtitle: 'Mariage Coutumier & Dot',
    category: 'coutumier',
    price: 'À partir de 45 000 FCFA',
    deliveryTime: '5 à 7 jours ouvrés',
    imageUrl: '/src/assets/images/fairepart_wedding_preview_1792669131612.jpg',
    demoUrl: 'https://wa.me/237651887722?text=Bonjour%20Flore,%20je%20veux%20tester%20la%20démo%20du%20modèle%20Coutumier',
    details: {
      ceremonyType: 'Mariage Coutumier uniquement',
      highlights: ['Programme de la Dot', 'Bénédiction des familles', 'RSVP WhatsApp', 'Plan d’accès GPS'],
      description: 'Dédié aux mariages traditionnels avec valorisation des tenues, de la dot et des familles.',
    },
  },
  {
    id: 'wm-civil-1',
    title: 'Élégance Mairie & Cocktail',
    subtitle: 'Mariage Civil Officiel',
    category: 'civil',
    price: 'À partir de 45 000 FCFA',
    deliveryTime: '5 à 7 jours ouvrés',
    imageUrl: '/src/assets/images/fairepart_wedding_preview_1792669131612.jpg',
    demoUrl: 'https://wa.me/237651887722?text=Bonjour%20Flore,%20je%20veux%20tester%20la%20démo%20du%20modèle%20Civil',
    details: {
      ceremonyType: 'Mariage Civil uniquement',
      highlights: ['Horaires Mairie', 'Vin d’honneur', 'Localisation GPS', 'Compte à rebours'],
      description: 'L’essentiel pour une célébration civile raffinée et facile d’accès pour tous les convives.',
    },
  },
  {
    id: 'wm-religieux-1',
    title: 'Féerie Blanche & Alliance Sacrée',
    subtitle: 'Bénédiction Nuptiale & Messe',
    category: 'religieux',
    price: 'À partir de 45 000 FCFA',
    deliveryTime: '5 à 7 jours ouvrés',
    imageUrl: '/src/assets/images/fairepart_wedding_preview_1792669131612.jpg',
    demoUrl: 'https://wa.me/237651887722?text=Bonjour%20Flore,%20je%20veux%20tester%20la%20démo%20du%20modèle%20Religieux',
    details: {
      ceremonyType: 'Mariage Religieux uniquement',
      highlights: ['Chants & Livret de messe', 'Horaires Église', 'RSVP en direct'],
      description: 'Un hommage solennel et pur à votre engagement sacré avec musique spirituelle et textes sacrés.',
    },
  },
  {
    id: 'wm-complet-1',
    title: 'Grand Palace 3 en 1 Cameroun',
    subtitle: 'Coutumier + Mairie + Église + Soirée de Gala',
    category: 'complet_3en1',
    price: 'À partir de 95 000 FCFA',
    deliveryTime: '3 à 5 jours prioritaires',
    imageUrl: '/src/assets/images/fairepart_wedding_preview_1792669131612.jpg',
    demoUrl: 'https://wa.me/237651887722?text=Bonjour%20Flore,%20je%20veux%20tester%20la%20démo%20du%20modèle%20Grand%20Palace%203%20en%201',
    details: {
      ceremonyType: 'Les Trois Cérémonies Complètes',
      highlights: ['Tous les 9 modules inclus', 'Filtre Snapchat offert', 'Cagnotte OM/MoMo', 'Album photo partagé'],
      description: 'La formule d’élite pour les couples qui célèbrent la tradition, la république et la foi dans une fête grandiose.',
    },
  },
];

export const INITIAL_SAVE_THE_DATE: SaveTheDateItem[] = [
  {
    id: 'std-1',
    title: 'Save the date digital interactif',
    price: '5 000 FCFA',
    delay: 'Livré en 48 h',
    desc: 'Un visuel exclusif à vos prénoms et à votre thème pour annoncer la date, prêt à envoyer sur WhatsApp et réseaux sociaux.',
    imageUrl: '/src/assets/images/fairepart_birthday_party_1792670579697.jpg',
    demoUrl: 'https://wa.me/237651887722?text=Bonjour%20Flore,%20je%20veux%20voir%20des%20exemples%20de%20Save%20the%20date',
  },
  {
    id: 'std-2',
    title: 'Filtre Snapchat officiel personnalisé',
    price: '10 000 FCFA',
    delay: 'Livré en 48 h',
    desc: 'Un filtre géolocalisé à vos prénoms pour mariage, anniversaire, baptême ou baby shower, actif pour toute la journée.',
    imageUrl: '/src/assets/images/fairepart_wedding_preview_1792669131612.jpg',
    demoUrl: 'https://wa.me/237651887722?text=Bonjour%20Flore,%20je%20veux%20tester%20les%20filtres%20Snapchat',
  },
];

export const INITIAL_GUEST_GIFTS: GuestGiftItem[] = [
  {
    id: 'gift-tasse-magique',
    name: 'Tasses Magiques Personnalisées',
    category: 'Cadeau chaud révélateur',
    startingPrice: 'Dès 3 500 FCFA / pièce',
    minQuantity: 'Minimum 10 pièces',
    description: 'La tasse noire révèle la photo des mariés et la date dès qu’on y verse une boisson chaude. Effet waouh garanti !',
    imageUrl: '/src/assets/images/branding_infographie_showcase_1792669132520.jpg',
  },
  {
    id: 'gift-tasse-simple',
    name: 'Tasses Blanches Céramique Personnalisées',
    category: 'Classique chic',
    startingPrice: 'Dès 2 500 FCFA / pièce',
    minQuantity: 'Minimum 20 pièces',
    description: 'Impression haute définition inaltérable avec vos initiales, date et motif du mariage.',
    imageUrl: '/src/assets/images/branding_infographie_showcase_1792669132520.jpg',
  },
  {
    id: 'gift-portecle',
    name: 'Porte-clés Personnalisés Métal / Acrylique',
    category: 'Pratique & élégant',
    startingPrice: 'Dès 1 000 FCFA / pièce',
    minQuantity: 'Minimum 30 pièces',
    description: 'Un souvenir que chaque invité garde quotidiennement sur son trousseau de clés.',
    imageUrl: '/src/assets/images/branding_infographie_showcase_1792669132520.jpg',
  },
  {
    id: 'gift-tableau-bois',
    name: 'Portraits d’art sur Bois Noble ou Plexiglas',
    category: 'Prestige & Décoration',
    startingPrice: 'Dès 12 000 FCFA / pièce',
    minQuantity: 'À l’unité ou par lot',
    description: 'Gravure d’art et impression photo sur bois massif ou acrylique transparent brillant pour les mariés, parents et témoins.',
    imageUrl: '/src/assets/images/branding_infographie_showcase_1792669132520.jpg',
  },
  {
    id: 'gift-pochettes',
    name: 'Pochettes & Trousseaux Personnalisés',
    category: 'Textile & Élégance',
    startingPrice: 'Dès 2 000 FCFA / pièce',
    minQuantity: 'Minimum 20 pièces',
    description: 'Pochettes en tissu ou lin avec broderie ou impression dorée pour les demoiselles d’honneur et proches.',
    imageUrl: '/src/assets/images/branding_infographie_showcase_1792669132520.jpg',
  },
  {
    id: 'gift-maillots',
    name: 'Maillots & T-shirts Événementiels',
    category: 'Team Mariage & After',
    startingPrice: 'Dès 4 500 FCFA / pièce',
    minQuantity: 'Minimum 10 pièces',
    description: 'T-shirts assortis pour la Team Mariée, Team Marié, cortège ou lendemain de fête.',
    imageUrl: '/src/assets/images/branding_infographie_showcase_1792669132520.jpg',
  },
  {
    id: 'gift-bijoux-macarons',
    name: 'Macarons, Badges & Bijoux Personnalisés',
    category: 'Petits cadeaux précieux',
    startingPrice: 'Dès 800 FCFA / pièce',
    minQuantity: 'Minimum 30 pièces',
    description: 'Bracelets personnalisés, macarons souvenirs et petits bijoux gravés aux initiales des mariés.',
    imageUrl: '/src/assets/images/branding_infographie_showcase_1792669132520.jpg',
  },
];

export const INITIAL_WEB_PROJECTS: WebProjectItem[] = [
  {
    id: 'web-1',
    title: 'Plateforme E-Commerce & Catalogue Douala',
    clientType: 'Boutique Prêt-à-Porter & Créations',
    description: 'Site vitrine et catalogue dynamique avec commande WhatsApp directe en un clic, optimisé pour les réseaux mobiles 3G/4G camerounais.',
    siteUrl: 'https://wa.me/237651887722?text=Bonjour%20Flore,%20je%20veux%20voir%20cette%20démo%20de%20site%20web',
    imageUrl: '/src/assets/images/hero_studio_creative_1792669131015.jpg',
    tags: ['React & Tailwind', 'SEO Local Google', 'WhatsApp Direct'],
  },
  {
    id: 'web-2',
    title: 'Portail Vitrine Cabinet Professionnel Yaoundé',
    clientType: 'Conseil Juridique & Fiscal',
    description: 'Interface institutionnelle sobre et haut de gamme avec formulaire de prise de rendez-vous et espace de présentation des experts.',
    siteUrl: 'https://wa.me/237651887722?text=Bonjour%20Flore,%20je%20veux%20voir%20vos%20réalisations%20de%20sites%20vitrines',
    imageUrl: '/src/assets/images/hero_studio_creative_1792669131015.jpg',
    tags: ['Site Vitrine Pro', 'Sécurisé', 'Mobile First'],
  },
];

export const INITIAL_INFOGRAPHIE_ITEMS: InfographieItem[] = [
  {
    id: 'info-1',
    title: 'Identité Visuelle Complète & Charte Graphique',
    type: 'Branding de Marque',
    price: 'À partir de 50 000 FCFA',
    description: 'Logo vectoriel haute précision, déclinaisons, palettes officielles, typographies et guide de marque complet.',
    imageUrl: '/src/assets/images/branding_infographie_showcase_1792669132520.jpg',
    demoUrl: 'https://wa.me/237651887722?text=Bonjour%20Flore,%20je%20veux%20une%20identité%20visuelle%20complète',
  },
  {
    id: 'info-2',
    title: 'Tableaux d’Art, Gravures Bois & Plexiglas',
    type: 'Tableaux & Décoration',
    price: 'À partir de 15 000 FCFA',
    description: 'Création artistique grand format sur bois noble ou plexiglas transparent pour salons, mariages et bureaux de direction.',
    imageUrl: '/src/assets/images/branding_infographie_showcase_1792669132520.jpg',
    demoUrl: 'https://wa.me/237651887722?text=Bonjour%20Flore,%20je%20veux%20un%20tableau%20personnalisé',
  },
  {
    id: 'info-3',
    title: 'Roll-ups, Bâches & Impressions Papier HD',
    type: 'Print & Événementiel',
    price: 'À partir de 25 000 FCFA',
    description: 'Fichiers d’impression certifiés conformes (300 DPI, CMJN) pour stands, séminaires, galas et affichages urbains.',
    imageUrl: '/src/assets/images/branding_infographie_showcase_1792669132520.jpg',
    demoUrl: 'https://wa.me/237651887722?text=Bonjour%20Flore,%20je%20veux%20des%20roll-ups%20et%20flyers',
  },
  {
    id: 'info-4',
    title: 'Montage Vidéo & Animations Réseaux Sociaux',
    type: 'Audiovisuel & Reels',
    price: 'À partir de 30 000 FCFA',
    description: 'Teasers de mariage, vidéos publicitaires de marques, réels TikTok & Instagram rythmés avec effets et étalonnage pro.',
    imageUrl: '/src/assets/images/hero_studio_creative_1792669131015.jpg',
    demoUrl: 'https://wa.me/237651887722?text=Bonjour%20Flore,%20je%20veux%20un%20montage%20vidéo%20pour%20mon%20projet',
  },
  {
    id: 'info-5',
    title: 'T-shirts, Macarons, Bijoux & Objets Personnalisés',
    type: 'Goodies & Textile',
    price: 'Dès 1 000 FCFA / pièce',
    description: 'Flocage textile de prestige, sérigraphie, macarons souvenirs et gravure de bijoux pour événements et entreprises.',
    imageUrl: '/src/assets/images/branding_infographie_showcase_1792669132520.jpg',
    demoUrl: 'https://wa.me/237651887722?text=Bonjour%20Flore,%20je%20veux%20des%20objets%20et%20t-shirts%20personnalisés',
  },
];

const STORAGE_CATALOG_KEY = 'pixel_et_trait_full_catalog_v3';

export function getStudioCatalog(): StudioCatalogState {
  try {
    const raw = localStorage.getItem(STORAGE_CATALOG_KEY);
    if (!raw) {
      return {
        weddingModels: INITIAL_WEDDING_MODELS,
        saveTheDateItems: INITIAL_SAVE_THE_DATE,
        guestGifts: INITIAL_GUEST_GIFTS,
        webProjects: INITIAL_WEB_PROJECTS,
        infographieItems: INITIAL_INFOGRAPHIE_ITEMS,
      };
    }
    const parsed = JSON.parse(raw);
    return {
      weddingModels: parsed.weddingModels || INITIAL_WEDDING_MODELS,
      saveTheDateItems: parsed.saveTheDateItems || INITIAL_SAVE_THE_DATE,
      guestGifts: parsed.guestGifts || INITIAL_GUEST_GIFTS,
      webProjects: parsed.webProjects || INITIAL_WEB_PROJECTS,
      infographieItems: parsed.infographieItems || INITIAL_INFOGRAPHIE_ITEMS,
    };
  } catch {
    return {
      weddingModels: INITIAL_WEDDING_MODELS,
      saveTheDateItems: INITIAL_SAVE_THE_DATE,
      guestGifts: INITIAL_GUEST_GIFTS,
      webProjects: INITIAL_WEB_PROJECTS,
      infographieItems: INITIAL_INFOGRAPHIE_ITEMS,
    };
  }
}

export function saveStudioCatalog(state: StudioCatalogState) {
  try {
    localStorage.setItem(STORAGE_CATALOG_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save studio catalog', err);
  }
}
