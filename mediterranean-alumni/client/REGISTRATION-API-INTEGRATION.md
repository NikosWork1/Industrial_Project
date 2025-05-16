# Registration API Integration

## Overview

The registration functionality has been updated to use real API calls instead of mock data. The client-side JavaScript now makes a proper fetch request to the server endpoint `/api/auth/register`.

## Implementation Details

### JavaScript Function Location
- File: `/client/js/auth.js`
- Function: Registration form event handler (lines 231-383)

### API Endpoint
- URL: `/api/auth/register`
- Method: POST
- Content-Type: application/json

### Form Field IDs
The registration function expects the following form field IDs:
- `first-name` - First name input
- `last-name` - Last name input
- `register-email` - Email input
- `register-password` - Password input
- `confirm-password` - Password confirmation input
- `school` - School dropdown selection
- `graduation-year` - Graduation year input
- `degree` - Degree input
- `current-position` - Current position input
- `company` - Company input
- `bio` - Bio textarea
- `linkedin` - LinkedIn URL input
- `public-profile` - Public profile checkbox

### Request Format
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "schoolId": "string",
  "graduationYear": "string",
  "degree": "string",
  "currentPosition": "string",
  "company": "string",
  "bio": "string",
  "linkedinUrl": "string",
  "isPublic": boolean
}
```

### Response Handling

#### Success Response (201)
```json
{
  "success": true,
  "message": "Registration successful. Your account is pending approval by an administrator.",
  "userId": 123
}
```
- Shows success message
- Clears the form
- Redirects to login page

#### Error Responses

**400 Bad Request**
- Missing required fields
- Invalid email format
- Password too short (< 6 characters)
- Invalid school ID

**409 Conflict**
- Email already exists

**500 Server Error**
- General server error

### Client-Side Validation

The function performs the following validations before making the API call:
1. Required fields check (firstName, lastName, email, schoolId)
2. Password matching with confirm password
3. Password minimum length (6 characters)

### Error Messages

The function provides user-friendly error messages for various scenarios:
- "Missing required fields: firstName, lastName"
- "This email is already registered. Please login or use a different email."
- "Please enter a valid email address"
- "Password must be at least 6 characters long"
- "Please select a valid school"
- "Cannot connect to server. Please check your connection."

### Loading State

The function uses the loading indicator if available:
```javascript
window.loading.show('register-form', 'Registering...');
// ... API call ...
window.loading.hide('register-form');
```

### Page Navigation

After successful registration, the function redirects to the login page using:
```javascript
if (window.main && typeof window.main.showPage === 'function') {
    window.main.showPage('login-form');
} else {
    showPage('login-form');
}
```

## Testing

To test the registration functionality:

1. Include the test file in your HTML:
```html
<script src="/js/test-registration-workflow.js"></script>
```

2. Use the test buttons that appear in the bottom right corner
3. Or use the console:
```javascript
// Test successful registration
registrationTests.testRegistration();

// Test error scenarios
registrationTests.testErrorScenarios();
```

## Migration from Mock Data

The previous implementation used mock data stored in `window.mockData`. The new implementation:
- Removes all mock data dependencies
- Uses real API endpoints
- Handles actual server responses
- Provides proper error handling

## Security Considerations

1. Passwords are validated for minimum length on the client side
2. The server handles password hashing with bcrypt
3. Email uniqueness is enforced by the server
4. All new users start with 'pending' status requiring admin approval

## Future Enhancements

Consider adding:
- Email verification
- Password strength indicator
- Real-time email availability check
- Terms of service acceptance
- CAPTCHA protection