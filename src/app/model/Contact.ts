export interface Contact {
  _id?: string;
  name: string;
  phone: string;
  address: string;
  notes: string;
  tags?: string[];
  category?: 'personal' | 'work' | 'family' | 'business' | 'other' | null;
  isFavorite?: boolean;
}