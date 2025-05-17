/**
 * Force logout and clear all authentication data
 * This runs immediately on page load to ensure clean state
 */

(function() {
    console.log('=== FORCE LOGOUT CHECK ===');
    
    const authToken = localStorage.getItem('authToken');
    
    if (authToken) {
        console.log('Found auth token, analyzing...');
        
        try {
            // Try to decode the token
            const tokenParts = authToken.split('.');
            if (tokenParts.length === 3) {
                const payload = JSON.parse(atob(tokenParts[1]));
                console.log('Token payload:', payload);
                
                // Check if token is expired
                if (payload.exp && payload.exp * 1000 < Date.now()) {
                    console.log('Token is expired - clearing');
                    localStorage.removeItem('authToken');
                }
                
                // Check if user is pending
                if (payload.role === 'pending') {
                    console.log('User is pending - clearing');
                    localStorage.removeItem('authToken');
                }
            }
        } catch (e) {
            console.log('Invalid token format - clearing');
            localStorage.removeItem('authToken');
        }
    }
    
    // If URL has force-logout parameter, clear everything
    if (window.location.search.includes('force-logout')) {
        console.log('Force logout requested');
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/';
    }
    
    // Ensure UI starts in logged out state
    const userProfile = document.getElementById('user-profile');
    const authButtons = document.getElementById('auth-buttons');
    
    if (userProfile) userProfile.style.display = 'none';
    if (authButtons) authButtons.style.display = 'flex';
    
    console.log('=== FORCE LOGOUT CHECK COMPLETE ===');
})();