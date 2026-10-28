// Edit product images with cohesive brand aesthetic
// Uses z-ai SDK with base64-encoded local images

import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const PRODUCTS_DIR = '/home/z/my-project/public/products';
const EDITED_DIR = '/home/z/my-project/public/products/edited';

// Ensure output directory exists
if (!fs.existsSync(EDITED_DIR)) {
  fs.mkdirSync(EDITED_DIR, { recursive: true });
}

function fileToBase64DataUrl(filePath: string, mimeType: string = 'image/jpeg'): string {
  const buffer = fs.readFileSync(filePath);
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}

interface ProductEdit {
  inputFile: string;
  outputFile: string;
  name: string;
  prompt: string;
}

const BASE_PROMPT = 'Premium botanical product photography with warm terracotta and cream color palette, soft natural daylight from the left, marble surface with subtle veining, fresh neem leaves and fern fronds arranged naturally around the product, hand-carved neem wood accents, shallow depth of field, editorial luxury beauty brand aesthetic, soft golden hour warmth, very soft diffused lighting. Maintain the original product bottle and label exactly as shown, only enhance the surrounding scene and lighting.';

const products: ProductEdit[] = [
  {
    name: 'Mane (Hair Oil)',
    inputFile: path.join(PRODUCTS_DIR, 'mane.jpg'),
    outputFile: path.join(EDITED_DIR, 'mane.jpg'),
    prompt: `${BASE_PROMPT} Focus on the hair oil bottle as the hero subject. Add a small brass bowl with hibiscus flowers in the background. Very soft diffused light. Botanical aesthetic.`,
  },
  {
    name: 'Neelam (Blue Bhring Oil)',
    inputFile: path.join(PRODUCTS_DIR, 'neelam.jpg'),
    outputFile: path.join(EDITED_DIR, 'neelam.jpg'),
    prompt: `${BASE_PROMPT} Focus on the dark indigo bottle as the hero subject. Add a few sprigs of indigo flowers and bhringraj leaves. Dramatic moody lighting with deep shadows but warm terracotta undertones.`,
  },
  {
    name: 'Ojas (Power Mix Hair Mask)',
    inputFile: path.join(PRODUCTS_DIR, 'ojas.jpg'),
    outputFile: path.join(EDITED_DIR, 'ojas.jpg'),
    prompt: `${BASE_PROMPT} Focus on the kraft paper pouch as the hero subject. Add a small ceramic bowl with green herbal powder and a wooden spoon. Warm earthy tones with golden highlights.`,
  },
  {
    name: 'Kāru (Neem Wood Comb)',
    inputFile: path.join(PRODUCTS_DIR, 'karu.jpg'),
    outputFile: path.join(EDITED_DIR, 'karu.jpg'),
    prompt: `${BASE_PROMPT} Focus on the hand-carved neem wood comb as the hero subject. Warm honey tones on the wood grain. Very intimate handcrafted feel. Soft shadow play.`,
  },
];

async function editOne(zai: any, product: ProductEdit): Promise<void> {
  console.log(`\n📸 Editing ${product.name}...`);
  
  if (!fs.existsSync(product.inputFile)) {
    console.error(`❌ Input file not found: ${product.inputFile}`);
    return;
  }

  const imageDataUrl = fileToBase64DataUrl(product.inputFile);
  console.log(`   Input: ${(fs.statSync(product.inputFile).size / 1024).toFixed(1)} KB`);

  try {
    const response = await zai.images.generations.edit({
      prompt: product.prompt,
      images: [{ url: imageDataUrl }],
      size: '864x1152',
    });

    if (!response.data || !response.data[0] || !response.data[0].base64) {
      throw new Error('Invalid response from API');
    }

    const buffer = Buffer.from(response.data[0].base64, 'base64');
    fs.writeFileSync(product.outputFile, buffer);
    console.log(`✓ Saved: ${product.outputFile} (${(buffer.length / 1024).toFixed(1)} KB)`);
  } catch (error: any) {
    console.error(`❌ Failed: ${error.message}`);
  }
}

async function main() {
  console.log('🎨 HAIR LAB. Image Editor');
  console.log('='.repeat(50));
  
  const zai = await ZAI.create();
  console.log('✓ ZAI SDK initialized');
  console.log(`✓ ${products.length} products to edit`);
  console.log(`✓ Size: 864x1152 (portrait)`);

  for (const product of products) {
    await editOne(zai, product);
    // Wait between requests to avoid rate limiting
    console.log('   Waiting 5 seconds before next image...');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  console.log('\n✅ Done! All edited images saved to:', EDITED_DIR);
  console.log('\nFiles:');
  const files = fs.readdirSync(EDITED_DIR);
  files.forEach(f => {
    const stat = fs.statSync(path.join(EDITED_DIR, f));
    console.log(`  ${f} — ${(stat.size / 1024).toFixed(1)} KB`);
  });
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
