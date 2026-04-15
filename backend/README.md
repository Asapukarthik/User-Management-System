# User Management System - Backend

A complete Node.js/Express backend with MongoDB integration featuring comprehensive authentication, authorization, and role-based access control.

## Features

✅ **Authentication System**

- User registration with email/username
- Login with email OR username
- JWT access tokens (1 day expiration)
- Refresh token support (7 days expiration)
- Secure password hashing with bcrypt
- Automatic token refresh
- Logout functionality

✅ **Role-Based Access Control (RBAC)**

- **Admin Role**: Full system access
  - View all users
  - Search and filter users
  - Create users
  - Update users
  - Delete users
  - Change user roles
  - Activate/deactivate users

- **Manager Role**: Limited management access
  - View users (excluding admins)
  - Search and filter users (excluding admins)
  - Update users (excluding admins)
  - Cannot delete or promote to admin

- **User Role**: Personal account access
  - View own profile
  - Edit own profile
  - Change password
  - Cannot see other users or change roles

✅ **Security Features**

- Password hashing with bcrypt
- JWT-based authentication
- Access & Refresh token system
- Account activation/deactivation
- Admin-only operations
- Role-based route protection

## Project Structure

```
backend/
├── config/
│   └── db.js                    # MongoDB connection
├── models/
│   └── User.js                  # User schema and methods
├── controllers/
│   ├── authController.js        # Auth endpoints (login, register, refresh)
│   ├── profileController.js     # User profile endpoints
│   ├── adminController.js       # Admin-only endpoints
│   ├── managerController.js     # Manager endpoints
│   └── userController.js        # Generic user endpoints
├── middleware/
│   ├── authMiddleware.js        # JWT verification
│   ├── roleMiddleware.js        # Role-based access control
│   └── errorMiddleware.js       # Global error handler
├── routes/
│   ├── authRoutes.js            # Authentication routes
│   ├── profileRoutes.js         # Profile routes
│   ├── adminRoutes.js           # Admin routes
│   ├── managerRoutes.js         # Manager routes
│   └── userRoutes.js            # User routes
├── seeds/
│   └── adminSeeder.js           # Database seeding script
├── server.js                     # Main server file
├── .env                          # Environment variables
├── package.json                  # Dependencies
└── API_DOCUMENTATION.md          # API reference
```

## Installation

### 1. Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Environment Setup

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/user-management
JWT_SECRET=your_secure_jwt_secret_key_here_change_in_production
JWT_EXPIRATION=1d
JWT_REFRESH_SECRET=your_secure_refresh_secret_key_here_change_in_production
JWT_REFRESH_EXPIRATION=7d
NODE_ENV=development
```

**Important:** Change the JWT secrets in production!

### 4. Database Seeding

Seed the database with test users:

```bash
npm run seed
```

This creates three test users:

- **Admin**: admin@example.com / admin123
- **Manager**: manager@example.com / manager123
- **User**: user@example.com / user123

## Running the Server

### Development (with auto-reload)

```bash
npm run dev
```

### Production

```bash
npm start
```

The server will start on `http://localhost:5000`

### Health Check

```bash
GET http://localhost:5000/api/health
```

Response:

```json
{
  "success": true,
  "message": "Server is running"
}
```

## API Endpoints Overview

### Authentication (`/api/auth`)

- `POST /register` - Register new user
- `POST /login` - Login with email/username
- `POST /refresh-token` - Get new access token
- `POST /logout` - Logout user

### Profile (`/api/profile`)

- `GET /` - Get own profile
- `PUT /` - Update own profile
- `PUT /change-password` - Change password

### Admin (`/api/admin`)

- `GET /users` - List all users with filters
- `POST /users` - Create user
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `PUT /users/:id/role` - Change user role
- `PUT /users/:id/toggle-status` - Activate/deactivate user
- `DELETE /users/:id` - Delete user

### Manager (`/api/manager`)

- `GET /users` - List users (excluding admins)
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user (excluding admins)

For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Usage Examples

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "passwordConfirm": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### Get Profile (Authenticated)

```bash
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer {accessToken}"
```

### Admin: Get All Users

```bash
curl -X GET "http://localhost:5000/api/admin/users?search=john&role=user" \
  -H "Authorization: Bearer {adminAccessToken}"
```

### Admin: Create User

```bash
curl -X POST http://localhost:5000/api/admin/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {adminAccessToken}" \
  -d '{
    "name": "New User",
    "email": "newuser@example.com",
    "password": "password123",
    "role": "user"
  }'
```

## Authentication Flow

1. **Register/Login**: User receives `accessToken` and `refreshToken`
2. **Access Protected Routes**: Include token in Authorization header
   ```
   Authorization: Bearer {accessToken}
   ```
3. **Token Expiration**: When access token expires, use refresh token to get new one
4. **Logout**: Optional - invalidates refresh tokens

## Error Handling

All errors return a consistent JSON format:

```json
{
  "success": false,
  "message": "Error description"
}
```

## Security Considerations

- ✅ Passwords are hashed with bcrypt
- ✅ JWT tokens are used for stateless authentication
- ✅ Refresh tokens are stored in database
- ✅ Role-based access control on all endpoints
- ✅ Account activation/deactivation support
- ✅ Input validation on all routes
- ⚠️ Always use HTTPS in production
- ⚠️ Keep JWT secrets secure and change them regularly
- ⚠️ Use environment variables for all secrets

## Dependencies

```json
{
  "express": "^4.18.2",
  "mongoose": "^7.0.3",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.0",
  "cors": "^2.8.5",
  "dotenv": "^16.0.3"
}
```

### Dev Dependencies

```json
{
  "nodemon": "^2.0.20"
}
```

## Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify network access (if using MongoDB Atlas)

### JWT Token Errors

- Verify token format: `Bearer {token}`
- Check token expiration
- Ensure `JWT_SECRET` matches in `.env`

### 403 Unauthorized Errors

- Verify user role has permission
- Check that user account is active
- Ensure correct token is being used

## Next Steps

1. Set up frontend to consume these APIs
2. Implement email verification
3. Add password reset functionality
4. Set up logging and monitoring
5. Add rate limiting for security
6. Implement audit logs for admin actions
7. Add two-factor authentication (2FA)

## License

ISC

## Support

For issues or questions, please refer to the API documentation or create an issue in the repository.
