import Anthropic from "@anthropic-ai/sdk";
import * as dotenv from 'dotenv';
import OpenAI from 'openai';
import * as path from 'path';
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// import { ProductService } from '../services/product.service';
// import { firstValueFrom } from 'rxjs';
import { Product } from '../models/interfaces';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env["ANTHROPIC_API_KEY"],
});

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});


type ProductVariations = {
    variation1: string;
    variation2: string;
    variation3: string;
    variation4: string;
    variation5: string;
};

async function generateProductVariations(productDescription: string): Promise<ProductVariations> {
    const prompt = "You are an expert copywriter specializing in crafting compelling product descriptions for e-commerce platforms. Your task is to create five variations of a given product description for A/B testing purposes. These variations will help determine which description is most effective in converting potential customers.\n\nHere is the original product description:\n\n<product_description>\n"
    + productDescription +
    "\n</product_description>\n\nYour goal is to create five variations of this description:\n1. Three slight modifications of the original\n2. One significant departure that explores a new direction\n3. One completely unique variation that takes a fresh perspective on the product\n\nBefore writing the variations, please brainstorm and plan your approach within <brainstorm> tags. In your brainstorming:\n\n1. Identify the target audience and key selling points of the product.\n2. List the key features and benefits of the product.\n3. Consider the emotional appeal and unique value proposition for each variation.\n4. Explore different ways to present these features (e.g., order, emphasis, phrasing).\n5. For slight variations, note specific changes you'll make to the original.\n6. For the significant variation, explore at least three different angles or approaches before choosing one.\n7. For the completely unique variation, think of an innovative way to present the product that hasn't been used in the other variations.\n\nGuidelines for creating the variations:\n\nFor the three slight variations:\n- Maintain the core message and key features of the product\n- Alter the wording, sentence structure, or emphasis\n- You may add or remove minor details, but keep the overall length similar\n- Ensure each variation is distinct from the others\n\nFor the fourth, significant variation:\n- Take a bold new approach to describing the product\n- This could involve:\n  * Focusing on a different key benefit\n  * Using a new tone or style\n  * Reimagining the product's positioning\n  * Addressing a different target audience\n  * Emphasizing emotional appeal over technical specifications\n  * Using a creative narrative or storytelling approach\n- While this should be a departure from the original, it must still accurately represent the product\n\nFor the fifth, completely unique variation:\n- Think outside the box and create a description that stands out from all the others\n- This could involve:\n  * Using an unexpected format (e.g., a mini-story, a dialogue, or a poem)\n  * Adopting a unique persona or voice\n  * Focusing on an unconventional aspect of the product\n  * Creating a vivid scenario that showcases the product's benefits\n- Ensure that this variation is still informative and relevant to potential customers\n\nAfter generating the variations, provide your output in the following JSON format:\n\n{\n  \"variation1\": \"Text of first slight variation\",\n  \"variation2\": \"Text of second slight variation\",\n  \"variation3\": \"Text of third slight variation\",\n  \"variation4\": \"Text of significant variation\",\n  \"variation5\": \"Text of completely unique variation\"\n}\n\nRemember to keep each variation concise and impactful, focusing on the most compelling aspects of the product. Your goal is to create descriptions that will resonate with potential customers and encourage them to make a purchase.";
   
    // Replace placeholders like {{PRODUCT_DESCRIPTION}} with real values,
    // because the SDK does not support variables.
    const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1000,
    temperature: 0,
    messages: [
        {
        "role": "user",
        "content": [
            {
            "type": "text",
            "text": "<examples>\n<example>\n<PRODUCT_DESCRIPTION>\n\"Powerful Intel Skylake Core i7­-6700HQ 2.6 GHz Quad­core CPU (turbo to 3.5GHz). Nvidia GTX960M GPU\",\"512GB SSD with transfer speeds of 1400MB/s and 16GB DDR4 RAM\",\"1x Thunderbolt III (via USB Type­C), 1x Gen 2 USB 3.1 Type­C, 3x USB 3.0, 1x HDMI.Bluetooth 4.0, SDXC reader, 802.11ac Wi­Fi\",\"Windows 10 (64 bit) Signature Edition. 1 ­year International Warranty with 1­ year Accidental Damage Protection\n</PRODUCT_DESCRIPTION>\n<ideal_output>\n<brainstorm>\n1. Key features and benefits:\n   - Powerful Intel Core i7 processor\n   - NVIDIA GTX960M graphics\n   - Fast 512GB SSD\n   - 16GB DDR4 RAM\n   - Advanced connectivity (Thunderbolt III, USB 3.1, etc.)\n   - Windows 10 Signature Edition\n   - 1-year warranty with accidental damage protection\n\n2. Different presentation approaches:\n   - Focus on performance aspects\n   - Emphasize connectivity options\n   - Highlight storage and memory capabilities\n   - Stress the warranty and protection features\n\n3. Slight variations:\n   - Reorder the features for different emphasis\n   - Adjust phrasing to focus on specific user benefits\n   - Vary sentence structure and length\n\n4. Significant variation approaches:\n   - Professional-grade workstation angle\n   - Gaming powerhouse perspective\n   - Versatile all-in-one solution for diverse needs\n   - Future-proof investment in technology\n\nChoosing the \"future-proof investment\" angle for the significant variation.\n</brainstorm>\n<answer>\n{\n  \"variation1\": \"Experience cutting-edge performance with the Intel Skylake Core i7-6700HQ processor, reaching speeds up to 3.5GHz with turbo boost. Featuring the powerful NVIDIA GTX960M graphics card, ultra-fast 512GB SSD (1400MB/s), and 16GB DDR4 RAM. Comprehensive connectivity includes Thunderbolt III, USB 3.1 Type-C, three USB 3.0 ports, and HDMI. Comes with Windows 10 (64-bit) Signature Edition and 1-year International Warranty including Accidental Damage Protection.\",\n\n  \"variation2\": \"Unleash professional-grade computing with a blazing-fast quad-core Intel i7-6700HQ processor and NVIDIA GTX960M graphics. Lightning-quick 512GB SSD delivers 1400MB/s transfer speeds, complemented by 16GB DDR4 memory. Complete connectivity suite features next-gen Thunderbolt III and USB 3.1 Type-C ports, plus HDMI and wireless capabilities. Protected by 1-year International Warranty with Accidental Damage coverage.\",\n\n  \"variation3\": \"High-performance computing meets versatile connectivity in this powerhouse system. At its heart, the Intel i7-6700HQ processor (2.6GHz, turbo to 3.5GHz) works alongside NVIDIA GTX960M graphics and 16GB DDR4 RAM. Premium storage solution includes a 512GB SSD with exceptional 1400MB/s speeds. Features advanced ports including Thunderbolt III and USB 3.1 Type-C, backed by comprehensive warranty protection.\",\n\n  \"variation4\": \"Transform your digital experience with a laptop that thinks as fast as you do. Whether you're rendering complex 3D models or running multiple resource-intensive applications, this performance beast handles it all with ease. The perfect blend of power and precision, featuring future-proof connectivity and lightning-fast storage that loads your applications in the blink of an eye. Built for professionals who demand excellence, backed by premium protection for complete peace of mind. Your journey to unprecedented productivity starts here.\"\n}\n</answer>\n</ideal_output>\n</example>\n<example>\n<PRODUCT_DESCRIPTION>\nExperience unparalleled comfort with our ergonomic office chair. Designed to support your body throughout the workday, it features adjustable lumbar support and breathable mesh backing.\n</PRODUCT_DESCRIPTION>\n<ideal_output>\n<brainstorm>\n1. Key features and benefits:\n   - Ergonomic design\n   - Adjustable lumbar support\n   - Breathable mesh backing\n   - All-day comfort\n   - Supports body throughout workday\n\n2. Different presentation approaches:\n   - Focus on comfort and support\n   - Emphasize productivity benefits\n   - Highlight adjustable features\n   - Stress the health benefits of good posture\n\n3. Slight variations:\n   - Reorder features for different emphasis\n   - Adjust phrasing to focus on specific user benefits\n   - Vary sentence structure and length\n\n4. Significant variation approaches:\n   - Wellness and health-focused angle\n   - Productivity booster perspective\n   - Luxury office upgrade\n   - Personal comfort zone concept\n\nChoosing the \"personal comfort zone\" angle for the significant variation.\n</brainstorm>\n<answer>\n{\n  \"variation1\": \"Experience unparalleled comfort with our ergonomic office chair. Designed to support your body throughout the workday, it features adjustable lumbar support and breathable mesh backing.\",\n  \"variation2\": \"Elevate your productivity with our state-of-the-art office chair. Its customizable settings and supportive design ensure optimal comfort, allowing you to focus on what matters most.\",\n  \"variation3\": \"Introducing the chair that revolutionizes your work environment. With its ergonomic design and adjustable features, our office chair provides the perfect balance of comfort and functionality.\",\n  \"variation4\": \"Embrace the future of workspace wellness with our innovative seating solution. More than just a chair, it's a personal comfort zone that adapts to your body, promoting better posture and increased energy throughout your day.\"\n}\n</answer>\n</ideal_output>\n</example>\n</examples>\n\n"
            },
            {
            "type": "text",
            "text": prompt
            }
        ]
        },
        {
        "role": "assistant",
        "content": [
            {
            "type": "text",
            "text": "<brainstorm>"
            }
        ]
        }
    ]
    });
    const jsonString = msg.content[0].type === 'text' ? msg.content[0].text.match(/\{[\s\S]*\}/)?.[0]: null;
  
    if (!jsonString) {
      throw new Error("Failed to extract JSON from the response");
    }
  
    // Parse the JSON string
    const variations: ProductVariations = JSON.parse(jsonString);
    return variations;
  }

