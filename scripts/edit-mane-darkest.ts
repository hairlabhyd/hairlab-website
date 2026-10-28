// Re-edit Mane bottle to VERY DARK amber, almost black
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
  console.log('🎨 Re-editing Mane to VERY DARK amber (almost black)...\n');
  
  const zai = await ZAI.create();
  
  const input = path.join(PRODUCTS_DIR, 'mane-original.jpg');
  const output = path.join(PRODUCTS_DIR, 'mane.jpg');
  
  const imageDataUrl = fileToBase64DataUrl(input);

  const prompt = `Photorealistic product photograph. Keep the EXACT same bottle shape, glass bottle, black cap, and the white round label with text unchanged — DO NOT change the bottle, label, or label design.
  
  Change ONLY the color of the oil INSIDE the bottle to a VERY DARK, DEEP BROWN-BLACK — almost black, like extremely dark molasses, dark roast coffee, or black tar. NOT amber, NOT red, NOT orange, NOT honey. Very dark, near-black brown.
  
  Keep the marble surface, soft natural daylight, fresh green neem leaves around. Real photographic quality — no illustration, no painting, no surreal colors. Authentic botanical product photography.`;

  try {
    const response = await zai.images.generations.edit({
      prompt,
      images: [{ url: imageDataUrl }],
      size: '864x1152',
    });

    const buffer = Buffer.from(response.data[0].base64, 'base64');
    fs.writeFileSync(output, buffer);
    console.log(`✓ Mane saved: ${output} (${(buffer.length / 1024).toFixed(1)} KB)`);
  } catch (error: any) {
    console.error(`❌ Failed: ${error.message}`);
  }

  fs.unlinkSync(input);
  console.log('\n✅ Done!');
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
