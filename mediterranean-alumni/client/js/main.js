/**
 * Main Application Module for Mediterranean College Alumni Network
 * Handles page navigation, event listeners, and data loading
 * Uses real API calls to fetch and manage data
 */

// Keep track of the current page
let currentPage = 'home-page';

// Initialize the app when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app');
    initializeApp();
});

/**
 * Initializes the application
 */
function initializeApp() {
    console.log('initializeApp called');
    
    // Set up navigation
    setupEventListeners();
    
    // Initialize filter dropdowns
    initSchoolFilter();
    initGraduationYearFilter();
    
    // If auth module exists and has necessary functions
    if (window.auth && typeof window.auth.isAuthenticated === 'function') {
        // Export showPage function to window.auth for use after login
        window.auth.showPage = showPage;
        
        // Export update function to window.auth
        window.auth.updateUIForLoggedInUser = window.auth.updateUIForLoggedInUser;
        
        console.log('Exported showPage and updateUIForLoggedInUser to auth module');
    } else {
        console.error('Error: auth module not available at initialization');
    }
    
    // Load data for the current page
    loadPageData(currentPage);
    
    console.log('App initialization complete');
}

/**
 * Sets up event listeners for navigation and buttons
 */
function setupEventListeners() {
    // Navigation links - Fixed IDs to match HTML
    document.getElementById('home-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('home-page');
    });
    
    document.getElementById('schools-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('[NAV] Schools link clicked');
        showPage('schools-page');
        loadSchools();
    });
    
    document.getElementById('alumni-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('[NAV] Alumni link clicked');
        showPage('alumni-page');
        loadAlumniDirectory();
    });
    
    document.getElementById('nav-contact')?.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('contact-page');
    });
    
    // Logo click
    document.querySelector('.navbar-brand')?.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('home-page');
    });
    
    // Admin link
    document.getElementById('admin-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('admin-page');
        loadAdminData();
    });
    
    // Auth buttons
    document.getElementById('login-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('login-form');
    });
    
    document.getElementById('register-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('register-form');
    });
    
    // Home page buttons
    document.getElementById('join-now-btn')?.addEventListener('click', () => {
        if (window.auth && window.auth.isAuthenticated()) {
            showPage('alumni-page');
        } else {
            showPage('register-form');
        }
    });
    
    document.getElementById('browse-alumni-btn')?.addEventListener('click', () => {
        showPage('alumni-page');
    });
    
    document.getElementById('events-btn')?.addEventListener('click', () => {
        // This would normally go to an events page
        // For now, just show an alert
        alert('Events feature coming soon!');
    });
    
    // Server test button
    document.getElementById('test-server-btn')?.addEventListener('click', () => {
        if (window.serverTest && window.serverTest.run) {
            window.serverTest.run('server-test-container');
        } else {
            alert('Server test module not loaded. Please check the console for errors.');
        }
    });
}

/**
 * Shows a specific page and hides all others
 * @param {string} pageId - The ID of the page to show
 */
function showPage(pageId) {
    console.log(`showPage called with pageId: ${pageId}`);
    
    // Get all pages
    const pages = document.querySelectorAll('.container > div[id$="-page"], .container > div[id$="-form"], .container > div[id="profile-view"], .container > div[id="profile-edit"]');
    console.log(`Found ${pages.length} pages to manage`);
    
    // Hide all pages
    pages.forEach(page => {
        page.style.display = 'none';
        console.log(`Hidden page: ${page.id}`);
    });
    
    // Show the requested page
    const pageToShow = document.getElementById(pageId);
    if (pageToShow) {
        console.log(`Showing page: ${pageId}`);
        pageToShow.style.display = 'block';
        currentPage = pageId;
        
        // Update active nav link
        updateActiveNavLink(pageId);
    } else {
        console.error(`Page not found: ${pageId}`);
    }
}

/**
 * Updates the active nav link based on current page
 * @param {string} pageId - The ID of the current page
 */
