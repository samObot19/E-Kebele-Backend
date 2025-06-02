import { User } from '../entities/User';

export interface IUserRepository {
  createUser(userData: User): Promise<User>;
  getUserById(userId: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  updateUser(userId: string, userData: Partial<User>): Promise<User | null>;
  deleteUser(userId: string): Promise<boolean>;
  findByEmailAndPassword(email: string, password: string): Promise<User | null>;
  listUsers(): Promise<any[]>; // Added listUsers method
}