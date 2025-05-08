import { Request, Response } from 'express';
import { UserUseCase } from '../../application/use-cases/user';

export class UserController {
  constructor(private userUseCase: UserUseCase) {}

  // Register a new user
  public async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      const newUser = await this.userUseCase.registerUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error });
    }
  }

  // Authenticate a user (login)
  public async authenticateUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await this.userUseCase.authenticateUser(email, password);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error authenticating user', error });
    }
  }

  // Get a user by ID
  public async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const user = await this.userUseCase.getUserById(userId);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user', error });
    }
  }

  // Update a user
  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const updates = req.body;
      const updatedUser = await this.userUseCase.updateUser(userId, updates);
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error });
    }
  }

  // Delete a user
  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const deleted = await this.userUseCase.deleteUser(userId);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error });
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
}