function updateActiveNavLink(pageId) {
    console.log(`updateActiveNavLink called with pageId: ${pageId}`);
    
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    console.log(`Found ${navLinks.length} nav links`);
    
    navLinks.forEach(link => {
        if (link.classList.contains('active')) {
            console.log(`Removing active class from: ${link.id || 'unnamed link'}`);
        }
        link.classList.remove('active');
    });
    
    // Add active class to the corresponding nav link
    let activeLink;
    
    switch (pageId) {
        case 'home-page':
            activeLink = document.getElementById('nav-home');
            break;
        case 'schools-page':
            activeLink = document.getElementById('nav-schools');
            break;
        case 'alumni-page':
            activeLink = document.getElementById('nav-alumni');
            break;
        case 'contact-page':
            activeLink = document.getElementById('nav-contact');
            break;
        case 'admin-page':
            activeLink = document.getElementById('admin-link');
            break;
        default:
            console.log(`No nav link mapping for page: ${pageId}`);
            break;
    }
    
    if (activeLink) {
        activeLink.classList.add('active');
        console.log(`Added active class to: ${activeLink.id}`);
    }
}

/**
 * Loads data for the current page (if needed)
 * @param {string} pageId - The ID of the page being loaded
 */
function loadPageData(pageId) {
    switch (pageId) {
        case 'schools-page':
            loadSchools();
            break;
        case 'alumni-page':
            loadAlumniDirectory();
            break;
        case 'admin-page':
            if (window.auth && window.auth.isAuthenticated() && window.auth.getCurrentUser()?.role === 'admin') {
                loadAdminData();
            }
            break;
    }
}

/**
 * Loads the schools data
 * Uses real API call to fetch schools data
 */
