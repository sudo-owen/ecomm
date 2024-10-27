import { Routes } from '@angular/router';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { 
    path: 'products', 
    component: ProductGridComponent 
  },
  { 
    path: 'products/:id', 
    component: ProductDetailComponent 
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];