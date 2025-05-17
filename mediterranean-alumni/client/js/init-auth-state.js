/**
 * Initialize authentication state on page load
 * This runs before any other scripts to ensure correct UI state
 */

(function() {
    console.log('=== INITIALIZING AUTH STATE ===');
    
    // Function to show login state
    function showLoggedInUI() {
        const userProfile = document.getElementById('user-profile');
        const authButtons = document.getElementById('auth-buttons');
        
        if (userProfile) {
            userProfile.style.display = 'flex';
            userProfile.classList.remove('d-none');
        }
        
        if (authButtons) {
            authButtons.style.display = 'none';
        }
        
        console.log('Showing logged in UI');
    }
    
    // Function to show logout state
    function showLoggedOutUI() {
        const userProfile = document.getElementById('user-profile');
        const authButtons = document.getElementById('auth-buttons');
        
        if (userProfile) {
            userProfile.style.display = 'none';
        }
        
        if (authButtons) {
            authButtons.style.display = 'flex';
            authButtons.classList.remove('d-none');
        }
        
        console.log('Showing logged out UI');
    }
    
    // Check auth token validity
    const authToken = localStorage.getItem('authToken');
    let isValidToken = false;
    let userData = null;
    
    console.log('Checking authToken:', authToken ? 'exists' : 'not found');
    
    if (authToken) {
        try {
            const tokenParts = authToken.split('.');
            if (tokenParts.length === 3) {
                const payload = JSON.parse(atob(tokenParts[1]));
                console.log('Token payload:', payload);
                
                // Check if token is valid and not expired
                if (payload.exp && payload.exp * 1000 > Date.now()) {
                    // Check if user is not pending
                    if (payload.role !== 'pending') {
                        isValidToken = true;
                        userData = payload;
                        console.log('Valid token found for user:', payload.email);
                    } else {
                        console.log('Pending user detected - clearing token');
                        localStorage.removeItem('authToken');
                        isValidToken = false;
                    }
                } else {
                    console.log('Token expired - clearing');
                    localStorage.removeItem('authToken');
                    isValidToken = false;
                }
            } else {
                console.log('Invalid token format - clearing');
                localStorage.removeItem('authToken');
                isValidToken = false;
            }
        } catch (e) {
            console.log('Error parsing token - clearing:', e);
            localStorage.removeItem('authToken');
            isValidToken = false;
        }
    } else {
        console.log('No auth token in localStorage');
    }
    
    // Function to update UI based on auth state
    function updateAuthUI() {
        if (isValidToken && userData) {
            showLoggedInUI();
            
            // Update username
            const userName = document.getElementById('user-name');
            if (userName && userData.firstName) {
                userName.textContent = `${userData.firstName} ${userData.lastName || ''}`.trim();
            }
            
            // Show admin link if needed
            const adminLink = document.getElementById('admin-link-container');
            if (adminLink && userData.role === 'admin') {
                adminLink.style.display = 'block';
            }
        } else {
            showLoggedOutUI();
        }
    }
    
    // Update UI immediately
    updateAuthUI();
    
    // Also update after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateAuthUI);
    }
    
    console.log('=== AUTH STATE INITIALIZED ===');
})();