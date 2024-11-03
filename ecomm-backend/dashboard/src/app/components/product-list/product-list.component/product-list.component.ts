// product-list.component.ts
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Product } from '../../../services/api.service';
import { Observable, map } from 'rxjs';

interface ProductWithSelection extends Product {
  selected: boolean;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading$ | async) {
      <div class="flex justify-center p-4">
        <span class="text-lg">Loading products...</span>
      </div>
    }

    @if (error$ | async) {
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">Error loading products.</span>
      </div>
    }

    <div class="p-4">
      <div class="mb-4 flex justify-between items-center">
        <h2 class="text-2xl font-bold">Products</h2>
        <button
          (click)="toggleSelectAll()"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {{ allSelected ? 'Deselect All' : 'Select All' }}
        </button>
      </div>

      <div class="space-y-4 h-[calc(100vh-35rem)] overflow-y-auto">
      @for (product of products$ | async; track product.id) {
          <div 
            class="flex items-center p-4 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
            [class.bg-blue-50]="product.selected"
            (click)=toggleProduct(product)
          >
            <div class="flex-grow">
              <!-- Image -->
              <img [src]="product.imageUrl" [alt]="product.name" class="w-20 h-20 object-cover rounded">
              <h3 class="text-lg font-semibold">
                {{ product.name }}
              </h3>
              <p class="text-gray-600">
                {{ product.description }}
              </p>
            </div>
            <div class="flex-shrink-0">
              <input
                type="checkbox"
                [checked]="product.selected"
                (change)="toggleProduct(product)"
                class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              >
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProductListComponent implements OnInit {
  private apiService = inject(ApiService);
  
  products$!: Observable<ProductWithSelection[]>;
  allProducts: Product[] = [];
  loading$ = this.apiService.loading$;
  error$ = this.apiService.error$;
  
  selectedCount = 0;
  selectedTotal = 0;
  allSelected = false;

  @Output() allSelectedProducts = new EventEmitter<Product[]>();
  selectedProductsAll: Set<Product> = new Set();

  ngOnInit() {
    this.products$ = this.apiService.getProducts().pipe(
      map(products => products.map(product => ({
        ...product,
        selected: false
      })))
    );
    // Set allProducts from this.product$
    this.products$.subscribe(products => this.allProducts = products);
  }

  toggleProduct(product: ProductWithSelection) {
    product.selected = !product.selected;
    if (product.selected) {
      this.selectedProductsAll.add(product);
    } else {
      this.selectedProductsAll.delete(product);
    }
    this.updateSelectionStats();
  }

  toggleSelectAll() {
    this.allSelected = !this.allSelected;
    this.products$ = this.products$.pipe(
      map(products => products.map(product => ({
        ...product,
        selected: this.allSelected
      })))
    );
    if (this.allSelected) {
      this.selectedProductsAll = new Set(this.allProducts);
    } else {
      this.selectedProductsAll = new Set();
    }
    this.updateSelectionStats();
  }

  private updateSelectionStats() {
    this.products$.pipe(
      map(products => {
        this.selectedCount = products.filter(p => p.selected).length;
        this.selectedTotal = products
          .filter(p => p.selected)
          .reduce((total, p) => total + p.price, 0);
        this.allSelected = products.length > 0 && products.every(p => p.selected);
      })
    ).subscribe();
    this.allSelectedProducts.emit(Array.from(this.selectedProductsAll));
  }
}