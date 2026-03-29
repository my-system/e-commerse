// Safe cleanup - hapus duplikat dan update database
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

console.log('=== SAFE CLEANUP PLAN ===');

// Create cleanup plan
const cleanupPlan = [];
Object.keys(fileGroups).forEach(hash => {
  const group = fileGroups[hash];
  if (group.length > 1) {
    const keepFile = group[0];
    const deleteFiles = group.slice(1);
    
    console.log(`\nHash: ${hash}`);
    console.log(`Keep: ${keepFile}`);
    console.log(`Delete: ${deleteFiles.length} files`);
    deleteFiles.forEach(file => console.log(`  - ${file}`));
    
    cleanupPlan.push({
      hash,
      keepFile,
      deleteFiles
    });
  }
});

// Ask for confirmation
console.log('\n=== EXECUTION PLAN ===');
console.log(`Will delete ${cleanupPlan.reduce((sum, plan) => sum + plan.deleteFiles.length, 0)} duplicate files`);
console.log('Keep only 4 unique files');
console.log('\nTo execute, run: node safe-cleanup.js --execute');

// Check for --execute flag
if (process.argv.includes('--execute')) {
  console.log('\n=== EXECUTING CLEANUP ===');
  
  let deletedCount = 0;
  cleanupPlan.forEach(plan => {
    plan.deleteFiles.forEach(file => {
      const filePath = `${UPLOAD_DIR}/${file}`;
      try {
        fs.unlinkSync(filePath);
        console.log(`Deleted: ${file}`);
        deletedCount++;
      } catch (error) {
        console.log(`Error deleting ${file}:`, error.message);
      }
    });
  });
  
  console.log(`\nCleanup complete! Deleted ${deletedCount} files.`);
} else {
  console.log('\n=== DRY RUN ONLY ===');
  console.log('No files were deleted. Add --execute to actually delete.');
}
