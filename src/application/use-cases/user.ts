import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

export class UserUseCase {
  constructor(private userRepository: IUserRepository) {}

  // Register a new user
  public async registerUser(userData: User): Promise<User> {
    return this.userRepository.createUser(userData);
  }

  // Authenticate a user (login)
  public async authenticateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.getUserByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  // Retrieve a user by their ID
  public async getUserById(userId: string): Promise<User | null> {
    return this.userRepository.getUserById(userId);
  }

  // Update user details
  public async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    return this.userRepository.updateUser(userId, updates);
  }

  // Delete a user by their ID
  public async deleteUser(userId: string): Promise<boolean> {
    return this.userRepository.deleteUser(userId);
  }

  // List all users
  public async listUsers(): Promise<User[]> {
    return this.userRepository.listUsers();
  }
}