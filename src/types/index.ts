export interface Car {
  id: string;
  brand: string;
  model: string;
  color: string;
  fuel: string;
  transmission: string;
  year: number;
  mileage: number;
  monthly_price: number;
  min_months: number;
  service_type: "subscription" | "rent";
  includes: string[];
  features: string[];
  images: string[];
  is_visible: boolean;
  is_featured: boolean;
  is_sale: boolean;
  created_at: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  created_at: string;
}
