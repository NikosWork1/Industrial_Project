/**
 * Auto-refresh UI after auth state changes
 * Alternative to full page reload
 */

(function() {
    console.log('Auto-refresh UI loaded');
    
    // Function to refresh all UI components
    function refreshUI() {
        console.log('Refreshing UI components');
        
        // Get current token state
        const token = localStorage.getItem('authToken');
        let userRole = null;
        let userName = 'User';
        
        if (token) {
            try {
                const parts = token.split('.');
                const payload = JSON.parse(atob(parts[1]));
                userRole = payload.role;
                userName = `${payload.firstName || ''} ${payload.lastName || ''}`.trim() || payload.email || 'User';
            } catch (e) {
                console.error('Invalid token');
            }
        }
        
        // Update navbar
        const authButtons = document.getElementById('auth-buttons');
        const userProfile = document.getElementById('user-profile');
        const adminLink = document.getElementById('admin-link-container');
        const userNameElement = document.getElementById('user-name');
        
        if (!token || !userRole) {
            // Not logged in
            if (authButtons) {
                authButtons.style.display = 'flex';
                authButtons.style.removeProperty('display');
                authButtons.classList.remove('d-none');
            }
            if (userProfile) {
                userProfile.style.display = 'none';
                userProfile.classList.add('d-none');
            }
            if (adminLink) {
                adminLink.style.display = 'none';
            }
        } else {
            // Logged in
            if (authButtons) {
                authButtons.style.display = 'none';
                authButtons.classList.add('d-none');
            }
            if (userProfile) {
                userProfile.style.display = 'flex';
                userProfile.style.removeProperty('display');
                userProfile.classList.remove('d-none');
            }
            if (userNameElement) {
                userNameElement.textContent = userName;
            }
            if (adminLink) {
                adminLink.style.display = userRole === 'admin' ? 'block' : 'none';
            }
        }
        
        // Refresh any dynamic content on the page
        if (window.loadPageData) {
            const currentPage = document.querySelector('[id$="-page"]:not([style*="none"])');
            if (currentPage) {
                window.loadPageData(currentPage.id);
            }
        }
    }
    
    // Monitor authentication changes
    let lastToken = localStorage.getItem('authToken');
    
    setInterval(() => {
        const currentToken = localStorage.getItem('authToken');
        if (currentToken !== lastToken) {
            console.log('Auth state changed - refreshing UI');
            lastToken = currentToken;
            refreshUI();
        }
    }, 500);
    
    // Initial refresh
    document.addEventListener('DOMContentLoaded', refreshUI);
    window.addEventListener('load', refreshUI);
    
    // Expose for manual calls
    window.refreshUI = refreshUI;
})();