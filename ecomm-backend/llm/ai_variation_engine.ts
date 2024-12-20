import Anthropic from "@anthropic-ai/sdk";
import * as dotenv from 'dotenv';
import OpenAI from 'openai';
import * as path from 'path';
import { promises as fs } from 'node:fs';
import axios from 'axios';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env["ANTHROPIC_API_KEY"],
});

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

interface ExperimentNameDescription {
  name: string;
  description: string;
}

async function generateExperimentNameDescription(item: any, varients: any[]): Promise<ExperimentNameDescription> {
  const prompt =  "You are working on an AB testing framework. Your task is to generate an experiment name " +
  "and description based on the provided item and its variants.\n\nFirst, examine the following item:\n<item>\n" +
  JSON.stringify(item) + "\n</item>\n\nNow, consider the following variants:\n<variants>\n" +
  JSON.stringify(varients) + "\n</variants>\n\nAnalyze the item and its variants carefully. Pay attention to the changes proposed in the variants and how they differ from the original item.\n\nTo create an experiment name:\n1. Identify the key aspect being tested (e.g., description style, pricing, layout)\n2. Keep it concise and descriptive\n3. Must be between 3 and 7 words. Mention the product name in the name.\n\nTo create an experiment description:\n1. Briefly explain the purpose of the experiment\n2. Mention the element being varied\n3. Describe the potential impact on user behavior or metrics\n4. Keep it under 2-3 sentences\n\nAfter your analysis, provide an experiment name and description. Format your response as follows:\n\n<experiment_name>\n[Your proposed experiment name here]\n</experiment_name>\n\n<experiment_description>\n[Your proposed experiment description here]\n</experiment_description>\n\nEnsure that your experiment name and description are relevant to the item and variants provided, and that they accurately reflect the nature of the AB test being conducted."


    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      temperature: 0.1,
      messages: [
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": prompt
            }
          ]
        }
      ]
    });

    const content = msg.content[0].type === 'text' ? msg.content[0].text : '';
    const nameMatch = content.match(/<experiment_name>([\s\S]*?)<\/experiment_name>/);
    const descriptionMatch = content.match(/<experiment_description>([\s\S]*?)<\/experiment_description>/);
  
    if (!nameMatch || !descriptionMatch) {
      throw new Error("Failed to extract experiment name or description from the response");
    }
  
    return {
      name: nameMatch[1].trim(),
      description: descriptionMatch[1].trim()
    };
}




