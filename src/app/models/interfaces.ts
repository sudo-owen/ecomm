// product.interface.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  stock: number;
  category: string;
  fullDescription: string;
  variations: ProductVariations;
}

export interface ProductVariations {
  descriptions: string[];
  imageUrls: string[];
}

// cart-item.interface.ts
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Feature {
  title: string;
  description: string;
  imageSrc: string;
}

export interface Testimonial {
  author: string;
  title: string;
  quote: string;
  stars: number[];
}