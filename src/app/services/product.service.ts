// services/product.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Leather Backpack',
      price: 79.99,
      description: 'Durable leather backpack perfect for daily use. Features multiple compartments and water-resistant material.',
      imageUrl: 'assets/images/backpack.jpg',
      stock: 10,
      category: 'Accessories'
    },
    {
      id: 2,
      name: 'Wireless Headphones',
      price: 129.99,
      description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
      imageUrl: 'assets/images/headphones.jpg',
      stock: 15,
      category: 'Electronics'
    },
    // Add more products...
  ];

  private productsSubject = new BehaviorSubject<Product[]>(this.products);

  constructor() {}

  // Get all products
  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  // Get a single product by ID
  getProduct(id: number): Observable<Product | undefined> {
    return this.productsSubject.pipe(
      map(products => products.find(product => product.id === id))
    );
  }

  // Add a new product
  addProduct(product: Product): void {
    const currentProducts = this.productsSubject.value;
    this.productsSubject.next([...currentProducts, product]);
  }

  // Update a product
  updateProduct(updatedProduct: Product): void {
    const currentProducts = this.productsSubject.value;
    const index = currentProducts.findIndex(p => p.id === updatedProduct.id);
    
    if (index !== -1) {
      currentProducts[index] = updatedProduct;
      this.productsSubject.next([...currentProducts]);
    }
  }

  // Delete a product
  deleteProduct(id: number): void {
    const currentProducts = this.productsSubject.value;
    this.productsSubject.next(currentProducts.filter(product => product.id !== id));
  }

  // Update stock
  updateStock(productId: number, quantity: number): void {
    const currentProducts = this.productsSubject.value;
    const product = currentProducts.find(p => p.id === productId);
    
    if (product) {
      product.stock -= quantity;
      this.productsSubject.next([...currentProducts]);
    }
  }
}