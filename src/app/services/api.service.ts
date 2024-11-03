import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Product } from '../models/interfaces';
import { AppTheme } from '../models/themes';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';
  private http = inject(HttpClient);

  private sessionId: string | null = null;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<boolean>(false);
  
  sessionIdSet: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();
  hasVisitSent: boolean = false;

  getProducts(): Observable<HttpResponse<Product[]>> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`, { observe: 'response' })
      .pipe(
        tap((response) => {
          const sessionId = response.headers.get('X-Ddd-Session-Id');
          if (sessionId) {
            this.sessionId = sessionId;
            this.sessionIdSet.next(true);
          }
        })
      );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  getTheme(): Observable<AppTheme> {
    return this.http.get<AppTheme>(`${this.apiUrl}/themes`);
  }


  generateVariations(productId: number): Observable<Product> {
    return this.http.get<Product>(
      `${this.apiUrl}/generate-variations/${productId}`,
    );
  }

  recordABTestResult(
    productId: number,
    variationType: 'descriptions' | 'imageUrls',
    variationIndex: number,
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/ab-test-result`, {
      productId,
      variationType,
      variationIndex,
    });
  }

  getABTestResults(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ab-test-results`);
  }

  hasVisited: Set<number>  = new Set();

  async recordVariantVisit(productId: number): Promise<void> {
    if (this.hasVisited.has(productId)) {
      return;
    }
    this.hasVisited.add(productId);
    try {
      const response = await fetch(`${this.apiUrl}/variant/visit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'sessionId': this.getSessionId(),
          'productId': productId
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error recording variant visit:', error);
      throw error;
    }
  }

  async recordVariantConversion(productId: number): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/variant/conversion`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'sessionId': this.getSessionId(),
          'productId': productId
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error recording variant visit:', error);
      throw error;
    }
  }

  getSessionId(): string | null {
    return this.sessionId;
  }
}
