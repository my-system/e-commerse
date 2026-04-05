// API Validation & Business Rules Enforcement
class APIValidator {
  static validateProductInput(data) {
    const errors = [];
    
    // Required fields
    const required = ['title', 'price', 'category'];
    required.forEach(field => {
      if (!data[field]) {
        errors.push(`${field} is required`);
      }
    });
    
    // Price validation
    if (data.price && (isNaN(data.price) || parseFloat(data.price) <= 0)) {
      errors.push('Price must be a positive number');
    }
    
    // Title validation
    if (data.title && data.title.length < 3) {
      errors.push('Title must be at least 3 characters');
    }
    
    // Category validation
    const validCategories = ['fashion', 'electronics', 'home', 'beauty', 'sports', 'books'];
    if (data.category && !validCategories.includes(data.category.toLowerCase()) && !/^\d+$/.test(data.category)) {
      errors.push(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  static validateDatabaseOperation(operation, database, data) {
    const errors = [];
    
    // Database-specific rules
    if (database === 'pending') {
      if (data.status && data.status !== 'pending') {
        errors.push('Pending database only accepts "pending" status');
      }
    }
    
    if (database === 'marketplace') {
      if (data.status && data.status !== 'approved') {
        errors.push('Marketplace database only accepts "approved" status');
      }
    }
    
    // Operation-specific rules
    if (operation === 'create') {
      if (!data.id) {
        errors.push('ID is required for product creation');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  static validateWorkflowTransition(fromStatus, toStatus, userRole) {
    const errors = [];
    
    // Define allowed transitions
    const transitions = {
      'seller': {
        'none': ['pending'],
        'pending': [] // Seller can't change status
      },
      'admin': {
        'pending': ['approved', 'rejected'],
        'rejected': ['pending'], // Admin can reconsider
        'approved': [] // Can't change approved products
      },
      'system': {
        'pending': ['approved'],
        'approved': ['archived']
      }
    };
    
    const allowedTransitions = transitions[userRole]?.[fromStatus] || [];
    
    if (!allowedTransitions.includes(toStatus)) {
      errors.push(`Invalid transition: ${userRole} cannot change status from ${fromStatus} to ${toStatus}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Enhanced API Route Template
class EnhancedAPIRoute {
  static async handleRequest(req, operation, database, validator) {
    try {
      // 1. Validate input
      const inputValidation = validator ? validator(req.body || req.query) : { isValid: true };
      if (!inputValidation.isValid) {
        return {
          status: 400,
          success: false,
          error: 'Validation failed',
          details: inputValidation.errors
        };
      }
      
      // 2. Validate database operation
      const dbValidation = APIValidator.validateDatabaseOperation(operation, database, req.body);
      if (!dbValidation.isValid) {
        return {
          status: 400,
          success: false,
          error: 'Database validation failed',
          details: dbValidation.errors
        };
      }
      
      // 3. Execute operation
      const result = await this.executeOperation(operation, database, req);
      
      // 4. Log audit
      await this.logAudit(operation, database, req, result);
      
      return {
        status: 200,
        success: true,
        data: result
      };
      
    } catch (error) {
      console.error(`API Error in ${operation}:`, error);
      
      // 5. Log error
      await this.logError(operation, database, req, error);
      
      return {
        status: 500,
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      };
    }
  }
  
  static async logAudit(operation, database, req, result) {
    // This would log to audit database
    console.log(`AUDIT: ${operation} on ${database} by ${req.user?.id || 'anonymous'}`);
  }
  
  static async logError(operation, database, req, error) {
    // This would log to error tracking system
    console.error(`ERROR: ${operation} on ${database} failed:`, error.message);
  }
}

// Business Rules Engine
class BusinessRulesEngine {
  static async checkBusinessRules(operation, data, context) {
    const rules = [
      this.checkProductLimits,
      this.checkCategoryLimits,
      this.checkPricingRules,
      this.checkUserPermissions
    ];
    
    for (const rule of rules) {
      const result = await rule(operation, data, context);
      if (!result.allowed) {
        return {
          allowed: false,
          reason: result.reason,
          rule: result.name
        };
      }
    }
    
    return { allowed: true };
  }
  
  static async checkProductLimits(operation, data, context) {
    // Check if user has exceeded product limits
    const userProducts = await BusinessRulesEngine.getUserProductCount(context.userId);
    const maxProducts = BusinessRulesEngine.getMaxProductsForUser(context.userRole);
    
    if (operation === 'create' && userProducts >= maxProducts) {
      return {
        allowed: false,
        reason: `Product limit exceeded. Max: ${maxProducts}`,
        name: 'product_limits'
      };
    }
    
    return { allowed: true };
  }
  
  static async checkCategoryLimits(operation, data, context) {
    // Check category-specific rules
    const categoryRules = {
      'electronics': {
        maxPrice: 10000000,
        requiredFields: ['specifications', 'warranty']
      },
      'fashion': {
        maxPrice: 5000000,
        requiredFields: ['sizes', 'material']
      }
    };
    
    const rules = categoryRules[data.category?.toLowerCase()];
    if (rules) {
      if (data.price > rules.maxPrice) {
        return {
          allowed: false,
          reason: `Price exceeds maximum for ${data.category}: Rp ${rules.maxPrice.toLocaleString('id-ID')}`,
          name: 'category_pricing'
        };
      }
      
      for (const field of rules.requiredFields) {
        if (!data[field]) {
          return {
            allowed: false,
            reason: `${field} is required for ${data.category} products`,
            name: 'category_requirements'
          };
        }
      }
    }
    
    return { allowed: true };
  }
  
  static async checkPricingRules(operation, data, context) {
    // Validate pricing rules
    if (data.price < 1000) {
      return {
        allowed: false,
        reason: 'Minimum price is Rp 1.000',
        name: 'minimum_price'
      };
    }
    
    if (data.price > 50000000) {
      return {
        allowed: false,
        reason: 'Maximum price is Rp 50.000.000',
        name: 'maximum_price'
      };
    }
    
    return { allowed: true };
  }
  
  static async checkUserPermissions(operation, data, context) {
    // Check user permissions
    const permissions = {
      'seller': ['create', 'read_own', 'update_own', 'delete_own'],
      'admin': ['create', 'read', 'update', 'delete', 'approve', 'reject'],
      'customer': ['read']
    };
    
    const userPermissions = permissions[context.userRole] || [];
    
    if (!userPermissions.includes(operation)) {
      return {
        allowed: false,
        reason: `User role ${context.userRole} cannot perform ${operation}`,
        name: 'user_permissions'
      };
    }
    
    return { allowed: true };
  }
  
  static async getUserProductCount(userId) {
    // This would query database - for now return mock data
    return 5; // Mock: user has 5 products
  }
  
  static getMaxProductsForUser(userRole) {
    const limits = {
      'seller': 100,
      'admin': 1000,
      'customer': 0
    };
    
    return limits[userRole] || 10;
  }
}

module.exports = {
  APIValidator,
  EnhancedAPIRoute,
  BusinessRulesEngine
};
