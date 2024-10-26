// components/cart-drawer/cart-drawer.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/interfaces';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, RouterLink],  
  templateUrl: './cart-drawer.component.html',
  styleUrls: ['./cart-drawer.component.css']
})
export class CartDrawerComponent implements OnInit, OnDestroy {
  isOpen = false;
  cartItems: CartItem[] = [];
  private subscription = new Subscription();

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.subscription.add(
      this.cartService.getCart().subscribe(items => {
        this.cartItems = items;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleCart() {
    this.isOpen = !this.isOpen;
  }

  incrementQuantity(item: CartItem) {
    if (item.quantity < item.product.stock) {
      this.cartService.addToCart(item.product);
    }
  }

  decrementQuantity(item: CartItem) {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.product.id, item.quantity - 1);
    } else {
      this.cartService.removeFromCart(item.product.id);
    }
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  getTotalQuantity(): number {
    return this.cartService.getTotalQuantity();
  }

  clearCart() {
    this.cartService.clearCart();
  }
}