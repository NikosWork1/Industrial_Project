/**
 * Simple, direct fix for authentication UI updates
 */

(function() {
    console.log('Simple auth fix loaded');
    
    // Direct UI update function
    function updateNavbarAuth() {
        console.log('=== Updating Navbar Auth State ===');
        
        const authButtons = document.getElementById('auth-buttons');
        const userProfile = document.getElementById('user-profile');
        const adminLink = document.getElementById('admin-link-container');
        const userName = document.getElementById('user-name');
        
        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
            // No token - show login buttons
            console.log('No auth token - showing login buttons');
            if (authButtons) authButtons.style.display = 'flex';
            if (userProfile) userProfile.style.display = 'none';
            if (adminLink) adminLink.style.display = 'none';
            return;
        }
        
        try {
            // Parse token
            const parts = authToken.split('.');
            if (parts.length !== 3) throw new Error('Invalid token');
            
            const payload = JSON.parse(atob(parts[1]));
            
            // Check if expired
            if (payload.exp && payload.exp * 1000 < Date.now()) {
                console.log('Token expired');
                localStorage.removeItem('authToken');
                updateNavbarAuth(); // Recursive call
                return;
            }
            
            // Valid token - show user UI
            console.log(`Valid token for: ${payload.email} (${payload.role})`);
            
            if (authButtons) authButtons.style.display = 'none';
            if (userProfile) userProfile.style.display = 'flex';
            
            // Update username
            if (userName) {
                const name = `${payload.firstName || ''} ${payload.lastName || ''}`.trim() || payload.email || 'User';
                userName.textContent = name;
            }
            
            // Show/hide admin link
            if (adminLink) {
                adminLink.style.display = payload.role === 'admin' ? 'block' : 'none';
                console.log(`Admin link ${payload.role === 'admin' ? 'shown' : 'hidden'}`);
            }
            
        } catch (e) {
            console.error('Error with token:', e);
            localStorage.removeItem('authToken');
            updateNavbarAuth(); // Recursive call
        }
    }
    
    // Expose globally
    window.updateNavbarAuth = updateNavbarAuth;
    
    // Override auth.js login success
    if (window.auth) {
        const originalUpdateLoggedIn = window.auth.updateUIForLoggedInUser;
        window.auth.updateUIForLoggedInUser = function(user) {
            console.log('Login detected - updating navbar');
            if (originalUpdateLoggedIn) {
                originalUpdateLoggedIn.call(this, user);
            }
            // Force immediate update
            updateNavbarAuth();
        };
        
        const originalUpdateLoggedOut = window.auth.updateUIForLoggedOutUser;
        window.auth.updateUIForLoggedOutUser = function() {
            console.log('Logout detected - updating navbar');
            if (originalUpdateLoggedOut) {
                originalUpdateLoggedOut.call(this);
            }
            // Force immediate update
            updateNavbarAuth();
        };
    }
    
    // Update on DOM ready
    document.addEventListener('DOMContentLoaded', updateNavbarAuth);
    
    // Update on window load
    window.addEventListener('load', updateNavbarAuth);
    
    // Update when returning to the page
    window.addEventListener('pageshow', updateNavbarAuth);
    window.addEventListener('focus', updateNavbarAuth);
    
    // Watch for storage changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'authToken') {
            updateNavbarAuth();
        }
    });
    
    console.log('Simple auth fix ready - call updateNavbarAuth() to update');
})();