async function getProductImageVariations(productDescription: string) {
  const prompt = "You are tasked with generating two different image generation prompts based on a given product description. These prompts will be used for A/B testing of product images. Your goal is to create prompts that will result in visually distinct and appealing images that accurately represent the product.\n\nHere is the product description:\n<product_description>\n" +
   productDescription + 
  "\n</product_description>\n\nTo generate the first prompt:\n1. Focus on the key features of the product mentioned in the description.\n2. Imagine a realistic, straightforward representation of the product.\n3. Include details about the product's color, style, and main characteristics.\n4. Specify a neutral background or setting that complements the product.\n\nTo generate the second prompt:\n1. Take a more creative or artistic approach to presenting the product.\n2. Imagine the product in a specific context or being used in a particular scenario.\n3. Incorporate elements that evoke a mood or lifestyle associated with the product.\n4. Consider using a unique perspective, lighting, or composition to make the image stand out.\n\nFor both prompts:\n- Use clear, descriptive language that an image generation AI can interpret.\n- Avoid mentioning brands or specific people.\n- Keep each prompt between 50-100 words.\n\nPlease provide your output in the following format:\n<prompt1>\n[Insert your first prompt here]\n</prompt1>\n\n<prompt2>\n[Insert your second prompt here]\n</prompt2>";
  
  const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1000,
    temperature: 0,
    messages: [
        {
        "role": "user",
        "content": [
            {
            "type": "text",
            "text": prompt
            }
        ]
        },
    ]
    });
    const promptRegex = /<prompt(\d)>([\s\S]*?)<\/prompt\1>/g;
    const prompts = [];
    let match;
    if (msg.content[0].type !== 'text') {
      throw new Error("Failed to extract prompts from the response");
    }
    while ((match = promptRegex.exec(msg.content[0].text)) !== null) {
      prompts.push(match[2].trim());
    }
    
    if (prompts.length !== 2) {
      throw new Error("Failed to extract exactly two prompts from the response");
    }
    
    return {
      prompt1: prompts[0],
      prompt2: prompts[1]
    };

}

