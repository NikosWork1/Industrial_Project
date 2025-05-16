# Login API Integration

## Overview

The login functionality has been updated to use real API calls instead of mock data. The client-side JavaScript now makes a proper fetch request to the server endpoint `/api/auth/login` and handles JWT token storage and management.

## Implementation Details

### JavaScript Function Location
- File: `/client/js/auth.js`
- Function: Login form event handler (lines 98-225)
- JWT token parsing: lines 11-58

### API Endpoint
- URL: `/api/auth/login`
- Method: POST
- Content-Type: application/json

### Form Field IDs
The login function expects the following form field IDs:
- `login-email` - Email input
- `login-password` - Password input

### Request Format
```json
{
  "email": "string",
  "password": "string"
}
```

### Response Handling

#### Success Response (200)
```json
{
  "success": true,
  "token": "JWT_TOKEN_STRING",
  "user": {
    "id": 123,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "schoolId": 1,
    "schoolName": "School Name",
    // ... other user fields
  },
  "message": "Login successful"
}
```

#### Error Responses

**400 Bad Request**
- Missing email or password

**401 Unauthorized**
- Invalid credentials

**403 Forbidden**
- Account pending approval

**500 Server Error**
- General server error

### JWT Token Management

1. **Token Storage**: The JWT token is stored in localStorage with key `authToken`
```javascript
localStorage.setItem('authToken', data.token);
```

2. **Token Parsing**: On page load, the token is parsed to extract user info
```javascript
const tokenParts = authToken.split('.');
const payload = JSON.parse(atob(tokenParts[1]));
```

3. **Token Validation**: Checks for proper format and expiration
```javascript
if (payload.exp && payload.exp * 1000 < Date.now()) {
    // Token expired
}
```

### User Interface Updates

After successful login:
1. Stores JWT token in localStorage
2. Parses user data from response
3. Updates UI elements:
   - Hides auth buttons
   - Shows user profile dropdown
   - Shows admin link if user is admin
   - Updates user name display
4. Clears the login form
5. Redirects to home page after 500ms delay

### Error Handling

The function provides user-friendly error messages:
- "Please enter both email and password"
- "Invalid email or password. Please try again."
- "Your account is pending approval..."
- "Cannot connect to server. Please check your connection."

### Loading States

Shows loading indicator during login:
```javascript
window.loading.show('login-form', 'Logging in...');
// ... API call ...
window.loading.hide('login-form');
```

### Logout Functionality

The logout function:
1. Clears the JWT token from localStorage
2. Clears the current user object
3. Updates UI to logged-out state
4. Redirects to home page
5. Shows confirmation message

### Security Considerations

1. Passwords are never stored in localStorage
2. JWT tokens are validated for format and expiration
3. Invalid tokens are automatically removed
4. Sensitive operations require valid authentication

## Testing

To test the login functionality:

1. Include the test file in your HTML:
```html
<script src="/js/test-login-workflow.js"></script>
```

2. Use the test buttons that appear in the bottom left corner:
   - Test Successful Login
   - Test Error Scenarios
   - Test UI Login
   - Validate Token

3. Or use the console:
```javascript
// Test successful login
loginTests.testSuccessfulLogin();

// Test error scenarios
loginTests.testLoginErrors();

// Validate current token
loginTests.testTokenValidation();
```

## Migration from Mock Data

The previous implementation used hardcoded credentials:
- Admin: `admin@medcollege.edu` / `admin123`
- User: `john.smith@example.com` / `password123`

The new implementation:
- Connects to real server endpoints
- Uses JWT tokens for authentication
- Maintains session across page refreshes
- Properly handles token expiration

## API Response Structure

### Successful Login Response
- `success`: boolean (true)
- `token`: JWT token string
- `user`: User object with all profile data
- `message`: Success message

### Error Response Structure
- `success`: boolean (false)
- `message`: Error description

## JWT Token Payload

The JWT token includes:
- `id`: User ID
- `email`: User email
- `role`: User role (admin/user/pending)
- `firstName`: User's first name
- `lastName`: User's last name
- `schoolId`: School ID
- `schoolName`: School name
- `exp`: Token expiration timestamp
- `iat`: Token issued timestamp

## Future Enhancements

Consider adding:
- Remember me functionality
- Two-factor authentication
- Password reset functionality
- Social login integration
- Session timeout warnings
- Refresh token implementation