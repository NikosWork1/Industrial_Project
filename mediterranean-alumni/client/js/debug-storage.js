/**
 * Debug localStorage on every page load
 */

(function() {
    console.log('=== DEBUG STORAGE CHECK ===');
    console.log('Time:', new Date().toISOString());
    
    // Check what's in localStorage
    console.log('localStorage contents:');
    Object.keys(localStorage).forEach(key => {
        const value = localStorage.getItem(key);
        console.log(`  ${key}:`, value ? value.substring(0, 100) + '...' : 'null');
    });
    
    // Specifically check authToken
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
        console.log('Auth token found! Analyzing...');
        try {
            const parts = authToken.split('.');
            if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]));
                console.log('Token payload:', payload);
                console.log('Token expiry:', new Date(payload.exp * 1000));
                console.log('Current time:', new Date());
                console.log('Is expired:', payload.exp * 1000 < Date.now());
                console.log('User role:', payload.role);
            }
        } catch (e) {
            console.log('Error parsing token:', e);
        }
    } else {
        console.log('No auth token found in localStorage');
    }
    
    // Check DOM state
    setTimeout(() => {
        const userProfile = document.getElementById('user-profile');
        const authButtons = document.getElementById('auth-buttons');
        
        console.log('DOM State:');
        console.log('  user-profile display:', userProfile?.style.display);
        console.log('  auth-buttons display:', authButtons?.style.display);
    }, 100);
    
    console.log('=== END DEBUG STORAGE ===');
})();