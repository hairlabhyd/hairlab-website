// Remove background from product images — keep only the product (bottle/comb)
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PRODUCTS_DIR = '/home/z/my-project/public/products';

async function main() {
  console.log('✂️ Removing backgrounds from product images...\n');
  
  const zai = await ZAI.create();
  
  const products = [
    { input: 'mane.jpg', output: 'mane-cutout.png', name: 'Mane' },
    { input: 'neelam.jpg', output: 'neelam-cutout.png', name: 'Neelam' },
    { input: 'ojas.jpg', output: 'ojas-cutout.png', name: 'Ojas' },
    { input: 'karu.jpg', output: 'karu-cutout.png', name: 'Kāru' },
  ];

  for (const p of products) {
    const inputPath = path.join(PRODUCTS_DIR, p.input);
    if (!fs.existsSync(inputPath)) {
      console.error(`❌ ${p.name}: input not found`);
      continue;
    }

    const buffer = fs.readFileSync(inputPath);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64}`;

    try {
      const response = await zai.images.generations.edit({
        prompt: 'Remove the background completely. Keep ONLY the product (bottle/comb). Make the background pure white. Do not change the product itself.',
        images: [{ url: dataUrl }],
        size: '864x1152',
      });

      const imageBase64 = response.data[0].base64;
      const outputBuffer = Buffer.from(imageBase64, 'base64');
      
      // Save as PNG
      const outputPath = path.join(PRODUCTS_DIR, p.output);
      await sharp(outputBuffer)
        .png()
        .toFile(outputPath);
      
      console.log(`✓ ${p.name} → ${p.output} (${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB)`);
    } catch (e: any) {
      console.error(`❌ ${p.name}: ${e.message}`);
    }
    
    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  console.log('\n✅ Done!');
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
