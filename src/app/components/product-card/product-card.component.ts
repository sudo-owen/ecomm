import { Component, Input } from '@angular/core';
import { Product } from '../../models/interfaces';
import { AppTheme } from '../../models/themes';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

// product-card.component.ts
@Component({
  selector: 'app-product-card',
  template: `
    <div [ngClass]="(theme$ | async)?.productCard?.container">
      <img [src]="product.imageUrl" [alt]="product.name" class="w-full h-48 object-cover" />
      <div class="p-4">
        <h3 [ngClass]="(theme$ | async)?.productCard?.title">
          {{ product.name }}
        </h3>
        <p [ngClass]="(theme$ | async)?.productCard?.description">
          {{ product.description }}
        </p>
        <div class="flex justify-between items-center mt-2">
          <span [ngClass]="(theme$ | async)?.productCard?.price"> 
           $ {{product.price}}
          </span>
          <button [ngClass]="(theme$ | async)?.productCard?.ctaButton">
            View Details
          </button>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() theme$!: Observable<AppTheme>;

  constructor() {}
}
