/**
 * Test file for the login workflow
 * This demonstrates how the client-side login works with the server
 */

// Test successful login
async function testSuccessfulLogin() {
    console.log('Testing successful login...');
    
    const loginData = {
        email: 'john.smith@example.com',
        password: 'password123'
    };

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        const data = await response.json();
        console.log('Response status:', response.status);
        console.log('Response data:', data);

        if (response.ok) {
            console.log('Login successful!');
            console.log('Token:', data.token);
            console.log('User:', data.user);
            
            // Decode JWT token payload
            const tokenParts = data.token.split('.');
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log('Token payload:', payload);
        } else {
            console.error('Login failed:', data.message);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}

// Test various error scenarios
async function testLoginErrors() {
    console.log('\n--- Testing Login Error Scenarios ---\n');

    // Test 1: Missing credentials
    console.log('Test 1: Missing credentials');
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        const data = await response.json();
        console.log('Response:', data);
    } catch (error) {
        console.error('Error:', error);
    }

    // Test 2: Invalid credentials
    console.log('\nTest 2: Invalid credentials');
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'invalid@example.com',
                password: 'wrongpassword'
            })
        });
        const data = await response.json();
        console.log('Response:', data);
    } catch (error) {
        console.error('Error:', error);
    }

    // Test 3: Pending account
    console.log('\nTest 3: Pending account (register first)');
    try {
        // First register a new account
        await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: 'Pending',
                lastName: 'User',
                email: 'pending@example.com',
                password: 'test123',
                schoolId: '1'
            })
        });

        // Try to login with pending account
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'pending@example.com',
                password: 'test123'
            })
        });
        const data = await response.json();
        console.log('Response:', data);
    } catch (error) {
        console.error('Error:', error);
    }

    // Test 4: Admin login
    console.log('\nTest 4: Admin login');
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@medcollege.edu',
                password: 'admin123'
            })
        });
        const data = await response.json();
        console.log('Response:', data);
        
        if (response.ok) {
            console.log('Admin role:', data.user.role);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Test login flow with UI updates
async function testLoginWithUI() {
    console.log('\n--- Testing Login with UI Updates ---\n');
    
    // Simulate filling the form
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    
    if (emailInput && passwordInput) {
        emailInput.value = 'john.smith@example.com';
        passwordInput.value = 'password123';
        
        // Trigger form submission
        const loginForm = document.getElementById('login-form-element');
        if (loginForm) {
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            loginForm.dispatchEvent(submitEvent);
        }
    } else {
        console.error('Login form elements not found');
    }
}

// Test JWT token validation
function testTokenValidation() {
    console.log('\n--- Testing JWT Token Validation ---\n');
    
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    
    if (token) {
        console.log('Token found in localStorage');
        
        try {
            const parts = token.split('.');
            if (parts.length === 3) {
                const header = JSON.parse(atob(parts[0]));
                const payload = JSON.parse(atob(parts[1]));
                
                console.log('Token header:', header);
                console.log('Token payload:', payload);
                console.log('Token expiry:', new Date(payload.exp * 1000));
                console.log('Is expired:', payload.exp * 1000 < Date.now());
            } else {
                console.error('Invalid token format');
            }
        } catch (error) {
            console.error('Error parsing token:', error);
        }
    } else {
        console.log('No token found in localStorage');
    }
}

// Run tests when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Login workflow tests loaded');
    
    // Add test buttons to your page
    const testContainer = document.createElement('div');
    testContainer.innerHTML = `
        <div style="position: fixed; bottom: 20px; left: 20px; z-index: 1000; background: white; padding: 10px; border: 1px solid #ddd;">
            <h4>Login Test Tools</h4>
            <button onclick="testSuccessfulLogin()" style="margin: 5px;">Test Successful Login</button>
            <button onclick="testLoginErrors()" style="margin: 5px;">Test Error Scenarios</button>
            <button onclick="testLoginWithUI()" style="margin: 5px;">Test UI Login</button>
            <button onclick="testTokenValidation()" style="margin: 5px;">Validate Token</button>
        </div>
    `;
    document.body.appendChild(testContainer);
});

// Export functions for console testing
window.loginTests = {
    testSuccessfulLogin,
    testLoginErrors,
    testLoginWithUI,
    testTokenValidation
};