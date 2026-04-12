/**
 * Input Sanitization Utilities
 * Provides functions to sanitize user inputs and prevent XSS attacks
 */

/**
 * Sanitize string input to prevent XSS attacks
 */
export function sanitizeString(input: string | null | undefined): string {
  if (!input) return '';
  
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim()
    .slice(0, 1000); // Limit length
}

/**
 * Sanitize email input
 */
export function sanitizeEmail(email: string | null | undefined): string {
  if (!email) return '';
  
  const sanitized = email.toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return emailRegex.test(sanitized) ? sanitized : '';
}

/**
 * Sanitize numeric input
 */
export function sanitizeNumber(input: string | number | null | undefined): number {
  if (input === null || input === undefined) return 0;
  
  const num = typeof input === 'number' ? input : parseFloat(input);
  return isNaN(num) ? 0 : num;
}

/**
 * Sanitize URL input
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  try {
    const parsedUrl = new URL(url);
    // Only allow http and https protocols
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return '';
    }
    return parsedUrl.toString();
  } catch {
    return '';
  }
}

/**
 * Sanitize array input (for arrays of strings)
 */
export function sanitizeStringArray(input: string[] | null | undefined): string[] {
  if (!input || !Array.isArray(input)) return [];
  
  return input
    .filter(item => typeof item === 'string')
    .map(item => sanitizeString(item))
    .filter(item => item.length > 0)
    .slice(0, 100); // Limit array size
}

/**
 * Sanitize object input by recursively sanitizing string values
 */
export function sanitizeObject<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized: any = Array.isArray(obj) ? [] : {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key as keyof T];
      
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
  }
  
  return sanitized as T;
}

/**
 * Validate and sanitize product data
 */
export function sanitizeProductData(data: any) {
  return {
    title: sanitizeString(data.title),
    description: sanitizeString(data.description),
    price: sanitizeNumber(data.price),
    category: sanitizeString(data.category),
    images: sanitizeStringArray(data.images),
    stock: Math.max(0, Math.min(99999, sanitizeNumber(data.stock))),
    inStock: Boolean(data.inStock)
  };
}

/**
 * Validate and sanitize user data
 */
export function sanitizeUserData(data: any) {
  return {
    name: sanitizeString(data.name),
    email: sanitizeEmail(data.email),
    phone: sanitizeString(data.phone),
    address: sanitizeString(data.address),
    city: sanitizeString(data.city),
    postalCode: sanitizeString(data.postalCode),
    country: sanitizeString(data.country)
  };
}

/**
 * Check for SQL injection patterns
 */
export function detectSqlInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|EXEC|UNION|SCRIPT)\b)/i,
    /(--|;|\/\*|\*\/)/,
    /(\bOR\b.*=.*=)/i,
    /(\bAND\b.*=.*=)/i,
    /(\bWHERE\b.*1=1)/i
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Sanitize and validate input with SQL injection check
 */
export function safeSanitize(input: string): string {
  const sanitized = sanitizeString(input);
  
  if (detectSqlInjection(sanitized)) {
    throw new Error('Invalid input detected');
  }
  
  return sanitized;
}
