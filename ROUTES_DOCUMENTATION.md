# E-Kebele API Routes Documentation

## Table of Contents
- [Authentication Routes](#authentication-routes)
- [User Routes](#user-routes)
- [Document Routes](#document-routes)

## Base Configuration

### Base URL
```
http://localhost:5000/api
```

### Authentication Header
For protected routes, include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Response Format
Standard success response:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Standard error response:
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Detailed error messages"]
}
```

## Authentication Routes
Base path: `/api/auth`

### 1. Register User
```http
POST /auth/register
```
Register a new user in the system.

**Access:** Public  
**Description:** Creates a new user account with pending status.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "phone": "+251912345678",
  "address": "Addis Ababa, Ethiopia",
  "role": "resident"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "userId": "user_1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "resident",
      "status": "pending"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Responses:**
- `400`: Missing or invalid fields
- `409`: Email already exists

### 2. Login User
```http
POST /auth/login
```
Authenticate a user and receive a JWT token.

**Access:** Public  
**Description:** Authenticates user credentials and returns a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "userId": "user_1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "resident",
      "status": "approved"
    }
  }
}
```

**Error Responses:**
- `400`: Missing credentials
- `401`: Invalid credentials
- `403`: Account pending approval

### 3. Google OAuth Login
```http
GET /auth/google
```
Initiate Google OAuth authentication flow.

**Access:** Public  
**Description:** Redirects to Google login page.

**Query Parameters:** None  
**Response:** Redirects to Google authentication page

### 4. Google OAuth Callback
```http
GET /auth/google/callback
```
Handle Google OAuth callback.

**Access:** Public  
**Description:** Processes Google authentication response and creates/updates user account.

**Success Response:** Redirects to frontend with token
```
http://localhost:3000/auth/callback?token=eyJhbGciOiJIUzI1NiIs...
```

**Error Response:** Redirects to error page
```
http://localhost:3000/auth/error?message=Authentication%20failed
```

## User Routes
Base path: `/api/users`

### 1. Get All Users
```http
GET /users
```
Retrieve all users in the system.

**Access:** Admin only  
**Description:** Returns a list of all users.

**Headers Required:**
- Authorization: Bearer token

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "userId": "user_1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "resident",
      "status": "approved",
      "phone": "+251912345678",
      "address": "Addis Ababa, Ethiopia"
    },
    // ... more users
  ]
}
```

### 2. Get User by ID
```http
GET /users/:userId
```
Get details of a specific user.

**Access:** Authenticated (Own profile or Admin)  
**Description:** Returns detailed information about a specific user.

**URL Parameters:**
- userId: The ID of the user to retrieve

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "user_1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "resident",
    "status": "approved",
    "phone": "+251912345678",
    "address": "Addis Ababa, Ethiopia"
  }
}
```

### 3. Update User
```http
PUT /users/:userId
```
Update user information.

**Access:** Authenticated (Own profile or Admin)  
**Description:** Updates user details.

**Request Body:** (all fields optional)
```json
{
  "name": "John Updated Doe",
  "phone": "+251987654321",
  "address": "Updated Address"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "userId": "user_1234567890",
    "name": "John Updated Doe",
    "email": "john@example.com",
    "role": "resident",
    "status": "approved",
    "phone": "+251987654321",
    "address": "Updated Address"
  }
}
```

## Document Routes
Base path: `/api/documents`

### 1. Create Document
```http
POST /documents
```
Create a new document.

**Access:** Admin only  
**Description:** Creates a new document in the system.

**Request Body:**
```json
{
  "type": "ID Card",
  "title": "National ID",
  "documentNumber": "ID123456",
  "status": "pending",
  "link": "http://example.com/documents/id123456",
  "userId": "user_1234567890",
  "description": "National ID card application",
  "issuedDate": "2024-03-15T00:00:00.000Z",
  "expiryDate": "2029-03-14T00:00:00.000Z",
  "metadata": {
    "idType": "national",
    "issuingAuthority": "Federal"
  }
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Document created successfully",
  "data": {
    "documentId": "doc_1234567890",
    // ... all document fields
  }
}
```

### 2. Get User Documents
```http
GET /documents/user/:userId
```
Get all documents for a specific user.

**Access:** Authenticated (Own documents or Admin)  
**Description:** Returns all documents associated with a user.

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "documentId": "doc_1234567890",
      "type": "ID Card",
      "title": "National ID",
      "status": "pending",
      // ... other document fields
    },
    // ... more documents
  ]
}
```

### 3. Update Document Status
```http
PUT /documents/:id
```
Update document information or status.

**Access:** Admin only  
**Description:** Updates document details or status.

**Request Body:**
```json
{
  "status": "approved",
  "metadata": {
    "approvedBy": "admin_user_id",
    "approvalDate": "2024-03-16T00:00:00.000Z"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Document updated successfully",
  "data": {
    "documentId": "doc_1234567890",
    "status": "approved",
    // ... other document fields
  }
}
```

## Role-Based Access Control

### Role Hierarchy
1. `kebele_admin`
   - Can perform all operations
   - Can approve/reject goxe_admin registrations
   - Can manage all documents

2. `goxe_admin`
   - Can approve/reject resident registrations
   - Can view and manage resident documents
   - Cannot modify kebele_admin data

3. `resident`
   - Can view own profile and documents
   - Can submit document requests
   - Cannot access other users' data

### Status Types
1. User Status:
   - `pending`: Newly registered, awaiting approval
   - `approved`: Account verified and active
   - `rejected`: Registration rejected
   - `suspended`: Account temporarily disabled

2. Document Status:
   - `pending`: Newly created document
   - `in_review`: Under admin review
   - `approved`: Document verified and active
   - `rejected`: Document request rejected
   - `expired`: Document past expiry date

## Error Handling

### Common Error Codes
- `400`: Bad Request (Invalid input)
- `401`: Unauthorized (No token)
- `403`: Forbidden (Insufficient permissions)
- `404`: Not Found
- `409`: Conflict (Resource already exists)
- `500`: Internal Server Error

### Error Response Format
```json
{
  "success": false,
  "message": "Main error message",
  "errors": [
    "Detailed error 1",
    "Detailed error 2"
  ]
}
```

## Security Considerations
1. All routes except authentication endpoints require JWT authentication
2. Passwords are hashed before storage
3. JWT tokens expire after 24 hours
4. Role-based access control is strictly enforced
5. Input validation is performed on all requests 