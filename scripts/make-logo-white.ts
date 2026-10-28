// Convert the logo to a white version for use on dark backgrounds
import sharp from 'sharp';
import fs from 'fs';

const input = '/home/z/my-project/public/hairlab-logo.png';
const outputColor = '/home/z/my-project/public/hairlab-logo-color.png';
const outputWhite = '/home/z/my-project/public/hairlab-logo-white.png';

// Move original to color version
fs.renameSync(input, outputColor);

// Create white version (treat as luminance, preserve alpha)
await sharp(outputColor)
  .modulate({ brightness: 1.0 })
  .removeAlpha()
  .flatten({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .negate()
  .threshold(180)
  .negate()
  .ensureAlpha()
  .png()
  .toFile(outputWhite);

console.log('✓ Color logo:', outputColor);
console.log('✓ White logo:', outputWhite);
