/**
 * Debug script to check authentication state
 */

console.log('=== DEBUG AUTH STATE ===');
console.log('Current URL:', window.location.href);
console.log('Auth token exists:', !!localStorage.getItem('authToken'));
console.log('Auth token value:', localStorage.getItem('authToken'));

// Check what's in the DOM
console.log('DOM Elements:');
console.log('- auth-buttons display:', document.getElementById('auth-buttons')?.style.display);
console.log('- user-profile display:', document.getElementById('user-profile')?.style.display);
console.log('- user-name text:', document.getElementById('user-name')?.textContent);

// Check if auth.js loaded properly
console.log('Auth module exists:', typeof window.auth !== 'undefined');
console.log('Current user:', window.currentUser);

// Force clear and reload for testing
if (window.location.search.includes('debug-clear')) {
    console.log('DEBUG: Clearing all storage');
    localStorage.clear();
    sessionStorage.clear();
    location.reload();
}

console.log('=== END DEBUG ===');