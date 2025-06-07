# Jury Selection System Backend

A robust Node.js backend with Express.js, PostgreSQL, and Prisma ORM for handling jury selection and authentication.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

## Setup Requirements

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd jury-selection
   ```

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

## Development

To start development:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server with hot reload:
   ```bash
   npm run dev
   ```

3. For production:
   ```bash
   npm start
   ```