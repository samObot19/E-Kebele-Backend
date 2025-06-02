import './setup';
import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import userRoutes from '../interfaces/routes/userRoutes';
import authRoutes from '../interfaces/routes/authRoutes';
import documentRoutes from '../interfaces/routes/documentRoutes';
import passport from '../config/passport';
import { AuthenticateOptions } from 'passport';

const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

describe('Authentication Routes', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'resident',
    phone: '1234567890',
    address: 'Test Address',
    status: 'pending'
  };

  let authToken: string;

  test('POST /api/auth/register - Register new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('userId');
  });

  test('POST /api/auth/login - Login user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    authToken = res.body.data.token;
  });

  test('GET /api/auth/google - Should redirect to Google OAuth', async () => {
    const res = await request(app)
      .get('/api/auth/google');
    
    expect(res.status).toBe(302); // Redirect status code
    expect(res.header.location).toContain('accounts.google.com');
  });

  test('GET /api/auth/google/callback - Should handle Google callback', async () => {
    // Mock successful Google authentication by setting passport user
    const mockUser = {
      userId: `google_${Date.now()}`,
      email: 'google@example.com',
      role: 'resident' as const,
      name: 'Google User',
      status: 'pending',
      phone: '',
      address: ''
    };

    // Mock passport authenticate middleware
    const originalAuthenticate = passport.authenticate;
    passport.authenticate = jest.fn().mockImplementation(() => {
      return (req: Request, _res: Response, next: NextFunction) => {
        req.user = mockUser;
        next();
      };
    });

    try {
      const res = await request(app)
        .get('/api/auth/google/callback')
        .query({ code: 'mock_auth_code' });

      // Add debug logging
      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers);
      console.log('Response body:', res.body);
      
      expect(res.status).toBe(302); // Redirect status code
      expect(res.header.location).toContain('token=');
    } catch (error) {
      console.error('Test error:', error);
      throw error;
    } finally {
      // Restore original passport authenticate
      passport.authenticate = originalAuthenticate;
    }
  });
});

describe('User Routes', () => {
  let userId: string;
  let testUserEmail = 'test@example.com';

  beforeAll(async () => {
    // Get the userId from the previously registered user
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUserEmail,
        password: 'password123'
      });
    
    userId = res.body.data.user.userId;
  });

  test('GET /api/users - List all users', async () => {
    const res = await request(app)
      .get('/api/users');
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/users/email/:email - Get user by email', async () => {
    const res = await request(app)
      .get(`/api/users/email/${testUserEmail}`);
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('email', testUserEmail);
  });

  test('GET /api/users/:userId - Get user by ID', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`);
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('userId', userId);
  });

  test('PUT /api/users/:userId - Update user', async () => {
    const updates = {
      name: 'Updated Name',
      phone: '0987654321'
    };

    const res = await request(app)
      .put(`/api/users/${userId}`)
      .send(updates);
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('name', 'Updated Name');
  });
});

describe('Document Routes', () => {
  let documentId: string;
  let authToken: string;
  let userId: string;

  const testDocument = {
    documentId: `doc_${Date.now()}`,
    type: 'ID Card',
    title: 'National ID',
    documentNumber: 'DOC123',
    status: 'pending',
    link: 'http://example.com/doc',
    userId: '' // Will be set in beforeAll
  };

  beforeAll(async () => {
    // Register and login to get auth token
    const user = {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'kebele_admin',
      phone: '1234567890',
      address: 'Admin Address',
      status: 'approved'
    };

    // Register admin user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send(user);
    
    userId = registerRes.body.data.userId;
    testDocument.userId = userId;

    // Login to get token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: user.email,
        password: user.password
      });
    
    authToken = loginRes.body.data.token;
  });

  test('POST /api/documents - Create document', async () => {
    const res = await request(app)
      .post('/api/documents')
      .set('Authorization', `Bearer ${authToken}`)
      .send(testDocument);
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('documentId');
    documentId = res.body.documentId;
  });

  test('GET /api/documents - Get all documents', async () => {
    const res = await request(app)
      .get('/api/documents')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/documents/user/:userId - Get user documents', async () => {
    const res = await request(app)
      .get(`/api/documents/user/${testDocument.userId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PUT /api/documents/:id - Update document', async () => {
    const updates = {
      title: 'Updated Title',
      status: 'approved'
    };

    const res = await request(app)
      .put(`/api/documents/${documentId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updates);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('title', 'Updated Title');
  });

  test('DELETE /api/documents/:id - Delete document', async () => {
    const res = await request(app)
      .delete(`/api/documents/${documentId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(res.status).toBe(204);
  });
}); 