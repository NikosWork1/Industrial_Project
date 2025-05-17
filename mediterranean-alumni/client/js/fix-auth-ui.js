/**
 * Force correct UI state based on localStorage auth token
 * This runs after all other scripts to ensure correct state
 */

window.addEventListener('load', function() {
    console.log('=== FIXING AUTH UI ===');
    
    const authToken = localStorage.getItem('authToken');
    const userProfile = document.getElementById('user-profile');
    const authButtons = document.getElementById('auth-buttons');
    
    if (!authToken) {
        console.log('No auth token - forcing logout UI');
        if (userProfile) {
            userProfile.style.display = 'none';
            userProfile.style.visibility = 'hidden';
            userProfile.classList.add('d-none');
        }
        if (authButtons) {
            authButtons.style.display = 'flex';
            authButtons.style.visibility = 'visible';
            authButtons.classList.remove('d-none');
        }
    } else {
        console.log('Auth token exists - validating');
        try {
            const parts = authToken.split('.');
            if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]));
                
                // If token is invalid, expired, or pending - force logout UI
                if (!payload.exp || payload.exp * 1000 < Date.now() || payload.role === 'pending') {
                    console.log('Invalid token - forcing logout UI');
                    localStorage.removeItem('authToken');
                    
                    if (userProfile) {
                        userProfile.style.display = 'none';
                        userProfile.style.visibility = 'hidden';
                        userProfile.classList.add('d-none');
                    }
                    if (authButtons) {
                        authButtons.style.display = 'flex';
                        authButtons.style.visibility = 'visible';
                        authButtons.classList.remove('d-none');
                    }
                }
                // Valid token - ensure login UI
                else {
                    console.log('Valid token - ensuring login UI');
                    if (userProfile) {
                        userProfile.style.display = 'flex';
                        userProfile.style.visibility = 'visible';
                        userProfile.classList.remove('d-none');
                    }
                    if (authButtons) {
                        authButtons.style.display = 'none';
                        authButtons.style.visibility = 'hidden';
                        authButtons.classList.add('d-none');
                    }
                }
            } else {
                throw new Error('Invalid token format');
            }
        } catch (e) {
            console.log('Error with token - forcing logout UI:', e);
            localStorage.removeItem('authToken');
            
            if (userProfile) {
                userProfile.style.display = 'none';
                userProfile.style.visibility = 'hidden';
                userProfile.classList.add('d-none');
            }
            if (authButtons) {
                authButtons.style.display = 'flex';
                authButtons.style.visibility = 'visible';
                authButtons.classList.remove('d-none');
            }
        }
    }
    
    console.log('=== AUTH UI FIXED ===');
});