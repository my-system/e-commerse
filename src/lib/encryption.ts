/**
 * Data Encryption Utilities
 * Provides functions for encrypting and decrypting sensitive data
 */

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const SALT_LENGTH = 64;

/**
 * Derive encryption key from password using scrypt
 */
function deriveKey(password: string, salt: Buffer): Buffer {
  return scryptSync(password, salt, KEY_LENGTH);
}

/**
 * Encrypt data using AES-256-GCM
 */
export function encrypt(data: string, password: string): { encrypted: string; iv: string; salt: string; authTag: string } {
  const salt = randomBytes(SALT_LENGTH);
  const iv = randomBytes(IV_LENGTH);
  const key = deriveKey(password, salt);

  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString('hex'),
    salt: salt.toString('hex'),
    authTag: authTag.toString('hex')
  };
}

/**
 * Decrypt data using AES-256-GCM
 */
export function decrypt(encryptedData: string, password: string, iv: string, salt: string, authTag: string): string {
  const saltBuffer = Buffer.from(salt, 'hex');
  const ivBuffer = Buffer.from(iv, 'hex');
  const authTagBuffer = Buffer.from(authTag, 'hex');
  const key = deriveKey(password, saltBuffer);

  const decipher = createDecipheriv(ALGORITHM, key, ivBuffer);
  decipher.setAuthTag(authTagBuffer);

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Encrypt sensitive field for database storage
 */
export function encryptField(data: string): string {
  const encryptionKey = process.env.ENCRYPTION_KEY || process.env.NEXTAUTH_SECRET || 'default-encryption-key';
  const { encrypted, iv, salt, authTag } = encrypt(data, encryptionKey);
  
  // Store as JSON string
  return JSON.stringify({ encrypted, iv, salt, authTag });
}

/**
 * Decrypt sensitive field from database storage
 */
export function decryptField(encryptedField: string): string {
  try {
    const encryptionKey = process.env.ENCRYPTION_KEY || process.env.NEXTAUTH_SECRET || 'default-encryption-key';
    const { encrypted, iv, salt, authTag } = JSON.parse(encryptedField);
    
    return decrypt(encrypted, encryptionKey, iv, salt, authTag);
  } catch (error) {
    console.error('Decryption error:', error);
    return ''; // Return empty string if decryption fails
  }
}

/**
 * Hash data for one-way encryption (e.g., for verification)
 */
export function hashData(data: string): string {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Verify hash matches data
 */
export function verifyHash(data: string, hash: string): boolean {
  return hashData(data) === hash;
}
