
# COMP229 - Assignment 3
## Full-Stack Portfolio Integration

This project is a full-stack personal portfolio application developed using the MERN stack for COMP229 - Web Application Development at Centennial College.

The application connects a React frontend to a Node.js and Express backend, using MongoDB Atlas for persistent data storage.

## Technologies

- React and Vite
- JavaScript, HTML, and CSS
- Node.js and Express
- MongoDB Atlas and Mongoose
- JSON Web Tokens (JWT)
- bcryptjs for password hashing
- React Router
- Git and GitHub

## Features

### Public Portfolio
- Home, About, Projects, Education, Services, and Contact pages
- Projects loaded dynamically through the backend API
- Qualifications loaded dynamically through the backend API
- Public contact form submission
- Responsive portfolio interface

### Authentication
- User registration
- User login
- JWT-based authentication
- Password hashing with bcryptjs
- Session-based token storage on the frontend
- Logout functionality
- Authenticated user information endpoint

### Administrator Dashboard
- Administrator-only dashboard
- Create, read, update, and delete projects
- Create, read, update, and delete qualifications
- View, update, and delete contact messages
- Role-based frontend access restrictions
- Backend authorization middleware

### User Permissions
- Visitors can view public projects and qualifications
- Visitors can submit contact messages
- Registered users can view public portfolio information
- Administrators can manage projects and qualifications
- Only administrators can retrieve, update, and delete contacts

## Project Structure

- client/ - React and Vite frontend
- client/src/pages/ - Portfolio and management pages
- client/src/components/ - Shared React components
- server/ - Express API implementation
- server/controllers/ - Request handling and database operations
- server/models/ - MongoDB schemas
- server/routes/ - API routes
- server/middleware/ - Authentication and administrator authorization
- server/seedAdmin.js - Administrator account initialization
- config/ - Backend configuration
- server.js - Backend entry point

## Installation

Requirements:
- Node.js and npm
- MongoDB Atlas connection
- Git (optional)

1. Clone the repository:

   git clone https://github.com/J0RDYJ0K3R/MyPortfolio.git

2. Navigate into the project directory:

   cd MyPortfolio

3. Install backend dependencies:

   npm install

4. Install frontend dependencies:

   npm install --prefix client

5. Copy the root `.env.example` file to `.env`.

6. Configure MONGO_URI, JWT_SECRET, CLIENT_ORIGIN, and administrator credentials.

7. Start the application:

   npm run dev

## Local Development

React frontend:
http://localhost:5173

Express backend:
http://localhost:5000

The backend connects to MongoDB Atlas using the MONGO_URI environment variable.

## Administrator Setup

To create the initial administrator account, configure ADMIN_EMAIL and ADMIN_PASSWORD in the root `.env` file.

Run:

   node server/seedAdmin.js

The seed script creates an administrator if an account with that email does not already exist.

The administrator can sign in using the configured credentials.

## API Endpoints

### Authentication

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

### Projects

- GET /api/projects - Public
- GET /api/projects/:id - Public
- POST /api/projects - Administrator
- PUT /api/projects/:id - Administrator
- DELETE /api/projects/:id - Administrator

### Qualifications

- GET /api/qualifications - Public
- GET /api/qualifications/:id - Public
- POST /api/qualifications - Administrator
- PUT /api/qualifications/:id - Administrator
- DELETE /api/qualifications/:id - Administrator

### Contacts

- POST /api/contacts - Public
- GET /api/contacts - Administrator
- GET /api/contacts/:id - Administrator
- PUT /api/contacts/:id - Administrator
- DELETE /api/contacts/:id - Administrator

Protected routes require an Authorization header containing a valid Bearer token.

The project also contains authenticated user-management API routes.

## Testing

The application was tested using the React frontend, PowerShell REST requests, and MongoDB Atlas.

Verified functionality includes:
- Successful user registration and login
- Administrator JWT authentication
- Rejection of unauthenticated and unauthorized API requests
- Administrator project CRUD operations
- Administrator qualification CRUD operations
- Public contact submission and administrator management
- Dynamic project and qualification retrieval
- Regular-user access restrictions
- Successful Vite production build

Build the frontend using:

   npm run build --prefix client

## Security

- Passwords are hashed using bcryptjs.
- JWTs are used for protected API requests.
- Administrator permissions are enforced by backend middleware.
- The root `.env` file is excluded from Git.
- Credentials and JWT secrets must not be committed.
- JWT logout removes the client token but does not revoke an issued JWT before expiry.
- Additional hardening is recommended before public production deployment.

## Submission

Assignment 3 deliverables:

1. Complete project ZIP archive.
2. GitHub repository URL.
3. Word document containing screenshots and brief evidence captions.

GitHub Repository:
https://github.com/J0RDYJ0K3R/MyPortfolio
