import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { generateProductVariations, getProductImageVariations, generateProductImage } from '../llm/ai_variation_engine';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  stock: number;
  category: string;
  fullDescription: string;
  variations: {
    descriptions: string[];
    imageUrls: string[];
  };
}

interface ABTestResult {
  productId: number;
  variationType: 'description' | 'image';
  variationIndex: number;
  purchases: number;
}
app.use(cors());
app.use(express.json());
app.use('/public', express.static(join(__dirname, 'public')));

let products: Product[] = [];
const abTestResults: ABTestResult[] = [];

async function loadProducts() {
  const productsPath = join(__dirname, 'public', 'data', 'products_with_variations.json');
  const productsData = await readFile(productsPath, 'utf-8');
  products = JSON.parse(productsData);
}

async function saveABTestResults() {
  const resultsPath = join(__dirname, 'public', 'data', 'ab_test_results.json');
  await writeFile(resultsPath, JSON.stringify(abTestResults, null, 2));
}

// Add the new endpoint for generating variations
app.get('/api/generate-variations/:productId', async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.productId);
    const product = products.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const descriptionVariations = await generateProductVariations(product.fullDescription);
    const imageVariations = await getProductImageVariations(product.fullDescription);

    product.variations = {
      descriptions: [
        descriptionVariations.variation1,
        descriptionVariations.variation2,
        descriptionVariations.variation3,
        descriptionVariations.variation4,
        descriptionVariations.variation5
      ],
      imageUrls: [
        await generateProductImage(imageVariations.prompt, join(__dirname, 'public', 'img')),
        await generateProductImage(imageVariations.prompt2, join(__dirname, 'public', 'img'))
      ]
    };

    // Save the updated products
    await writeFile(
      join(__dirname, 'public', 'data', 'products_with_variations.json'),
      JSON.stringify(products, null, 2)
    );

    res.json({ message: 'Variations generated successfully', product });
  } catch (error) {
    console.error('Error generating variations:', error);
    res.status(500).json({ message: 'Error generating variations' });
  }
});

app.get('/api/products', (_req: any, res: { json: (arg0: Product[]) => void; }) => {
  res.json(products);
});

app.get('/api/products/:id', (req: { params: { id: string; }; }, res: { json: (arg0: Product) => void; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; }) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

app.post('/api/ab-test-result', (req: { body: { productId: any; variationType: any; variationIndex: any; }; }, res: { json: (arg0: { message: string; }) => void; }) => {
  const { productId, variationType, variationIndex } = req.body;
  let result = abTestResults.find(r => 
    r.productId === productId && 
    r.variationType === variationType && 
    r.variationIndex === variationIndex
  );

  if (!result) {
    result = { productId, variationType, variationIndex, purchases: 0 };
    abTestResults.push(result);
  }

  result.purchases++;
  saveABTestResults();
  res.json({ message: 'A/B test result recorded' });
});

app.get('/api/ab-test-results', (req: any, res: { json: (arg0: ABTestResult[]) => void; }) => {
  res.json(abTestResults);
});

async function startServer() {
  await loadProducts();
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

startServer();