async function loadSchools() {
    const schoolsContainer = document.getElementById('schools-container');
    schoolsContainer.innerHTML = '';
    
    // Show loading indicator if available
    if (window.loading && window.loading.show) {
        window.loading.show('schools-page', 'Loading schools...');
    }
    
    try {
        // Make real API call to fetch schools
        const response = await fetch('/api/schools');
        const schools = await response.json();
        
        schools.forEach(school => {
            const schoolCard = document.createElement('div');
            schoolCard.className = 'col';
            schoolCard.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${school.name}</h5>
                        <p class="card-text">${school.description || 'No description available.'}</p>
                        <p class="text-muted">Alumni: ${school.alumniCount || 0}</p>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-outline-primary view-school-alumni" data-school-id="${school.id}">View Alumni</button>
                    </div>
                </div>
            `;
            
            schoolsContainer.appendChild(schoolCard);
        });
        
        // Add event listeners to view alumni buttons
        document.querySelectorAll('.view-school-alumni').forEach(button => {
            button.addEventListener('click', () => {
                const schoolId = button.getAttribute('data-school-id');
                document.getElementById('filter-school').value = schoolId;
                filterAlumni();
                showPage('alumni-page');
            });
        });
    } catch (error) {
        console.error('Error loading schools:', error);
        schoolsContainer.innerHTML = '<div class="col-12"><div class="alert alert-danger">Failed to load schools. Please try again later.</div></div>';
    } finally {
        // Hide loading indicator if it was shown
        if (window.loading && window.loading.hide) {
            window.loading.hide('schools-page');
        }
    }
}

/**
 * Loads the alumni directory data
 * Uses real API call to fetch alumni data
 */
async function loadAlumniDirectory() {
    const alumniContainer = document.getElementById('alumni-container');
    alumniContainer.innerHTML = '';
    
    // Show loading indicator if available
    if (window.loading && window.loading.show) {
        window.loading.show('alumni-page', 'Loading alumni...');
    }
    
    try {
        // Make real API call to fetch alumni data
        const response = await fetch('/api/users/alumni');
        const alumni = await response.json();
        displayAlumni(alumni);
    } catch (error) {
        console.error('Error loading alumni:', error);
        alumniContainer.innerHTML = '<div class="col-12"><div class="alert alert-danger">Failed to load alumni data. Please try again later.</div></div>';
    } finally {
        // Hide loading indicator if it was shown
        if (window.loading && window.loading.hide) {
            window.loading.hide('alumni-page');
        }
    }
}

/**
 * Displays alumni in the alumni directory
 * @param {Array} alumni - The alumni data to display
 */
function displayAlumni(alumni) {
    const alumniContainer = document.getElementById('alumni-container');
    alumniContainer.innerHTML = '';
    
    if (alumni.length === 0) {
        alumniContainer.innerHTML = '<div class="col-12"><div class="alert alert-info">No alumni found matching your criteria.</div></div>';
        return;
    }
    
    alumni.forEach(alumnus => {
        const card = document.createElement('div');
        card.className = 'col';
        card.innerHTML = `
            <div class="card alumni-card">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h5 class="card-title">${alumnus.firstName} ${alumnus.lastName}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">
                                <i class="fas fa-university me-1"></i> ${alumnus.schoolName || 'School not specified'}
                            </h6>
                            <p class="card-text text-muted">
                                ${alumnus.graduationYear ? '<i class="fas fa-graduation-cap me-1"></i> Class of ' + alumnus.graduationYear : ''}
                            </p>
                        </div>
                        <img src="${alumnus.profileImage || 'images/icons/default-avatar.svg'}" class="rounded-circle" width="70" height="70">
                    </div>
                    <p class="card-text">
                        <i class="fas fa-briefcase me-1"></i> ${alumnus.currentPosition || 'Position not specified'}
                        ${alumnus.company ? ` at ${alumnus.company}` : ''}
                    </p>
                    <p class="card-text alumni-bio">${alumnus.bio || 'No bio available.'}</p>
                    <div class="d-flex justify-content-end">
                        ${alumnus.linkedinUrl ? `<a href="${alumnus.linkedinUrl}" target="_blank" class="btn btn-sm btn-outline-primary"><i class="fab fa-linkedin"></i> LinkedIn</a>` : ''}
                    </div>
                </div>
            </div>
        `;
        
        alumniContainer.appendChild(card);
    });
}

/**
 * Sets up filters for the alumni directory
 */
function initSchoolFilter() {
    // School filter is now populated from the schools API
    fetch('/api/schools')
        .then(response => response.json())
        .then(schools => {
            const schoolSelect = document.getElementById('filter-school');
            
            // Clear existing options except the "All Schools" option
            const allSchoolsOption = schoolSelect.querySelector('option[value="0"]');
            schoolSelect.innerHTML = '';
            schoolSelect.appendChild(allSchoolsOption);
            
            // Add school options
            schools.forEach(school => {
                const option = document.createElement('option');
                option.value = school.id;
                option.textContent = school.name;
                schoolSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading schools for filter:', error);
        });
    
    // Set up filter event listeners
    document.getElementById('filter-school')?.addEventListener('change', filterAlumni);
    document.getElementById('filter-year')?.addEventListener('change', filterAlumni);
    document.getElementById('search-alumni')?.addEventListener('input', filterAlumni);
    document.getElementById('filter-button')?.addEventListener('click', filterAlumni);
    document.getElementById('clear-filters')?.addEventListener('click', clearFilters);
}

/**
 * Filters the alumni directory based on selected criteria
 */
async function filterAlumni() {
    console.log('filterAlumni function called');
    
    // Get filter values - safely handle potential missing elements
    const filterSchoolEl = document.getElementById('filter-school');
    const filterYearEl = document.getElementById('filter-year');
    const searchAlumniEl = document.getElementById('search-alumni');
    
    if (!filterSchoolEl || !filterYearEl || !searchAlumniEl) {
        console.error('Filter elements not found:', {
            'filter-school': !!filterSchoolEl,
            'filter-year': !!filterYearEl,
            'search-alumni': !!searchAlumniEl
        });
        return;
    }
    
    // Parse filter values
    const schoolId = parseInt(filterSchoolEl.value) || 0;
    const graduationYear = parseInt(filterYearEl.value) || 0;
    const searchQuery = searchAlumniEl.value.trim();
    
    console.log('Filter criteria:', { schoolId, graduationYear, searchQuery });
    
    const alumniContainer = document.getElementById('alumni-container');
    alumniContainer.innerHTML = '';
    
    // Show loading indicator if available
    if (window.loading && window.loading.show) {
        window.loading.show('alumni-page', 'Filtering alumni...');
    }
    
    try {
        // Build query parameters
        const params = new URLSearchParams();
        if (schoolId !== 0) params.append('schoolId', schoolId);
        if (graduationYear !== 0) params.append('graduationYear', graduationYear);
        if (searchQuery) params.append('search', searchQuery);
        
        // Make real API call with query parameters
        const response = await fetch(`/api/users/alumni?${params.toString()}`);
        const filteredAlumni = await response.json();
        
        console.log('Final filtered alumni count:', filteredAlumni.length);
        if (filteredAlumni.length === 0) {
            console.log('No alumni matched the filter criteria');
        } else {
            console.log('First match:', filteredAlumni[0].firstName, filteredAlumni[0].lastName);
        }
        
        // Display the filtered alumni
        displayAlumni(filteredAlumni);
    } catch (error) {
        console.error('Error filtering alumni:', error);
        alumniContainer.innerHTML = '<div class="col-12"><div class="alert alert-danger">Failed to filter alumni. Please try again later.</div></div>';
    } finally {
        // Hide loading indicator if it was shown
        if (window.loading && window.loading.hide) {
            window.loading.hide('alumni-page');
        }
    }
}

/**
 * Initializes the graduation year filter dropdown
 */
function initGraduationYearFilter() {
    const yearSelect = document.getElementById('filter-year');
    
    // Clear existing options except the "All Years" option
    const allYearsOption = yearSelect.querySelector('option[value="0"]');
    yearSelect.innerHTML = '';
    yearSelect.appendChild(allYearsOption);
    
    // Add graduation years from current year to 10 years ago
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 10; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

/**
 * Sets up admin-specific functions
 */
async function loadAdminData() {
    console.log('loadAdminData called');
    
    // Check authentication and admin role
    if (!window.auth) {
        console.error('Error: auth module not available');
        return;
    }
    
    if (!window.auth.isAuthenticated()) {
        console.warn('User is not authenticated');
        return;
    }
    
    const currentUser = window.auth.getCurrentUser();
    if (!currentUser) {
        console.error('Error: Current user data not available');
        return;
    }
    
    if (currentUser.role !== 'admin') {
        console.warn('User is not an admin:', currentUser.role);
        return;
    }
    
    console.log('Admin authentication verified');
    
    // Show loading indicator if available
    if (window.loading && window.loading.show) {
        window.loading.show('admin-page', 'Loading admin dashboard...');
    }
    
    try {
        // Get auth token
        const authToken = window.auth?.authToken || localStorage.getItem('authToken');
        
        // Fetch pending applications
        const pendingResponse = await fetch('/api/admin/users/pending', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (pendingResponse.ok) {
            const pendingApplications = await pendingResponse.json();
            console.log(`Loading ${pendingApplications.length} pending applications`);
            displayPendingApplications(pendingApplications);
        } else {
            console.error('Failed to fetch pending applications');
            displayPendingApplications([]);
        }
        
        // Fetch all users
        const usersResponse = await fetch('/api/admin/users/all', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (usersResponse.ok) {
            const users = await usersResponse.json();
            console.log(`Loading ${users.length} users`);
            displayAllUsers(users);
        } else {
            console.error('Failed to fetch users');
            displayAllUsers([]);
        }
        
        // Fetch schools data
        const schoolsResponse = await fetch('/api/schools');
        
        if (schoolsResponse.ok) {
            const schools = await schoolsResponse.json();
            console.log(`Loading ${schools.length} schools`);
            displaySchoolsAdmin(schools);
        } else {
            console.error('Failed to fetch schools');
            displaySchoolsAdmin([]);
        }
        
        console.log('Admin dashboard data loaded successfully');
    } catch (error) {
        console.error('Error loading admin data:', error);
        
        // Show error message on the admin page
        const adminContainer = document.getElementById('admin-page');
        if (adminContainer) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger';
            errorDiv.textContent = 'Error loading admin dashboard data. Please try refreshing the page.';
            adminContainer.prepend(errorDiv);
        }
    } finally {
        // Hide loading indicator if it was shown
        if (window.loading && window.loading.hide) {
            window.loading.hide('admin-page');
        }
    }
}

/**
 * Displays pending applications in the admin dashboard
 * @param {Array} applications - The pending applications data
 */
function displayPendingApplications(applications) {
    console.log('displayPendingApplications called with:', applications);
    
    // Safely get the tbody element
    const tbody = document.getElementById('pending-applications');
    if (!tbody) {
        console.error('Error: pending-applications element not found in the DOM');
        return;
    }
    
    console.log('Found tbody element for pending applications');
    
    // Check if applications is valid array
    if (!Array.isArray(applications)) {
        console.error('Error: applications is not an array:', applications);
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Error loading applications data</td></tr>';
        return;
    }
    
    // Clear the table
    tbody.innerHTML = '';
    console.log(`Cleared table, will add ${applications.length} applications`);
    
    // Handle empty applications list
    if (applications.length === 0) {
        console.log('No pending applications to display');
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No pending applications</td></tr>';
        return;
    }
    
    // Add each application to the table
    applications.forEach((app, index) => {
        console.log(`Processing application ${index + 1}:`, app.id, app.firstName, app.lastName);
        
        // Validate application object has required fields
        if (!app || !app.id) {
            console.warn(`Application ${index} is invalid or missing ID`, app);
            return; // Skip this application
        }
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${app.firstName || ''} ${app.lastName || ''}</td>
            <td>${app.email || 'No email'}</td>
            <td>${app.schoolName || 'Not specified'}</td>
            <td>${app.graduationYear || 'Not specified'}</td>
            <td>
                <button class="btn btn-sm btn-success approve-application" data-id="${app.id}">Approve</button>
                <button class="btn btn-sm btn-danger reject-application" data-id="${app.id}">Reject</button>
            </td>
        `;
        
        tbody.appendChild(tr);
        console.log(`Added application ${app.id} to table`);
    });
    
    console.log('Setting up event listeners for approval/rejection buttons');
    
    // Remove any existing event listeners (to prevent duplicates)
    const approveButtons = document.querySelectorAll('.approve-application');
    const rejectButtons = document.querySelectorAll('.reject-application');
    
    console.log(`Found ${approveButtons.length} approve buttons and ${rejectButtons.length} reject buttons`);
    
    // Add event listeners to approve buttons
    approveButtons.forEach(button => {
        // Clone and replace to remove existing listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', async () => {
            const id = newButton.getAttribute('data-id');
            console.log(`Approve button clicked for application ID: ${id}`);
            await handleApplicationAction(id, 'approve');
        });
    });
    
    // Add event listeners to reject buttons
    rejectButtons.forEach(button => {
        // Clone and replace to remove existing listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', async () => {
            const id = newButton.getAttribute('data-id');
            console.log(`Reject button clicked for application ID: ${id}`);
            await handleApplicationAction(id, 'reject');
        });
    });
    
    console.log('Finished setting up pending applications table');
}

