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
}

interface ProductVariant {
  id: number;
  productId: number;
  changes: Record<string, string>;
}

interface ABTest {
  id: number,
  product: Product,
  name: string,
  description: string,
  variantIds: number[]
  result: ABTestResult 
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

const PRODUCT_FILE = join(__dirname, 'public', 'data', 'products.json');
const PRODUCT_VARIANTS_FILE = join(__dirname, 'public', 'data', 'product_variants.json');
const IMAGES_FOLDER = join(__dirname, 'public', 'img');

let products: Product[] = [];
const abTestResults: ABTestResult[] = [];

let productVariantMetadata = {
  id: 0
};
let productVariants: ProductVariant[] = [];


async function loadProducts() {
  const productsData = await readFile(PRODUCT_FILE, 'utf-8');
  products = JSON.parse(productsData);
}

async function loadProductVariants() {
  const productsVariantData = await readFile(PRODUCT_VARIANTS_FILE, 'utf-8')
  const parsedData = JSON.parse(productsVariantData);
  productVariantMetadata = parsedData.metadata;
  productVariants = parsedData.data;
}

async function saveProductVariants() {
  await writeFile(PRODUCT_VARIANTS_FILE, JSON.stringify(productVariants, null, 2));
}

async function saveProducts() {
  await writeFile(
    PRODUCT_FILE,
    JSON.stringify(products, null, 2)
  );
}


async function saveABTestResults() {
  const resultsPath = join(__dirname, 'public', 'data', 'ab_test_results.json');
  await writeFile(resultsPath, JSON.stringify(abTestResults, null, 2));
}


// Add the new endpoint for generating variations
app.get('/api/generate-variant/:productId', async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.productId);
    const product = products.find(p => p.id === productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const descriptionVariant = await generateProductVariations(product.fullDescription);
    const imageVariant = await getProductImageVariations(product.fullDescription);

    descriptionVariant.forEach((fullDescription: string) => {
      let newVariant: ProductVariant = {
        id: productVariantMetadata.id++,
        productId: product.id,
        changes: {
          fullDescription: fullDescription
        }
      }
      productVariants.push(newVariant);
    });

    imageVariant.forEach(async (imagePrompt: string) => {
      generateProductImage(imagePrompt, IMAGES_FOLDER);
    });

    // Save the updated products
    saveProductVariants();

    res.json({ message: 'Variants generated successfully'});
  } catch (error) {
    console.error('Error generating variants:', error);
    res.status(500).json({ message: 'Error generating variants' });
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

app.post('/api/start-ab-test', (req: Request, res: Response) => {
  const { productId, name, description } = req.body;

  if (!productId || !name || !description) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  let product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const newABTest: ABTest = {
    id: 0,
    product: {...product},
    name: name,
    description: description,
    variantIds: [];
  }
});

app.post('/api/ab-test-result', (req: Request, res: Response) => {
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
  await loadProductVariants();
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

startServer();