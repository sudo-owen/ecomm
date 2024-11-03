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

  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  getTheme(): Observable<HttpResponse<AppTheme>> {
    return this.http
      .get<AppTheme>(`${this.apiUrl}/themes`, { observe: 'response' })
      .pipe(
        tap((response) => {
          const sessionId = response.headers.get('X-Ddd-Session-Id');
          if (sessionId) {
            this.sessionId = sessionId;
          }
        }),
      );
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

  recordVariantVisit() {
    return this.http.put<void>(
      `${this.apiUrl}/variant/${this.sessionId}/visit`,
      {},
    );
  }

  getSessionId(): string | null {
    return this.sessionId;
  }
}
