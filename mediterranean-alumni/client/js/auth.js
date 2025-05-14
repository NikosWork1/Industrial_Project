/**
 * Authentication Module for Mediterranean College Alumni Network
 * Handles user login, registration, and session management
 * DEMO VERSION: Using mock data instead of API calls
 */

// Initialize UI state - hide user-specific elements by default
document.addEventListener('DOMContentLoaded', () => {
    const userProfile = document.getElementById('user-profile');
    const adminLinkContainer = document.getElementById('admin-link-container');
    const authButtons = document.getElementById('auth-buttons');
    const profileDropdown = document.getElementById('profileDropdown');

    // Hide user profile and admin elements by default
    if (userProfile) {
        userProfile.style.display = 'none';
        userProfile.classList.add('d-none');
    }
    if (adminLinkContainer) {
        adminLinkContainer.style.display = 'none';
        adminLinkContainer.classList.add('d-none');
    }
    if (profileDropdown) {
        profileDropdown.style.display = 'none';
        profileDropdown.classList.add('d-none');
    }
    // Show auth buttons by default
    if (authButtons) {
        authButtons.style.display = 'flex';
        authButtons.classList.remove('d-none');
    }
});

// Store auth token in localStorage
let authToken = localStorage.getItem('authToken');
let currentUser = null;

// Parse JWT token (if any) and get user data
if (authToken) {
    try {
        // In a real app this would decode the JWT token
        // For demo, we'll just check if the token matches our mock admin user
        if (authToken === 'admin-token') {
            currentUser = {
                id: 101,
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@medcollege.edu',
                role: 'admin'
            };
            updateUIForLoggedInUser(currentUser);
        } else if (authToken === 'user-token') {
            // Sample user token
            currentUser = window.mockData?.alumni[0] || {
                id: 1,
                firstName: 'John',
                lastName: 'Smith',
                email: 'john.smith@example.com',
                role: 'user',
                schoolId: 2,
                schoolName: 'School of Computing'
            };
            updateUIForLoggedInUser(currentUser);
        } else {
            localStorage.removeItem('authToken');
            authToken = null;
        }
    } catch (e) {
        console.error('Invalid token format', e);
        localStorage.removeItem('authToken');
        authToken = null;
    }
}

/**
 * Handles the login form submission
 * DEMO: Uses hardcoded credentials instead of API calls
 */
document.getElementById('login-form-element')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        // Demo implementation with hardcoded credentials
        if (email === 'admin@medcollege.edu' && password === 'admin123') {
            // Admin login
            authToken = 'admin-token';
            localStorage.setItem('authToken', authToken);
            currentUser = {
                id: 101,
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@medcollege.edu',
                role: 'admin'
            };
            
            updateUIForLoggedInUser(currentUser);
            showPage('home-page');
            alert('Admin login successful!');
        } else if (email === 'john.smith@example.com' && password === 'password123') {
            // Regular user login
            authToken = 'user-token';
            localStorage.setItem('authToken', authToken);
            currentUser = window.mockData?.alumni[0] || {
                id: 1,
                firstName: 'John',
                lastName: 'Smith',
                email: 'john.smith@example.com',
                role: 'user',
                schoolId: 2,
                schoolName: 'School of Computing'
            };
            
            updateUIForLoggedInUser(currentUser);
            showPage('home-page');
            alert('Login successful!');
        } else {
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        alert(error.message);
        console.error('Login error:', error);
    }
});

/**
 * Handles the registration form submission
 * DEMO: Simulates registration without API call
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
        // In a real app, this would be a POST request to register
        // For demo purposes, we'll just show a success message
        
        // Add to pending applications if mock data is available
        if (window.mockData && window.mockData.pendingApplications) {
            const newPendingApp = {
                id: 204, // Generate a new ID
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                schoolId: parseInt(formData.schoolId),
                schoolName: window.mockData.schools.find(s => s.id.toString() === formData.schoolId)?.name || '',
                graduationYear: parseInt(formData.graduationYear),
                degree: formData.degree,
                currentPosition: formData.currentPosition,
                company: formData.company,
                bio: formData.bio,
                isPublic: formData.isPublic
            };
            
            window.mockData.pendingApplications.push(newPendingApp);
        }
        
        // Show success message and redirect to login
        alert('Registration successful! Your application is pending approval.');
        showPage('login-form');
        
    } catch (error) {
        alert(error.message || 'Registration failed');
        console.error('Registration error:', error);
    }
});

/**
 * Handles user logout
 */
