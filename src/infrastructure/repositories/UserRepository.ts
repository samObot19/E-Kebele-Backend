import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

// Make users array static to maintain state between tests
export class UserRepository implements IUserRepository {
  private static users: User[] = [];
  
  async getUserByEmail(email: string): Promise<User | null> {
    return UserRepository.users.find(user => user.email === email) || null;
  }

  async createUser(user: User): Promise<User> {
    UserRepository.users.push(user);
    return user;
  }

  async getUserById(userId: string): Promise<User | null> {
    return UserRepository.users.find(user => user.userId === userId) || null;
  }

  async updateUser(userId: string, updatedUser: Partial<User>): Promise<User | null> {
    const userIndex = UserRepository.users.findIndex(user => user.userId === userId);
    if (userIndex === -1) return null;

    const user = UserRepository.users[userIndex];
    const updated = { ...user, ...updatedUser };
    UserRepository.users[userIndex] = updated;
    return updated;
  }

  async deleteUser(userId: string): Promise<boolean> {
    const userIndex = UserRepository.users.findIndex(user => user.userId === userId);
    if (userIndex !== -1) {
      UserRepository.users.splice(userIndex, 1);
      return true; // Return true if the user was successfully deleted
    }
    return false; // Return false if the user was not found
  }

  async findByEmailAndPassword(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async listUsers(): Promise<User[]> {
    return UserRepository.users; // Return all users
  }
}