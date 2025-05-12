/**
 * Loading Indicator Module for Mediterranean College Alumni Network
 * Provides functions to show and hide loading spinners in any container
 */

/**
 * Shows a loading spinner inside the specified container
 * @param {string} containerId - The ID of the container element to show the spinner in
 * @param {string} [message='Loading...'] - Optional custom loading message
 * @returns {boolean} - Success status
 */
function showLoading(containerId, message = 'Loading...') {
    // Get the container element
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Loading indicator error: Container with ID "${containerId}" not found`);
        return false;
    }
    
    // Check if there's already a loading indicator
    if (container.querySelector('.loading-indicator')) {
        console.warn(`Loading indicator already exists in container "${containerId}"`);
        return true; // Already showing
    }
    
    // Create loading indicator elements
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-indicator';
    loadingDiv.innerHTML = `
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">${message}</p>
    `;
    
    // Add styles to the loading indicator
    loadingDiv.style.display = 'flex';
    loadingDiv.style.flexDirection = 'column';
    loadingDiv.style.alignItems = 'center';
    loadingDiv.style.justifyContent = 'center';
    loadingDiv.style.padding = '2rem';
    loadingDiv.style.textAlign = 'center';
    
    // Add the loading indicator to the container
    container.appendChild(loadingDiv);
    
    return true;
}

/**
 * Hides the loading spinner from the specified container
 * @param {string} containerId - The ID of the container element to remove the spinner from
 * @returns {boolean} - Success status
 */
function hideLoading(containerId) {
    // Get the container element
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Hide loading error: Container with ID "${containerId}" not found`);
        return false;
    }
    
    // Find and remove the loading indicator
    const loadingIndicator = container.querySelector('.loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.remove();
        return true;
    } else {
        console.warn(`No loading indicator found in container "${containerId}"`);
        return false;
    }
}

// Export the functions for use in other modules
window.loading = {
    show: showLoading,
    hide: hideLoading
};