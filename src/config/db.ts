// src/db.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();


// Function to connect to MongoDB
const connectDB = async (): Promise<void> => {
  try {
    // Attempt to connect to MongoDB using the URL from environment variables
    await mongoose.connect(process.env.DATABASE_URL as string);

    console.log('MongoDB connected successfully!');
  } catch (error) {
    // Log the error and exit the process if MongoDB connection fails
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process with an error code
  }
};

export default connectDB;
