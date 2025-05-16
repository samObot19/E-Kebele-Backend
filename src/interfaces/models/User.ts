import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  role: string;
  name: string;
  address: string;
  phone: string;
  idNumber: string;
  adminCredentials: {
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}
  status: 'Pending' | 'Verified' | 'Rejected' | 'Approved';
  verificationReason: { type: String, default: "" },
}

const UserSchema: Schema = new Schema(
  {
    role: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    idNumber: { type: String, required: true },
    adminCredentials: {
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
},
    status: { type: String, enum: ['Pending', 'Verified', 'Rejected', "Approved"], default: 'Pending' },
    verificationReason: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
