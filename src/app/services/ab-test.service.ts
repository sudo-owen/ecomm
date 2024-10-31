import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Product } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ABTestService {
  constructor(private apiService: ApiService) {}

  getVariation(product: Product, variationType: 'descriptions' | 'imageUrls'): Observable<string> {
    if (!product.variations || !product.variations[variationType]) {
      return this.apiService.generateVariations(product.id).pipe(
        map(updatedProduct => this.selectRandomVariation(updatedProduct, variationType)),
        catchError(() => of(variationType === 'descriptions' ? product.description : product.imageUrl))
      );
    }
    return of(this.selectRandomVariation(product, variationType));
  }

  private selectRandomVariation(product: Product, variationType: 'descriptions' | 'imageUrls'): string {
    const variations = product.variations[variationType];
    const randomIndex = Math.floor(Math.random() * variations.length);
    return variations[randomIndex];
  }

  recordResult(product: Product, variationType: 'descriptions' | 'imageUrls', selectedVariation: string): void {
    const variations = product.variations[variationType];
    const variationIndex = variations.indexOf(selectedVariation);
    if (variationIndex !== -1) {
      this.apiService.recordABTestResult(product.id, variationType, variationIndex).subscribe();
    }
  }

  getTestResults(): Observable<any> {
    return this.apiService.getABTestResults();
  }
}