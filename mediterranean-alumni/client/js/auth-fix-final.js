/**
 * Final authentication fix
 * This runs last to ensure everything is correct
 */

(function() {
    // Wait for everything to load
    window.addEventListener('load', function() {
        console.log('=== FINAL AUTH CHECK ===');
        
        const authToken = localStorage.getItem('authToken');
        const userProfile = document.getElementById('user-profile');
        const authButtons = document.getElementById('auth-buttons');
        const adminLink = document.getElementById('admin-link-container');
        
        function hideUserUI() {
            if (userProfile) {
                userProfile.style.display = 'none';
                userProfile.style.setProperty('display', 'none', 'important');
            }
            if (authButtons) {
                authButtons.style.display = 'flex';
                authButtons.style.setProperty('display', 'flex', 'important');
            }
            if (adminLink) {
                adminLink.style.display = 'none';
            }
        }
        
        function showUserUI(isAdmin) {
            if (userProfile) {
                userProfile.style.display = 'flex';
                userProfile.style.setProperty('display', 'flex', 'important');
            }
            if (authButtons) {
                authButtons.style.display = 'none';
                authButtons.style.setProperty('display', 'none', 'important');
            }
            if (adminLink && isAdmin) {
                adminLink.style.display = 'block';
            }
        }
        
        if (!authToken) {
            console.log('No token - showing logout UI');
            hideUserUI();
            return;
        }
        
        try {
            const parts = authToken.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid token format');
            }
            
            const payload = JSON.parse(atob(parts[1]));
            const now = Date.now();
            const expiry = payload.exp * 1000;
            
            console.log('Token user:', payload.email);
            console.log('Token role:', payload.role);
            console.log('Token expires:', new Date(expiry));
            console.log('Current time:', new Date(now));
            console.log('Is expired:', expiry < now);
            
            if (expiry < now) {
                console.log('Token expired - clearing');
                localStorage.removeItem('authToken');
                hideUserUI();
                return;
            }
            
            if (payload.role === 'pending') {
                console.log('Pending user - clearing');
                localStorage.removeItem('authToken');
                hideUserUI();
                return;
            }
            
            // Valid token - show appropriate UI
            console.log('Valid token - showing user UI');
            showUserUI(payload.role === 'admin');
            
            // Update username
            const userName = document.getElementById('user-name');
            if (userName) {
                userName.textContent = `${payload.firstName || ''} ${payload.lastName || ''}`.trim() || payload.email;
            }
            
        } catch (e) {
            console.error('Error processing token:', e);
            localStorage.removeItem('authToken');
            hideUserUI();
        }
        
        console.log('=== FINAL AUTH CHECK COMPLETE ===');
    });
})();