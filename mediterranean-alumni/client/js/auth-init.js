/**
 * Complete authentication initialization
 * This must run FIRST before any other scripts
 */

(function() {
    console.log('=== AUTH INITIALIZATION START ===');
    
    // Function to completely hide all auth UI
    function hideAllAuthUI() {
        const userProfile = document.getElementById('user-profile');
        const authButtons = document.getElementById('auth-buttons');
        const adminLink = document.getElementById('admin-link-container');
        
        if (userProfile) {
            userProfile.style.display = 'none';
            userProfile.classList.add('d-none');
        }
        if (authButtons) {
            authButtons.style.display = 'none';
            authButtons.classList.add('d-none');
        }
        if (adminLink) {
            adminLink.style.display = 'none';
        }
    }
    
    // Function to validate token
    function isTokenValid(token) {
        if (!token) return false;
        
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return false;
            
            const payload = JSON.parse(atob(parts[1]));
            
            // Check expiration
            if (!payload.exp || payload.exp * 1000 < Date.now()) {
                console.log('Token expired');
                return false;
            }
            
            // Check if pending
            if (payload.role === 'pending') {
                console.log('Pending user - invalid');
                return false;
            }
            
            return true;
        } catch (e) {
            console.log('Invalid token format');
            return false;
        }
    }
    
    // Hide everything first
    hideAllAuthUI();
    
    // Check token and update UI
    const authToken = localStorage.getItem('authToken');
    
    if (!isTokenValid(authToken)) {
        console.log('No valid token - clearing and showing login buttons');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('currentUser');
        
        // Show auth buttons only
        setTimeout(() => {
            const authButtons = document.getElementById('auth-buttons');
            if (authButtons) {
                authButtons.style.display = 'flex';
                authButtons.classList.remove('d-none');
            }
        }, 0);
    } else {
        console.log('Valid token found - will show user profile after other scripts load');
        // Let auth.js handle showing the correct UI
    }
    
    console.log('=== AUTH INITIALIZATION END ===');
})();