async function generateThemeVariations(elementName: string, themeParms: object): Promise<object> {
  const prompt ="You are an expert UI/UX designer tasked with generating style variations for web components to optimize user " +
  "engagement and conversion rates through A/B testing. Your goal is to create subtle yet impactful changes that can potentially " +
  "boost user satisfaction and improve the component's performance while maintaining accessibility and usability.\n\nYou will be " +
  "given a component name and its current styles. Here they are:\n\n<component_name>\n" +
  elementName + "\n</component_name>\n\n<component_styles>\n" + JSON.stringify(themeParms) + "\n</component_styles>\n\nYour task is to generate three distinct variations of the given styles. Follow these guidelines:\n\n1. Maintain the overall structure and purpose of the component.\n2. Make changes to colors, sizes, spacing, or typography that range from subtle to moderately bold.\n3. Ensure that the variations are distinct from each other and the original.\n4.{{COMPONENT_STYLES}}\n</component_styles>\n\nYour task is to generate three distinct variations of the given styles. Follow these guidelines:\n\n1. Maintain the overall structure and purpose of the component.\n2. Make changes to colors, sizes, spacing, or typography that range from subtle to moderately bold.\n3. Ensure that the variations are distinct from each other and the original.\n4. Keep accessibility and responsiveness in mind, maintaining good contrast ratios.\n5. Consider the potential impact on user experience and conversion rates.\n\nBegin by analyzing the current styles and planning your variations. Wrap your design process in <design_process> tags. Follow these steps:\n\n1. Analyze the current design:\n   - Identify the color scheme and its potential psychological impact\n   - Evaluate the typography and its readability\n   - Assess the use of space (padding, margins)\n   - Determine the visual hierarchy and emphasis\n\n2. Consider the target audience (18-30 year old urban professionals) and their preferences.\n\n3. For each variation, brainstorm specific ideas:\n   - Color scheme adjustments\n   - Typography changes\n   - Spacing modifications\n   - Visual hierarchy alterations\n\n4. Evaluate how each proposed change might impact user engagement and conversion rates.\n\n5. Ensure each variation maintains accessibility and responsiveness.\n\nAfter your design process, present exactly three variations of the styles in the following format:\n\n<variations>\n<variation1>\n{\n  \"propertyName1\": \"value1\",\n  \"propertyName2\": \"value2\",\n  ...\n}\n</variation1>\n<variation2>\n{\n  \"propertyName1\": \"value1\",\n  \"propertyName2\": \"value2\",\n  ...\n}\n</variation2>\n<variation3>\n{\n  \"propertyName1\": \"value1\",\n  \"propertyName2\": \"value2\",\n  ...\n}\n</variation3>\n</variations>\n\nEnsure that each variation is a valid JSON object.\n\nRemember to maintain consistency with the overall design language and ensure that the component remains functional and usable across all variations."
      
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
            "text": "<examples>\n<example>\n<COMPONENT_NAME>\nheroSection\n</COMPONENT_NAME>\n<COMPONENT_STYLES>\n{\"backgroundColor\":\"#3498db\",\"textColor\":\"#ffffff\",\"fontSize\":\"16px\",\"padding\":\"10px 20px\",\"borderRadius\":\"5px\"}\n</COMPONENT_STYLES>\n<ideal_output>\n<design_process>\n1. Current Design Analysis:\n- Color scheme: Uses #3498db (bright blue) with white text, creating good contrast\n- Typography: Standard 16px size, likely good readability\n- Spacing: Moderate padding (10px 20px)\n- Visual hierarchy: Simple, straightforward design for a hero section\n\n2. Target Audience Considerations:\n- Urban professionals (18-30) typically prefer:\n  * Modern, clean designs\n  * Bold but sophisticated color schemes\n  * Adequate white space\n  * Clear typography\n\n3. Variation Planning:\nVariation 1: Modern Gradient\n- Introduces subtle gradient for depth\n- Increases padding for better breathing room\n- Slightly larger font size for impact\n\nVariation 2: Bold Dark Theme\n- Dark background with higher contrast\n- Warmer accent color\n- Enhanced padding and rounded corners\n- Larger font size for emphasis\n\nVariation 3: Minimal Light Theme\n- Lighter, more subtle approach\n- Softer colors but maintaining contrast\n- Refined spacing\n- Sophisticated typography\n\n4. Impact Considerations:\n- Gradient might increase visual appeal and engagement\n- Dark theme could improve reading comfort\n- Light theme might appear more professional\n\n5. Accessibility Check:\n- All variations maintain WCAG 2.1 contrast requirements\n- Font sizes remain readable\n- Adequate padding for touch targets\n</design_process>\n\n<variations>\n<variation1>\n{\n  \"backgroundColor\": \"linear-gradient(135deg, #3498db, #2980b9)\",\n  \"textColor\": \"#ffffff\",\n  \"fontSize\": \"18px\",\n  \"padding\": \"15px 30px\",\n  \"borderRadius\": \"8px\",\n  \"boxShadow\": \"0 2px 10px rgba(52, 152, 219, 0.3)\"\n}\n</variation1>\n<variation2>\n{\n  \"backgroundColor\": \"#2c3e50\",\n  \"textColor\": \"#ffffff\",\n  \"fontSize\": \"20px\",\n  \"padding\": \"20px 35px\",\n  \"borderRadius\": \"12px\",\n  \"boxShadow\": \"0 4px 15px rgba(0, 0, 0, 0.2)\",\n  \"borderBottom\": \"4px solid #e74c3c\"\n}\n</variation2>\n<variation3>\n{\n  \"backgroundColor\": \"#f8f9fa\",\n  \"textColor\": \"#2c3e50\",\n  \"fontSize\": \"17px\",\n  \"padding\": \"18px 32px\",\n  \"borderRadius\": \"6px\",\n  \"boxShadow\": \"0 1px 3px rgba(0, 0, 0, 0.1)\",\n  \"border\": \"1px solid #e9ecef\"\n}\n</variation3>\n</variations>\n</ideal_output>\n</example>\n</examples>\n\n"
        },
        {
            "type": "text",
            "text": prompt
          }
        ]
      }
    ]
  });

  const response = msg.content[0].type === 'text' ? msg.content[0].text : null;

  if (!response) {
    throw new Error("Failed to extract response from the API");
  }

  try {
    // Extract variations from the response
    const variationsMatch = response.match(/<variations>([\s\S]*?)<\/variations>/);
    if (!variationsMatch) {
      throw new Error("No variations found in the response");
    }

    const variationsContent = variationsMatch[1];
    const variationMatches = variationsContent.match(/<variation\d+>([\s\S]*?)<\/variation\d+>/g);

    if (!variationMatches) {
      throw new Error("No individual variations found in the response");
    }

    const variations = {};
    variationMatches.forEach((match, index) => {
      const jsonMatch = match.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          variations[`variation${index + 1}`] = JSON.parse(jsonMatch[0]);
        } catch (error) {
          console.error(`Failed to parse JSON for variation ${index + 1}:`, error);
        }
      }
    });

    if (Object.keys(variations).length === 0) {
      throw new Error("No valid variations found in the response");
    }

    return variations;
  } catch (error) {
    console.error("Failed to parse response:", error);
    console.log("Response:", response);
    throw new Error("Invalid response from the API");
  }
}

