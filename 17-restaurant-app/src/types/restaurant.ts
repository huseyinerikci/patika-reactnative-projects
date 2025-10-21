export interface Category {
  alias: string;
  title: string;
}
export interface Coordinates {
  latitude: number;
  longitude: number;
}
export interface Location {
  address1: string;
  address2?: string;
  address3?: string;
  city: string;
  zip_code: string;
  country: string;
  state: string;
  display_address: string[];
}
export interface Hour {
  open: Array<{
    is_overnight: boolean;
    start: string;
    end: string;
    day: number;
  }>;
  hours_type: string;
  is_open_now: boolean;
}
export interface Review {
  id: string;
  rating: number;
  user: {
    name: string;
    image_url: string;
  };
  text: string;
  time_created: string;
}

export interface Restaurant {
  id: string;
  alias: string;
  name: string;
  image_url: string;
  is_closed: boolean;
  url: string;
  review_count: number;
  categories: Category[];
  rating: number;
  coordinates: Coordinates;
  transactions: string[];
  price?: string;
  location: Location;
  phone: string;
  display_phone: string;
  distance?: number;
  photos?: string[];
  hours?: Hour[];
  reviews?: Review[];
}

export interface SearchParams {
  term?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  categories?: string;
  price?: string;
  open_now?: boolean;
  sort_by?: 'best_match' | 'rating' | 'review_count' | 'distance';
  limit?: number;
}
export interface YelpApiResponse {
  businesses: Restaurant[];
  total: number;
  region: {
    center: Coordinates;
  };
}
