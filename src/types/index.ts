export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  fullDescription: string;
  image: string;
  price?: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
}
