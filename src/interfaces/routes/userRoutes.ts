// src/routes/userRoutes.ts
import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate } from '../middlewares/authenticate';

const router = Router();


const userController = new UserController();

// User registration route
router.post('/register', (req, res) => userController.registerUser(req, res));

// User login route
router.post('/login', (req, res) => userController.loginUser(req, res));

// Google login/register
router.post('/google', (req, res) => userController.googleAuth(req, res));



// User logout route
router.post('/logout', (req, res) => userController.logoutUser(req, res));

// GET /api/users/:userId - Get a user by ID
router.get("/:userId", authenticate, (req, res) =>
  userController.getUserById(req, res)
);

router.put(
  "/:userId/verify",
  authenticate, // must attach req.user
  (req, res) => userController.verifyUser(req, res)
);



// Route for approving or rejecting user access
router.put(
  "/:userId/approve",
  authenticate, // Middleware to verify JWT and attach user info
  (req, res) => userController.approveUser(req, res))


// router.get(
//   "/",
//   authenticate,
//   (req, res) => userController.getAllUsers(req, res))



export default router;
