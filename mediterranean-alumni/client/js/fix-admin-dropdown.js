/**
 * Specific fix for admin dropdown not showing immediately
 */

(function() {
    console.log('Admin dropdown fix loaded');
    
    // Function to check and fix admin UI
    function fixAdminUI() {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) return;
        
        try {
            const parts = authToken.split('.');
            if (parts.length !== 3) return;
            
            const payload = JSON.parse(atob(parts[1]));
            console.log('Checking user role:', payload.role);
            
            if (payload.role === 'admin') {
                console.log('Admin user detected - ensuring admin link is visible');
                
                const adminLink = document.getElementById('admin-link-container');
                if (adminLink) {
                    // Force show admin link
                    adminLink.style.cssText = 'display: block !important; visibility: visible !important;';
                    adminLink.classList.remove('d-none');
                    
                    // Also ensure the link inside is visible
                    const innerLink = adminLink.querySelector('#admin-link');
                    if (innerLink) {
                        innerLink.style.display = 'block';
                    }
                    
                    console.log('Admin link forced visible');
                } else {
                    console.error('Admin link container not found');
                }
                
                // Also ensure user dropdown is visible
                const userProfile = document.getElementById('user-profile');
                if (userProfile) {
                    userProfile.style.cssText = 'display: flex !important; visibility: visible !important;';
                    userProfile.classList.remove('d-none');
                }
                
                // Hide login buttons
                const authButtons = document.getElementById('auth-buttons');
                if (authButtons) {
                    authButtons.style.cssText = 'display: none !important; visibility: hidden !important;';
                    authButtons.classList.add('d-none');
                }
            }
        } catch (e) {
            console.error('Error parsing token:', e);
        }
    }
    
    // Override login success handler
    const originalSuccessHandler = window.handleLoginSuccess;
    window.handleLoginSuccess = function(data) {
        console.log('Login success intercepted');
        
        if (originalSuccessHandler) {
            originalSuccessHandler.call(this, data);
        }
        
        // Force admin UI update
        if (data && data.user && data.user.role === 'admin') {
            console.log('Admin login detected - fixing UI');
            setTimeout(fixAdminUI, 0);
            setTimeout(fixAdminUI, 100);
            setTimeout(fixAdminUI, 500);
        }
    };
    
    // Monitor storage changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'authToken') {
            console.log('Auth token changed in storage');
            fixAdminUI();
        }
    });
    
    // Fix on various events
    document.addEventListener('DOMContentLoaded', fixAdminUI);
    window.addEventListener('load', fixAdminUI);
    window.addEventListener('popstate', fixAdminUI);
    
    // Periodic check
    setInterval(fixAdminUI, 2000);
    
    // Expose for manual calls
    window.fixAdminUI = fixAdminUI;
    
    console.log('Admin dropdown fix ready - call fixAdminUI() to manually trigger');
})();