// product-list.component.ts
import { Component, EventEmitter, inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Product } from '../../../services/api.service';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';

interface ProductWithSelection extends Product {
  selected: boolean;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
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
            [ngClass]="{
              'bg-blue-50': product.selected,
              'bg-white': !product.selected
            }"
          >
            <div class="flex-grow">
              <!-- Image -->
              <h3 class="text-lg font-semibold">
                {{ product.name }}
              </h3>
              <p class="text-gray-600">
                {{ product.description }}
              </p>
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
  
  public productsSubject = new BehaviorSubject<ProductWithSelection[]>([]);
  products$: Observable<ProductWithSelection[]> = this.productsSubject.asObservable();
  loading$ = this.apiService.loading$;
  error$ = this.apiService.error$;
  selectedCount = 0;
  selectedTotal = 0;
  allSelected = false;
  selectedProductsAll: Set<Product> = new Set();

  @Input() productsToDeselect: Set<Product> = new Set();
  @Output() allSelectedProducts = new EventEmitter<Product[]>();

  ngOnInit() {
    this.apiService.getProducts().subscribe(products => {
      const productsWithSelection = products.map(product => ({
        ...product,
        selected: false
      }));
      this.productsSubject.next(productsWithSelection);
    });
  }

  public toggleProduct(product: ProductWithSelection) {
    const updatedProducts = this.productsSubject.value.map(p => 
      p.id === product.id ? { ...p, selected: !p.selected } : p
    );
    this.productsSubject.next(updatedProducts);
    this.updateSelectionStats();
  }

  toggleSelectAll() {
    this.allSelected = !this.allSelected;
    const updatedProducts = this.productsSubject.value.map(product => ({
      ...product,
      selected: this.allSelected
    }));
    this.productsSubject.next(updatedProducts);
    this.updateSelectionStats();
  }

  private updateSelectionStats() {
    const products = this.productsSubject.value;
    this.selectedCount = products.filter(p => p.selected).length;
    this.selectedTotal = products
      .filter(p => p.selected)
      .reduce((total, p) => total + p.price, 0);
    this.allSelected = products.length > 0 && products.every(p => p.selected);    
    this.selectedProductsAll = new Set(products.filter(p => p.selected));
    this.allSelectedProducts.emit(Array.from(this.selectedProductsAll));
  }
}