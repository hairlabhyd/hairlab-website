// Create a HAIR LAB. logo with:
// - Green background (#7A8450 — matches brand botanical green)
// - White "HAIR LAB." text
// - Circular or rounded shape to match brand aesthetic

import sharp from 'sharp';
import fs from 'fs';

const OUTPUT_COLOR = '/home/z/my-project/public/hairlab-logo-color.png';
const OUTPUT_WHITE = '/home/z/my-project/public/hairlab-logo-white.png';
const OUTPUT_GREEN = '/home/z/my-project/public/hairlab-logo-green.png';

// Brand green
const GREEN = { r: 0x7A, g: 0x84, b: 0x50, alpha: 1 };

// Create a circular green badge with "HAIR LAB." text
// Use SVG to render the text, then composite onto green circle

const size = 512;
const radius = size / 2;

const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="circle">
      <circle cx="${radius}" cy="${radius}" r="${radius}" />
    </clipPath>
  </defs>
  <g clip-path="url(#circle)">
    <rect width="${size}" height="${size}" fill="rgb(${GREEN.r},${GREEN.g},${GREEN.b})"/>
    <text x="50%" y="48%" 
          font-family="Playfair Display, Georgia, serif" 
          font-size="64" 
          font-weight="700"
          fill="white" 
          text-anchor="middle" 
          dominant-baseline="middle"
          letter-spacing="2">HAIR</text>
    <text x="50%" y="62%" 
          font-family="Playfair Display, Georgia, serif" 
          font-size="64" 
          font-weight="700"
          fill="white" 
          text-anchor="middle" 
          dominant-baseline="middle"
          letter-spacing="2">LAB.</text>
  </g>
  <!-- Subtle ring border -->
  <circle cx="${radius}" cy="${radius}" r="${radius - 4}" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
</svg>`;

await sharp(Buffer.from(svg))
  .png()
  .toFile(OUTPUT_GREEN);

console.log('✓ Green logo created:', OUTPUT_GREEN);
console.log('  Size: 512x512 PNG with green background + white HAIR LAB. text');
