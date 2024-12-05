// cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CartItem } from '../models/interfaces';
import { Product } from '../models/interfaces';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private itemRemovedSubject = new Subject<{
    productId: number;
    quantity: number;
  }>();

  constructor(private api: ApiService) {}

  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  addToCart(product: Product): void {
    const existingItem = this.cartItems.find(
      (item) => item.product.id === product.id,
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }

    this.cartSubject.next([...this.cartItems]);

    // Record conversion
    this.api.recordVariantConversion(product.id);
  }

  updateQuantity(productId: number, newQuantity: number): void {
    const item = this.cartItems.find((item) => item.product.id === productId);
    if (item) {
      if (newQuantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = newQuantity;
        this.cartSubject.next([...this.cartItems]);
      }
    }
  }

  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(
      (item) => item.product.id !== productId,
    );
    this.cartSubject.next([...this.cartItems]);
  }

  emitItemRemoved(productId: number, quantity: number): void {
    this.itemRemovedSubject.next({ productId, quantity });
  }
  getTotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  }

  getTotalQuantity(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  clearCart(): void {
    this.cartItems = [];
  }

  getItemRemovedObservable(): Observable<{
    productId: number;
    quantity: number;
  }> {
    return this.itemRemovedSubject.asObservable();
  }
}
