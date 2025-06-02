import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../../domain/entities/User';
import { config } from '../../config/env';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: UserRole;
    email: string;
  };
}

export const generateToken = (user: { userId: string; role: UserRole; email: string }): string => {
  return jwt.sign(user, config.jwtSecret, { expiresIn: '24h' });
};

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const user = jwt.verify(token, config.jwtSecret) as { userId: string; role: UserRole; email: string };
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};

// Middleware to check if user can access a document
export const authorizeDocumentAccess = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { role } = req.user;
  const documentUserId = req.params.userId || req.body.userId;

  // Kebele admins can access all documents
  if (role === 'kebele_admin') {
    return next();
  }

  // Goxe admins can access documents they need to verify
  if (role === 'goxe_admin') {
    // You might want to add additional checks here
    return next();
  }

  // Residents can only access their own documents
  if (role === 'resident' && req.user.userId === documentUserId) {
    return next();
  }

  return res.status(403).json({ message: 'Forbidden: Cannot access this document' });
};