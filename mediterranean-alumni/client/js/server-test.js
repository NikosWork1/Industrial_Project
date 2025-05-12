/**
 * Server Connection Test Module for Mediterranean College Alumni Network
 * Provides functions to test if the server API is accessible
 */

/**
 * Tests the connection to the server by sending a request to the schools endpoint
 * @param {string} [baseUrl='http://localhost:3000'] - The base URL of the server
 * @returns {Promise<Object>} - A promise that resolves with the test results
 */
async function testServerConnection(baseUrl = 'http://localhost:3000') {
    console.log('Testing server connection to:', baseUrl);
    
    const results = {
        success: false,
        endpoint: `${baseUrl}/api/status`,
        error: null,
        data: null,
        timestamp: new Date().toISOString(),
        responseTime: 0
    };
    
    try {
        const startTime = performance.now();
        
        // Set a timeout of 5 seconds
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${baseUrl}/api/status`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        const endTime = performance.now();
        results.responseTime = Math.round(endTime - startTime);
        
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status} ${response.statusText}`);
        }
        
        // Try to parse the response as JSON
        const data = await response.json();
        results.data = data;
        results.success = true;
        
        console.log('✅ Server connection successful!');
        console.log(`Response time: ${results.responseTime}ms`);
        console.log('Server status:', data.status);
        console.log('Server message:', data.message);
        
        return results;
    } catch (error) {
        results.error = {
            name: error.name,
            message: error.message,
            stack: error.stack
        };
        
        if (error.name === 'AbortError') {
            console.error('❌ Server connection failed: Request timed out after 5 seconds');
        } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            console.error('❌ Server connection failed: Cannot reach server');
            console.error('Make sure the server is running and CORS is properly configured');
        } else {
            console.error('❌ Server connection failed:', error.message);
        }
        
        // Additional helpful diagnostics
        console.error('Common issues:');
        console.error('1. Is the server running on port 3000?');
        console.error('2. Check if CORS is enabled on the server');
        console.error('3. Check for network issues or firewall restrictions');
        console.error('4. Verify the API endpoint path is correct');
        
        return results;
    }
}

/**
 * Displays the server test results in the UI
 * @param {Object} results - The results from testServerConnection
 * @param {string} containerId - The ID of the container to display results in
 */
function displayServerTestResults(results, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Cannot display test results: Container not found');
        return;
    }
    
    const resultHtml = `
        <div class="server-test-results card mb-4">
            <div class="card-header bg-${results.success ? 'success' : 'danger'} text-white">
                <h5 class="mb-0">Server Connection Test: ${results.success ? 'Successful' : 'Failed'}</h5>
            </div>
            <div class="card-body">
                <p><strong>Endpoint:</strong> ${results.endpoint}</p>
                <p><strong>Timestamp:</strong> ${results.timestamp}</p>
                <p><strong>Response Time:</strong> ${results.responseTime}ms</p>
                ${results.error ? `
                    <div class="alert alert-danger">
                        <strong>Error:</strong> ${results.error.message}
                    </div>
                ` : ''}
                ${results.success ? `
                    <div class="alert alert-success">
                        <strong>Success!</strong> Server status: ${results.data.status}. ${results.data.message}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    container.innerHTML = resultHtml;
}

// Add a function that both tests the connection and displays results
function runServerTest(containerId = 'home-page', baseUrl = 'http://localhost:3000') {
    console.log('Running server connection test...');
    
    // Add a temporary display area if needed
    const container = document.getElementById(containerId);
    const testContainerId = 'server-test-container';
    let testContainer = document.getElementById(testContainerId);
    
    if (!testContainer && container) {
        testContainer = document.createElement('div');
        testContainer.id = testContainerId;
        container.prepend(testContainer);
    }
    
    // Show loading indicator
    if (testContainer) {
        testContainer.innerHTML = `
            <div class="card mb-4">
                <div class="card-body text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Testing connection...</span>
                    </div>
                    <p class="mt-2">Testing connection to server...</p>
                </div>
            </div>
        `;
    }
    
    // Run the test
    testServerConnection(baseUrl)
        .then(results => {
            if (testContainer) {
                displayServerTestResults(results, testContainerId);
            }
            
            return results;
        })
        .catch(error => {
            console.error('Error running server test:', error);
            
            if (testContainer) {
                testContainer.innerHTML = `
                    <div class="alert alert-danger">
                        <strong>Error:</strong> Could not complete the server test.
                    </div>
                `;
            }
        });
}

// Export functions for use in other modules
window.serverTest = {
    test: testServerConnection,
    display: displayServerTestResults,
    run: runServerTest
};