/**
 * Handles approve/reject actions for applications
 * @param {string} id - The ID of the application
 * @param {string} action - The action to perform ('approve' or 'reject')
 */
async function handleApplicationAction(id, action) {
    console.log(`handleApplicationAction called with id: ${id}, action: ${action}`);
    
    if (!id) {
        console.error('Error: No application ID provided');
        alert('Error: Application ID is missing');
        return;
    }
    
    if (action !== 'approve' && action !== 'reject') {
        console.error('Error: Invalid action:', action);
        alert('Error: Invalid action');
        return;
    }
    
    // Show loading indicator if available
    if (window.loading && window.loading.show) {
        window.loading.show('admin-page', `${action === 'approve' ? 'Approving' : 'Rejecting'} application...`);
    }
    
    try {
        // Get auth token
        const authToken = window.auth?.authToken || localStorage.getItem('authToken');
        
        if (action === 'approve') {
            // Make real API call to approve the application
            const response = await fetch(`/api/admin/applications/${id}/approve`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to approve application`);
            }
            
            const result = await response.json();
            console.log('Application approved:', result);
        } else {
            // For reject action, we need to implement a reject endpoint
            // For now, we'll use a generic update endpoint to change status
            const response = await fetch(`/api/admin/applications/${id}/reject`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to reject application`);
            }
            
            const result = await response.json();
            console.log('Application rejected:', result);
        }
        
        // Reload admin data to reflect changes
        console.log('Reloading admin data');
        await loadAdminData();
        
        console.log(`Application ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
        alert(`Application ${action === 'approve' ? 'approved' : 'rejected'} successfully.`);
        
    } catch (error) {
        console.error('Error handling application action:', error);
        alert(`Failed to ${action} application: ${error.message}`);
    } finally {
        // Hide loading indicator if it was shown
        if (window.loading && window.loading.hide) {
            window.loading.hide('admin-page');
        }
    }
}

/**
 * Displays all users in the admin dashboard
 * @param {Array} users - The users data
 */
function displayAllUsers(users) {
    const tbody = document.getElementById('all-users');
    tbody.innerHTML = '';
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No users found</td></tr>';
        return;
    }
    
    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.schoolName || 'Not specified'}</td>
            <td>
                <button class="btn btn-sm btn-primary view-user" data-id="${user.id}">View</button>
                <button class="btn btn-sm btn-warning edit-user-role" data-id="${user.id}">Edit Role</button>
                <button class="btn btn-sm btn-danger delete-user" data-id="${user.id}">Delete</button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    // Add event listeners (implementation needed)
    // TODO: Implement view, edit, and delete user functionality
}

/**
 * Displays schools in the admin dashboard
 * @param {Array} schools - The schools data
 */
function displaySchoolsAdmin(schools) {
    const tbody = document.getElementById('schools-admin');
    tbody.innerHTML = '';
    
    if (schools.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center">No schools found</td></tr>';
        return;
    }
    
    schools.forEach(school => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${school.name}</td>
            <td>${school.alumniCount || 0}</td>
            <td>
                <button class="btn btn-sm btn-primary edit-school" data-id="${school.id}">Edit</button>
                <button class="btn btn-sm btn-danger delete-school" data-id="${school.id}">Delete</button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    // Add event listeners (implementation needed)
    // TODO: Implement edit and delete school functionality
}

/**
 * Handles deletion of a user
 * @param {number} id - The user ID to delete
 */
async function handleDeleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }
    
    // TODO: Implement API call to delete user
    alert('User deletion not yet implemented');
}

/**
 * Handles deletion of a school
 * @param {number} id - The school ID to delete
 */
async function handleDeleteSchool(id) {
    if (!confirm('Are you sure you want to delete this school?')) {
        return;
    }
    
    // TODO: Implement API call to delete school
    alert('School deletion not yet implemented');
}

/**
 * Test server connectivity to the /api/schools endpoint
 * Run this function from the browser console to check if the server is accessible
 * @param {string} [baseUrl='http://localhost:3000'] - The base URL of the server
 * @returns {Promise<Object>} - A promise that resolves with school data or rejects with an error
 */
async function testServerConnection(baseUrl = 'http://localhost:3000') {
    console.log(`Testing server connection to ${baseUrl}/api/schools...`);
    
    try {
        // Start timer
        const startTime = performance.now();
        
        // Fetch schools from the server
        const response = await fetch(`${baseUrl}/api/schools`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        // End timer
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status} ${response.statusText}`);
        }
        
        // Parse the response
        const schools = await response.json();
        
        // Log results
        console.log(`✅ Server connection successful!`);
        console.log(`Response time: ${responseTime}ms`);
        console.log(`Received ${schools.length} schools`);
        
        // Print the schools
        schools.forEach((school, index) => {
            console.log(`${index + 1}. ${school.name} - ${school.alumni_count || 0} alumni`);
        });
        
        return schools;
    } catch (error) {
        console.error(`❌ Server connection failed:`, error.message);
        
        if (error.message.includes('Failed to fetch')) {
            console.error('The server might be offline or the URL might be incorrect.');
            console.error(`Attempted URL: ${baseUrl}/api/schools`);
        }
        
        throw error;
    }
}

