import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

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

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';
  private http = inject(HttpClient);

  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }
}
