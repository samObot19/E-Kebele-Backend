import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Define backend URL from environment or construct it
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  googleAuth: {
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
    scope: ['profile', 'email']
  },
  frontendURL: process.env.FRONTEND_URL || 'http://localhost:3000',
  mongoURI: process.env.DATABASE_URL || '',
  baseURL: BACKEND_URL
};

// Validate required environment variables
const requiredEnvVars = [
  'JWT_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'DATABASE_URL',
  'FRONTEND_URL',
  'PORT'
];

// Validate all required environment variables
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: Environment variable ${envVar} is not set`);
    process.exit(1);
  }
}

// Debug: Print configuration
if (process.env.NODE_ENV === 'development') {
  console.log('=== Configuration ===');
  console.log('Environment:', config.nodeEnv);
  console.log('Port:', config.port);
  console.log('Frontend URL:', config.frontendURL);
  console.log('Backend URL:', config.baseURL);
  console.log('Google OAuth Configuration:');
  console.log('- Client ID:', config.googleAuth.clientID.substring(0, 10) + '...');
  console.log('- Callback URL:', config.googleAuth.callbackURL);
  console.log('==================');
}