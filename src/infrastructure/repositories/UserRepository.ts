import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

export class UserRepository implements IUserRepository {
  private users: User[] = [];
  
  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async createUser(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.users.find(user => user.userId === userId) || null;
  }

  async updateUser(userId: string, updatedUser: Partial<User>): Promise<User | null> {
    const userIndex = this.users.findIndex(user => user.userId === userId);
    if (userIndex === -1) return null;

    const user = this.users[userIndex];
    const updated = { ...user, ...updatedUser };
    this.users[userIndex] = updated;
    return updated;
  }

  async deleteUser(userId: string): Promise<boolean> {
    const userIndex = this.users.findIndex(user => user.userId === userId);
    if (userIndex !== -1) {
      this.users.splice(userIndex, 1);
      return true; // Return true if the user was successfully deleted
    }
    return false; // Return false if the user was not found
  }

  async listUsers(): Promise<User[]> {
    return this.users; // Return all users
  }
}