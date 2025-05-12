/**
 * Demo script showing how to use the loading indicator
 */

// Example 1: Show loading in alumni container when fetching data
function loadAlumniWithLoading() {
    // Step 1: Show the loading indicator
    window.loading.show('alumni-container', 'Loading alumni data...');
    
    // Step 2: Simulate data fetching with setTimeout
    setTimeout(() => {
        // Step 3: Process your data (in this case, just calling the existing function)
        loadAlumniDirectory();
        
        // Step 4: Hide the loading indicator when done
        window.loading.hide('alumni-container');
    }, 1500); // Simulate 1.5 second delay
}

// Example 2: Show loading in schools container
function loadSchoolsWithLoading() {
    // Show loading indicator
    window.loading.show('schools-container', 'Loading schools...');
    
    // Simulate API call
    setTimeout(() => {
        // Load the schools
        loadSchools();
        
        // Hide the loading indicator
        window.loading.hide('schools-container');
    }, 1000);
}

// Example 3: Show loading when logging in
function loginWithLoading(email, password) {
    // Show loading in login form
    window.loading.show('login-form', 'Logging in...');
    
    // Simulate login API call
    setTimeout(() => {
        // Try to login
        window.auth.login(email, password);
        
        // Hide loading
        window.loading.hide('login-form');
    }, 2000);
}

// Example usage with the existing code:
/*
// Replace the original loadSchools call in setupNavigation
document.getElementById('schools-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('schools-page');
    loadSchoolsWithLoading();  // Use this instead of direct loadSchools()
});

// Replace the original loadAlumniDirectory call in setupNavigation
document.getElementById('alumni-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('alumni-page');
    loadAlumniWithLoading();  // Use this instead of direct loadAlumniDirectory()
});
*/