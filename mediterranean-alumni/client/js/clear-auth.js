/**
 * Utility script to clear authentication data
 * Use this during development to clear old tokens
 */

// Clear all authentication data
function clearAuth() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user'); // Remove old user data
    console.log('Authentication data cleared');
    window.location.reload();
}

// Auto-clear on page load if URL has ?clear-auth
if (window.location.search.includes('clear-auth')) {
    clearAuth();
}

// Expose to console for manual clearing
window.clearAuth = clearAuth;

console.log('To clear authentication, run: clearAuth() in console or visit the page with ?clear-auth');