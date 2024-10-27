// checkout.component.ts
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/interfaces';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, CommonModule],
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  checkoutForm: FormGroup;

  constructor(
    public cartService: CartService,
    private fb: FormBuilder,
  ) {
    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      paymentMethod: ['card', Validators.required],
      cardNumber: ['', Validators.required],
      expiryDate: ['', Validators.required],
      cvv: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cartService.getCart().subscribe((items) => {
      this.cartItems = items;
    });
  }

  updateQuantity(item: CartItem, quantity: number | string): void {
    this.cartService.updateQuantity(item.product.id, Number(quantity));
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      console.log('Order submitted', {
        items: this.cartItems,
        form: this.checkoutForm.value,
      });
    }
  }
}
