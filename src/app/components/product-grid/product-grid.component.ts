// components/product-grid/product-grid.component.ts
import { AsyncPipe, NgFor, SlicePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../../models/interfaces';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.css'],
  imports: [AsyncPipe, SlicePipe, NgFor, RouterModule],
  standalone: true
})
export class ProductGridComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    public productService: ProductService,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.productService.getProducts().subscribe(products => {
        this.products = products;
      })
    );
    this.subscription.add(
      this.cartService.getItemRemovedObservable().subscribe(({productId, quantity}) => {
        this.productService.restockProduct(productId, quantity);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addToCart(product: Product): void {
    if (product.stock > 0) {
      this.cartService.addToCart(product);
      this.productService.updateStock(product.id, 1);
    }
  }
}