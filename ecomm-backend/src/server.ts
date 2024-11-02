import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { generateProductVariations, getProductImageVariations, generateProductImage, generateThemeVariations } from '../llm/ai_variation_engine';

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
  result?: ABTestResult 
}

interface ABTestResult {
  productId: number;
  variationType: 'description' | 'image';
  variationIndex: number;
  purchases: number;
}

// Base export interface for common styles
export interface BaseStyles {
  padding?: string;
  margin?: string;
  background?: string;
  rounded?: string;
  shadow?: string;
}

// Hero Section Styles
interface HeroSectionStyles extends BaseStyles {
  container: string;
  headingText: string;
  subText: string;
  ctaButton: string;
  imageContainer: string;
  textContent: string;
  subTextContent: string;
}

// Feature Card Styles
interface FeatureCardStyles extends BaseStyles {
  container: string;
  icon: string;
  title: string;
  description: string;
  image: string;
}

// Testimonial Card Styles
interface TestimonialCardStyles extends BaseStyles {
  container: string;
  starIcon: string;
  quote: string;
  authorContainer: string;
  authorName: string;
  authorTitle: string;
}

// Product Card Styles
interface ProductCardStyles extends BaseStyles {
  container: string;
  title: string;
  description: string;
  price: string;
  ctaButton: string;
}

// Product Holder Styles
interface ProductHolderStyles extends BaseStyles {
  container: string;
  numItems: number;
}

// Main Theme Interface
interface AppTheme {
  heroSection: HeroSectionStyles;
  featureCard: FeatureCardStyles;
  testimonialCard: TestimonialCardStyles;
  productCard: ProductCardStyles;
  productHolder: ProductHolderStyles;
}


app.use(cors());
app.use(express.json());
app.use('/public', express.static(join(__dirname, 'public')));

const PRODUCT_FILE = join(__dirname, 'public', 'data', 'products.json');
const THEME_FILE = join(__dirname, 'public', 'data', 'themes.json');
const PRODUCT_VARIANTS_FILE = join(__dirname, 'public', 'data', 'product_variants.json');
const AB_TESTS_FILE = join(__dirname, 'public', 'data', 'ab_tests.json');
const IMAGES_FOLDER = join(__dirname, 'public', 'img');

let products: Product[] = [];
let abTests: ABTest[] = [];
let theme: AppTheme | undefined = undefined;
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

async function loadThemes() {
  try {
    const themeData = await readFile(THEME_FILE, 'utf-8');
    theme = JSON.parse(themeData);
  } catch (error) {
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

app.get('/api/ab-test-results', (req: any, res: { json: (arg0: ABTestResult[]) => void; }) => {
  res.json(abTestResults);
});
// Add the new endpoint for generating theme variations
app.post('/api/generate-theme-variations', async (req: Request, res: Response) => {
  try {
    const { elementName, themeParams } = req.body;

    if (!elementName || !themeParams) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const variations = await generateThemeVariations(elementName, themeParams);

    res.json({ variations });
  } catch (error) {
    console.error('Error generating theme variations:', error);
    res.status(500).json({ message: 'Error generating theme variations' });
  }
});

// Getter for themes
app.get('/api/themes', (_req: any, res: { json: (arg0: AppTheme) => void; }) => {
  res.json(theme!);
});

async function startServer() {
  try {
    await loadProducts();
    await loadProductVariants();
    await loadABTests();
    await loadThemes();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer().catch(error => console.error('Unhandled error:', error));