/**
 * Clears all filters in the alumni directory
 */
function clearFilters() {
    document.getElementById('filter-school').value = '0';
    document.getElementById('filter-year').value = '0';
    document.getElementById('search-alumni').value = '';
    loadAlumniDirectory();
}

// Export key functions to global scope
window.main = {
    showPage: showPage
};

// Fix for username display
(function() {
    console.log('[USERNAME FIX] Starting username display fix');
    
    function updateUsername() {
        if (window.auth && window.auth.isAuthenticated() && window.auth.getCurrentUser()) {
            var user = window.auth.getCurrentUser();
            var userNameElement = document.getElementById('user-name');
            if (userNameElement) {
                var displayName = (user.firstName || 'User') + ' ' + (user.lastName || '');
                userNameElement.textContent = displayName.trim();
                console.log('[USERNAME FIX] Updated username to:', displayName);
            }
        }
    }
    
    // Update on load and after delays
    updateUsername();
    setTimeout(updateUsername, 500);
    setTimeout(updateUsername, 1000);
    
    // Override auth update function
    if (window.auth) {
        var originalUpdate = window.auth.updateUIForLoggedInUser;
        window.auth.updateUIForLoggedInUser = function(user) {
            console.log('[USERNAME FIX] Intercepted updateUIForLoggedInUser');
            if (originalUpdate) {
                originalUpdate.call(this, user);
            }
            updateUsername();
        };
    }
})();

