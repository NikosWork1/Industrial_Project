/**
 * Ensure immediate UI updates after auth changes
 */

// Override the auth.js functions to ensure immediate updates
if (window.auth) {
    const originalUpdateLoggedIn = window.auth.updateUIForLoggedInUser;
    const originalUpdateLoggedOut = window.auth.updateUIForLoggedOutUser;
    
    window.auth.updateUIForLoggedInUser = function(user) {
        console.log('Immediate UI update for logged in user');
        // Call original function
        if (originalUpdateLoggedIn) {
            originalUpdateLoggedIn.call(this, user);
        }
        // Force immediate update
        if (window.AuthManager) {
            setTimeout(() => window.AuthManager.updateUI(), 0);
        }
    };
    
    window.auth.updateUIForLoggedOutUser = function() {
        console.log('Immediate UI update for logged out user');
        // Call original function
        if (originalUpdateLoggedOut) {
            originalUpdateLoggedOut.call(this);
        }
        // Force immediate update
        if (window.AuthManager) {
            setTimeout(() => window.AuthManager.updateUI(), 0);
        }
    };
}

// Also ensure UI updates after any navigation
window.addEventListener('load', () => {
    if (window.main && window.main.showPage) {
        const originalShowPage = window.main.showPage;
        window.main.showPage = function(pageId) {
            originalShowPage.call(this, pageId);
            // Update UI after page change
            if (window.AuthManager) {
                setTimeout(() => window.AuthManager.updateUI(), 100);
            }
        };
    }
});