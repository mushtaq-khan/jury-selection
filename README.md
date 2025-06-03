# Authentication Backend

A Node.js backend with Express.js, PostgreSQL, and Prisma ORM for handling user authentication.

## Features

- User registration and login
- JWT-based authentication
- Password reset functionality
- Profile management
- Email notifications for password reset

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/jury"
   JWT_SECRET="your-secret-key"
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-specific-password"
   FRONTEND_URL="http://localhost:3000"
   ```

4. Initialize the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Profile

- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

## Request Examples

### Signup
```json
POST /api/auth/signup
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Forgot Password
```json
POST /api/auth/forgot-password
{
  "email": "user@example.com"
}
```

### Reset Password
```json
POST /api/auth/reset-password
{
  "token": "reset-token",
  "newPassword": "newpassword123"
}
```

### Update Profile
```json
PUT /api/auth/profile
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "phoneNumber": "+1234567890"
}
```

## Security

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Email verification for password reset
- Protected routes using middleware

## Error Handling

The API includes comprehensive error handling for:
- Invalid credentials
- Duplicate email addresses
- Invalid tokens
- Database errors
- Server errors 