document.getElementById('logout-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    
    try {
        // Clear authentication data
        authToken = null;
        currentUser = null;
        localStorage.removeItem('authToken');
        
        // Get all UI elements
        const authButtons = document.getElementById('auth-buttons');
        const userProfile = document.getElementById('user-profile');
        const adminLinkContainer = document.getElementById('admin-link-container');
        const userNameElement = document.getElementById('user-name');
        const profileDropdown = document.getElementById('profileDropdown');
        
        // Show auth buttons
        if (authButtons) {
            authButtons.style.display = 'flex';
            authButtons.classList.remove('d-none');
        }
        
        // Hide user profile and dropdown
        if (userProfile) {
            userProfile.style.display = 'none';
            userProfile.classList.add('d-none');
        }

        // Hide the profile dropdown button
        if (profileDropdown) {
            profileDropdown.style.display = 'none';
            profileDropdown.classList.add('d-none');
        }
        
        // Hide admin link
        if (adminLinkContainer) {
            adminLinkContainer.style.display = 'none';
            adminLinkContainer.classList.add('d-none');
        }
        
        // Reset the user name display
        if (userNameElement) {
            userNameElement.textContent = '';
        }
        
        // Redirect to home page and show success message
        showPage('home-page');
        alert('You have been logged out successfully.');
        
        // Force page reload to clear any remaining state
        window.location.reload();
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error during logout. Please try again.');
    }
});

/**
 * Updates the UI elements for a logged-in user
 * @param {Object} user - The user object
 */
function updateUIForLoggedInUser(user) {
    try {
        // Get UI elements
        const authButtons = document.getElementById('auth-buttons');
        const userProfile = document.getElementById('user-profile');
        const adminLinkContainer = document.getElementById('admin-link-container');
        const userNameElement = document.getElementById('user-name');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const profileDropdown = document.getElementById('profileDropdown');
        const dropdownMenu = document.querySelector('.dropdown-menu');

        // Hide auth buttons
        if (authButtons) {
            authButtons.style.display = 'none';
            authButtons.classList.add('d-none');
        }

        // Show user profile and its components
        if (userProfile) {
            userProfile.style.display = 'flex';
            userProfile.classList.remove('d-none');
        }

        // Show dropdown button
        if (profileDropdown) {
            profileDropdown.style.display = 'block';
            profileDropdown.classList.remove('d-none');
        }

        // Show dropdown menu
        if (dropdownMenu) {
            dropdownMenu.classList.remove('d-none');
        }

        // Update user name
        if (userNameElement && user) {
            userNameElement.textContent = `${user.firstName} ${user.lastName}`;
        }

        // Handle admin link visibility
        if (adminLinkContainer) {
            if (user && user.role === 'admin') {
                adminLinkContainer.style.display = 'block';
                adminLinkContainer.classList.remove('d-none');
            } else {
                adminLinkContainer.style.display = 'none';
                adminLinkContainer.classList.add('d-none');
            }
        }

        // Hide login and register forms
        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'none';

    } catch (error) {
        console.error('Error updating UI for logged-in user:', error);
    }
}

/**
 * Updates the UI elements for a logged-out user
 */
function updateUIForLoggedOutUser() {
    try {
        // Get UI elements
        const authButtons = document.getElementById('auth-buttons');
        const userProfile = document.getElementById('user-profile');
        const adminLinkContainer = document.getElementById('admin-link-container');
        const userNameElement = document.getElementById('user-name');
        const profileDropdown = document.getElementById('profileDropdown');
        const dropdownMenu = document.querySelector('.dropdown-menu');

        // Show auth buttons
        if (authButtons) {
            authButtons.style.display = 'flex';
            authButtons.classList.remove('d-none');
        }

        // Hide all user-specific elements
        [userProfile, adminLinkContainer, profileDropdown].forEach(element => {
            if (element) {
                element.style.display = 'none';
                element.classList.add('d-none');
            }
        });

        // Hide dropdown menu if it exists
        if (dropdownMenu) {
            dropdownMenu.style.display = 'none';
            dropdownMenu.classList.add('d-none');
        }

        // Clear user name
        if (userNameElement) {
            userNameElement.textContent = '';
        }

    } catch (error) {
        console.error('Error updating UI for logged-out user:', error);
    }
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

// Helper function to handle page navigation
// This is defined in main.js but needed here for demo purposes
function showPage(pageId) {
    if (typeof window.showPage === 'function') {
        window.showPage(pageId);
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