import { Routes } from '@angular/router';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

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
    path: 'checkout',
    component: CheckoutComponent
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];