import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const FRAMES_DIR = '/home/z/my-project/download/reel-final';
const OUTPUT_DIR = '/home/z/my-project/download/reel-final-annotated';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const annotations = [
  { file: '01-url.png', text: 'hairlab.one' },
  { file: '02-curtain.png', text: 'Welcome to HAIR LAB.' },
  { file: '03-hero.png', text: 'Ancient luxury, handcrafted' },
  { file: '04-products.png', text: 'Explore the collection' },
  { file: '05-add-to-cart.png', text: 'Add to cart' },
  { file: '06-cart-drawer.png', text: 'Your cart' },
  { file: '07-checkout-form.png', text: 'Checkout' },
  { file: '08-checkout-form-2.png', text: 'Shipping details' },
  { file: '09-otp-verify.png', text: 'Verify your email' },
  { file: '10-payment-method.png', text: 'Pay online or COD' },
  { file: '11-cart-closed.png', text: 'Keep exploring' },
  { file: '12-herb-hunter.png', text: 'Herb Hunter' },
  { file: '13-herb-hunter-play.png', text: 'Match the pairs' },
  { file: '14-herb-hunter-match.png', text: 'Learn herb secrets' },
  { file: '15-spot-ingredient.png', text: 'Spot the Ingredient' },
  { file: '16-spot-play.png', text: 'Find hidden herbs' },
  { file: '17-timer.png', text: 'Ritual Timer' },
  { file: '18-timer-running.png', text: 'Guided massage' },
  { file: '19-referral.png', text: 'Share and earn' },
  { file: '20-referral-code.png', text: 'Your unique code' },
  { file: '21-testimonials.png', text: 'Letters we keep' },
  { file: '22-footer.png', text: 'Made with intention' },
  { file: '23-final.png', text: 'hairlab.one' },
];

async function annotateFrame(frame, idx) {
  const inputPath = path.join(FRAMES_DIR, frame.file);
  const outputPath = path.join(OUTPUT_DIR, frame.file);
  
  if (!fs.existsSync(inputPath)) {
    console.error(`Not found: ${frame.file}`);
    return;
  }

  const img = sharp(inputPath);
  const metadata = await img.metadata();
  const width = metadata.width || 405;
  const height = metadata.height || 720;

  // Text background + text at bottom
  const text = frame.text;
  const textWidth = Math.min(text.length * 8 + 40, width - 20);
  const textX = (width - textWidth) / 2;
  const textY = height - 80;
  const textBgY = textY - 28;

  const svgOverlay = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect x="${textX}" y="${textBgY}" width="${textWidth}" height="40" 
            rx="20" fill="rgba(26, 61, 42, 0.9)"/>
      <text x="${width/2}" y="${textY}" 
            font-family="Georgia, serif" font-size="15" fill="#F4ECD8" 
            text-anchor="middle" font-style="italic">${text}</text>
    </svg>
  `;

  await img
    .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
    .png()
    .toFile(outputPath);

  console.log(`OK ${idx + 1}/23: ${frame.file} -> "${frame.text}"`);
}

async function main() {
  console.log('Adding text overlays...');
  for (let i = 0; i < annotations.length; i++) {
    await annotateFrame(annotations[i], i);
  }
  console.log('Done!');
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
