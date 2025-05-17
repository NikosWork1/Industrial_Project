/**
 * Centralized Authentication UI Manager
 * Handles all authentication UI updates in one place
 */

window.AuthManager = (function() {
    
    // Update UI based on authentication state
    function updateUI() {
        console.log('AuthManager: Updating UI');
        
        const authToken = localStorage.getItem('authToken');
        const authButtons = document.getElementById('auth-buttons');
        const userProfile = document.getElementById('user-profile');
        const adminLink = document.getElementById('admin-link-container');
        const userName = document.getElementById('user-name');
        
        if (!authToken) {
            // Not logged in - show auth buttons
            console.log('AuthManager: No auth token - showing login buttons');
            showLoginButtons();
            return;
        }
        
        try {
            // Parse and validate token
            const parts = authToken.split('.');
            if (parts.length !== 3) throw new Error('Invalid token format');
            
            const payload = JSON.parse(atob(parts[1]));
            
            // Check if expired
            if (payload.exp && payload.exp * 1000 < Date.now()) {
                console.log('AuthManager: Token expired');
                localStorage.removeItem('authToken');
                showLoginButtons();
                return;
            }
            
            // Check if pending
            if (payload.role === 'pending') {
                console.log('AuthManager: Pending user');
                localStorage.removeItem('authToken');
                showLoginButtons();
                return;
            }
            
            // Valid user - show user UI
            console.log('AuthManager: Valid user - showing user UI');
            showUserUI(payload);
            
        } catch (e) {
            console.error('AuthManager: Error parsing token:', e);
            localStorage.removeItem('authToken');
            showLoginButtons();
        }
    }
    
    function showLoginButtons() {
        const authButtons = document.getElementById('auth-buttons');
        const userProfile = document.getElementById('user-profile');
        const adminLink = document.getElementById('admin-link-container');
        
        if (authButtons) {
            authButtons.style.display = 'flex';
            authButtons.style.visibility = 'visible';
            authButtons.classList.remove('d-none');
        }
        
        if (userProfile) {
            userProfile.style.display = 'none';
            userProfile.style.visibility = 'hidden';
            userProfile.classList.add('d-none');
        }
        
        if (adminLink) {
            adminLink.style.display = 'none';
        }
    }
    
    function showUserUI(userData) {
        const authButtons = document.getElementById('auth-buttons');
        const userProfile = document.getElementById('user-profile');
        const adminLink = document.getElementById('admin-link-container');
        const userName = document.getElementById('user-name');
        
        if (authButtons) {
            authButtons.style.display = 'none';
            authButtons.style.visibility = 'hidden';
            authButtons.classList.add('d-none');
        }
        
        if (userProfile) {
            userProfile.style.display = 'flex';
            userProfile.style.visibility = 'visible';
            userProfile.classList.remove('d-none');
        }
        
        if (userName) {
            userName.textContent = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email || 'User';
        }
        
        if (adminLink) {
            adminLink.style.display = userData.role === 'admin' ? 'block' : 'none';
        }
    }
    
    // Initialize on page load
    document.addEventListener('DOMContentLoaded', updateUI);
    
    // Also check on window load
    window.addEventListener('load', updateUI);
    
    // Public API
    return {
        updateUI: updateUI,
        showLoginButtons: showLoginButtons,
        showUserUI: showUserUI
    };
})();