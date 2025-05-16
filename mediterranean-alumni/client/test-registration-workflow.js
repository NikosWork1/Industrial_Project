/**
 * Test file for the registration workflow
 * This demonstrates how the client-side registration works with the server
 */

// Simulate a registration form submission
async function testRegistration() {
    // Example registration data
    const registrationData = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: 'password123',
        schoolId: '1',
        graduationYear: '2020',
        degree: 'Bachelor of Science',
        currentPosition: 'Software Developer',
        company: 'Tech Company',
        bio: 'Passionate about technology',
        linkedinUrl: 'https://linkedin.com/in/janedoe',
        isPublic: true
    };

    console.log('Testing registration with data:', registrationData);

    try {
        // Make the API call
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registrationData)
        });

        const data = await response.json();
        console.log('Response status:', response.status);
        console.log('Response data:', data);

        if (response.ok) {
            console.log('Registration successful!');
            console.log('Success message:', data.message);
            console.log('User ID:', data.userId);
        } else {
            console.error('Registration failed');
            console.error('Error message:', data.message);
            if (data.missingFields) {
                console.error('Missing fields:', data.missingFields);
            }
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}

// Test various error scenarios
async function testErrorScenarios() {
    console.log('\n--- Testing Error Scenarios ---\n');

    // Test 1: Missing required fields
    console.log('Test 1: Missing required fields');
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'test123'
            })
        });
        const data = await response.json();
        console.log('Response:', data);
    } catch (error) {
        console.error('Error:', error);
    }

    // Test 2: Invalid email format
    console.log('\nTest 2: Invalid email format');
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: 'Test',
                lastName: 'User',
                email: 'invalid-email',
                password: 'test123',
                schoolId: '1'
            })
        });
        const data = await response.json();
        console.log('Response:', data);
    } catch (error) {
        console.error('Error:', error);
    }

    // Test 3: Short password
    console.log('\nTest 3: Short password');
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: 'Test',
                lastName: 'User',
                email: 'test2@example.com',
                password: '123',
                schoolId: '1'
            })
        });
        const data = await response.json();
        console.log('Response:', data);
    } catch (error) {
        console.error('Error:', error);
    }

    // Test 4: Duplicate email
    console.log('\nTest 4: Duplicate email');
    try {
        // First registration
        await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: 'Duplicate',
                lastName: 'Test',
                email: 'duplicate@example.com',
                password: 'test123',
                schoolId: '1'
            })
        });

        // Second registration with same email
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: 'Duplicate',
                lastName: 'Test',
                email: 'duplicate@example.com',
                password: 'test123',
                schoolId: '1'
            })
        });
        const data = await response.json();
        console.log('Response:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Run tests when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Registration workflow tests loaded');
    
    // Add test buttons to your page
    const testContainer = document.createElement('div');
    testContainer.innerHTML = `
        <div style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
            <button onclick="testRegistration()" style="margin: 5px;">Test Successful Registration</button>
            <button onclick="testErrorScenarios()" style="margin: 5px;">Test Error Scenarios</button>
        </div>
    `;
    document.body.appendChild(testContainer);
});

// Export functions for console testing
window.registrationTests = {
    testRegistration,
    testErrorScenarios
};