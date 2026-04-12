/**
 * CSRF Protection Utilities
 * Provides functions for generating and validating CSRF tokens
 */

import { createHash, randomBytes } from 'crypto';

/**
 * Generate a random CSRF token
 */
export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Generate CSRF token hash for validation
 */
export function hashCSRFToken(token: string): string {
  const secret = process.env.CSRF_SECRET || process.env.NEXTAUTH_SECRET || 'default-csrf-secret';
  return createHash('sha256')
    .update(token + secret)
    .digest('hex');
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string, expectedHash: string): boolean {
  const tokenHash = hashCSRFToken(token);
  return tokenHash === expectedHash;
}

/**
 * Generate CSRF token pair (token + hash)
 */
export function generateCSRFPair(): { token: string; hash: string } {
  const token = generateCSRFToken();
  const hash = hashCSRFToken(token);
  return { token, hash };
}

/**
 * Middleware function to validate CSRF token in request
 */
export function validateCSRFMiddleware(request: Request): boolean {
  const csrfToken = request.headers.get('x-csrf-token');
  const csrfCookie = request.headers.get('cookie')?.match(/csrf-token=([^;]+)/)?.[1];
  
  if (!csrfToken || !csrfCookie) {
    return false;
  }
  
  return validateCSRFToken(csrfToken, csrfCookie);
}
