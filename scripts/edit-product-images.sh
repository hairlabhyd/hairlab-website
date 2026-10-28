#!/bin/bash
# Edit product images to have a cohesive brand aesthetic
# Terracotta + cream + green palette matching HAIR LAB. branding

PRODUCTS_DIR="/home/z/my-project/public/products"
EDITED_DIR="/home/z/my-project/public/products/edited"

mkdir -p "$EDITED_DIR"

echo "🎨 Editing product images for HAIR LAB. brand aesthetic..."
echo ""

# Common edit prompt - subtle, preserves product identity
# but adds warm terracotta + cream tones and brand cohesion
BASE_PROMPT="Premium botanical product photography, warm terracotta and cream color palette, soft natural daylight from the left, marble surface with subtle veining, fresh neem leaves and fern fronds arranged naturally, hand-carved neem wood accents, shallow depth of field, editorial luxury beauty brand aesthetic, soft golden hour warmth, maintain the original product and label exactly, only enhance the surrounding scene and lighting"

echo "📸 Editing Mane (Hair Oil)..."
z-ai image-edit \
  -p "$BASE_PROMPT, focus on the hair oil bottle as the hero subject, add a small brass bowl with hibiscus flowers in the background, very soft diffused light" \
  -i "$PRODUCTS_DIR/mane.jpg" \
  -o "$EDITED_DIR/mane.jpg" \
  -s 864x1152 2>&1 | tail -3
echo ""

echo "📸 Editing Neelam (Blue Bhring Oil)..."
z-ai image-edit \
  -p "$BASE_PROMPT, focus on the dark indigo bottle as the hero subject, add a few sprigs of indigo flowers and bhringraj leaves, dramatic moody lighting with deep shadows" \
  -i "$PRODUCTS_DIR/neelam.jpg" \
  -o "$EDITED_DIR/neelam.jpg" \
  -s 864x1152 2>&1 | tail -3
echo ""

echo "📸 Editing Ojas (Power Mix Hair Mask)..."
z-ai image-edit \
  -p "$BASE_PROMPT, focus on the kraft pouch as the hero subject, add a small ceramic bowl with green herbal powder and a wooden spoon, warm earthy tones" \
  -i "$PRODUCTS_DIR/ojas.jpg" \
  -o "$EDITED_DIR/ojas.jpg" \
  -s 864x1152 2>&1 | tail -3
echo ""

echo "📸 Editing Kāru (Neem Wood Comb)..."
z-ai image-edit \
  -p "$BASE_PROMPT, focus on the hand-carved neem wood comb as the hero subject, add a few curled hair strands on the marble, warm honey tones on the wood grain, very intimate handcrafted feel" \
  -i "$PRODUCTS_DIR/karu.jpg" \
  -o "$EDITED_DIR/karu.jpg" \
  -s 864x1152 2>&1 | tail -3
echo ""

echo "✅ All images edited!"
ls -la "$EDITED_DIR"
