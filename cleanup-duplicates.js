// Script untuk mengidentifikasi file duplikat
const fs = require('fs');
const crypto = require('crypto');

const UPLOAD_DIR = './public/uploads/products';

function getFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

// Group files by hash
const fileGroups = {};
const files = fs.readdirSync(UPLOAD_DIR);

files.forEach(file => {
  const filePath = `${UPLOAD_DIR}/${file}`;
  const hash = getFileHash(filePath);
  
  if (!fileGroups[hash]) {
    fileGroups[hash] = [];
  }
  fileGroups[hash].push(file);
});

// Show duplicates
console.log('=== FILE DUPLICATE ANALYSIS ===');
Object.keys(fileGroups).forEach(hash => {
  const group = fileGroups[hash];
  if (group.length > 1) {
    console.log(`\nHash: ${hash}`);
    console.log(`Files: ${group.length} duplikat`);
    group.forEach(file => console.log(`  - ${file}`));
  }
});

// Show unique files
console.log('\n=== UNIQUE FILES TO KEEP ===');
Object.keys(fileGroups).forEach(hash => {
  const group = fileGroups[hash];
  const keepFile = group[0]; // Keep first file
  console.log(`Keep: ${keepFile} (representing ${group.length} files)`);
});

console.log('\n=== SUMMARY ===');
const totalFiles = files.length;
const uniqueFiles = Object.keys(fileGroups).length;
const duplicateCount = totalFiles - uniqueFiles;

console.log(`Total files: ${totalFiles}`);
console.log(`Unique files: ${uniqueFiles}`);
console.log(`Duplicate files: ${duplicateCount}`);
console.log(`Space wasted: ~${(duplicateCount * 500000 / 1024 / 1024).toFixed(2)} MB`);
