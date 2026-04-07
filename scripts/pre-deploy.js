import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting pre-deployment setup...');

// Check if required environment variables are set
const requiredEnvVars = [
  'PENDING_DATABASE_URL',
  'MARKETPLACE_DATABASE_URL',
  'BACKUP_DATABASE_URL',
  'DATABASE_URL',
  'NEXTAUTH_SECRET'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  process.exit(1);
}

console.log('✅ Environment variables validated');

// Generate Prisma client
console.log('📦 Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated');
} catch (error) {
  console.error('❌ Failed to generate Prisma client:', error.message);
  process.exit(1);
}

// Check if build will succeed
console.log('🏗️ Testing build process...');
try {
  execSync('npm run type-check', { stdio: 'inherit' });
  console.log('✅ TypeScript compilation successful');
} catch (error) {
  console.error('❌ TypeScript compilation failed:', error.message);
  process.exit(1);
}

// Check if public assets exist
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  console.error('❌ Public directory not found');
  process.exit(1);
}

console.log('✅ Public directory exists');

// Check if .next directory is clean (optional)
const nextDir = path.join(process.cwd(), '.next');
if (fs.existsSync(nextDir)) {
  console.log('🧹 Cleaning .next directory...');
  try {
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log('✅ .next directory cleaned');
  } catch (error) {
    console.warn('⚠️ Could not clean .next directory:', error.message);
  }
}

console.log('🎯 Pre-deployment setup complete!');
console.log('📋 Ready for Vercel deployment');
