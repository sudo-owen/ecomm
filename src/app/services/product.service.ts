// services/product.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Cotton T-Shirt',
      price: 19.99,
      description: 'Basic cotton t-shirt. Short sleeves. Crew neck.',
      fullDescription:
        'Plain cotton t-shirt with short sleeves and a crew neck. No special features. Comes in one color. Minimal stretch. Requires ironing after wash.',
      imageUrl: 'assets/images/tshirt.jpg',
      stock: 50,
      category: 'Clothing',
    },
    {
      id: 2,
      name: 'Denim Jeans',
      price: 49.99,
      description: 'Standard fit jeans. Five pockets. Belt loops.',
      fullDescription:
        'Basic denim jeans with a standard fit. Has five pockets and belt loops. No stretch. Prone to fading after multiple washes. May feel stiff initially.',
      imageUrl: 'assets/images/jeans.jpg',
      stock: 30,
      category: 'Clothing',
    },
    {
      id: 3,
      name: 'Hooded Sweatshirt',
      price: 39.99,
      description: 'Pullover hoodie. Front pocket. Drawstring hood.',
      fullDescription:
        'Simple pullover hoodie with a single front pocket and drawstring hood. Basic design. No special lining. Hood may shrink in wash. Drawstrings can get tangled.',
      imageUrl: 'assets/images/hoodie.jpg',
      stock: 25,
      category: 'Clothing',
    },
    {
      id: 4,
      name: 'Knit Sweater',
      price: 59.99,
      description: 'Long-sleeve sweater. Ribbed cuffs and hem.',
      fullDescription:
        'Long-sleeve knit sweater with ribbed cuffs and hem. Plain design. No patterns. May pill after several wears. Requires careful washing to maintain shape.',
      imageUrl: 'assets/images/sweater.jpg',
      stock: 20,
      category: 'Clothing',
    },
    {
      id: 5,
      name: 'Cargo Shorts',
      price: 34.99,
      description: 'Knee-length shorts. Multiple pockets. Button closure.',
      fullDescription:
        'Knee-length cargo shorts with multiple pockets. Button and zipper closure. No stretch in fabric. Pockets may bulge when filled. Wrinkles easily.',
      imageUrl: 'assets/images/shorts.jpg',
      stock: 35,
      category: 'Clothing',
    },
    {
      id: 6,
      name: 'Button-Up Shirt',
      price: 44.99,
      description: 'Collared shirt. Long sleeves. Button front.',
      fullDescription:
        'Standard button-up shirt with collar and long sleeves. Plain design. No chest pocket. Requires ironing after wash. Buttons may loosen over time.',
      imageUrl: 'assets/images/button-up.jpg',
      stock: 40,
      category: 'Clothing',
    },
    {
      id: 7,
      name: 'Athletic Socks',
      price: 12.99,
      description: 'Ankle-length socks. Pack of 6. Cushioned sole.',
      fullDescription:
        'Pack of 6 basic ankle-length athletic socks. White color only. Cushioned sole may flatten with use. Elastic may loosen after multiple washes.',
      imageUrl: 'assets/images/socks.jpg',
      stock: 100,
      category: 'Clothing',
    },
    {
      id: 8,
      name: 'Leather Belt',
      price: 29.99,
      description: 'Genuine leather belt. Metal buckle. 1.5 inches wide.',
      fullDescription:
        'Plain leather belt, 1.5 inches wide with a basic metal buckle. No design or patterns. Leather may crease with regular use. Buckle prone to scratches.',
      imageUrl: 'assets/images/belt.jpg',
      stock: 45,
      category: 'Clothing',
    },
    {
      id: 9,
      name: 'Windbreaker Jacket',
      price: 69.99,
      description: 'Lightweight jacket. Water-resistant. Zip front.',
      fullDescription:
        'Basic windbreaker jacket with front zipper. Water-resistant but not waterproof. No inner lining. Makes rustling noise when moving. Zipper may stick occasionally.',
      imageUrl: 'assets/images/windbreaker.jpg',
      stock: 15,
      category: 'Clothing',
    },
    {
      id: 10,
      name: 'Knit Beanie',
      price: 14.99,
      description: 'Warm winter hat. One size fits most. Acrylic material.',
      fullDescription:
        'Simple knit beanie made of acrylic material. One size designed to fit most. No special insulation. May cause static in dry conditions. Loses shape easily.',
      imageUrl: 'assets/images/beanie.jpg',
      stock: 60,
      category: 'Clothing',
    },
  ];

  private productsSubject = new BehaviorSubject<Product[]>(this.products);

  constructor() {}

  restockProduct(productId: number, quantity: number): void {
    const currentProducts = this.productsSubject.value;
    const product = currentProducts.find((p) => p.id === productId);

    if (product) {
      product.stock += quantity;
      this.productsSubject.next([...currentProducts]);
    }
  }

  // Get all products
  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  // Get a single product by ID
  getProduct(id: number): Observable<Product | undefined> {
    return this.productsSubject.pipe(
      map((products) => products.find((product) => product.id === id)),
    );
  }

  // Add a new product
  addProduct(product: Product): void {
    const currentProducts = this.productsSubject.value;
    this.productsSubject.next([...currentProducts, product]);
  }

  // Update a product
  updateProduct(updatedProduct: Product): void {
    const currentProducts = this.productsSubject.value;
    const index = currentProducts.findIndex((p) => p.id === updatedProduct.id);

    if (index !== -1) {
      currentProducts[index] = updatedProduct;
      this.productsSubject.next([...currentProducts]);
    }
  }

  // Delete a product
  deleteProduct(id: number): void {
    const currentProducts = this.productsSubject.value;
    this.productsSubject.next(
      currentProducts.filter((product) => product.id !== id),
    );
  }

  // Update stock
  updateStock(productId: number, quantity: number): void {
    const currentProducts = this.productsSubject.value;
    const product = currentProducts.find((p) => p.id === productId);

    if (product) {
      product.stock -= quantity;
      this.productsSubject.next([...currentProducts]);
    }
  }
}