// Mock ProductService
class MockProductService {
  private products: Product[] = [
  {
    id: 1,
    name: 'Cotton T-Shirt',
    price: 19.99,
    description: 'Basic cotton t-shirt. Short sleeves. Crew neck.',
    fullDescription: 'Plain cotton t-shirt with short sleeves and a crew neck. No special features. Comes in one color. Minimal stretch. Requires ironing after wash.',
    imageUrl: 'assets/images/tshirt.jpg',
    stock: 50,
    category: 'Clothing'
  },
  {
    id: 2,
    name: 'Denim Jeans',
    price: 49.99,
    description: 'Standard fit jeans. Five pockets. Belt loops.',
    fullDescription: 'Basic denim jeans with a standard fit. Has five pockets and belt loops. No stretch. Prone to fading after multiple washes. May feel stiff initially.',
    imageUrl: 'assets/images/jeans.jpg',
    stock: 30,
    category: 'Clothing'
  },
  {
    id: 3,
    name: 'Hooded Sweatshirt',
    price: 39.99,
    description: 'Pullover hoodie. Front pocket. Drawstring hood.',
    fullDescription: 'Simple pullover hoodie with a single front pocket and drawstring hood. Basic design. No special lining. Hood may shrink in wash. Drawstrings can get tangled.',
    imageUrl: 'assets/images/hoodie.jpg',
    stock: 25,
    category: 'Clothing'
  },
  {
    id: 4,
    name: 'Knit Sweater',
    price: 59.99,
    description: 'Long-sleeve sweater. Ribbed cuffs and hem.',
    fullDescription: 'Long-sleeve knit sweater with ribbed cuffs and hem. Plain design. No patterns. May pill after several wears. Requires careful washing to maintain shape.',
    imageUrl: 'assets/images/sweater.jpg',
    stock: 20,
    category: 'Clothing'
  },
  {
    id: 5,
    name: 'Cargo Shorts',
    price: 34.99,
    description: 'Knee-length shorts. Multiple pockets. Button closure.',
    fullDescription: 'Knee-length cargo shorts with multiple pockets. Button and zipper closure. No stretch in fabric. Pockets may bulge when filled. Wrinkles easily.',
    imageUrl: 'assets/images/shorts.jpg',
    stock: 35,
    category: 'Clothing'
  },
  {
    id: 6,
    name: 'Button-Up Shirt',
    price: 44.99,
    description: 'Collared shirt. Long sleeves. Button front.',
    fullDescription: 'Standard button-up shirt with collar and long sleeves. Plain design. No chest pocket. Requires ironing after wash. Buttons may loosen over time.',
    imageUrl: 'assets/images/button-up.jpg',
    stock: 40,
    category: 'Clothing'
  },
  {
    id: 7,
    name: 'Athletic Socks',
    price: 12.99,
    description: 'Ankle-length socks. Pack of 6. Cushioned sole.',
    fullDescription: 'Pack of 6 basic ankle-length athletic socks. White color only. Cushioned sole may flatten with use. Elastic may loosen after multiple washes.',
    imageUrl: 'assets/images/socks.jpg',
    stock: 100,
    category: 'Clothing'
  },
  {
    id: 8,
    name: 'Leather Belt',
    price: 29.99,
    description: 'Genuine leather belt. Metal buckle. 1.5 inches wide.',
    fullDescription: 'Plain leather belt, 1.5 inches wide with a basic metal buckle. No design or patterns. Leather may crease with regular use. Buckle prone to scratches.',
    imageUrl: 'assets/images/belt.jpg',
    stock: 45,
    category: 'Clothing'
  },
  {
    id: 9,
    name: 'Windbreaker Jacket',
    price: 69.99,
    description: 'Lightweight jacket. Water-resistant. Zip front.',
    fullDescription: 'Basic windbreaker jacket with front zipper. Water-resistant but not waterproof. No inner lining. Makes rustling noise when moving. Zipper may stick occasionally.',
    imageUrl: 'assets/images/windbreaker.jpg',
    stock: 15,
    category: 'Clothing'
  },
  {
    id: 10,
    name: 'Knit Beanie',
    price: 14.99,
    description: 'Warm winter hat. One size fits most. Acrylic material.',
    fullDescription: 'Simple knit beanie made of acrylic material. One size designed to fit most. No special insulation. May cause static in dry conditions. Loses shape easily.',
    imageUrl: 'assets/images/beanie.jpg',
    stock: 60,
    category: 'Clothing'
  }  ];

