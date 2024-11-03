// components/product-detail/product-detail.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../../models/interfaces';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ABTestService } from '../../services/ab-test.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  imports: [FormsModule, NgFor, NgIf],
  standalone: true,
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product!: Product;
  quantity = 1;
  description!: string;
  imageUrl!: string;
  private subscription: Subscription = new Subscription();


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private abTestService: ABTestService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.route.params.subscribe((params) => {
        const productId = Number(params['id']);
        this.loadProduct(productId);
      }),
    );
    this.subscription.add(
      this.cartService
        .getItemRemovedObservable()
        .subscribe(({ productId, quantity }) => {
          if (productId === this.product?.id) {
            this.productService.restockProduct(productId, quantity);
            this.loadProduct(productId); // Reload the product to update the stock
          }
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadProduct(productId: number): void {
    this.subscription.add(
      this.productService.getProduct(productId).subscribe((product) => {
        if (product) {
          this.product = product;
          this.quantity = 1; // Reset quantity when loading new product
          this.loadVariations();
        } else {
          this.router.navigate(['/not-found']);
        }
      }),
    );
  }

  loadVariations() {
    // this.abTestService.getVariation(this.product, 'descriptions').subscribe(description => {
    //   this.description = description;
    // });
    // this.abTestService.getVariation(this.product, 'imageUrls').subscribe(imageUrl => {
    //   this.imageUrl = imageUrl;
    // });
  }

  addToCart(): void {
    if (this.product && this.product.stock >= this.quantity) {
      for (let i = 0; i < this.quantity; i++) {
        this.cartService.addToCart(this.product);
      }
      this.productService.updateStock(this.product.id, this.quantity);
      
      // Record A/B test results
      this.abTestService.recordResult(this.product, 'descriptions', this.description);
      this.abTestService.recordResult(this.product, 'imageUrls', this.imageUrl);
    }
  }

  updateQuantity(newQuantity: number | string): void {
    newQuantity = Number(newQuantity);
    if (this.product && newQuantity <= this.product.stock) {
      this.quantity = newQuantity;
    }
  }
}
