import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware';
import { UserRole } from '../../domain/entities/User';

export const ROLE_HIERARCHY = {
  kebele_admin: ['kebele_admin', 'goxe_admin', 'resident'],
  goxe_admin: ['goxe_admin', 'resident'],
  resident: ['resident']
};

export const checkRole = (requiredRoles: UserRole[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const userRole = req.user.role;
      const allowedRoles = ROLE_HIERARCHY[userRole] || [];

      // Check if user's role has permission
      const hasPermission = requiredRoles.some(role => allowedRoles.includes(role));

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
          requiredRoles,
          userRole
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error checking role permissions',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
};

// Specific role-based middleware functions
export const requireKebeleAdmin = checkRole(['kebele_admin']);
export const requireGoxeAdmin = checkRole(['goxe_admin']);
export const requireAnyAdmin = checkRole(['kebele_admin', 'goxe_admin']);
export const requireResident = checkRole(['resident']);

// Custom middleware for document access
export const checkDocumentAccess = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { role, userId } = req.user;
    const targetUserId = req.params.userId || req.body.userId;

    // Kebele admin can access all documents
    if (role === 'kebele_admin') {
      return next();
    }

    // Goxe admin can access documents they need to verify
    if (role === 'goxe_admin') {
      // Add any specific Goxe admin checks here
      return next();
    }

    // Residents can only access their own documents
    if (role === 'resident' && userId === targetUserId) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'You do not have permission to access these documents'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking document access',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 