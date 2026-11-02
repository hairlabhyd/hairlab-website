import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const FRAMES_DIR = '/home/z/my-project/download/reel-tour';
const OUTPUT_DIR = '/home/z/my-project/download/reel-tour-annotated';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const annotations = [
  { file: '01-url.png', text: 'Type: hairlab.one', arrow: 'right', arrowY: 60, textY: 100 },
  { file: '02-curtain.png', text: 'Our intro animation', arrow: 'down', arrowY: 200, textY: 250 },
  { file: '03-hero.png', text: 'Welcome home 🌿', arrow: 'down', arrowY: 300, textY: 350 },
  { file: '04-products.png', text: 'Shop our rituals', arrow: 'right', arrowY: 400, textY: 450 },
  { file: '05-products-more.png', text: '4 hand-blended products', arrow: 'right', arrowY: 400, textY: 450 },
  { file: '06-product-detail.png', text: 'Click View for details', arrow: 'right', arrowY: 400, textY: 450 },
  { file: '07-usage-guide.png', text: 'Step-by-step usage guide', arrow: 'down', arrowY: 400, textY: 450 },
  { file: '08-herb-hunter.png', text: 'Play Herb Hunter! 🌿', arrow: 'down', arrowY: 400, textY: 450 },
  { file: '09-herb-hunter-play.png', text: 'Match the herbs', arrow: 'right', arrowY: 400, textY: 450 },
  { file: '10-herb-hunter-cards.png', text: 'Learn herb facts!', arrow: 'down', arrowY: 500, textY: 550 },
  { file: '11-spot-ingredient.png', text: 'Spot the Ingredient! 🔍', arrow: 'down', arrowY: 400, textY: 450 },
  { file: '12-spot-play.png', text: 'Find hidden herbs', arrow: 'right', arrowY: 400, textY: 450 },
  { file: '13-timer.png', text: 'Guided Ritual Timer 🕐', arrow: 'down', arrowY: 400, textY: 450 },
  { file: '14-timer-running.png', text: 'Massage guidance', arrow: 'down', arrowY: 500, textY: 550 },
  { file: '15-referral.png', text: 'Share & earn ₹50! 🎁', arrow: 'down', arrowY: 400, textY: 450 },
  { file: '16-shop-back.png', text: 'COD + Online payment', arrow: 'right', arrowY: 400, textY: 450 },
  { file: '17-final.png', text: 'hairlab.one', arrow: 'none', arrowY: 0, textY: 600 },
];

async function annotateFrame(frame, idx) {
  const inputPath = path.join(FRAMES_DIR, frame.file);
  const outputPath = path.join(OUTPUT_DIR, frame.file);
  
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Not found: ${frame.file}`);
    return;
  }

  const img = sharp(inputPath);
  const metadata = await img.metadata();
  const width = metadata.width || 405;
  const height = metadata.height || 720;

  // Create SVG overlay with text + arrow
  let arrowSvg = '';
  if (frame.arrow === 'right') {
    arrowSvg = `
      <path d="M ${width/2 - 40} ${frame.arrowY} L ${width/2 + 30} ${frame.arrowY}" 
            stroke="#B8553C" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M ${width/2 + 30} ${frame.arrowY} L ${width/2 + 20} ${frame.arrowY - 8} 
               M ${width/2 + 30} ${frame.arrowY} L ${width/2 + 20} ${frame.arrowY + 8}" 
            stroke="#B8553C" stroke-width="4" fill="none" stroke-linecap="round"/>
    `;
  } else if (frame.arrow === 'down') {
    arrowSvg = `
      <path d="M ${width/2} ${frame.arrowY - 30} L ${width/2} ${frame.arrowY + 20}" 
            stroke="#B8553C" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M ${width/2} ${frame.arrowY + 20} L ${width/2 - 8} ${frame.arrowY + 10} 
               M ${width/2} ${frame.arrowY + 20} L ${width/2 + 8} ${frame.arrowY + 10}" 
            stroke="#B8553C" stroke-width="4" fill="none" stroke-linecap="round"/>
    `;
  }

  // Text background + text
  const textBgY = frame.textY - 30;
  const textWidth = frame.text.length * 8 + 30;
  const textX = (width - textWidth) / 2;

  const svgOverlay = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      ${arrowSvg}
      <rect x="${textX}" y="${textBgY}" width="${textWidth}" height="36" 
            rx="18" fill="rgba(26, 61, 42, 0.9)"/>
      <text x="${width/2}" y="${frame.textY}" 
            font-family="Georgia, serif" font-size="16" fill="#F4ECD8" 
            text-anchor="middle" font-style="italic">${frame.text}</text>
    </svg>
  `;

  await img
    .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
    .png()
    .toFile(outputPath);

  console.log(`✓ ${idx + 1}/17: ${frame.file} → "${frame.text}"`);
}

async function main() {
  console.log('🎨 Adding arrows + text to frames...\n');
  
  for (let i = 0; i < annotations.length; i++) {
    await annotateFrame(annotations[i], i);
  }
  
  console.log('\n✅ All frames annotated!');
  console.log(`📁 Output: ${OUTPUT_DIR}`);
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
