import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

export class UserUseCase {
  constructor(private userRepository: IUserRepository) {}

  // Register a new user
  public async registerUser(userData: User): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Basic password hashing (in production, use bcrypt or similar)
    if (userData.password) {
      userData.password = Buffer.from(userData.password).toString('base64');
    }

    return this.userRepository.createUser(userData);
  }

  // Login user
  public async loginUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    // Basic password comparison (in production, use bcrypt or similar)
    const hashedPassword = Buffer.from(password).toString('base64');
    if (user.password !== hashedPassword) {
      throw new Error('Invalid password');
    }

    // Check if user is approved
    if (user.status !== 'approved' && user.role !== 'kebele_admin') {
      throw new Error('Account is pending approval');
    }

    return user;
  }

  // Retrieve a user by their ID
  public async getUserById(userId: string): Promise<User | null> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // Update user details
  public async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return this.userRepository.updateUser(userId, updates);
  }

  // Delete a user by their ID
  public async deleteUser(userId: string): Promise<boolean> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return this.userRepository.deleteUser(userId);
  }

  // List all users
  public async listUsers(): Promise<User[]> {
    return this.userRepository.listUsers();
  }

  // Get user by email
  public async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}