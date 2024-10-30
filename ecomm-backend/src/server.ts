import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import { readFile } from "fs/promises";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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

// Enable CORS
app.use(cors());

// Path to JSON file
const dataPath = join(__dirname, "public/data/products.json");

// Helper function to read products
async function readProducts(): Promise<Product[]> {
  try {
    const data = await readFile(dataPath, "utf8");
    const productData = JSON.parse(data);
    return productData;
  } catch (error) {
    console.error("Error reading products file:", error);
    return [];
  }
}

// GET all products
app.get("/api/products", async (_req: Request, res: Response) => {
  try {
    const products = await readProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error reading products" });
  }
});

app.use('/public', express.static(join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});