/**
 * Fix for immediate UI updates after auth state changes
 */

(function() {
    // Function to force UI update
    function forceUIUpdate() {
        console.log('=== FORCING UI UPDATE ===');
        
        const authToken = localStorage.getItem('authToken');
        const authButtons = document.getElementById('auth-buttons');
        const userProfile = document.getElementById('user-profile');
        const adminLink = document.getElementById('admin-link-container');
        const userName = document.getElementById('user-name');
        
        if (!authToken) {
            console.log('No token - showing login UI');
            // Force show login buttons
            if (authButtons) {
                authButtons.style.display = 'flex';
                authButtons.style.setProperty('display', 'flex', 'important');
                authButtons.classList.remove('d-none');
            }
            if (userProfile) {
                userProfile.style.display = 'none';
                userProfile.style.setProperty('display', 'none', 'important');
                userProfile.classList.add('d-none');
            }
            if (adminLink) {
                adminLink.style.display = 'none';
                adminLink.style.setProperty('display', 'none', 'important');
            }
            return;
        }
        
        try {
            const parts = authToken.split('.');
            if (parts.length !== 3) throw new Error('Invalid token');
            
            const payload = JSON.parse(atob(parts[1]));
            
            // Check if valid
            if (payload.exp && payload.exp * 1000 < Date.now()) {
                console.log('Token expired');
                localStorage.removeItem('authToken');
                forceUIUpdate(); // Recursive call
                return;
            }
            
            console.log('Valid token for:', payload.email, 'Role:', payload.role);
            
            // Force show user UI
            if (authButtons) {
                authButtons.style.display = 'none';
                authButtons.style.setProperty('display', 'none', 'important');
                authButtons.classList.add('d-none');
            }
            if (userProfile) {
                userProfile.style.display = 'flex';
                userProfile.style.setProperty('display', 'flex', 'important');
                userProfile.classList.remove('d-none');
            }
            if (userName) {
                userName.textContent = `${payload.firstName || ''} ${payload.lastName || ''}`.trim() || payload.email || 'User';
            }
            if (adminLink) {
                if (payload.role === 'admin') {
                    console.log('Showing admin link');
                    adminLink.style.display = 'block';
                    adminLink.style.setProperty('display', 'block', 'important');
                } else {
                    adminLink.style.display = 'none';
                    adminLink.style.setProperty('display', 'none', 'important');
                }
            }
            
        } catch (e) {
            console.error('Error parsing token:', e);
            localStorage.removeItem('authToken');
            forceUIUpdate(); // Recursive call
        }
    }
    
    // Expose globally
    window.forceUIUpdate = forceUIUpdate;
    
    // Override auth functions to force immediate updates
    const originalAuth = window.auth;
    if (originalAuth) {
        // Override updateUIForLoggedInUser
        const originalUpdateLoggedIn = originalAuth.updateUIForLoggedInUser;
        originalAuth.updateUIForLoggedInUser = function(user) {
            console.log('Overridden updateUIForLoggedInUser called');
            if (originalUpdateLoggedIn) {
                originalUpdateLoggedIn.call(this, user);
            }
            // Force immediate update
            setTimeout(forceUIUpdate, 0);
        };
        
        // Override updateUIForLoggedOutUser
        const originalUpdateLoggedOut = originalAuth.updateUIForLoggedOutUser;
        originalAuth.updateUIForLoggedOutUser = function() {
            console.log('Overridden updateUIForLoggedOutUser called');
            if (originalUpdateLoggedOut) {
                originalUpdateLoggedOut.call(this);
            }
            // Force immediate update
            setTimeout(forceUIUpdate, 0);
        };
    }
    
    // Also update on page navigation
    const originalShowPage = window.showPage;
    if (originalShowPage) {
        window.showPage = function(pageId) {
            originalShowPage.call(this, pageId);
            setTimeout(forceUIUpdate, 100);
        };
    }
    
    // Initial update
    document.addEventListener('DOMContentLoaded', forceUIUpdate);
    window.addEventListener('load', forceUIUpdate);
})();