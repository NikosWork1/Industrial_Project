# API Routes Documentation

## Authentication Routes (`/api/auth`)

### Registration Endpoint

**POST** `/api/auth/register`

Creates a new user account with pending status, requiring admin approval.

#### Request Body

```json
{
  "firstName": "string",      // Required
  "lastName": "string",       // Required
  "email": "string",          // Required, must be unique
  "password": "string",       // Required, minimum 6 characters
  "schoolId": "number",       // Required, must be valid school ID
  "graduationYear": "number", // Optional
  "degree": "string",         // Optional
  "currentPosition": "string",// Optional
  "company": "string",        // Optional
  "bio": "string",            // Optional
  "linkedinUrl": "string",    // Optional
  "isPublic": "boolean"       // Optional, defaults to true
}
```

#### Responses

**201 Created**
```json
{
  "success": true,
  "message": "Registration successful. Your account is pending approval by an administrator.",
  "userId": 123
}
```

**400 Bad Request**
- Missing required fields:
```json
{
  "success": false,
  "message": "Missing required fields",
  "missingFields": ["password", "schoolId"]
}
```
- Invalid email format:
```json
{
  "success": false,
  "message": "Invalid email format"
}
```
- Password too short:
```json
{
  "success": false,
  "message": "Password must be at least 6 characters long"
}
```
- Invalid school ID:
```json
{
  "success": false,
  "message": "Invalid school selected"
}
```

**409 Conflict**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Registration failed. Please try again later."
}
```

#### Features

1. **Required Field Validation**: Ensures all required fields are present
2. **Email Validation**: Validates email format and checks for duplicates (case-insensitive)
3. **Password Security**: Requires minimum 6 characters and hashes using bcrypt (10 rounds)
4. **School Validation**: Verifies the school ID exists in the database
5. **Data Sanitization**: Trims whitespace from all string fields
6. **Error Handling**: Provides detailed error messages for all validation failures
7. **Pending Status**: All new users start with 'pending' role requiring admin approval

### Login Endpoint

**POST** `/api/auth/login`

Authenticates a user and returns a JWT token.

#### Request Body

```json
{
  "email": "string",    // Required
  "password": "string"  // Required
}
```

#### Responses

**200 OK**
```json
{
  "success": true,
  "token": "JWT_TOKEN_HERE",
  "user": {
    "id": 123,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "schoolId": 1,
    "schoolName": "Mediterranean College Athens",
    // ... other user fields (without password)
  },
  "message": "Login successful"
}
```

**400 Bad Request**
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**403 Forbidden**
```json
{
  "success": false,
  "message": "Your account is pending approval. Please wait for an administrator to approve your registration."
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Login failed. Please try again later."
}
```

#### Features

1. **Email Case-Insensitive**: Login works with any case variation of the email
2. **Pending Account Check**: Prevents login for accounts pending approval
3. **Last Login Update**: Updates the user's last login timestamp
4. **JWT Token**: Includes user info in the token for authentication
5. **Secure Response**: Never returns password in response data