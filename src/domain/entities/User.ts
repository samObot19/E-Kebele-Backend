export interface User {
  userId: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: Date;
  profilePicture: string;
  createdAt: Date;
  updatedAt: Date;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
}