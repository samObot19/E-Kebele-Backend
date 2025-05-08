import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserUseCase } from '../../application/use-cases/user';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';

const router = Router();

// Dependency injection
const userRepository = new UserRepository();
const userUseCase = new UserUseCase(userRepository);
const userController = new UserController(userUseCase);

// User registration
router.post('/register', (req, res) => userController.registerUser(req, res));

// User login
router.post('/login', (req, res) => userController.authenticateUser(req, res));

// Get user details
router.get('/:userId', (req, res) => userController.getUserById(req, res));

// Update user details
router.put('/:userId', (req, res) => userController.updateUser(req, res));

// Delete user
router.delete('/:userId', (req, res) => userController.deleteUser(req, res));

// List all users
router.get('/', (req, res) => userController.listUsers(req, res));

export default router;