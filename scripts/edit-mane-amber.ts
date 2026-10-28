// Re-edit Mane bottle to DARK AMBER (not red, not orange)
// Keep the original hand-holding-comb photo for karu
// Keep neelam and ojas as they are now (already good)

import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const PRODUCTS_DIR = '/home/z/my-project/public/products';

function fileToBase64DataUrl(filePath: string, mimeType: string = 'image/jpeg'): string {
  const buffer = fs.readFileSync(filePath);
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}

async function main() {
  console.log('🎨 Re-editing Mane bottle to DARK AMBER...\n');
  
  const zai = await ZAI.create();
  
  const input = path.join(PRODUCTS_DIR, 'mane-original.jpg');
  const output = path.join(PRODUCTS_DIR, 'mane.jpg');
  
  if (!fs.existsSync(input)) {
    console.error('❌ Input not found');
    return;
  }

  const imageDataUrl = fileToBase64DataUrl(input);

  const prompt = `Photorealistic product photograph. Keep the EXACT same bottle shape, glass bottle, black cap, and the white round label with "HAIR LAB." text exactly as it is — DO NOT change the bottle or label design.
  
  Change ONLY the color of the oil INSIDE the bottle to a DEEP DARK AMBER color — like dark honey, dark molasses, or aged whiskey. NOT red, NOT orange, NOT bright. A rich deep amber brown, like real herbal-infused oil that has steeped for weeks.
  
  Keep the marble surface, soft natural daylight, fresh green neem leaves around. Real photographic quality — no illustration, no painting, no surreal colors. Like a Forest Essentials or Kama Ayurveda product photo. Authentic botanical brand aesthetic.`;

  try {
    const response = await zai.images.generations.edit({
      prompt,
      images: [{ url: imageDataUrl }],
      size: '864x1152',
    });

    if (!response.data || !response.data[0] || !response.data[0].base64) {
      throw new Error('Invalid response');
    }

    const buffer = Buffer.from(response.data[0].base64, 'base64');
    fs.writeFileSync(output, buffer);
    console.log(`✓ Mane saved: ${output} (${(buffer.length / 1024).toFixed(1)} KB)`);
  } catch (error: any) {
    console.error(`❌ Failed: ${error.message}`);
  }

  // Cleanup
  fs.unlinkSync(input);
  console.log('\n✅ Done!');
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
