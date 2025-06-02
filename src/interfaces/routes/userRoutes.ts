import { Router, RequestHandler } from 'express';
import { UserController } from '../controllers/UserController';
import { UserUseCase } from '../../application/use-cases/user';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { requireKebeleAdmin, requireAnyAdmin, checkRole } from '../middlewares/roleMiddleware';

const router = Router();

// Dependency injection
const userRepository = new UserRepository();
const userUseCase = new UserUseCase(userRepository);
const userController = new UserController(userUseCase);

// Public routes
router.post('/register', (req, res) => userController.registerUser(req, res));
router.post('/login', (req, res) => userController.loginUser(req, res));

// Protected routes - require authentication
router.use(authenticateJWT as RequestHandler);

// Get user details - Users can access their own details, admins can access any
router.get('/:userId', 
  checkRole(['resident']) as RequestHandler,
  (req, res) => userController.getUserById(req, res)
);

// Update user details - Users can update their own details, admins can update any
router.put('/:userId',
  checkRole(['resident']) as RequestHandler,
  (req, res) => userController.updateUser(req, res)
);

// Delete user - Only Kebele admin can delete users
router.delete('/:userId',
  requireKebeleAdmin as RequestHandler,
  (req, res) => userController.deleteUser(req, res)
);

// List all users - Only admins can list all users
router.get('/',
  requireAnyAdmin as RequestHandler,
  (req, res) => userController.listUsers(req, res)
);

// Get user by email - Only admins can search by email
router.get('/email/:email',
  requireAnyAdmin as RequestHandler,
  (req, res) => userController.getUserByEmail(req, res)
);

export default router;