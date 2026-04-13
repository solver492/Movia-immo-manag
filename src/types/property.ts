export type PropertyType =
  | 'Appartement'
  | 'Maison'
  | 'Villa'
  | 'Terrain'
  | 'Local Commercial';

export type TransactionType = 'À vendre' | 'À louer';

export type PropertyState = 'Aménagé' | 'Brut' | 'En travaux';

export type MandatStatus = 'Actif' | 'Vendu' | 'Loué' | 'En attente';

export interface Property {
  id: string;
  id_bien: string;
  type: PropertyType;
  transaction: TransactionType;
  prix: number;
  superficie: number;
  nb_chambres: number | null;
  parking: boolean;
  etage: number | null;
  ascenseur: boolean;
  etat: PropertyState | null;
  localisation: string;
  contact_nom: string;
  contact_telephone: string;
  statut_mandat: MandatStatus;
  photo_url: string | null;
  created_at: string;
}

export interface PropertyFormData {
  type: PropertyType;
  transaction: TransactionType;
  prix: string;
  superficie: string;
  nb_chambres: string;
  parking: boolean;
  etage: string;
  ascenseur: boolean;
  etat: PropertyState | '';
  localisation: string;
  contact_nom: string;
  contact_telephone: string;
  statut_mandat: MandatStatus;
  photo_url: string;
}

export interface PropertyFilters {
  type: string;
  transaction: string;
  prix_min: string;
  prix_max: string;
  localisation: string;
  statut_mandat: string;
}

export const PROPERTY_TYPES: PropertyType[] = [
  'Appartement',
  'Maison',
  'Villa',
  'Terrain',
  'Local Commercial',
];

export const TRANSACTION_TYPES: TransactionType[] = ['À vendre', 'À louer'];

export const PROPERTY_STATES: PropertyState[] = ['Aménagé', 'Brut', 'En travaux'];

export const MANDAT_STATUSES: MandatStatus[] = ['Actif', 'Vendu', 'Loué', 'En attente'];

export const MOROCCAN_CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fès',
  'Tanger',
  'Agadir',
  'Meknès',
  'Oujda',
  'Kénitra',
  'Tétouan',
  'Safi',
  'Mohammédia',
  'El Jadida',
  'Béni Mellal',
  'Nador',
  'Taza',
  'Settat',
  'Larache',
  'Khouribga',
  'Guelmim',
];
