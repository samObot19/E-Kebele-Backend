export type UserRole = 'resident' | 'goxe_admin' | 'kebele_admin';
export type UserStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface User {
  userId: string;
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  role: UserRole;
  status: UserStatus;
  phone: string;
  address: string;
  idNumber?: string;
  adminCredentials?: {
    username: string;
    verificationCode: string;
  };
  verifiedBy?: {
    goxeAdmin?: string;
    kebeleAdmin?: string;
  };
  documents?: {
    idPhoto?: string;
    supportingDocs?: string[];
  };
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any; // Add index signature for dynamic access
}