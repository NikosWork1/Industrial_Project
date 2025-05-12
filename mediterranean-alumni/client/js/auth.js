/**
 * Authentication Module for Mediterranean College Alumni Network
 * Handles user login, registration, and session management
 * DEMO VERSION: Using mock data instead of API calls
 */

// Store auth token in localStorage
let authToken = localStorage.getItem('authToken');
let currentUser = null;

// Parse JWT token (if any) and get user data
console.log('Initializing auth module. Checking for stored token...');

if (authToken) {
    console.log('Found auth token in localStorage:', authToken);
    
    try {
        // In a real app this would decode the JWT token
        // For demo, we'll just check if the token matches our mock admin user
        if (authToken === 'admin-token') {
            console.log('Recognized admin token');
            currentUser = {
                id: 101,
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@medcollege.edu',
                role: 'admin'
            };
            console.log('Admin user authenticated:', currentUser);
            
            // Make sure DOM is ready before updating UI
            document.addEventListener('DOMContentLoaded', () => {
                console.log('DOM loaded, updating UI for admin user');
                updateUIForLoggedInUser(currentUser);
            });
            
            // If DOM is already loaded, update UI immediately
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                console.log('DOM already loaded, updating UI for admin user immediately');
                updateUIForLoggedInUser(currentUser);
            }
        } else if (authToken === 'user-token') {
            console.log('Recognized user token');
            
            // Check if mockData is available yet
            if (window.mockData && window.mockData.alumni && window.mockData.alumni.length > 0) {
                console.log('Mock data available, using first alumni entry');
                currentUser = window.mockData.alumni[0];
            } else {
                console.log('Mock data not available, using default user object');
                currentUser = {
                    id: 1,
                    firstName: 'John',
                    lastName: 'Smith',
                    email: 'john.smith@example.com',
                    role: 'user',
                    schoolId: 2,
                    schoolName: 'School of Computing'
                };
            }
            
            console.log('Regular user authenticated:', currentUser);
            
            // Make sure DOM is ready before updating UI
            document.addEventListener('DOMContentLoaded', () => {
                console.log('DOM loaded, updating UI for regular user');
                updateUIForLoggedInUser(currentUser);
            });
            
            // If DOM is already loaded, update UI immediately
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                console.log('DOM already loaded, updating UI for regular user immediately');
                updateUIForLoggedInUser(currentUser);
            }
        } else {
            console.warn('Unrecognized token found:', authToken);
            console.log('Removing invalid token from localStorage');
            localStorage.removeItem('authToken');
            authToken = null;
        }
    } catch (e) {
        console.error('Error processing auth token:', e);
        console.error('Stack trace:', e.stack);
        console.log('Removing invalid token from localStorage');
        localStorage.removeItem('authToken');
        authToken = null;
    }
} else {
    console.log('No auth token found. User is not authenticated.');
}

