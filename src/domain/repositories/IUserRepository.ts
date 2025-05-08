export interface IUserRepository {
  createUser(userData: any): Promise<any>;
  getUserById(userId: string): Promise<any>;
  getUserByEmail(email: string): Promise<any | null>; // Added getUserByEmail method
  updateUser(userId: string, userData: any): Promise<any>;
  deleteUser(userId: string): Promise<boolean>; // Updated to return boolean
  listUsers(): Promise<any[]>; // Added listUsers method
}