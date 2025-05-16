/**
 * Authentication Module for Mediterranean College Alumni Network
 * Handles user login, registration, and session management
 * Updated to use real API calls for both login and registration
 */

// Store auth token in localStorage
let authToken = localStorage.getItem('authToken');
let currentUser = null;

// Parse JWT token (if any) and get user data
if (authToken) {
    try {
        // Parse JWT token to extract user information
        const tokenParts = authToken.split('.');
        
        if (tokenParts.length !== 3) {
            throw new Error('Invalid token format');
        }
        
        // Decode the payload (middle part of JWT)
        const payload = JSON.parse(atob(tokenParts[1]));
        
        // Check if token is expired
        if (payload.exp && payload.exp * 1000 < Date.now()) {
            throw new Error('Token expired');
        }
        
        // Extract user data from token payload
        currentUser = {
            id: payload.id,
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            role: payload.role,
            schoolId: payload.schoolId,
            schoolName: payload.schoolName
        };
        
        // Make sure DOM is ready before updating UI
        document.addEventListener('DOMContentLoaded', () => {
            updateUIForLoggedInUser(currentUser);
        });
        
        // If DOM is already loaded, update UI immediately
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            updateUIForLoggedInUser(currentUser);
        }
    } catch (e) {
        console.error('Error processing auth token:', e);
        localStorage.removeItem('authToken');
        authToken = null;
        currentUser = null;
    }
}

