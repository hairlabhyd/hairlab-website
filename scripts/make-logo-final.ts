// Create the FINAL HAIR LAB. logo:
// - Green background (full logo area, like SmartBiz)
// - Woman side-profile icon (botanical line art) on left
// - "HAIR LAB." text on right (white)

import sharp from 'sharp';
import fs from 'fs';

const OUTPUT = '/home/z/my-project/public/hairlab-logo-green.png';

// Brand colors
const GREEN = '#7A8450';  // botanical green
const CREAM = '#F4ECD8';  // cream
const WHITE = '#FFFFFF';

// Create SVG with:
// - Full green rounded rectangle background
// - Woman side-profile icon (line art) on the left
// - "HAIR LAB." text on the right (white, Playfair Display)

const width = 1200;
const height = 400;

// Woman side-profile line art icon (simplified botanical style)
// This mimics the side-profile-with-leaves aesthetic common in Ayurvedic brand logos
const womanIconSvg = `
  <g transform="translate(80, 70)">
    <!-- Woman side profile silhouette - facing right -->
    <g stroke="${WHITE}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <!-- Head outline (profile facing right) -->
      <path d="M 90 30 
               C 95 20, 110 15, 125 20
               C 140 25, 150 40, 150 60
               C 150 80, 145 95, 135 105
               C 130 110, 125 115, 125 125
               L 125 145
               L 110 145
               L 110 130
               C 100 128, 90 120, 85 110
               C 75 95, 70 75, 75 55
               C 75 45, 80 35, 90 30 Z" 
              fill="${WHITE}" fill-opacity="0.15"/>
      
      <!-- Hair flowing down back -->
      <path d="M 75 55 
               C 60 60, 50 75, 45 95
               C 40 115, 45 135, 55 150
               C 60 158, 70 162, 80 160
               C 75 145, 70 130, 72 115
               C 75 95, 80 75, 75 55 Z"
              fill="${WHITE}" fill-opacity="0.25"/>
      
      <!-- Eye (closed, serene) -->
      <path d="M 115 65 C 120 63, 128 63, 132 65"/>
      <!-- Eyebrow -->
      <path d="M 113 58 C 120 56, 130 56, 135 59"/>
      <!-- Lips -->
      <path d="M 130 90 C 135 88, 140 88, 142 91"/>
      <!-- Nose -->
      <path d="M 140 65 L 145 75 L 140 78"/>
      
      <!-- Botanical leaf accents in hair -->
      <g stroke="${CREAM}" stroke-width="2" fill="none">
        <path d="M 95 25 C 100 15, 110 12, 115 18"/>
        <path d="M 105 22 L 108 18"/>
        <path d="M 80 35 C 70 25, 60 28, 55 38"/>
        <path d="M 70 32 L 65 35"/>
      </g>
      
      <!-- Neck/shoulder -->
      <path d="M 125 145 L 130 175 L 165 180"/>
    </g>
  </g>
`;

const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Full green background with rounded corners -->
  <rect width="${width}" height="${height}" rx="60" ry="60" fill="${GREEN}"/>
  
  <!-- Subtle texture: botanical leaf pattern in background -->
  <g opacity="0.08" fill="${WHITE}">
    <ellipse cx="200" cy="80" rx="40" ry="15" transform="rotate(45 200 80)"/>
    <ellipse cx="${width-200}" cy="${height-80}" rx="40" ry="15" transform="rotate(-45 ${width-200} ${height-80})"/>
    <ellipse cx="100" cy="${height-100}" rx="30" ry="10" transform="rotate(30 100 ${height-100})"/>
    <ellipse cx="${width-100}" cy="100" rx="30" ry="10" transform="rotate(-30 ${width-100} 100)"/>
  </g>
  
  <!-- Woman side-profile icon (left side) -->
  ${womanIconSvg}
  
  <!-- "HAIR LAB." text (right side, white) -->
  <text x="640" y="200" 
        font-family="Playfair Display, Georgia, serif" 
        font-size="130" 
        font-weight="700"
        fill="${WHITE}" 
        text-anchor="middle" 
        dominant-baseline="middle"
        letter-spacing="8">HAIR</text>
  <text x="840" y="200" 
        font-family="Playfair Display, Georgia, serif" 
        font-size="130" 
        font-weight="700"
        fill="${WHITE}" 
        text-anchor="middle" 
        dominant-baseline="middle"
        letter-spacing="8">LAB.</text>
  
  <!-- Subtle tagline below -->
  <text x="740" y="290" 
        font-family="Inter, sans-serif" 
        font-size="18" 
        font-weight="400"
        fill="${CREAM}" 
        text-anchor="middle" 
        dominant-baseline="middle"
        letter-spacing="6"
        opacity="0.85">ANCIENT LUXURY, HANDCRAFTED</text>
  
  <!-- Decorative line -->
  <line x1="620" y1="240" x2="860" y2="240" stroke="${WHITE}" stroke-width="1" opacity="0.4"/>
</svg>`;

await sharp(Buffer.from(svg))
  .png()
  .toFile(OUTPUT);

console.log('✓ Final logo created:', OUTPUT);
console.log('  - Full green background (#7A8450)');
console.log('  - Woman side-profile icon (left, white line art)');
console.log('  - "HAIR LAB." text (right, white serif)');
console.log('  - Tagline below text');