// Navigation debugging and fix
(function() {
    console.log('[NAV FIX] Starting navigation fix');
    
    // Force fix navigation after a delay to ensure everything is loaded
    function forceFixNavigation() {
        console.log('[NAV FIX] Running navigation fix');
        
        // Schools link
        var schoolsLink = document.getElementById('schools-link');
        if (schoolsLink) {
            schoolsLink.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('[NAV FIX] Schools clicked - direct handler');
                
                // Hide all pages first
                document.querySelectorAll('.container > div').forEach(function(div) {
                    div.style.display = 'none';
                });
                
                // Show schools page
                var schoolsPage = document.getElementById('schools-page');
                if (schoolsPage) {
                    schoolsPage.style.display = 'block';
                    console.log('[NAV FIX] Schools page shown');
                }
                
                // Call loadSchools
                if (typeof loadSchools === 'function') {
                    loadSchools();
                }
                
                return false;
            };
            console.log('[NAV FIX] Schools link fixed');
        }
        
        // Alumni link
        var alumniLink = document.getElementById('alumni-link');
        if (alumniLink) {
            alumniLink.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('[NAV FIX] Alumni clicked - direct handler');
                
                // Hide all pages first
                document.querySelectorAll('.container > div').forEach(function(div) {
                    div.style.display = 'none';
                });
                
                // Show alumni page
                var alumniPage = document.getElementById('alumni-page');
                if (alumniPage) {
                    alumniPage.style.display = 'block';
                    console.log('[NAV FIX] Alumni page shown');
                }
                
                // Call loadAlumniDirectory
                if (typeof loadAlumniDirectory === 'function') {
                    loadAlumniDirectory();
                }
                
                return false;
            };
            console.log('[NAV FIX] Alumni link fixed');
        }
    }
    
    // Run immediately and after delays
    forceFixNavigation();
    setTimeout(forceFixNavigation, 500);
    setTimeout(forceFixNavigation, 1000);
    
    // Debug function
    window.debugNav = function() {
        console.log('=== NAVIGATION DEBUG ===');
        console.log('Schools link exists:', !!document.getElementById('schools-link'));
        console.log('Alumni link exists:', !!document.getElementById('alumni-link'));
        console.log('Schools page exists:', !!document.getElementById('schools-page'));
        console.log('Alumni page exists:', !!document.getElementById('alumni-page'));
        console.log('showPage function exists:', typeof showPage === 'function');
        console.log('loadSchools function exists:', typeof loadSchools === 'function');
        console.log('loadAlumniDirectory function exists:', typeof loadAlumniDirectory === 'function');
        
        // Check current event listeners
        var schoolsLink = document.getElementById('schools-link');
        if (schoolsLink) {
            console.log('Schools link onclick:', schoolsLink.onclick);
        }
        var alumniLink = document.getElementById('alumni-link');
        if (alumniLink) {
            console.log('Alumni link onclick:', alumniLink.onclick);
        }
    };
    
    console.log('[NAV FIX] Navigation fix loaded. Run debugNav() to check status.');
})();