/**
 * Handles the login form submission
 * Uses real API call to server endpoint
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Setting up login form handler');
    
    const loginForm = document.getElementById('login-form-element');
    
    if (!loginForm) {
        console.error('Login form element not found in the DOM');
        return;
    }
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Login form submitted');
        
        // Get form elements
        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');
        
        if (!emailInput || !passwordInput) {
            console.error('Login form inputs not found:', {
                emailInput: !!emailInput,
                passwordInput: !!passwordInput
            });
            alert('Error: Login form is not properly configured');
            return;
        }
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        console.log('Attempting login with email:', email);
        
        if (!email || !password) {
            console.warn('Empty email or password submitted');
            alert('Please enter both email and password');
            return;
        }
        
        try {
            // Show loading indicator if available
            if (window.loading && window.loading.show) {
                window.loading.show('login-form', 'Logging in...');
            }
            
            // Make real API call to login endpoint
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            
            const data = await response.json();
            console.log('Login response:', data);
            
            if (!response.ok) {
                // Handle specific error responses
                if (response.status === 400) {
                    throw new Error(data.message || 'Email and password are required');
                } else if (response.status === 401) {
                    throw new Error('Invalid email or password');
                } else if (response.status === 403) {
                    throw new Error(data.message || 'Account not authorized');
                } else {
                    throw new Error(data.message || 'Login failed');
                }
            }
            
            // Store the JWT token
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            console.log('JWT token saved to localStorage');
            
            // Parse and store user data
            currentUser = data.user;
            console.log('User data received:', currentUser);
            
            // Update UI for logged-in user
            updateUIForLoggedInUser(currentUser);
            
            // Clear the login form
            loginForm.reset();
            
            // Show success message
            const successMessage = data.message || 'Login successful!';
            console.log(successMessage);
            
            // Optional: Show a brief success notification before redirecting
            if (window.loading && window.loading.show) {
                window.loading.show('login-form', successMessage);
            }
            
            // Redirect to home page
            setTimeout(() => {
                if (window.main && typeof window.main.showPage === 'function') {
                    window.main.showPage('home-page');
                } else {
                    // Otherwise use our local implementation
                    showPage('home-page');
                }
                
                // Hide loading after redirect
                if (window.loading && window.loading.hide) {
                    window.loading.hide('login-form');
                }
            }, 500); // Small delay to show success message
            
        } catch (error) {
            console.error('Login error:', error);
            
            // Show user-friendly error message
            let errorMessage = 'Login failed';
            
            if (error.message.includes('required')) {
                errorMessage = 'Please enter both email and password';
            } else if (error.message.includes('Invalid email or password')) {
                errorMessage = 'Invalid email or password. Please try again.';
            } else if (error.message.includes('pending approval')) {
                errorMessage = 'Your account is pending approval. Please wait for an administrator to approve your registration.';
            } else if (error.message === 'Failed to fetch') {
                errorMessage = 'Cannot connect to server. Please check your connection.';
            } else {
                errorMessage = error.message || 'Login failed. Please try again.';
            }
            
            alert(errorMessage);
        } finally {
            // Hide loading indicator if it was shown (only if not successful)
            if (!authToken && window.loading && window.loading.hide) {
                window.loading.hide('login-form');
            }
        }
    });
});

/**
 * Handles the registration form submission
 * Uses real API call to server endpoint
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Setting up registration form handler');
    
    const registerForm = document.getElementById('register-form-element');
    
    if (!registerForm) {
        console.error('Registration form element not found in the DOM');
        return;
    }
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Registration form submitted');
        
        // Get all form fields
        const formData = {
            firstName: document.getElementById('first-name')?.value.trim(),
            lastName: document.getElementById('last-name')?.value.trim(),
            email: document.getElementById('register-email')?.value.trim(),
            password: document.getElementById('register-password')?.value,
            confirmPassword: document.getElementById('confirm-password')?.value,
            schoolId: document.getElementById('school')?.value,
            graduationYear: document.getElementById('graduation-year')?.value,
            degree: document.getElementById('degree')?.value.trim(),
            currentPosition: document.getElementById('current-position')?.value.trim(),
            company: document.getElementById('company')?.value.trim(),
            bio: document.getElementById('bio')?.value.trim(),
            linkedinUrl: document.getElementById('linkedin')?.value.trim(),
            isPublic: document.getElementById('public-profile')?.checked
        };
        
        // Add console logs to check the data
        console.log("Registration form data:", formData);
        
        // Validate required fields
        if (!formData.firstName || !formData.lastName) {
            alert('Name fields are required');
            return;
        }
        
        if (!formData.email) {
            alert('Email is required');
            return;
        }
        
        if (!formData.schoolId) {
            alert('Please select a school');
            return;
        }
        
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        // Validate password length
        if (formData.password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }
        
        // Show loading indicator if available
        if (window.loading && window.loading.show) {
            window.loading.show('register-form', 'Registering...');
        }
        
        try {
            // Prepare data for API (without confirmPassword)
            const apiData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                schoolId: formData.schoolId,
                graduationYear: formData.graduationYear,
                degree: formData.degree,
                currentPosition: formData.currentPosition,
                company: formData.company,
                bio: formData.bio,
                linkedinUrl: formData.linkedinUrl,
                isPublic: formData.isPublic
            };
            
            // Make real API call to register endpoint
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(apiData)
            });
            
            const data = await response.json();
            console.log('Registration response:', data);
            
            if (!response.ok) {
                // Handle specific error responses
                if (response.status === 400 && data.missingFields) {
                    throw new Error(`Missing required fields: ${data.missingFields.join(', ')}`);
                } else if (response.status === 409) {
                    throw new Error('This email is already registered');
                } else {
                    throw new Error(data.message || 'Registration failed');
                }
            }
            
            // Show success message
            alert(data.message || 'Registration successful! Your application is pending approval.');
            
            // Clear the form
            registerForm.reset();
            
            // Redirect to login page
            console.log('Redirecting to login page...');
            if (window.main && typeof window.main.showPage === 'function') {
                window.main.showPage('login-form');
            } else {
                // Otherwise use our local implementation
                showPage('login-form');
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            
            // Show user-friendly error message
            let errorMessage = 'Registration failed';
            
            if (error.message.includes('Missing required fields')) {
                errorMessage = error.message;
            } else if (error.message.includes('already registered')) {
                errorMessage = 'This email is already registered. Please login or use a different email.';
            } else if (error.message.includes('Invalid email format')) {
                errorMessage = 'Please enter a valid email address';
            } else if (error.message.includes('at least 6 characters')) {
                errorMessage = 'Password must be at least 6 characters long';
            } else if (error.message.includes('Invalid school')) {
                errorMessage = 'Please select a valid school';
            } else if (error.message === 'Failed to fetch') {
                errorMessage = 'Cannot connect to server. Please check your connection.';
            } else {
                errorMessage = error.message || 'Registration failed. Please try again.';
            }
            
            alert(errorMessage);
        } finally {
            // Hide loading indicator if it was shown
            if (window.loading && window.loading.hide) {
                window.loading.hide('register-form');
            }
        }
    });
});

/**
 * Handles user logout
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Setting up logout button handler');
    
    const logoutButton = document.getElementById('logout-btn');
    
    if (!logoutButton) {
        console.error('Logout button not found in the DOM');
        return;
    }
    
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        console.log('Logout clicked - clearing authentication data');
        
        try {
            // Show loading indicator if available
            if (window.loading && window.loading.show) {
                window.loading.show('user-profile', 'Logging out...');
            }
            
            // Clear ALL authentication-related data
            authToken = null;
            currentUser = null;
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken'); // In case you're using session storage too
            
            // Clear any cached user data
            if (window.sessionStorage) {
                window.sessionStorage.clear();
            }
            
            // Update UI for logged out state
            updateUIForLoggedOutUser();
            
            // Force reset of UI elements
            const authButtons = document.getElementById('auth-buttons');
            const userProfile = document.getElementById('user-profile');
            const adminLinkContainer = document.getElementById('admin-link-container');
            
            if (authButtons) authButtons.style.display = 'flex';
            if (userProfile) userProfile.style.display = 'none';
            if (adminLinkContainer) adminLinkContainer.style.display = 'none';
            
            // Update UI elements in the header
            const adminUserDropdown = document.querySelector('.dropdown-toggle');
            if (adminUserDropdown) {
                adminUserDropdown.style.display = 'none';
            }
            
            console.log('Logout complete - redirecting to home page');
            
            // Show logout message
            alert('You have been logged out successfully.');
            
            // Redirect to home page
            if (window.main && typeof window.main.showPage === 'function') {
                window.main.showPage('home-page');
            } else {
                showPage('home-page');
            }
            
        } catch (error) {
            console.error('Error during logout:', error);
            console.error('Stack trace:', error.stack);
            alert('There was a problem logging out. Please try again.');
        } finally {
            // Hide loading indicator if it was shown
            if (window.loading && window.loading.hide) {
                window.loading.hide('user-profile');
            }
        }
    });
});

/**
 * Updates the UI elements for a logged-in user
 * @param {Object} user - The user object
 */
