# Mediterranean College Alumni Network

A web application for Mediterranean College alumni to connect, network, and stay updated with college news and events.

## Features

- User authentication (login, registration)
- Alumni directory with searching and filtering
- School information
- User profiles with education and professional details
- Admin dashboard for managing users, schools, and pending applications

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript, Bootstrap 5
- **Backend**: Node.js, Express.js
- **Authentication**: JWT (JSON Web Tokens)

## Installation

1. Clone the repository:
```
git clone <repository-url>
```

2. Install dependencies:
```
npm install
```

3. Initialize the database:
```
npm run init-db
```
   
4. Start the server:
```
npm start
```

5. Access the application:
Open your browser and navigate to `http://localhost:3000`

## Login Credentials

### Admin User
- Email: admin@medcollege.edu
- Password: admin123

### Regular User
- Email: john.smith@example.com
- Password: password123

## API Endpoints

### Public Endpoints
- `GET /api/schools` - Get all schools
- `GET /api/users/alumni` - Get all public alumni profiles (with optional filtering)

### Authentication Endpoints
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/register` - Register a new alumni (creates pending application)

### Protected Endpoints (require authentication)
- `GET /api/users/:id` - Get a specific user profile
- `PUT /api/users/:id` - Update user profile

### Admin Endpoints (require admin authentication)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/pending-applications` - Get all pending applications
- `PUT /api/admin/applications/:id/approve` - Approve a pending application
- `PUT /api/admin/applications/:id/reject` - Reject a pending application
- `DELETE /api/admin/users/:id` - Delete a user
- `GET /api/admin/schools` - Get schools with admin details
- `PUT /api/admin/schools/:id` - Update a school
- `DELETE /api/admin/schools/:id` - Delete a school

## Project Structure

```
mediterranean-alumni/
├── client/                 # Frontend files
│   ├── css/                # CSS stylesheets
│   ├── images/             # Image assets
│   ├── js/                 # JavaScript files
│   └── index.html          # Main HTML file
├── database/               # Database files (not used in this demo)
├── server/                 # Server-side folder structure (not used in this demo)
└── server.js               # Express server implementation
```

## Development

For development with auto-restart on file changes:
```
npm run dev
```

