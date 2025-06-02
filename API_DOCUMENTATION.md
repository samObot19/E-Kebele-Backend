# E-Kebele API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Role Hierarchy
- `kebele_admin`: Has access to all features
- `goxe_admin`: Can manage residents and verify documents
- `resident`: Basic user role with limited access

## Endpoints

### Authentication Routes

#### 1. Register User
```http
POST /auth/register
```
Register a new user in the system.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string",
  "address": "string",
  "role": "resident" | "goxe_admin" | "kebele_admin"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "userId": "string",
      "name": "string",
      "email": "string",
      "role": "string",
      "status": "pending"
    },
    "token": "string"
  }
}
```

#### 2. Login User
```http
POST /auth/login
```
Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "string",
    "user": {
      "userId": "string",
      "name": "string",
      "email": "string",
      "role": "string",
      "status": "string"
    }
  }
}
```

#### 3. Google OAuth Login
```http
GET /auth/google
```
Initiate Google OAuth authentication flow.

#### 4. Google OAuth Callback
```http
GET /auth/google/callback
```
Handle Google OAuth callback and authentication.

**Response:**
Redirects to frontend with token:
```
http://localhost:3000/auth/callback?token=<jwt_token>
```

### User Routes

#### 1. Get All Users
```http
GET /users
```
Get a list of all users (Admin only).

**Authentication:** Required (Admin)  
**Response (200):** Array of user objects

#### 2. Get User by ID
```http
GET /users/:userId
```
Get user details by ID.

**Authentication:** Required  
**Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "status": "string",
    "phone": "string",
    "address": "string"
  }
}
```

#### 3. Get User by Email
```http
GET /users/email/:email
```
Get user details by email (Admin only).

**Authentication:** Required (Admin)  
**Response (200):** User object

#### 4. Update User
```http
PUT /users/:userId
```
Update user details.

**Authentication:** Required  
**Request Body:** Partial user object  
**Response (200):** Updated user object

#### 5. Delete User
```http
DELETE /users/:userId
```
Delete a user (Kebele Admin only).

**Authentication:** Required (Kebele Admin)  
**Response (204):** No content

### Document Routes

#### 1. Create Document
```http
POST /documents
```
Create a new document.

**Authentication:** Required (Admin)  
**Request Body:**
```json
{
  "type": "string",
  "title": "string",
  "documentNumber": "string",
  "status": "string",
  "link": "string",
  "userId": "string",
  "description": "string (optional)",
  "issuedDate": "date (optional)",
  "expiryDate": "date (optional)",
  "metadata": "object (optional)"
}
```

**Response (201):** Created document object

#### 2. Get All Documents
```http
GET /documents
```
Get all documents (Admin only).

**Authentication:** Required (Admin)  
**Response (200):** Array of document objects

#### 3. Get User Documents
```http
GET /documents/user/:userId
```
Get documents for a specific user.

**Authentication:** Required  
**Response (200):** Array of document objects

#### 4. Update Document
```http
PUT /documents/:id
```
Update a document.

**Authentication:** Required (Admin)  
**Request Body:** Partial document object  
**Response (200):** Updated document object

#### 5. Delete Document
```http
DELETE /documents/:id
```
Delete a document.

**Authentication:** Required (Kebele Admin)  
**Response (204):** No content

## Error Responses

### Common Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Array of error messages (optional)"]
}
```

### Status Codes
- `200`: Success
- `201`: Created
- `204`: No Content
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Rate Limiting
- None implemented currently

## Notes
1. All timestamps are in ISO 8601 format
2. All IDs are strings
3. Authentication uses JWT tokens
4. Google OAuth is available for alternative authentication
5. Role-based access control is implemented for all routes 