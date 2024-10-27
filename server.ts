import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { readFile } from 'fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRODUCT_CONFIG } from './src/app/services/product.service'; // or wherever your service is
import bootstrap from './src/main.server';

interface UserContext {
  experimentGroup: 'A' | 'B';
}

// Product interface
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
const PRODUCT_KEY = 'STANDARD';
const productSets = new Map<string, Product[]>();

async function loadProductData(): Promise<void> {
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const dataFolder = resolve(browserDistFolder, 'data');
  try {
    // Load different product sets
    const standardProducts = JSON.parse(
      await readFile(join(dataFolder, 'products.json'), 'utf-8')
    );
    productSets.set(PRODUCT_KEY, standardProducts);
    console.log('Product data loaded successfully');
  } catch (error) {
    console.error('Error loading product data:', error);
    // You might want to handle this error differently
    process.exit(1);
  }
}

async function determineUserContext(req: express.Request): Promise<UserContext> {
  return {
    experimentGroup: 'A'
  };
}

// The Express app is exported so that it can be used by serverless Functions.
export async function app(): Promise<express.Express> {

  // Init the directories
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  // Load the product json
  await loadProductData();

  // Set up the Angular engine
  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('**', express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  }));

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;
    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [
          { provide: APP_BASE_HREF, useValue: baseUrl },
          { provide: PRODUCT_CONFIG, useValue: productSets.get(PRODUCT_KEY)},
        ],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });
  return server;
}

async function run(): Promise<void> {
  const port = process.env['PORT'] || 4000;
  // Start up the Node server
  const server = await app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
