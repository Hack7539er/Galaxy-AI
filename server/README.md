# Galaxy AI - Backend Server

A robust Node.js Express server with MongoDB integration, JWT authentication, and CORS support for the Galaxy AI application.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
  - [Authentication Endpoints](#authentication-endpoints)
- [Database Schema](#database-schema)
- [Architecture](#architecture)
- [Error Handling](#error-handling)
- [Security Features](#security-features)
- [Development](#development)
- [Deployment](#deployment)

---

## Features

✅ **User Authentication** - Secure registration and login with JWT tokens  
✅ **Password Hashing** - Bcrypt integration for secure password storage  
✅ **HTTP-Only Cookies** - Secure session management with HTTP-only cookies  
✅ **CORS Support** - Cross-Origin Resource Sharing for multiple frontend origins  
✅ **MongoDB Integration** - Scalable database with Mongoose ODM  
✅ **JWT Middleware** - Protected routes with token verification  
✅ **Environment Configuration** - Centralized config management  

---

## Prerequisites

- **Node.js** - v18.0.0 or higher
- **npm** - v9.0.0 or higher
- **MongoDB** - Local or cloud instance (MongoDB Atlas)
- **Git** - For version control

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Hack7539er/Galaxy-AI.git
cd Galaxy-AI/server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

Create a `.env` file in the server root directory:

```env
# Server Configuration
SERVER_RUNNING_PORT=5000

# CORS Configuration (comma-separated origins)
ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5174

# MongoDB Configuration
MONGO_DB_URL=mongodb+srv://username:password@cluster.mongodb.net/galaxy-ai

# JWT Configuration
JWT_SECRET_TOKEN_GENERATE_KEY=your-secure-secret-key-here-min-32-chars

# Environment
NODE_ENV=development
```

### 4. Start the Server

**Development Mode** (with auto-reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

The server will start at `http://localhost:5000`

---

## Environment Variables

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `SERVER_RUNNING_PORT` | number | Port for server to run on | `5000` |
| `ORIGINS` | string | Comma-separated CORS allowed origins | `http://localhost:3000,http://localhost:5173` |
| `MONGO_DB_URL` | string | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET_TOKEN_GENERATE_KEY` | string | Secret key for JWT signing | `your-secret-key-min-32-chars` |
| `NODE_ENV` | string | Deployment environment | `development` or `production` |

---

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── configs.js           # Environment configuration manager
│   ├── controllers/
│   │   └── Authentication.Controller.js  # Request handlers for auth routes
│   ├── lib/
│   │   └── database.js          # MongoDB connection setup
│   ├── middleware/
│   │   └── Authentication.Middleware.js  # JWT verification middleware
│   ├── models/
│   │   └── User.Model.js        # Mongoose User schema and methods
│   └── routes/
│       └── Authentication.Routes.js      # Express route definitions
├── .env                         # Environment variables
├── .env.example                 # Example environment file
├── package.json                 # Project dependencies
├── package-lock.json            # Locked dependency versions
├── server.js                    # Main application entry point
└── README.md                    # This file
```

---

## API Endpoints

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Register User

**Endpoint:** `POST /api/auth/register`

**Description:** Create a new user account with name, email, and password.

**Request Headers:**
```http
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (201 Created):**
```json
{
  "user": {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Set-Cookie Header:**
```
Set-Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Lax; Max-Age=604800; Path=/
```

**Error Responses:**

- **400 Bad Request** - Missing required fields
```json
{
  "Error": "Name, Email, Password Are Required For Register."
}
```

- **409 Conflict** - Email already exists
```json
{
  "Error": "User Already Exists With This \"john@example.com\" Email Address. Try Again With Different Email Address."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

**JavaScript Fetch Example:**
```javascript
const registerUser = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePassword123!'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Registration successful:', data.user);
    } else {
      console.error('Registration failed:', data.Error);
    }
  } catch (error) {
    console.error('Request error:', error);
  }
};

registerUser();
```

---

#### 2. Login User

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate an existing user with email and password.

**Request Headers:**
```http
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200 OK):**
```json
{
  "user": {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Set-Cookie Header:**
```
Set-Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Lax; Max-Age=604800; Path=/
```

**Error Responses:**

- **400 Bad Request** - Missing required fields
```json
{
  "Error": "Email, Password Are Required For Login."
}
```

- **401 Unauthorized** - Invalid email or password
```json
{
  "Error": "The Password, Email Are Invalid Please Check Your Email, Password."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

**JavaScript Fetch Example:**
```javascript
const loginUser = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email: 'john@example.com',
        password: 'SecurePassword123!'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Login successful:', data.user);
      // Token is automatically stored in cookies
    } else {
      console.error('Login failed:', data.Error);
    }
  } catch (error) {
    console.error('Request error:', error);
  }
};

loginUser();
```

---

#### 3. Logout User

**Endpoint:** `POST /api/auth/logout`

**Description:** Logout the current user by clearing the authentication cookie.

**Request Headers:**
```http
Cookie: token=<jwt-token>
```

**Request Body:**
```json
{}
```

**Success Response (200 OK):**
```json
{
  "success": true
}
```

**Set-Cookie Header (Clear):**
```
Set-Cookie: token=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -b cookies.txt
```

**JavaScript Fetch Example:**
```javascript
const logoutUser = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Logout successful');
      // Token is cleared from cookies
    } else {
      console.error('Logout failed:', data.Error);
    }
  } catch (error) {
    console.error('Request error:', error);
  }
};

logoutUser();
```

---

#### 4. Fetch User Profile

**Endpoint:** `GET /api/auth/fetchUser`

**Description:** Get the current authenticated user's profile information. Requires valid JWT token.

**Request Headers:**
```http
Cookie: token=<jwt-token>
```

**Success Response (200 OK):**
```json
{
  "user": {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-08-15T19:00:00.000Z",
    "updatedAt": "2024-08-15T19:00:00.000Z"
  }
}
```

**Error Responses:**

- **401 Unauthorized** - Missing or invalid token
```json
{
  "Error": "You Are Not Authenticated. Go To Login Or Register."
}
```

- **404 Not Found** - User not found in database
```json
{
  "Error": "User Not Found."
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/auth/fetchUser \
  -b cookies.txt
```

**JavaScript Fetch Example:**
```javascript
const fetchUserProfile = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/fetchUser', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('User profile:', data.user);
    } else {
      console.error('Failed to fetch profile:', data.Error);
    }
  } catch (error) {
    console.error('Request error:', error);
  }
};

fetchUserProfile();
```

---

## Database Schema

### User Collection

**Schema Definition:**
```javascript
{
  _id: ObjectId,
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    hashed: true  // Hashed with bcrypt (salt rounds: 10)
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Example Document:**
```json
{
  "_id": ObjectId("64f8a1b2c3d4e5f6g7h8i9j0"),
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2b$10$abcdefghijklmnopqrstuvwxyz",
  "createdAt": ISODate("2024-08-15T19:00:00.000Z"),
  "updatedAt": ISODate("2024-08-15T19:00:00.000Z")
}
```

---

## Architecture

### Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js 5.x
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** Bcrypt
- **Middleware:** CORS, Cookie Parser
- **Environment:** dotenv

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                       │
└─────────────────────────────────────────────────────────────┘

1. USER REGISTRATION
   ├── Client sends: name, email, password
   ├── Server validates input
   ├── Server checks email uniqueness
   ├── Server hashes password with bcrypt (10 salt rounds)
   ├── Server stores user in MongoDB
   ├── Server creates JWT token
   ├── Server sets token in HTTP-only cookie
   └── Client receives user data (password excluded)

2. USER LOGIN
   ├── Client sends: email, password
   ├── Server finds user by email
   ├── Server compares password with stored hash
   ├── Server creates JWT token
   ├── Server sets token in HTTP-only cookie
   └── Client receives user data (password excluded)

3. PROTECTED ROUTES
   ├── Client sends request with token in cookie
   ├── Middleware verifies JWT token
   ├── Middleware decodes token and attaches user to request
   ├── Route handler processes authenticated request
   └── Response returned to client

4. USER LOGOUT
   ├── Client sends logout request
   ├── Server clears token cookie (Max-Age: 0)
   └── Client can no longer access protected routes
```

### Request/Response Cycle

```
Client Request
    ↓
Express Parser (JSON + Cookies)
    ↓
CORS Middleware (Origin Check)
    ↓
Route Matching
    ↓
Authentication Middleware (if protected route)
    ↓
Controller Handler
    ↓
Database Operation (Mongoose)
    ↓
Response Formatting
    ↓
Cookie Setting (if needed)
    ↓
JSON Response
```

---

## Error Handling

### Status Codes

| Code | Message | Scenario |
|------|---------|----------|
| `200` | OK | Successful GET request |
| `201` | Created | Successful registration/login |
| `400` | Bad Request | Missing/invalid request fields |
| `401` | Unauthorized | Invalid/missing authentication token |
| `404` | Not Found | User not found |
| `409` | Conflict | Email already exists (duplicate) |
| `500` | Server Error | Unexpected server error |

### Error Response Format

All errors follow this format:

```json
{
  "Error": "Descriptive error message explaining what went wrong"
}
```

### Common Error Scenarios

**1. Missing Required Fields:**
```json
{
  "Error": "Name, Email, Password Are Required For Register."
}
```

**2. Invalid Credentials:**
```json
{
  "Error": "The Password, Email Are Invalid Please Check Your Email, Password."
}
```

**3. Duplicate Email:**
```json
{
  "Error": "User Already Exists With This \"john@example.com\" Email Address. Try Again With Different Email Address."
}
```

**4. Unauthenticated Request:**
```json
{
  "Error": "You Are Not Authenticated. Token Not Found Go To Login/Register First."
}
```

---

## Security Features

### 1. Password Security
- ✅ Bcrypt hashing with 10 salt rounds
- ✅ Password never stored in plain text
- ✅ Passwords excluded from all responses

### 2. JWT Security
- ✅ HTTP-only cookies (XSS protection)
- ✅ Secure flag in production (HTTPS only)
- ✅ SameSite=Lax (CSRF protection)
- ✅ 7-day expiration
- ✅ Secret key required for verification

### 3. CORS Protection
- ✅ Whitelist of allowed origins
- ✅ Credentials allowed only from trusted sources
- ✅ Configurable per environment

### 4. Database Security
- ✅ MongoDB connection string in environment
- ✅ Unique indexes on email and name
- ✅ Trimmed and lowercase email normalization

### 5. Input Validation
- ✅ Required field validation
- ✅ Email format validation
- ✅ Password strength requirements (recommended)

---

## Development

### Running the Server

**Development Mode** (with hot-reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

### Testing Endpoints

#### Using Postman

1. Import the collection from `/postman` folder
2. Set environment variables in Postman
3. Run requests sequentially

#### Using Thunder Client (VS Code)

1. Install Thunder Client extension
2. Create new collection
3. Add requests following API documentation above

#### Using REST Client (VS Code)

Create a `requests.http` file:

```http
### Register User
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}

### Login User
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}

### Fetch User (requires valid token from login)
GET http://localhost:5000/api/auth/fetchUser
```

### Environment Setup for Development

Create `.env.development`:
```env
SERVER_RUNNING_PORT=5000
ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5174
MONGO_DB_URL=mongodb://localhost:27017/galaxy-ai-dev
JWT_SECRET_TOKEN_GENERATE_KEY=dev-secret-key-min-32-chars
NODE_ENV=development
```

### Debugging

Enable detailed logging by adding to `server.js`:

```javascript
import morgan from 'morgan';

server.use(morgan('dev')); // Log all requests
```

---

## Deployment

### Prerequisites

- MongoDB Atlas account (or MongoDB server)
- Node.js hosting (Render, Railway, Heroku, AWS, etc.)
- Environment variables configured on hosting platform

### Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure production MongoDB URL
- [ ] Set strong JWT secret key (min 32 characters)
- [ ] Set production frontend origins in CORS
- [ ] Enable HTTPS (secure cookies)
- [ ] Set SameSite=Strict in production (if same-domain)
- [ ] Enable rate limiting (recommended)
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure logging and monitoring
- [ ] Test all endpoints in production

### Environment Variables for Production

```env
SERVER_RUNNING_PORT=5000
ORIGINS=https://yourdomain.com,https://www.yourdomain.com
MONGO_DB_URL=mongodb+srv://username:password@cluster.mongodb.net/galaxy-ai
JWT_SECRET_TOKEN_GENERATE_KEY=your-very-secure-secret-key-here-min-32-chars
NODE_ENV=production
```

### Deployment Command

```bash
git push <hosting-platform>
```

The platform will automatically:
1. Install dependencies (`npm install`)
2. Run start script (`npm start`)
3. Start the server on assigned port

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use ESM imports/exports
- Follow existing naming conventions
- Add JSDoc comments for all functions
- Keep functions single-responsibility

---

## License

This project is part of Galaxy AI. All rights reserved.

---

## Support

For issues and questions:
- 📧 Email: support@galaxyai.com
- 🐛 GitHub Issues: [Report a bug](https://github.com/Hack7539er/Galaxy-AI/issues)
- 💬 Discussions: [Ask a question](https://github.com/Hack7539er/Galaxy-AI/discussions)

---

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose ODM](https://mongoosejs.com/)
- [JWT Guide](https://jwt.io/)
- [Bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)

---

**Last Updated:** August 15, 2024  
**Version:** 1.0.0  
**Maintainer:** Galaxy AI Team
