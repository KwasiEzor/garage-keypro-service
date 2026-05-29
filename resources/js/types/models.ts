export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_path: string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  services?: Service[];
}

export interface Service {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  icon: string | null;
  starting_price: string;
  estimated_duration: string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  brands?: Brand[];
}

export interface Testimonial {
  id: number;
  customer_name: string;
  customer_location: string | null;
  vehicle_info: string | null;
  content: string;
  rating: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
