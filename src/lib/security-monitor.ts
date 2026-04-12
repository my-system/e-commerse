/**
 * Security Monitoring Utilities
 * Provides functions for monitoring security events and detecting suspicious patterns
 */

interface SecurityAlert {
  id: string;
  type: 'brute_force' | 'sql_injection' | 'xss_attempt' | 'rate_limit_exceeded' | 'unauthorized_access' | 'data_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  description: string;
  details?: any;
  resolved: boolean;
}

class SecurityMonitor {
  private alerts: SecurityAlert[] = [];
  private authAttempts: Map<string, number> = new Map();
  private suspiciousIPs: Set<string> = new Set();

  /**
   * Track authentication attempt
   */
  trackAuthAttempt(email: string, success: boolean, ip: string) {
    const key = `${email}:${ip}`;
    
    if (!success) {
      const attempts = this.authAttempts.get(key) || 0;
      this.authAttempts.set(key, attempts + 1);
      
      // Alert if too many failed attempts
      if (attempts + 1 >= 5) {
        this.createAlert({
          type: 'brute_force',
          severity: 'high',
          description: `Multiple failed authentication attempts for ${email}`,
          details: { email, ip, attempts: attempts + 1 }
        });
        this.suspiciousIPs.add(ip);
      }
    } else {
      // Reset attempts on successful login
      this.authAttempts.delete(key);
    }
  }

  /**
   * Check if IP is suspicious
   */
  isSuspiciousIP(ip: string): boolean {
    return this.suspiciousIPs.has(ip);
  }

  /**
   * Create security alert
   */
  createAlert(alert: Omit<SecurityAlert, 'id' | 'timestamp' | 'resolved'>) {
    const newAlert: SecurityAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      resolved: false,
      ...alert
    };
    
    this.alerts.push(newAlert);
    console.warn('[SECURITY ALERT]', JSON.stringify(newAlert));
    
    return newAlert;
  }

  /**
   * Get all alerts
   */
  getAlerts(): SecurityAlert[] {
    return this.alerts;
  }

  /**
   * Get unresolved alerts
   */
  getUnresolvedAlerts(): SecurityAlert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  /**
   * Resolve alert
   */
  resolveAlert(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
    }
  }

  /**
   * Get security metrics
   */
  getMetrics() {
    return {
      totalAlerts: this.alerts.length,
      unresolvedAlerts: this.alerts.filter(a => !a.resolved).length,
      suspiciousIPs: this.suspiciousIPs.size,
      authAttempts: this.authAttempts.size,
      alertsByType: this.getAlertsByType(),
      alertsBySeverity: this.getAlertsBySeverity()
    };
  }

  /**
   * Get alerts grouped by type
   */
  private getAlertsByType() {
    const byType: Record<string, number> = {};
    this.alerts.forEach(alert => {
      byType[alert.type] = (byType[alert.type] || 0) + 1;
    });
    return byType;
  }

  /**
   * Get alerts grouped by severity
   */
  private getAlertsBySeverity() {
    const bySeverity: Record<string, number> = {};
    this.alerts.forEach(alert => {
      bySeverity[alert.severity] = (bySeverity[alert.severity] || 0) + 1;
    });
    return bySeverity;
  }

  /**
   * Check for suspicious patterns
   */
  checkSuspiciousPattern(email: string, ip: string, userAgent?: string) {
    // Check for rapid requests from same IP
    // Check for requests from suspicious IP
    // Check for unusual user agent patterns
    // In production, this would use more sophisticated ML/anomaly detection
  }
}

// Singleton instance
const securityMonitor = new SecurityMonitor();

export { securityMonitor, SecurityMonitor };
export type { SecurityAlert };