async function generateProductVariations(productDescription: string): Promise<string[]> {
  const prompt = "You are an expert copywriter specializing in crafting compelling product descriptions for e-commerce platforms. Your task is to create five variations of a given product description for A/B testing purposes. These variations will help determine which description is most effective in converting potential customers.\n\nHere is the original product description:\n\n<product_description>\n"
  + productDescription +
  "\n</product_description>\n\nYour goal is to create five variations of this description:\n1. Three slight modifications of the original\n2. One significant departure that explores a new direction\n3. One completely unique variation that takes a fresh perspective on the product\n\nBefore writing the variations, please brainstorm and plan your approach within <brainstorm> tags. In your brainstorming:\n\n1. Identify the target audience and key selling points of the product.\n2. List the key features and benefits of the product.\n3. Consider the emotional appeal and unique value proposition for each variation.\n4. Explore different ways to present these features (e.g., order, emphasis, phrasing).\n5. For slight variations, note specific changes you'll make to the original.\n6. For the significant variation, explore at least three different angles or approaches before choosing one.\n7. For the completely unique variation, think of an innovative way to present the product that hasn't been used in the other variations.\n\nGuidelines for creating the variations:\n\nFor the three slight variations:\n- Maintain the core message and key features of the product\n- Alter the wording, sentence structure, or emphasis\n- You may add or remove minor details, but keep the overall length similar\n- Ensure each variation is distinct from the others\n\nFor the fourth, significant variation:\n- Take a bold new approach to describing the product\n- This could involve:\n  * Focusing on a different key benefit\n  * Using a new tone or style\n  * Reimagining the product's positioning\n  * Addressing a different target audience\n  * Emphasizing emotional appeal over technical specifications\n  * Using a creative narrative or storytelling approach\n- While this should be a departure from the original, it must still accurately represent the product\n\nFor the fifth, completely unique variation:\n- Think outside the box and create a description that stands out from all the others\n- This could involve:\n  * Using an unexpected format (e.g., a mini-story, a dialogue, or a poem)\n  * Adopting a unique persona or voice\n  * Focusing on an unconventional aspect of the product\n  * Creating a vivid scenario that showcases the product's benefits\n- Ensure that this variation is still informative and relevant to potential customers\n\nAfter generating the variations, provide your output in the following JSON format:\n\n{\n  \"variation1\": \"Text of first slight variation\",\n  \"variation2\": \"Text of second slight variation\",\n  \"variation3\": \"Text of third slight variation\",\n  \"variation4\": \"Text of significant variation\",\n  \"variation5\": \"Text of completely unique variation\"\n}\n\nRemember to keep each variation concise and impactful, focusing on the most compelling aspects of the product. Your goal is to create descriptions that will resonate with potential customers and encourage them to make a purchase.";
  
  // Replace placeholders like {{PRODUCT_DESCRIPTION}} with real values,
  // because the SDK does not support variables.
  const msg = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1000,
  temperature: 0.1,
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
  try {
    const variations: string[] = Object.values(JSON.parse(jsonString));
    return variations;
  } catch (error) {
    throw new Error("Failed to parse JSON from the response response: " + jsonString + error);
  }
}

async function getProductImageVariations(productDescription: string): Promise<string[]> {
  const prompt = "You are tasked with generating two different image generation prompts based on a given product description. These prompts will be used for A/B testing of product images. Your goal is to create prompts that will result in visually distinct and appealing images that accurately represent the product.\n\nHere is the product description:\n<product_description>\n" +
   productDescription + 
  "\n</product_description>\n\nTo generate the first prompt:\n1. Focus on the key features of the product mentioned in the description.\n2. Imagine a realistic, straightforward representation of the product.\n3. Include details about the product's color, style, and main characteristics.\n4. Specify a neutral background or setting that complements the product.\n\nTo generate the second prompt:\n1. Take a more creative or artistic approach to presenting the product.\n2. Imagine the product in a specific context or being used in a particular scenario.\n3. Incorporate elements that evoke a mood or lifestyle associated with the product.\n4. Consider using a unique perspective, lighting, or composition to make the image stand out.\n\nFor both prompts:\n- Use clear, descriptive language that an image generation AI can interpret.\n- Avoid mentioning brands or specific people.\n- Keep each prompt between 50-100 words.\n\nPlease provide your output in the following format:\n<prompt1>\n[Insert your first prompt here]\n</prompt1>\n\n<prompt2>\n[Insert your second prompt here]\n</prompt2>";
  
  const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1000,
    temperature: 0.1,
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
    
    return prompts;
}

async function generateProductImage(description: string, saveFolder: string): Promise<string> {
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
      if (!response.data || response.data.length === 0 || !response.data[0].url) {
        throw new Error("No data in the response");
      }
  
      const imageUrl = response.data[0].url;
      const imageName = `product_${Date.now()}.png`;
      const imagePath = path.join(saveFolder, imageName);
  
      // Download the image
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      await fs.writeFile(imagePath, imageResponse.data);
    
      // Return the path starting from /public
      const publicIndex = imagePath.indexOf('public');
      if (publicIndex === -1) {
        throw new Error("Unable to find 'public' in the image path");
      }
      const relativePath = imagePath.slice(publicIndex);
      return `/${relativePath.replace(/\\/g, '/')}`;
    } catch (error) {
      console.error(`Failed to generate or save image for ${description}:`, error);
      return ''; // Return an empty string or a default image path in case of error
    }
  }

export { generateExperimentNameDescription, generateProductVariations, getProductImageVariations, generateProductImage, generateThemeVariations };
 