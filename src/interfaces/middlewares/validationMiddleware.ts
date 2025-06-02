import { Request, Response, NextFunction } from 'express';

export const validateUserRegistration = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, phone, address } = req.body;
  const errors: string[] = [];

  // Validate email
  if (!email) {
    errors.push('Email is required');
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.push('Email format is invalid');
  }

  // Validate name
  if (!name) {
    errors.push('Name is required');
  } else if (name.length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  // Validate password for non-Google auth
  if (!req.body.googleId && (!password || password.length < 6)) {
    errors.push('Password must be at least 6 characters long');
  }

  // Validate phone
  if (!phone) {
    errors.push('Phone number is required');
  }

  // Validate address
  if (!address) {
    errors.push('Address is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

export const validateLoginRequest = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const errors: string[] = [];

  if (!email) {
    errors.push('Email is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
}; 