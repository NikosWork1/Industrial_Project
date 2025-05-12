/**
 * Authentication Module for Mediterranean College Alumni Network
 * Handles user login, registration, and session management
 */

// Store auth token in localStorage
let authToken = localStorage.getItem('authToken');
let currentUser = null;

// Parse JWT token (if any) and get user data
if (authToken) {
    try {
        const payload = JSON.parse(atob(authToken.split('.')[1]));
        currentUser = payload;
        updateUIForLoggedInUser(currentUser);
    } catch (e) {
        console.error('Invalid token format', e);
        localStorage.removeItem('authToken');
        authToken = null;
    }
}

/**
 * Handles the login form submission
 */
document.getElementById('login-form-element')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        
        // Store token and user info
        authToken = data.token;
        localStorage.setItem('authToken', authToken);
        currentUser = data.user;
        
        // Update UI based on user role
        updateUIForLoggedInUser(currentUser);
        
        // Show home page
        showPage('home-page');
        
    } catch (error) {
        alert(error.message);
        console.error('Login error:', error);
    }
});

/**
 * Handles the registration form submission
 */
document.getElementById('register-form-element')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get all form fields
    const formData = {
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        email: document.getElementById('register-email').value,
        password: document.getElementById('register-password').value,
        confirmPassword: document.getElementById('confirm-password').value,
        schoolId: document.getElementById('school').value,
        graduationYear: document.getElementById('graduation-year').value,
        degree: document.getElementById('degree').value,
        currentPosition: document.getElementById('current-position').value,
        company: document.getElementById('company').value,
        bio: document.getElementById('bio').value,
        linkedinUrl: document.getElementById('linkedin').value,
        isPublic: document.getElementById('public-profile').checked
    };
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }
        
        // Show success message and redirect to login
        alert('Registration successful! Please log in.');
        showPage('login-form');
        
    } catch (error) {
        alert(error.message);
        console.error('Registration error:', error);
    }
});

/**
 * Handles user logout
 */
document.getElementById('logout-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Clear authentication data
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    
    // Update UI for logged out state
    updateUIForLoggedOutUser();
    
    // Redirect to home page
    showPage('home-page');
});

/**
 * Updates the UI elements for a logged-in user
 * @param {Object} user - The user object
 */
function updateUIForLoggedInUser(user) {
    // Hide auth buttons, show user profile
    document.getElementById('auth-buttons').style.display = 'none';
    document.getElementById('user-profile').style.display = 'flex';
    
    // Set user name in dropdown
    document.getElementById('user-name').textContent = `${user.firstName} ${user.lastName}`;
    
    // Show admin link if user is admin
    if (user.role === 'admin') {
        document.getElementById('admin-link-container').style.display = 'block';
    } else {
        document.getElementById('admin-link-container').style.display = 'none';
    }
}

/**
 * Updates the UI elements for a logged-out user
 */
function updateUIForLoggedOutUser() {
    // Show auth buttons, hide user profile
    document.getElementById('auth-buttons').style.display = 'flex';
    document.getElementById('user-profile').style.display = 'none';
    
    // Hide admin link
    document.getElementById('admin-link-container').style.display = 'none';
}

/**
 * Navigates between login and registration forms
 */
document.getElementById('go-to-register')?.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('register-form');
});

document.getElementById('go-to-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('login-form');
});

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
function isAuthenticated() {
    return authToken !== null;
}

/**
 * Get the current user
 * @returns {Object|null} The current user or null if not logged in
 */
function getCurrentUser() {
    return currentUser;
}

/**
 * Get the authentication token
 * @returns {string|null} The auth token or null if not logged in
 */
function getAuthToken() {
    return authToken;
}

// Export functions for other modules
window.auth = {
    isAuthenticated,
    getCurrentUser,
    getAuthToken,
    updateUIForLoggedInUser,
    updateUIForLoggedOutUser
};
