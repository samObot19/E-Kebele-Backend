import { Request, Response } from 'express';
import { UserUseCase } from '../../application/use-cases/user';
import { User, UserRole } from '../../domain/entities/User';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { generateToken } from '../middlewares/authMiddleware';

export class UserController {
  constructor(private userUseCase: UserUseCase) {}

  // Register a new user
  public async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: User = {
        ...req.body,
        userId: `user_${Date.now()}`, // Generate a simple userId
        status: 'pending'
      };

      // Validate required fields
      const requiredFields = ['name', 'email', 'password', 'phone', 'address'];
      const missingFields = requiredFields.filter(field => !userData[field]);
      
      if (missingFields.length > 0) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields',
          missingFields
        });
        return;
      }

      const newUser = await this.userUseCase.registerUser(userData);
      
      // Generate token for the new user
      const token = generateToken({
        userId: newUser.userId,
        role: newUser.role,
        email: newUser.email
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: newUser,
          token
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error registering user',
        error
      });
    }
  }

  // Login user
  public async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      
      // Additional validation
      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
        return;
      }

      const user = await this.userUseCase.loginUser(email, password);
      
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
        return;
      }

      // Generate JWT token
      const token = generateToken({
        userId: user.userId,
        role: user.role as UserRole,
        email: user.email
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            userId: user.userId,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
          }
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Invalid credentials'
      });
    }
  }

  // Approve user role
  public async approveUserRole(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const adminId = req.user?.userId;
      const adminRole = req.user?.role;

      if (!adminId || !adminRole) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      // Only Kebele admin can approve Goxe admin, and Goxe admin can approve residents
      const userToApprove = await this.userUseCase.getUserById(userId);
      
      if (!userToApprove) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      if (
        (adminRole === 'kebele_admin' && userToApprove.role === 'goxe_admin') ||
        (adminRole === 'goxe_admin' && userToApprove.role === 'resident')
      ) {
        const updatedUser = await this.userUseCase.updateUser(userId, {
          status: 'approved',
          verifiedBy: {
            ...(userToApprove.verifiedBy || {}),
            [adminRole === 'kebele_admin' ? 'kebeleAdmin' : 'goxeAdmin']: adminId
          }
        });

        res.status(200).json({
          success: true,
          message: 'User role approved successfully',
          data: updatedUser
        });
      } else {
        res.status(403).json({
          success: false,
          message: 'You do not have permission to approve this user role'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error approving user role',
        error
      });
    }
  }

  // Reject user role
  public async rejectUserRole(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const adminId = req.user?.userId;
      const adminRole = req.user?.role;

      if (!adminId || !adminRole) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const userToReject = await this.userUseCase.getUserById(userId);
      
      if (!userToReject) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      if (
        (adminRole === 'kebele_admin' && userToReject.role === 'goxe_admin') ||
        (adminRole === 'goxe_admin' && userToReject.role === 'resident')
      ) {
        const updatedUser = await this.userUseCase.updateUser(userId, {
          status: 'rejected',
          verifiedBy: {
            ...(userToReject.verifiedBy || {}),
            [adminRole === 'kebele_admin' ? 'kebeleAdmin' : 'goxeAdmin']: adminId
          }
        });

        res.status(200).json({
          success: true,
          message: 'User role rejected successfully',
          data: updatedUser
        });
      } else {
        res.status(403).json({
          success: false,
          message: 'You do not have permission to reject this user role'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error rejecting user role',
        error
      });
    }
  }

  // Get user by ID
  public async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const user = await this.userUseCase.getUserById(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving user',
        error
      });
    }
  }

  // Update user
  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const updates = req.body;
      const updatedUser = await this.userUseCase.updateUser(userId, updates);
      if (!updatedUser) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: updatedUser
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating user',
        error
      });
    }
  }

  // Delete user
  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const deleted = await this.userUseCase.deleteUser(userId);
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting user',
        error
      });
    }
  }

  // List all users
  public async listUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userUseCase.listUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving users', error });
    }
  }

  // Get user by email
  public async getUserByEmail(req: Request, res: Response): Promise<void> {
    try {
      const email = req.params.email;
      const user = await this.userUseCase.getUserByEmail(email);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving user',
        error
      });
    }
  }
}

