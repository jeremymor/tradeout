// Simple script to generate cursor PNG files
// Uses raw pixel data to create classic Mac-style cursors

const fs = require('fs');
const path = require('path');

// PNG signature and chunks helper
function createPNG(width, height, pixels) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth
  ihdr.writeUInt8(6, 9); // color type (RGBA)
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace
  
  const ihdrChunk = createChunk('IHDR', ihdr);
  
  // IDAT chunk (image data)
  const zlib = require('zlib');
  const rawData = Buffer.alloc((width * 4 + 1) * height);
  
  for (let y = 0; y < height; y++) {
    rawData[y * (width * 4 + 1)] = 0; // filter byte
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4;
      const dstIdx = y * (width * 4 + 1) + 1 + x * 4;
      rawData[dstIdx] = pixels[srcIdx];     // R
      rawData[dstIdx + 1] = pixels[srcIdx + 1]; // G
      rawData[dstIdx + 2] = pixels[srcIdx + 2]; // B
      rawData[dstIdx + 3] = pixels[srcIdx + 3]; // A
    }
  }
  
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);
  
  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  
  const typeBuffer = Buffer.from(type);
  const crcData = Buffer.concat([typeBuffer, data]);
  const crc = crc32(crcData);
  
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);
  
  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

// CRC32 implementation
function crc32(buf) {
  let crc = 0xffffffff;
  const table = makeCRCTable();
  
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  
  return (crc ^ 0xffffffff) >>> 0;
}

function makeCRCTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
}

// Classic Mac pointer cursor (16x16)
const pointerPattern = [
  'X...............',
  'XX..............',
  'XWX.............',
  'XWWX............',
  'XWWWX...........',
  'XWWWWX..........',
  'XWWWWWX.........',
  'XWWWWWWX........',
  'XWWWWWWWX.......',
  'XWWWWWWWWX......',
  'XWWWWWXXXXX.....',
  'XWWXWWX.........',
  'XWXXWWX.........',
  'XX..XWWX........',
  'X....XWWX.......',
  '.....XXX........',
];

// Hand pointer cursor (16x20)
const handPattern = [
  '......X.........',
  '.....XWX........',
  '.....XWX........',
  '.....XWX........',
  '.....XWXXX......',
  '.....XWXWXXX....',
  '.X...XWXWXWXX...',
  'XWX..XWXWXWXWX..',
  'XWWX.XWWWWWWWX..',
  'XWWWXXWWWWWWWX..',
  '.XWWWWWWWWWWWX..',
  '.XWWWWWWWWWWWX..',
  '..XWWWWWWWWWX...',
  '..XWWWWWWWWWX...',
  '...XWWWWWWWX....',
  '...XWWWWWWWX....',
  '....XWWWWWX.....',
  '....XWWWWWX.....',
  '.....XWWWX......',
  '.....XXXXX......',
];

function patternToPixels(pattern) {
  const height = pattern.length;
  const width = pattern[0].length;
  const pixels = Buffer.alloc(width * height * 4);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const char = pattern[y][x];
      
      if (char === 'X') {
        // Black pixel
        pixels[idx] = 0;
        pixels[idx + 1] = 0;
        pixels[idx + 2] = 0;
        pixels[idx + 3] = 255;
      } else if (char === 'W') {
        // White pixel
        pixels[idx] = 255;
        pixels[idx + 1] = 255;
        pixels[idx + 2] = 255;
        pixels[idx + 3] = 255;
      } else {
        // Transparent
        pixels[idx] = 0;
        pixels[idx + 1] = 0;
        pixels[idx + 2] = 0;
        pixels[idx + 3] = 0;
      }
    }
  }
  
  return { width, height, pixels };
}

// Generate cursors
const cursorsDir = path.join(__dirname, '..', 'public', 'cursors');
if (!fs.existsSync(cursorsDir)) {
  fs.mkdirSync(cursorsDir, { recursive: true });
}

// Pointer cursor
const pointer = patternToPixels(pointerPattern);
const pointerPng = createPNG(pointer.width, pointer.height, pointer.pixels);
fs.writeFileSync(path.join(cursorsDir, 'pointer.png'), pointerPng);
console.log('Created pointer.png');

// Hand cursor
const hand = patternToPixels(handPattern);
const handPng = createPNG(hand.width, hand.height, hand.pixels);
fs.writeFileSync(path.join(cursorsDir, 'hand.png'), handPng);
console.log('Created hand.png');

console.log('Done! Cursors saved to public/cursors/');
