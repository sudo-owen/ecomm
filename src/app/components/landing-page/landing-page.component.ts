import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Feature, Product, Testimonial } from '../../models/interfaces';
import { AppTheme } from '../../models/themes';
import { ProductService } from '../../services/product.service';
import { ThemeService } from '../../services/theme.service';
import { TestimonialCardComponent } from '../testimonial-card/testimonial-card.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { RouterLink } from '@angular/router';
import { FeatureCardComponent } from '../feature-card/feature-card.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  standalone: true,
  imports: [CommonModule, TestimonialCardComponent, ProductCardComponent, RouterLink, FeatureCardComponent, NgClass],
})
export class LandingPageComponent implements OnInit {
  featuredProducts$: Observable<Product[]> = of([]);
  theme$: Observable<AppTheme>;

  features: Feature[] = [
    {
      title: 'Premium Quality',
      description:
        'Our clothing is made from high-quality materials, ensuring comfort and durability.',
      imageSrc: '/public/img/product_1730328265039.png',
    },
    {
      title: 'Trendy Designs',
      description:
        'Stay fashionable with our latest styles and designs for every occasion.',
      imageSrc: '/public/img/product_1730328278080.png',
    },
    {
      title: 'Sustainable Fashion',
      description:
        "We're committed to eco-friendly practices and sustainable materials in our production.",
      imageSrc: '/public/img/product_1730328291610.png',
    },
  ];

  testimonials: Testimonial[] = [
    {
      author: 'Alex Johnson',
      title: 'Satisfied Customer',
      quote:
        "I love the quality and style of these clothes! They're comfortable, fashionable, and perfect for any occasion.",
      stars: [1, 2, 3, 4, 5],
    },
    {
      author: 'Sarah Martinez',
      title: 'Fashion Enthusiast',
      quote:
        'The attention to detail in these pieces is remarkable. The fabrics are premium and the fit is excellent.',
      stars: [1, 2, 3, 4],
    },
    {
      author: 'Michael Chen',
      title: 'Verified Buyer',
      quote:
        'Outstanding customer service and the clothes exceeded my expectations. The sustainable packaging was a nice touch too!',
      stars: [1, 2, 3, 4, 5],
    },
  ];

  constructor(
    private productService: ProductService,
    private themeService: ThemeService,
  ) {
    this.theme$ = this.themeService.currentTheme$;
  }

  ngOnInit() {
    this.featuredProducts$ = this.productService.getProducts().pipe(
      map((products) => products.slice(0, this.themeService.currentTheme.getValue().productHolder.numItems)),
    );
  }
}