  getProducts() {
    return Promise.resolve(this.products);
  }

  updateProduct(updatedProduct: Product) {
    const index = this.products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      this.products[index] = updatedProduct;
    }
  }
}

async function generateProductImage(description: string): Promise<string> {
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: `A product image of ${description}`,
        n: 1,
        size: "1024x1024",
      });
      if (!response.data || response.data.length === 0 || !response.data[0].url) {
        throw new Error("No data in the response");
      }
      return response.data[0].url;
    } catch (error) {
      console.error(`Failed to generate image for ${description}:`, error);
      return ''; // Return an empty string or a default image URL in case of error
    }
  }

async function addImageUrlsToProducts(productService: MockProductService): Promise<Product[]> {
  const products = await productService.getProducts();
  let updatedCount = 0;
  const updatedProducts = [];

  for (let product of products) {
    console.log(`Generating images for ${product.name}...`);
    const prompts = await getProductImageVariations(product.fullDescription);
    
    const imageUrl1 = await generateProductImage(prompts.prompt1);
    const imageUrl2 = await generateProductImage(prompts.prompt2);
    
    console.log(`Generated image URLs for ${product.name}:`);
    console.log(`  Image 1: ${imageUrl1}`);
    console.log(`  Image 2: ${imageUrl2}`);
    
    const updatedProduct = { 
      ...product, 
      imageVariation1: imageUrl1,
      imageVariation2: imageUrl2
    };
    updatedProducts.push(updatedProduct);
    updatedCount++;
  }

  console.log(`Updated ${updatedCount} products with new image URLs and variations.`);
  return updatedProducts;
}
async function saveProductsToJson(products: any[]): Promise<void> {
  const outputPath = path.join(__dirname, 'updated_products.json');
  await fs.writeFile(outputPath, JSON.stringify(products, null, 2));
  console.log(`Updated products saved to ${outputPath}`);
}


async function main() {
  try {
    const productService = new MockProductService();
    const updatedProducts = await addImageUrlsToProducts(productService);
    
    // Print all product URLs
    updatedProducts.forEach(product => {
      console.log(`${product.name}: ${product.imageUrl}`);
    });

    // Save updated products to JSON
    await saveProductsToJson(updatedProducts);

    console.log("Process completed successfully.");
  } catch (error) {
    console.error("Error in main process:", error);
  }
}


main();

