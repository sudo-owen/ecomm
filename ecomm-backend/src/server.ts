import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { generateProductVariations, getProductImageVariations, generateProductImage } from '../llm/ai_variation_engine';
import { PrismaClient } from '@prisma/client'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;
const prisma = new PrismaClient()


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
  productId: number,
  name: string,
  description: string,
  variantIds: number[]
  result?: ABTestResult 
}

interface ABTestReponse {
  id: number,
  product: Product,
  name: string,
  description: string,
  variant: ProductVariant[],
  result?: ABTestResult 
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
const AB_TESTS_FILE = join(__dirname, 'public', 'data', 'ab_tests.json');
const IMAGES_FOLDER = join(__dirname, 'public', 'img');

let products: Product[] = [];
let abTests: ABTest[] = [];
const abTestResults: ABTestResult[] = [];

let productVariantMetadata = {
  id: 0
};
let productVariants: ProductVariant[] = [];


async function loadProducts() {
  try {
    const productsData = await readFile(PRODUCT_FILE, 'utf-8');
    products = JSON.parse(productsData);
  } catch (error) {
    products = [];
    await saveProducts();
  }
}

async function populateDatabaseFromFile() {
  // Populate products table using products.json
  // checks if empty first
  const productCount = await prisma.product.count();

  const productsData = await readFile(PRODUCT_FILE, 'utf-8');
  products = JSON.parse(productsData);
  
  if (productCount === 0) {
    console.log('Products table is empty. Loading data from JSON file...')
  } else {
    console.log('Products table is not empty. Skipping JSON import.')
    return;
  }

  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.name,
        price: product.price,
        description: product.description,
        imageUrl: product.imageUrl,
        stock: product.stock,
        category: product.category,
        fullDescription: product.fullDescription
      }
    });
  }
}

async function loadProductVariants() {
  try {
    const productsVariantData = await readFile(PRODUCT_VARIANTS_FILE, 'utf-8');
    const parsedData = JSON.parse(productsVariantData);
    productVariantMetadata = parsedData.metadata;
    productVariants = parsedData.data;
  } catch (error) {
    await saveProductVariants();
  }
}

async function loadABTests() {
  try {
    const abTestsData = await readFile(AB_TESTS_FILE, 'utf-8');
    abTests = JSON.parse(abTestsData);
  } catch (error) {
    abTests = [];
    await saveABTests();
  }
}

async function saveProductVariants() {
  await writeFile(PRODUCT_VARIANTS_FILE, JSON.stringify({
    metadata: productVariantMetadata,
    data: productVariants
  }, null, 2));
}

async function saveProducts() {
  await writeFile(
    PRODUCT_FILE,
    JSON.stringify(products, null, 2)
  );
}

async function saveABTests() {
  const abTestsPath = join(__dirname, 'public', 'data', 'ab_tests.json');
  await writeFile(abTestsPath, JSON.stringify(abTests, null, 2));
}

async function saveABTestResults() {
  const resultsPath = join(__dirname, 'public', 'data', 'ab_test_results.json');
  await writeFile(resultsPath, JSON.stringify(abTestResults, null, 2));
}

async function generateVariants(productId: number) {
    const product = products.find(p => p.id === productId);

    if (!product) {
      return undefined;
    }

    const descriptionVariant = await generateProductVariations(product.fullDescription);
    const imageVariant = await getProductImageVariations(product.fullDescription);

    let newVariants: ProductVariant[] = [];

    descriptionVariant.forEach((fullDescription: string) => {
      const newVariant: ProductVariant = {
        id: productVariantMetadata.id++,
        productId: product.id,
        changes: {
          fullDescription: fullDescription
        }
      }
      newVariants.push(newVariant);
    });

    imageVariant.forEach(async (imagePrompt: string) => {
      const imageUrl = generateProductImage(imagePrompt, IMAGES_FOLDER);
      const newVariant: ProductVariant = {
        id: productVariantMetadata.id++,
        productId: product.id,
        changes: {
          imageUrl: imageUrl
        }
      }
      newVariants.push(newVariant);
    });

    return newVariants;
}

app.use((req: Request, res: Response, next: () => void) => {
  next();
  console.log(`${new Date().toISOString()}: ${req.method} ${req.url} (${res.statusCode})`);
});

// Add the new endpoint for generating variations
app.get('/api/generate-variant/:productId', async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.productId);

    const generatedVariants = await generateVariants(productId);
    if (!generatedVariants) {
      return res.status(404).json({ message: 'Product not found' });
    }

    productVariants.push(...generatedVariants);

    // Save the updated products
    saveProductVariants();

    res.json({ message: 'Variants generated successfully'});
  } catch (error) {
    console.error('Error generating variants:', error);
    res.status(500).json({ message: 'Error generating variants' });
  }
});

app.get('/api/products', async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

app.get('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

app.post('/api/create-ab-test', async (req: Request, res: Response) => {
  const { productId, name, description } = req.body;

  if (!productId || !name || !description) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  let product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const generatedVariants = await generateVariants(productId);
  if (!generatedVariants) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const newABTest: ABTest = {
    id: 0,
    product: product,
    productId: productId,
    name: name,
    description: description,
    variantIds: generatedVariants.map(v => v.id)
  }

  abTests.push(newABTest);

  saveProductVariants();
  saveABTests();

  res.json({ message: 'A/B test created successfully' });
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


app.get('/api/ab-test/:id', (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);

  const abTest = abTests.find(t => t.id === id);
  if (!abTest) {
    return res.status(404).json({ message: 'A/B test not found' });
  }
  const abTestResponse: any = {...abTest};
  delete abTestResponse.variantIds;

  abTestResponse.variants = abTest.variantIds.map(id => productVariants.find(v => v.id === id));

  res.json(abTestResponse);
});

app.put('api/ab-config', (req: Request, res: Response) => {
  const { type, info, enabled } = req.body;

  if (type === 'product') {
    const product = products.find(p => p.id === info.id); 
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

  } else if (type === 'ui') {
    res.status(500).json({"message": "UI config not implemented"});
  } else {
    res.status(400).json({"message": "Invalid config type"});
  }

}


app.get('/api/ab-test-results', (req: any, res: { json: (arg0: ABTestResult[]) => void; }) => {
  res.json(abTestResults);
});

async function startServer() {
  await loadProducts();
  await loadProductVariants();
  await loadABTests();

  await populateDatabaseFromFile();
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

startServer();