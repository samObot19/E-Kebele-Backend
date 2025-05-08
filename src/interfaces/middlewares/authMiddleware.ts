import { Request, Response, NextFunction } from 'express';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Here you would typically verify the token and extract user information
  // For example, using a library like jsonwebtoken
  // jwt.verify(token, secret, (err, decoded) => {
  //   if (err) {
  //     return res.status(403).json({ message: 'Forbidden' });
  //   }
  //   req.user = decoded; // Attach user info to request
  //   next();
  // });

  // Placeholder for token verification logic
  req.user = { id: 1, name: 'Test User' }; // Mock user for demonstration
  next();
};

export default authMiddleware;