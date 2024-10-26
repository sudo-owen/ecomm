import { Routes } from '@angular/router';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

export const routes: Routes = [
  { 
    path: '', 
    component: ProductGridComponent 
  },
  { 
    path: 'product/:id', 
    component: ProductDetailComponent 
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];