/**
 * Handles the login form submission
 * DEMO: Uses hardcoded credentials instead of API calls
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
            
            // Demo implementation with hardcoded credentials
            console.log('Checking credentials...');
            
            if (email === 'admin@medcollege.edu' && password === 'admin123') {
                // Admin login
                console.log('Admin credentials verified');
                authToken = 'admin-token';
                localStorage.setItem('authToken', authToken);
                console.log('Admin token saved to localStorage');
                
                currentUser = {
                    id: 101,
                    firstName: 'Admin',
                    lastName: 'User',
                    email: 'admin@medcollege.edu',
                    role: 'admin'
                };
                
                console.log('Admin user object created:', currentUser);
                updateUIForLoggedInUser(currentUser);
                
                // Use the global showPage function in main.js if available
                if (window.main && typeof window.main.showPage === 'function') {
                    window.main.showPage('home-page');
                } else {
                    // Otherwise use our local implementation
                    showPage('home-page');
                }
                
                // Success notification
                console.log('Admin login completed successfully');
                alert('Admin login successful!');
            } else if (email === 'john.smith@example.com' && password === 'password123') {
                // Regular user login
                console.log('Regular user credentials verified');
                authToken = 'user-token';
                localStorage.setItem('authToken', authToken);
                console.log('User token saved to localStorage');
                
                // Check if mockData is available
                if (window.mockData && window.mockData.alumni && window.mockData.alumni.length > 0) {
                    console.log('Using mock alumni data for user');
                    currentUser = window.mockData.alumni[0];
                } else {
                    console.log('Mock data not available, using default user object');
                    currentUser = {
                        id: 1,
                        firstName: 'John',
                        lastName: 'Smith',
                        email: 'john.smith@example.com',
                        role: 'user',
                        schoolId: 2,
                        schoolName: 'School of Computing'
                    };
                }
                
                console.log('Regular user object created:', currentUser);
                updateUIForLoggedInUser(currentUser);
                
                // Use the global showPage function in main.js if available
                if (window.main && typeof window.main.showPage === 'function') {
                    window.main.showPage('home-page');
                } else {
                    // Otherwise use our local implementation
                    showPage('home-page');
                }
                
                // Success notification
                console.log('User login completed successfully');
                alert('Login successful!');
            } else {
                console.warn('Invalid credentials provided');
                throw new Error('Invalid email or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            console.error('Stack trace:', error.stack);
            alert(error.message || 'Login failed due to an unexpected error');
        } finally {
            // Hide loading indicator if it was shown
            if (window.loading && window.loading.hide) {
                window.loading.hide('login-form');
            }
        }
    });
});

/**
 * Handles the registration form submission
 * DEMO: Simulates registration without API call
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
        
        // Show loading indicator if available
        if (window.loading && window.loading.show) {
            window.loading.show('register-form', 'Registering...');
        }
        
        try {
            // In a real app, this would be a POST request to register
            
            // Check if mockData exists
            if (!window.mockData) {
                console.error("mockData not found - creating empty mockData object");
                window.mockData = {
                    pendingApplications: [],
                    schools: [
                        { id: 1, name: 'School of Business' },
                        { id: 2, name: 'School of Computing' },
                        { id: 3, name: 'School of Engineering' },
                        { id: 4, name: 'School of Health Sciences' },
                        { id: 5, name: 'School of Humanities' }
                    ]
                };
            }
            
            if (!window.mockData.pendingApplications) {
                console.error("pendingApplications array not found - creating empty array");
                window.mockData.pendingApplications = [];
            }
            
            // Check if email already exists
            const emailExists = 
                (window.mockData.users && window.mockData.users.some(u => u.email === formData.email)) || 
                window.mockData.pendingApplications.some(p => p.email === formData.email);
            
            if (emailExists) {
                throw new Error('This email is already registered');
            }
            
            // Generate a unique ID
            const newId = Date.now();
            
            // Find school name
            let schoolName = 'Unknown School';
            if (window.mockData.schools) {
                const school = window.mockData.schools.find(s => s.id.toString() === formData.schoolId);
                if (school) {
                    schoolName = school.name;
                }
            }
            
            // Create the new pending application
            const newPendingApp = {
                id: newId,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                schoolId: parseInt(formData.schoolId),
                schoolName: schoolName,
                graduationYear: parseInt(formData.graduationYear) || null,
                degree: formData.degree,
                currentPosition: formData.currentPosition,
                company: formData.company,
                bio: formData.bio,
                linkedinUrl: formData.linkedinUrl,
                isPublic: formData.isPublic === true
            };
            
            console.log("Adding new pending application:", newPendingApp);
            
            // Add to pending applications
            window.mockData.pendingApplications.push(newPendingApp);
            
            console.log("Pending applications after adding:", window.mockData.pendingApplications);
            
            // Show success message and redirect to login
            alert('Registration successful! Your application is pending approval.');
            
            // Use the global showPage function in main.js if available
            if (window.main && typeof window.main.showPage === 'function') {
                window.main.showPage('login-form');
            } else {
                // Otherwise use our local implementation
                showPage('login-form');
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed: ' + (error.message || 'Unknown error'));
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
            
            // Update UI for logged out state
            updateUIForLoggedOutUser();
            
            // Force reset of UI elements
            document.getElementById('auth-buttons').style.display = 'flex';
            document.getElementById('user-profile').style.display = 'none';
            document.getElementById('admin-link-container').style.display = 'none';
            
            // Update UI elements in the header
            const adminUserDropdown = document.querySelector('.dropdown-toggle');
            if (adminUserDropdown) {
                adminUserDropdown.style.display = 'none';
            }
            
            // Redirect to home page
            // Use the global showPage function in main.js if available
            if (window.main && typeof window.main.showPage === 'function') {
                window.main.showPage('home-page');
            } else {
                // Otherwise use our local implementation
                showPage('home-page');
            }
            
            console.log('Logout complete - redirected to home page');
            alert('You have been logged out.');
            
            // Optional: Force page reload to ensure clean state
            // window.location.reload();
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