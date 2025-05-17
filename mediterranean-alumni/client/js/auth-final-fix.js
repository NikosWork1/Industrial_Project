/**
 * Final fix for authentication UI updates
 * This ensures immediate updates for both admin and regular users
 */

(function() {
    console.log('Auth Final Fix loaded');
    
    // Utility function to get current auth state
    function getCurrentAuthState() {
        const token = localStorage.getItem('authToken');
        if (!token) return null;
        
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return null;
            
            const payload = JSON.parse(atob(parts[1]));
            
            // Check if expired
            if (payload.exp && payload.exp * 1000 < Date.now()) {
                localStorage.removeItem('authToken');
                return null;
            }
            
            return payload;
        } catch (e) {
            localStorage.removeItem('authToken');
            return null;
        }
    }
    
    // Force UI update based on current state
    function forceAuthUIUpdate() {
        console.log('=== FORCE AUTH UI UPDATE ===');
        
        const authState = getCurrentAuthState();
        const authButtons = document.getElementById('auth-buttons');
        const userProfile = document.getElementById('user-profile');
        const adminLink = document.getElementById('admin-link-container');
        const userName = document.getElementById('user-name');
        
        console.log('Auth state:', authState);
        
        if (!authState) {
            // Not logged in
            console.log('Not logged in - showing auth buttons');
            
            if (authButtons) {
                authButtons.style.cssText = 'display: flex !important; visibility: visible !important;';
                authButtons.className = authButtons.className.replace('d-none', '').trim();
            }
            
            if (userProfile) {
                userProfile.style.cssText = 'display: none !important; visibility: hidden !important;';
                userProfile.className = (userProfile.className + ' d-none').trim();
            }
            
            if (adminLink) {
                adminLink.style.cssText = 'display: none !important;';
            }
        } else {
            // Logged in
            console.log('Logged in as:', authState.email, 'Role:', authState.role);
            
            if (authButtons) {
                authButtons.style.cssText = 'display: none !important; visibility: hidden !important;';
                authButtons.className = (authButtons.className + ' d-none').trim();
            }
            
            if (userProfile) {
                userProfile.style.cssText = 'display: flex !important; visibility: visible !important;';
                userProfile.className = userProfile.className.replace('d-none', '').trim();
            }
            
            if (userName) {
                const name = `${authState.firstName || ''} ${authState.lastName || ''}`.trim() || authState.email || 'User';
                userName.textContent = name;
                console.log('Set username to:', name);
            }
            
            if (adminLink) {
                if (authState.role === 'admin') {
                    console.log('User is admin - showing admin link');
                    adminLink.style.cssText = 'display: block !important;';
                } else {
                    console.log('User is not admin - hiding admin link');
                    adminLink.style.cssText = 'display: none !important;';
                }
            }
        }
        
        console.log('=== UI UPDATE COMPLETE ===');
    }
    
    // Expose globally
    window.forceAuthUIUpdate = forceAuthUIUpdate;
    
    // Hook into auth events
    document.addEventListener('DOMContentLoaded', function() {
        // Override the logout button handler
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.removeEventListener('click', null); // Remove any existing handlers
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Enhanced logout handler');
                
                // Clear auth data
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                sessionStorage.clear();
                
                // Force immediate UI update
                forceAuthUIUpdate();
                
                // Navigate to home
                setTimeout(() => {
                    window.location.href = '#home-page';
                    if (window.main && window.main.showPage) {
                        window.main.showPage('home-page');
                    }
                }, 100);
            });
        }
        
        // Initial update
        forceAuthUIUpdate();
    });
    
    // Monitor for auth changes
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        originalSetItem.call(this, key, value);
        if (key === 'authToken') {
            console.log('Auth token changed - updating UI');
            setTimeout(forceAuthUIUpdate, 0);
        }
    };
    
    const originalRemoveItem = localStorage.removeItem;
    localStorage.removeItem = function(key) {
        originalRemoveItem.call(this, key);
        if (key === 'authToken') {
            console.log('Auth token removed - updating UI');
            setTimeout(forceAuthUIUpdate, 0);
        }
    };
    
    // Update on window focus (in case of external changes)
    window.addEventListener('focus', forceAuthUIUpdate);
    
    // Update periodically to catch any missed changes
    setInterval(forceAuthUIUpdate, 1000);
})();