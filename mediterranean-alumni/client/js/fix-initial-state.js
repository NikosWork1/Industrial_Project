/**
 * Fix initial state on page load
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('=== FIXING INITIAL STATE ===');
    
    // Get elements
    const authButtons = document.getElementById('auth-buttons');
    const userProfile = document.getElementById('user-profile');
    const authToken = localStorage.getItem('authToken');
    
    console.log('Auth token exists:', !!authToken);
    console.log('Auth buttons initial display:', authButtons?.style.display);
    console.log('User profile initial display:', userProfile?.style.display);
    
    // If no auth token, ensure proper display
    if (!authToken) {
        console.log('No auth token - showing auth buttons, hiding user profile');
        if (authButtons) authButtons.style.display = 'flex';
        if (userProfile) userProfile.style.display = 'none';
    }
    
    // Force update UI based on auth state
    if (window.auth && window.auth.isAuthenticated()) {
        console.log('User is authenticated - updating UI');
        const user = window.auth.getCurrentUser();
        if (user && user.role !== 'pending') {
            window.auth.updateUIForLoggedInUser(user);
        } else {
            window.auth.updateUIForLoggedOutUser();
        }
    } else {
        console.log('User is not authenticated - forcing logout UI');
        if (window.auth) {
            window.auth.updateUIForLoggedOutUser();
        }
    }
    
    console.log('=== INITIAL STATE FIXED ===');
});