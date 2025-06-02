import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import passport from 'passport';
import { generateToken, AuthenticatedRequest } from '../middlewares/authMiddleware';
import { UserController } from '../controllers/UserController';
import { UserUseCase } from '../../application/use-cases/user';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { UserRole } from '../../domain/entities/User';
import { validateUserRegistration, validateLoginRequest } from '../middlewares/validationMiddleware';
import { config } from '../../config/env';

const router = Router();

// Dependency injection
const userRepository = new UserRepository();
const userUseCase = new UserUseCase(userRepository);
const userController = new UserController(userUseCase);

// Regular email/password registration with validation
router.post('/register', 
  validateUserRegistration as RequestHandler,
  (req, res) => userController.registerUser(req, res)
);

// Regular email/password login with validation
router.post('/login', 
  validateLoginRequest as RequestHandler,
  (req, res) => userController.loginUser(req, res)
);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { 
    scope: config.googleAuth.scope,
    prompt: 'select_account' // Always show account selector
  })
);

// Google OAuth callback
router.get('/google/callback',
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', { session: false }, (err, user) => {
      if (err) {
        console.error('Google authentication error:', err);
        return res.redirect(`${config.frontendURL}/auth/error?message=${encodeURIComponent('Authentication failed')}`);
      }
      if (!user) {
        return res.redirect(`${config.frontendURL}/auth/error?message=${encodeURIComponent('No user data received')}`);
      }
      try {
        const token = generateToken({
          userId: user.userId,
          role: user.role as UserRole,
          email: user.email
        });
        res.redirect(`${config.frontendURL}/auth/callback?token=${token}`);
      } catch (error) {
        console.error('Token generation error:', error);
        res.redirect(`${config.frontendURL}/auth/error?message=${encodeURIComponent('Token generation failed')}`);
      }
    })(req, res, next);
  }
);

// Protected routes - require JWT authentication
router.put('/approve/:userId',
  passport.authenticate('jwt', { session: false }),
  userController.approveUserRole as RequestHandler
);

router.put('/reject/:userId',
  passport.authenticate('jwt', { session: false }),
  userController.rejectUserRole as RequestHandler
);

// Test protected route
router.get('/protected',
  passport.authenticate('jwt', { session: false }),
  ((req: AuthenticatedRequest, res: Response) => {
    res.json({
      success: true,
      message: 'You have accessed a protected route',
      user: req.user
    });
  }) as RequestHandler
);

export default router; 