function updateUIForLoggedInUser(user) {
    console.log('Updating UI for logged in user:', user ? user.id : 'undefined user');
    
    if (!user) {
        console.error('Cannot update UI for undefined user');
        return;
    }
    
    try {
        // Get UI elements
        const authButtons = document.getElementById('auth-buttons');
        const userProfile = document.getElementById('user-profile');
        const userName = document.getElementById('user-name');
        const adminLinkContainer = document.getElementById('admin-link-container');
        
        // Check if elements exist
        if (!authButtons) {
            console.error('auth-buttons element not found in DOM');
        } else {
            authButtons.style.display = 'none';
            console.log('Hidden auth buttons');
        }
        
        if (!userProfile) {
            console.error('user-profile element not found in DOM');
        } else {
            userProfile.style.display = 'flex';
            console.log('Showing user profile dropdown');
        }
        
        if (!userName) {
            console.error('user-name element not found in DOM');
        } else {
            userName.textContent = `${user.firstName || 'User'} ${user.lastName || ''}`;
            console.log('Updated user name in dropdown to:', userName.textContent);
        }
        
        // Show admin link if user is admin
        if (!adminLinkContainer) {
            console.error('admin-link-container element not found in DOM');
        } else {
            if (user.role === 'admin') {
                adminLinkContainer.style.display = 'block';
                console.log('Showing admin link (user is admin)');
            } else {
                adminLinkContainer.style.display = 'none';
                console.log('Hiding admin link (user is not admin)');
            }
        }
        
        console.log('UI successfully updated for logged in user');
    } catch (error) {
        console.error('Error updating UI for logged in user:', error);
        console.error('Stack trace:', error.stack);
    }
}

/**
 * Updates the UI elements for a logged-out user
 */
function updateUIForLoggedOutUser() {
    console.log('Updating UI for logged out user');
    
    try {
        // Get UI elements
        const authButtons = document.getElementById('auth-buttons');
        const userProfile = document.getElementById('user-profile');
        const adminLinkContainer = document.getElementById('admin-link-container');
        
        // Check if elements exist
        if (!authButtons) {
            console.error('auth-buttons element not found in DOM');
        } else {
            authButtons.style.display = 'flex';
            console.log('Showing auth buttons');
        }
        
        if (!userProfile) {
            console.error('user-profile element not found in DOM');
        } else {
            userProfile.style.display = 'none';
            console.log('Hiding user profile dropdown');
        }
        
        // Hide admin link
        if (!adminLinkContainer) {
            console.error('admin-link-container element not found in DOM');
        } else {
            adminLinkContainer.style.display = 'none';
            console.log('Hiding admin link');
        }
        
        console.log('UI successfully updated for logged out user');
    } catch (error) {
        console.error('Error updating UI for logged out user:', error);
        console.error('Stack trace:', error.stack);
    }
}

/**
 * Navigates between login and registration forms
 */
document.getElementById('go-to-register')?.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Use the global showPage function in main.js if available
    if (window.main && typeof window.main.showPage === 'function') {
        window.main.showPage('register-form');
    } else {
        // Otherwise use our local implementation
        showPage('register-form');
    }
});

document.getElementById('go-to-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Use the global showPage function in main.js if available
    if (window.main && typeof window.main.showPage === 'function') {
        window.main.showPage('login-form');
    } else {
        // Otherwise use our local implementation
        showPage('login-form');
    }
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

// Helper function to handle page navigation
// This is defined in main.js but needed here for demo purposes
function showPage(pageId) {
    // Check if the global showPage function exists in window object (defined in main.js)
    // But DON'T call it with window.showPage as that would create an infinite recursion
    if (window.main && typeof window.main.showPage === 'function') {
        window.main.showPage(pageId);
        return;
    }
    
    // Fallback implementation if main.js hasn't loaded yet
    const pages = document.querySelectorAll('.container > div[id$="-page"], .container > div[id$="-form"], .container > div[id="profile-view"], .container > div[id="profile-edit"]');
    
    // Hide all pages
    pages.forEach(page => {
        page.style.display = 'none';
    });
    
    // Show the requested page
    const pageToShow = document.getElementById(pageId);
    if (pageToShow) {
        pageToShow.style.display = 'block';
    }
}