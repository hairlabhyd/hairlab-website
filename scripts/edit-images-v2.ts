// Re-edit Mane, Neelam, Ojas with NATURAL subtle enhancements
// Comb (karu) uses original photo untouched

import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const PRODUCTS_DIR = '/home/z/my-project/public/products';

function fileToBase64DataUrl(filePath: string, mimeType: string = 'image/jpeg'): string {
  const buffer = fs.readFileSync(filePath);
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}

const edits = [
  {
    name: 'Mane (Hair Oil) — DARK RED bottle',
    input: path.join(PRODUCTS_DIR, 'mane-original.jpg'),
    output: path.join(PRODUCTS_DIR, 'mane.jpg'),
    prompt: `Photorealistic product photograph (NOT illustration, NOT painting). Keep the EXACT same bottle shape and white round label with text "HAIR LAB." — DO NOT change the bottle or label.
      Change ONLY the oil inside the bottle to a deep dark crimson red color (like dark hibiscus / mandaram flower red), so it looks like real hibiscus-infused oil.
      Keep the marble surface natural, soft daylight, fresh green neem leaves around (NOT fake-looking). Maintain the original photographic quality. No surreal colors, no fantasy lighting. Real product photo with botanical authenticity.`
  },
  {
    name: 'Neelam (Bhring Oil)',
    input: path.join(PRODUCTS_DIR, 'neelam-original.jpg'),
    output: path.join(PRODUCTS_DIR, 'neelam.jpg'),
    prompt: `Photorealistic product photograph (NOT illustration, NOT painting). Keep the EXACT same bottle and label unchanged.
      Maintain the natural dark indigo/blue color of the bhringraj oil inside the bottle.
      Softly enhance the surrounding green botanical leaves to look fresher and more natural. Keep marble surface and soft daylight. No artificial saturation, no surreal tones. Real botanical product photography aesthetic — like a Forest Essentials or Kama Ayurveda product shot.`
  },
  {
    name: 'Ojas (Power Mix)',
    input: path.join(PRODUCTS_DIR, 'ojas-original.jpg'),
    output: path.join(PRODUCTS_DIR, 'ojas.jpg'),
    prompt: `Photorealistic product photograph (NOT illustration, NOT painting). Keep the EXACT same kraft paper pouch and round label unchanged.
      Enhance the green herbal powder in the wooden bowl to look more vibrant and natural (like fresh hibiscus powder or matcha green). Add a few fresh green neem leaves naturally arranged. Keep marble surface and soft daylight. Real editorial product photography. No artificial filters.`
  },
];

async function editOne(zai: any, item: typeof edits[0]): Promise<void> {
  console.log(`\n📸 ${item.name}...`);
  
  if (!fs.existsSync(item.input)) {
    console.error(`❌ Input not found: ${item.input}`);
    return;
  }

  const imageDataUrl = fileToBase64DataUrl(item.input);

  try {
    const response = await zai.images.generations.edit({
      prompt: item.prompt,
      images: [{ url: imageDataUrl }],
      size: '864x1152',
    });

    if (!response.data || !response.data[0] || !response.data[0].base64) {
      throw new Error('Invalid response');
    }

    const buffer = Buffer.from(response.data[0].base64, 'base64');
    fs.writeFileSync(item.output, buffer);
    console.log(`✓ Saved: ${item.output} (${(buffer.length / 1024).toFixed(1)} KB)`);
  } catch (error: any) {
    console.error(`❌ Failed: ${error.message}`);
  }
}

async function main() {
  console.log('🌿 HAIR LAB. Natural Image Re-edit');
  console.log('='.repeat(50));
  console.log('Keeping products natural — only enhancing colors and greens');
  
  const zai = await ZAI.create();
  console.log('✓ SDK ready\n');

  for (const item of edits) {
    await editOne(zai, item);
    console.log('   Waiting 8 seconds...');
    await new Promise(resolve => setTimeout(resolve, 8000));
  }

  // Clean up original backups
  fs.unlinkSync(path.join(PRODUCTS_DIR, 'mane-original.jpg'));
  fs.unlinkSync(path.join(PRODUCTS_DIR, 'neelam-original.jpg'));
  fs.unlinkSync(path.join(PRODUCTS_DIR, 'ojas-original.jpg'));

  console.log('\n✅ Done! Comb uses your real hand photo, others naturally enhanced.');
  
  console.log('\nFinal files:');
  fs.readdirSync(PRODUCTS_DIR).forEach(f => {
    const stat = fs.statSync(path.join(PRODUCTS_DIR, f));
    console.log(`  ${f} — ${(stat.size / 1024).toFixed(1)} KB`);
  });
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
