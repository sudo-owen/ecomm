import Anthropic from "@anthropic-ai/sdk";
import * as dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env["ANTHROPIC_API_KEY"],
});


interface ProductVariations {
    variation1: string;
    variation2: string;
    variation3: string;
    variation4: string;
    variation5: string;
  }
  
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
    const jsonString = msg.content[0].text.match(/\{[\s\S]*\}/)?.[0];
  
    if (!jsonString) {
      throw new Error("Failed to extract JSON from the response");
    }
  
    // Parse the JSON string
    const variations: ProductVariations = JSON.parse(jsonString);
    return variations;
  }

async function main() {
    const productDescription = "Experience unparalleled comfort with our ergonomic office chair. Designed to support your body throughout the workday, it features adjustable lumbar support and breathable mesh backing.";
    
    try {
      const variations = await generateProductVariations(productDescription);
      console.log(variations);
    } catch (error) {
      console.error("Error generating variations:", error);
    }
  }
  
  main();