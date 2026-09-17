/**
 * Generate favicon files from source image
 * Creates: favicon.ico, favicon-16x16.png, favicon-32x32.png, 
 *          apple-touch-icon.png (180x180), icon-192.png, icon-512.png
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE = 'C:\\Users\\manik\\.gemini\\antigravity-ide\\brain\\a27b9b9c-1d71-48a5-be0d-4474d7c8f111\\favicon_calculatorbowl_1789312113974.jpg';
const OUT_DIR = path.resolve(__dirname, '..');

async function generateFavicons() {
  console.log('Source:', SOURCE);
  console.log('Output:', OUT_DIR);

  if (!fs.existsSync(SOURCE)) {
    console.error('Source image not found:', SOURCE);
    process.exit(1);
  }

  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
  ];

  for (const { name, size } of sizes) {
    const outPath = path.join(OUT_DIR, name);
    await sharp(SOURCE)
      .resize(size, size, { fit: 'cover' })
      .png()
      .toFile(outPath);
    console.log(`✅ Created ${name} (${size}x${size})`);
  }

  // Create favicon.ico (contains 16x16 and 32x32)
  // ICO format: we'll create a simple 32x32 PNG-based ICO
  const ico32 = await sharp(SOURCE)
    .resize(32, 32, { fit: 'cover' })
    .png()
    .toBuffer();

  const ico16 = await sharp(SOURCE)
    .resize(16, 16, { fit: 'cover' })
    .png()
    .toBuffer();

  // Build ICO file manually
  const icoBuffer = buildIco([
    { size: 16, data: ico16 },
    { size: 32, data: ico32 },
  ]);
  
  fs.writeFileSync(path.join(OUT_DIR, 'favicon.ico'), icoBuffer);
  console.log('✅ Created favicon.ico (16x16 + 32x32)');
  
  console.log('\n🎉 All favicon files generated successfully!');
}

/**
 * Build a minimal ICO file from PNG buffers
 */
function buildIco(images) {
  // ICO header: 6 bytes
  const headerSize = 6;
  const entrySize = 16; // Each directory entry is 16 bytes
  const dataOffset = headerSize + (entrySize * images.length);
  
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);           // Reserved
  header.writeUInt16LE(1, 2);           // Type: 1 = ICO
  header.writeUInt16LE(images.length, 4); // Number of images

  const entries = [];
  let currentOffset = dataOffset;
  
  for (const img of images) {
    const entry = Buffer.alloc(entrySize);
    entry.writeUInt8(img.size === 256 ? 0 : img.size, 0);  // Width
    entry.writeUInt8(img.size === 256 ? 0 : img.size, 1);  // Height
    entry.writeUInt8(0, 2);                                  // Color palette
    entry.writeUInt8(0, 3);                                  // Reserved
    entry.writeUInt16LE(1, 4);                               // Color planes
    entry.writeUInt16LE(32, 6);                              // Bits per pixel
    entry.writeUInt32LE(img.data.length, 8);                 // Size of image data
    entry.writeUInt32LE(currentOffset, 12);                  // Offset to image data
    entries.push(entry);
    currentOffset += img.data.length;
  }

  return Buffer.concat([header, ...entries, ...images.map(i => i.data)]);
}

generateFavicons().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