// Extreme navigation fix - add this to ensure navigation works
window.addEventListener('load', function() {
    console.log('[EXTREME NAV FIX] Window loaded, applying final fixes');
    
    // Test the navigation immediately
    var testNav = function() {
        var schoolsLink = document.getElementById('schools-link');
        var alumniLink = document.getElementById('alumni-link');
        
        if (schoolsLink && alumniLink) {
            console.log('[EXTREME NAV FIX] Both links found, fixing handlers');
            
            // Schools
            schoolsLink.onclick = null;
            schoolsLink.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('[EXTREME NAV FIX] Schools clicked!');
                alert('Schools clicked - check console for debug info');
                debugNav();
                
                // Direct page manipulation
                document.querySelectorAll('.container > div').forEach(function(div) {
                    div.style.display = 'none';
                });
                var schoolsPage = document.getElementById('schools-page');
                if (schoolsPage) {
                    schoolsPage.style.display = 'block';
                }
                loadSchools();
            });
            
            // Alumni
            alumniLink.onclick = null;
            alumniLink.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('[EXTREME NAV FIX] Alumni clicked!');
                alert('Alumni clicked - check console for debug info');
                debugNav();
                
                // Direct page manipulation
                document.querySelectorAll('.container > div').forEach(function(div) {
                    div.style.display = 'none';
                });
                var alumniPage = document.getElementById('alumni-page');
                if (alumniPage) {
                    alumniPage.style.display = 'block';
                }
                loadAlumniDirectory();
            });
        }
    };
    
    testNav();
    setTimeout(testNav, 2000);
});