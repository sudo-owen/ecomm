import express from "express";
import type { Request, Response } from "express";
import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { PrismaClient, Prisma } from '@prisma/client'
import { generateProductVariations, getProductImageVariations, generateProductImage, generateThemeVariations } from '../llm/ai_variation_engine';

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

async function loadThemes() {
  try {
    const themeData = await readFile(THEME_FILE, 'utf-8');
    theme = JSON.parse(themeData);
  } catch (error) {
    theme = undefined;
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

async function generateVariants(product: Product) {
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

    console.log("newVariants: " + newVariants);

    return newVariants;
}

app.use((req: Request, res: Response, next: () => void) => {
  next();
  console.log(`${new Date().toISOString()}: ${req.method} ${req.url} (${res.statusCode})`);
});

app.use((err: any, req: Request, res: Response, next: any): any => {
  if (err) {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);

    // Send error response
    return res.status(500).json({
      error: {
        message: 'Internal Server Error',
        // Only include error details in development
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      }
    });
  }
  next();
});


// API for customer website ---------------------------------------
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
// ---------------------------------------------------------



function variantToDatabaseVariant(variant: ProductVariant, abTestId: number) {
  let databaseVariant: any = {};
  databaseVariant.changes = JSON.stringify(variant.changes);
  databaseVariant.product = {
    connect: {
      id: variant.productId
    }
  };
  /*
  databaseVariant.abTest = {
    connect: {
      id: abTestId
    }
  };*/
  return databaseVariant;
}

async function generateABTest(config, abTest) {
  try {
    const variants: ProductVariant[] = await generateVariants(config.product);
    const databaseVariants = variants.map(
      v => variantToDatabaseVariant(v, abTest.id)
    );

    // TODO: name and description
    const newABTest = await prisma.abTest.update({
      where: {
        id: abTest.id,
      },
      data: {
        variants: {
          create: databaseVariants
        }
      }
    });

    if (!newABTest) {
      throw new Error('Error creating A/B test');

    }
    return newABTest;

  } catch (error) {
    console.error('Error generating A/B test:', error);
    const newABTest = await prisma.abTest.update({
      where: {
        id: abTest.id,
      },
      data: {
        status: 'error'
      }
    });
    return null;
  }
}

async function updateProductAbTest(enabled: boolean, config: Prisma.AbConfig, res: Response) {
  if (enabled) {
    let abTest = await prisma.abTest.findFirst({
      where: {
        AND: [
          { configId: config.id },
          {
            NOT: { status: 'finished' }
          },
          {
            NOT: { status: 'error' }
          }
        ]
      },
    });

    if (!abTest) {
      abTest = await prisma.abTest.create({
        data: {
          name: ('Experiment for Product ' + config.productId +
            ' (' + config.type + ')'),
          description: ('A/B test for ' + config.type +
            ' of product ' + config.productId),
          purchases: 0,
          status: 'new',
          productBlob: JSON.stringify(config.product),
          abConfig: {
            connect: {
              id: config.id
            }
          }
        }
      });
      res.status(202).json({
        abTest: abTest,
        message: 'A/B test enabled'
      });

      const newAbTest = await generateABTest(config, abTest);
    } else {
      res.status(200).json({
        abTest: abTest,
        message: 'A/B test already exists'
      });
    }


  } else {
    await prisma.abTest.updateMany({
      where: {
        AND: [
          { configId: config.id },
          {
            NOT: { status: 'finished' }
          }
        ]
      },
      data: {
        status: 'finished'
      }
    });

    res.status(200).json({ message: 'A/B test disabled' });
  }
}

function catchErrorsDecorator(func: any) {
  return async (req: Request, res: Response, next: any) => {
    try {
      return await func(req, res);
    } catch (error) {
      console.error('Error:', error);
      return next(error);
    }
  };
}

// API for dashboard ---------------------------------------
app.get('/api/ab-test-configs', catchErrorsDecorator(
  async (req: Request, res: Response) => {
  const configs = await prisma.productAbConfig.findMany();
  res.status(200).json(configs);
  }
));

app.post('/api/ab-test-configs/:type', catchErrorsDecorator(
  async (req: Request, res: Response) => {
  const { info, enabled } = req.body;
  const type = req.params.type;

  if (!type || !info || enabled == null) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (type === 'product') {
    const config = await prisma.productAbConfig.create({
      data: {
        enabled: enabled,
        product: {
          connect: { 
            id: info.productId
          }
        },
        type: info.type,
      },
      include: {
        product: true
      }
    });
    if (config) {
      updateProductAbTest(enabled, config, res);
    } else {
      res.status(500).json({ message: 'Error creating A/B test' });
    }
  } else {
    res.status(400).json({ message: 'Unsupported config type' });
  }
}));

app.put('/api/ab-test-configs/:type/:id', catchErrorsDecorator(
  async (req: Request, res: Response) => {
  const { enabled } = req.body;
  const info = req.body.info ?? {};
  const configId = parseInt(req.params.id);
  const type = req.params.type;

  if (enabled == null || !configId || !type) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  console.log("configId: " + configId);
  
  let config = null;
  try {
    config = await prisma.productAbConfig.update({
      where: { id: configId },
      data: {
        enabled: enabled
      },
      include: {
        product: true
      }
    });
  } catch (error) {
    console.error('Error creating A/B test:', error);
    res.status(400).json({ message: 'Config not found' });
    return;
  }

  updateProductAbTest(enabled, config, res);

}));

// ---------------------------------------------------------


// Deprecated: 
app.post('/api/create-ab-test', async (req: Request, res: Response) => {
  const { productId, name, description } = req.body;

  if (!productId || !name || !description) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  let product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const generatedVariants = await generateVariants(product);
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

// Add the new endpoint for generating variations
app.get('/api/generate-variant/:productId', async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.productId);

    const product = products.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const generatedVariants = await generateVariants(product);
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

async function startServer() {
  await loadProducts();
  await loadProductVariants();
  await loadThemes();
  await loadABTests();

  await populateDatabaseFromFile();
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

startServer().catch(error => console.error('Unhandled error:', error));

