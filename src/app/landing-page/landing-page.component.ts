import { Component, OnInit } from '@angular/core';
import { NgFor, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/interfaces';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  standalone: true,
  imports: [NgFor, RouterLink, AsyncPipe],
})
export class LandingPageComponent implements OnInit {
  featuredProducts$: Observable<Product[]> = of([]);

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.featuredProducts$ = this.productService.getProducts().pipe(
      map((products) => products.slice(0, 3)), // Get first 3 products
    );
  }
}
