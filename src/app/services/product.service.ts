// services/product.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      "id": 1,
      "name": "Cotton T-Shirt",
      "price": 19.99,
      "description": "Basic cotton t-shirt. Short sleeves. Crew neck.",
      "fullDescription": "Plain cotton t-shirt with short sleeves and a crew neck. No special features. Comes in one color. Minimal stretch. Requires ironing after wash.",
      "imageUrl": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-AjxM4MZSbLb9gP6EhZHxlupU/user-X1TkWsrK9O4gvvoMYub5A66K/img-aNeEayqlLyYPql6SfS9zq5wk.png?st=2024-10-27T00%3A55%3A09Z&se=2024-10-27T02%3A55%3A09Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-10-26T04%3A02%3A40Z&ske=2024-10-27T04%3A02%3A40Z&sks=b&skv=2024-08-04&sig=yEpjlm/QKTaU1owMohdMtDh2bbmgAQ6%2B3itvHnqnqKU%3D",
      "stock": 50,
      "category": "Clothing"
    },
    {
      "id": 2,
      "name": "Denim Jeans",
      "price": 49.99,
      "description": "Standard fit jeans. Five pockets. Belt loops.",
      "fullDescription": "Basic denim jeans with a standard fit. Has five pockets and belt loops. No stretch. Prone to fading after multiple washes. May feel stiff initially.",
      "imageUrl": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-AjxM4MZSbLb9gP6EhZHxlupU/user-X1TkWsrK9O4gvvoMYub5A66K/img-sXXmscVA60hs6YwlKsLnah1W.png?st=2024-10-27T00%3A55%3A18Z&se=2024-10-27T02%3A55%3A18Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-10-26T21%3A05%3A42Z&ske=2024-10-27T21%3A05%3A42Z&sks=b&skv=2024-08-04&sig=IgCKQNsGYGwyl5FpzVSKUQjxlA71RBHo6nHlFCbVUsg%3D",
      "stock": 30,
      "category": "Clothing"
    },
    {
      "id": 3,
      "name": "Hooded Sweatshirt",
      "price": 39.99,
      "description": "Pullover hoodie. Front pocket. Drawstring hood.",
      "fullDescription": "Simple pullover hoodie with a single front pocket and drawstring hood. Basic design. No special lining. Hood may shrink in wash. Drawstrings can get tangled.",
      "imageUrl": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-AjxM4MZSbLb9gP6EhZHxlupU/user-X1TkWsrK9O4gvvoMYub5A66K/img-HAvrqr92yEdw7donqRVjECqI.png?st=2024-10-27T00%3A55%3A27Z&se=2024-10-27T02%3A55%3A27Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-10-26T19%3A14%3A54Z&ske=2024-10-27T19%3A14%3A54Z&sks=b&skv=2024-08-04&sig=C0tziV2HWPDAHE9HHFBUVVVfiJKEtJ5C6fp1qw5MY5I%3D",
      "stock": 25,
      "category": "Clothing"
    },
    {
      "id": 4,
      "name": "Knit Sweater",
      "price": 59.99,
      "description": "Long-sleeve sweater. Ribbed cuffs and hem.",
      "fullDescription": "Long-sleeve knit sweater with ribbed cuffs and hem. Plain design. No patterns. May pill after several wears. Requires careful washing to maintain shape.",
      "imageUrl": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-AjxM4MZSbLb9gP6EhZHxlupU/user-X1TkWsrK9O4gvvoMYub5A66K/img-RWUiHegjeOE1ZySRC7ZUDOAo.png?st=2024-10-27T00%3A55%3A36Z&se=2024-10-27T02%3A55%3A36Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-10-26T07%3A11%3A22Z&ske=2024-10-27T07%3A11%3A22Z&sks=b&skv=2024-08-04&sig=8uDemR5esbgw9UA8/cWXRKLYaUEkzMWTRt%2BIU6Bh8po%3D",
      "stock": 20,
      "category": "Clothing"
    },
    {
      "id": 5,
      "name": "Cargo Shorts",
      "price": 34.99,
      "description": "Knee-length shorts. Multiple pockets. Button closure.",
      "fullDescription": "Knee-length cargo shorts with multiple pockets. Button and zipper closure. No stretch in fabric. Pockets may bulge when filled. Wrinkles easily.",
      "imageUrl": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-AjxM4MZSbLb9gP6EhZHxlupU/user-X1TkWsrK9O4gvvoMYub5A66K/img-7GinRTQJGsy6GlVYNwSUIHAG.png?st=2024-10-27T00%3A55%3A47Z&se=2024-10-27T02%3A55%3A47Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-10-26T20%3A49%3A39Z&ske=2024-10-27T20%3A49%3A39Z&sks=b&skv=2024-08-04&sig=oOD9STZ8Ar8b/iS/e9%2BIdQaQfNQ8oEwOeXUNc1DHxJA%3D",
      "stock": 35,
      "category": "Clothing"
    },
    {
      "id": 6,
      "name": "Button-Up Shirt",
      "price": 44.99,
      "description": "Collared shirt. Long sleeves. Button front.",
      "fullDescription": "Standard button-up shirt with collar and long sleeves. Plain design. No chest pocket. Requires ironing after wash. Buttons may loosen over time.",
      "imageUrl": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-AjxM4MZSbLb9gP6EhZHxlupU/user-X1TkWsrK9O4gvvoMYub5A66K/img-ZlhNCWzqQQSJnqcIGS7v2C5Y.png?st=2024-10-27T00%3A55%3A58Z&se=2024-10-27T02%3A55%3A58Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-10-26T13%3A47%3A49Z&ske=2024-10-27T13%3A47%3A49Z&sks=b&skv=2024-08-04&sig=t/CBjTxdo3KZEIYv41zwNuydNiPVnkTrH7JfqsbMBe4%3D",
      "stock": 40,
      "category": "Clothing"
    },
    {
      "id": 7,
      "name": "Athletic Socks",
      "price": 12.99,
      "description": "Ankle-length socks. Pack of 6. Cushioned sole.",
      "fullDescription": "Pack of 6 basic ankle-length athletic socks. White color only. Cushioned sole may flatten with use. Elastic may loosen after multiple washes.",
      "imageUrl": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-AjxM4MZSbLb9gP6EhZHxlupU/user-X1TkWsrK9O4gvvoMYub5A66K/img-dugaYsxmU0a3wRd8OXhaAxd4.png?st=2024-10-27T00%3A56%3A08Z&se=2024-10-27T02%3A56%3A08Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-10-26T19%3A05%3A17Z&ske=2024-10-27T19%3A05%3A17Z&sks=b&skv=2024-08-04&sig=qRmkPaneFiMCtDTsJ8yCZ/WUwn6w5haolwceQAUqCcc%3D",
      "stock": 100,
      "category": "Clothing"
    },
    {
      "id": 8,
      "name": "Leather Belt",
      "price": 29.99,
      "description": "Genuine leather belt. Metal buckle. 1.5 inches wide.",
      "fullDescription": "Plain leather belt, 1.5 inches wide with a basic metal buckle. No design or patterns. Leather may crease with regular use. Buckle prone to scratches.",
      "imageUrl": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-AjxM4MZSbLb9gP6EhZHxlupU/user-X1TkWsrK9O4gvvoMYub5A66K/img-eZ8pUATQAKytRLCH3Godj6s3.png?st=2024-10-27T00%3A56%3A19Z&se=2024-10-27T02%3A56%3A19Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-10-26T19%3A08%3A19Z&ske=2024-10-27T19%3A08%3A19Z&sks=b&skv=2024-08-04&sig=ISRZcdVBnbZXb7A6rJ87DPIPV6nXSiJfTIArCdoo0SA%3D",
      "stock": 45,
      "category": "Clothing"
    },
    {
      "id": 9,
      "name": "Windbreaker Jacket",
      "price": 69.99,
      "description": "Lightweight jacket. Water-resistant. Zip front.",
      "fullDescription": "Basic windbreaker jacket with front zipper. Water-resistant but not waterproof. No inner lining. Makes rustling noise when moving. Zipper may stick occasionally.",
      "imageUrl": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-AjxM4MZSbLb9gP6EhZHxlupU/user-X1TkWsrK9O4gvvoMYub5A66K/img-eqjddDOLLgLS7xSCBhGtFwmt.png?st=2024-10-27T00%3A56%3A31Z&se=2024-10-27T02%3A56%3A31Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-10-26T21%3A39%3A49Z&ske=2024-10-27T21%3A39%3A49Z&sks=b&skv=2024-08-04&sig=C%2BATkApi2qwTbFl7zOtRhTfAbnHOKeiF0v8dxXkAUKo%3D",
      "stock": 15,
      "category": "Clothing"
    },
    {
      "id": 10,
      "name": "Knit Beanie",
      "price": 14.99,
      "description": "Warm winter hat. One size fits most. Acrylic material.",
      "fullDescription": "Simple knit beanie made of acrylic material. One size designed to fit most. No special insulation. May cause static in dry conditions. Loses shape easily.",
      "imageUrl": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-AjxM4MZSbLb9gP6EhZHxlupU/user-X1TkWsrK9O4gvvoMYub5A66K/img-bLpQsdP5mznKmdco712aI2Cm.png?st=2024-10-27T00%3A56%3A39Z&se=2024-10-27T02%3A56%3A39Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-10-26T20%3A35%3A50Z&ske=2024-10-27T20%3A35%3A50Z&sks=b&skv=2024-08-04&sig=FR3BzQ0HPN9rtdaS/VwNa%2BJmXI%2BVfaDTIvu7RpJDnIk%3D",
      "stock": 60,
      "category": "Clothing"
    }
  ];

  private productsSubject = new BehaviorSubject<Product[]>(this.products);

  constructor() {}

  restockProduct(productId: number, quantity: number): void {
    const currentProducts = this.productsSubject.value;
    const product = currentProducts.find(p => p.id === productId);
    
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
      map(products => products.find(product => product.id === id))
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
    const index = currentProducts.findIndex(p => p.id === updatedProduct.id);
    
    if (index !== -1) {
      currentProducts[index] = updatedProduct;
      this.productsSubject.next([...currentProducts]);
    }
  }

  // Delete a product
  deleteProduct(id: number): void {
    const currentProducts = this.productsSubject.value;
    this.productsSubject.next(currentProducts.filter(product => product.id !== id));
  }

  // Update stock
  updateStock(productId: number, quantity: number): void {
    const currentProducts = this.productsSubject.value;
    const product = currentProducts.find(p => p.id === productId);
    
    if (product) {
      product.stock -= quantity;
      this.productsSubject.next([...currentProducts]);
    }
  }
}

