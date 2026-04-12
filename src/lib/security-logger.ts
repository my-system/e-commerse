/**
 * Security Logging Utilities
 * Provides functions for logging security-related events
 */

interface SecurityLogEntry {
  timestamp: string;
  event: string;
  userId?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  details?: any;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

/**
 * Log security event
 */
export function logSecurityEvent(entry: Omit<SecurityLogEntry, 'timestamp'>) {
  const logEntry: SecurityLogEntry = {
    timestamp: new Date().toISOString(),
    ...entry
  };

  // Log to console (in production, this should go to a secure logging service)
  console.log('[SECURITY]', JSON.stringify(logEntry));

  // In production, you would send this to:
  // - External logging service (e.g., Datadog, LogRocket, Sentry)
  // - Database table for audit logs
  // - SIEM system
}

/**
 * Log authentication attempt
 */
export function logAuthAttempt(
  success: boolean,
  email: string,
  ip?: string,
  userAgent?: string,
  userId?: string
) {
  logSecurityEvent({
    event: 'AUTH_ATTEMPT',
    userId,
    email,
    ip,
    userAgent,
    details: { success },
    severity: success ? 'info' : 'warning'
  });
}

/**
 * Log failed authentication
 */
export function logAuthFailure(
  email: string,
  reason: string,
  ip?: string,
  userAgent?: string
) {
  logSecurityEvent({
    event: 'AUTH_FAILURE',
    email,
    ip,
    userAgent,
    details: { reason },
    severity: 'warning'
  });
}

/**
 * Log successful authentication
 */
export function logAuthSuccess(
  email: string,
  userId: string,
  ip?: string,
  userAgent?: string
) {
  logSecurityEvent({
    event: 'AUTH_SUCCESS',
    userId,
    email,
    ip,
    userAgent,
    severity: 'info'
  });
}

/**
 * Log authorization failure
 */
export function logAuthzFailure(
  userId: string,
  email: string,
  resource: string,
  action: string,
  ip?: string
) {
  logSecurityEvent({
    event: 'AUTHZ_FAILURE',
    userId,
    email,
    ip,
    details: { resource, action },
    severity: 'warning'
  });
}

/**
 * Log rate limit hit
 */
export function logRateLimitHit(
  ip: string,
  endpoint: string,
  limit: number
) {
  logSecurityEvent({
    event: 'RATE_LIMIT_HIT',
    ip,
    details: { endpoint, limit },
    severity: 'warning'
  });
}

/**
 * Log suspicious activity
 */
export function logSuspiciousActivity(
  description: string,
  userId?: string,
  email?: string,
  ip?: string,
  details?: any
) {
  logSecurityEvent({
    event: 'SUSPICIOUS_ACTIVITY',
    userId,
    email,
    ip,
    details: { description, ...details },
    severity: 'error'
  });
}

/**
 * Log data access
 */
export function logDataAccess(
  userId: string,
  email: string,
  resource: string,
  action: 'read' | 'write' | 'delete',
  ip?: string
) {
  logSecurityEvent({
    event: 'DATA_ACCESS',
    userId,
    email,
    ip,
    details: { resource, action },
    severity: 'info'
  });
}

/**
 * Log security configuration change
 */
export function logSecurityConfigChange(
  userId: string,
  email: string,
  change: string,
  ip?: string
) {
  logSecurityEvent({
    event: 'SECURITY_CONFIG_CHANGE',
    userId,
    email,
    ip,
    details: { change },
    severity: 'warning'
  });
}

/**
 * Get recent security logs (for monitoring dashboard)
 */
export function getRecentSecurityLogs(limit: number = 50): SecurityLogEntry[] {
  // In production, this would query from database or logging service
  // For now, return empty array as we're only logging to console
  return [];
}

/**
 * Get security statistics
 */
export function getSecurityStats() {
  // In production, this would aggregate logs from database
  return {
    totalAuthAttempts: 0,
    failedAuthAttempts: 0,
    rateLimitHits: 0,
    suspiciousActivities: 0,
    last24Hours: {}
  };
}
