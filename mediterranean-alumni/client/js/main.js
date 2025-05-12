/**
 * Main Application Module for Mediterranean College Alumni Network
 * Handles page navigation, event listeners, and data loading
 */

// Keep track of the current page
let currentPage = 'home-page';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set up navigation event listeners
    setupNavigation();
    
    // Load schools data for the schools page
    loadSchools();
    
    // Load alumni data for the alumni directory
    loadAlumniDirectory();
    
    // Set up filter event listeners
    setupFilters();
    
    // Initialize the graduation year dropdown
    initGraduationYearFilter();
    
    // Set up admin functions if user is admin
    if (window.auth && window.auth.getCurrentUser() && window.auth.getCurrentUser().role === 'admin') {
        setupAdminFunctions();
    }
});

/**
 * Set up navigation and button event listeners
 */
function setupNavigation() {
    // Navbar links
    document.getElementById('home-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('home-page');
    });
    
    document.getElementById('schools-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('schools-page');
    });
    
    document.getElementById('alumni-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('alumni-page');
    });
    
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
}

/**
 * Shows a specific page and hides all others
 * @param {string} pageId - The ID of the page to show
 */
function showPage(pageId) {
    // Get all pages
    const pages = document.querySelectorAll('.container > div[id$="-page"], .container > div[id$="-form"], .container > div[id="profile-view"], .container > div[id="profile-edit"]');
    
    // Hide all pages
    pages.forEach(page => {
        page.style.display = 'none';
    });
    
    // Show the requested page
    const pageToShow = document.getElementById(pageId);
    if (pageToShow) {
        pageToShow.style.display = 'block';
        currentPage = pageId;
        
        // Update active nav link
        updateActiveNavLink(pageId);
    }
}

/**
 * Updates the active nav link based on current page
 * @param {string} pageId - The ID of the current page
 */
function updateActiveNavLink(pageId) {
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to the corresponding nav link
    let activeLink;
    
    switch (pageId) {
        case 'home-page':
            activeLink = document.getElementById('home-link');
            break;
        case 'schools-page':
            activeLink = document.getElementById('schools-link');
            break;
        case 'alumni-page':
            activeLink = document.getElementById('alumni-link');
            break;
        case 'admin-page':
            activeLink = document.getElementById('admin-link');
            break;
        case 'profile-view':
        case 'profile-edit':
            // Don't highlight any nav link for profile pages
            return;
        default:
            // Don't highlight any nav link for forms
            return;
    }
    
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

/**
 * Loads the schools data and populates the schools page
 */
async function loadSchools() {
    try {
        const response = await fetch('/api/schools');
        const schools = await response.json();
        
        const schoolsContainer = document.getElementById('schools-container');
        schoolsContainer.innerHTML = '';
        
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
        const schoolsContainer = document.getElementById('schools-container');
        schoolsContainer.innerHTML = '<div class="alert alert-danger">Failed to load schools data. Please try again later.</div>';
    }
}

/**
 * Loads the alumni directory data
 */
async function loadAlumniDirectory() {
    try {
        const response = await fetch('/api/users/alumni');
        const alumni = await response.json();
        
        displayAlumni(alumni);
        
    } catch (error) {
        console.error('Error loading alumni directory:', error);
        const alumniContainer = document.getElementById('alumni-container');
        alumniContainer.innerHTML = '<div class="alert alert-danger">Failed to load alumni data. Please try again later.</div>';
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
                            <h6 class="card-subtitle mb-2 text-muted">${alumnus.schoolName || 'School not specified'}</h6>
                            <p class="card-text text-muted">${alumnus.graduationYear ? 'Class of ' + alumnus.graduationYear : ''}</p>
                        </div>
                        <img src="${alumnus.profileImage || 'images/default-profile.png'}" class="rounded-circle" width="60" height="60">
                    </div>
                    <p class="card-text">${alumnus.currentPosition ? alumnus.currentPosition + (alumnus.company ? ' at ' + alumnus.company : '') : 'Position not specified'}</p>
                </div>
                <div class="card-footer">
                    <button class="btn btn-primary btn-sm view-profile" data-user-id="${alumnus.id}">View Profile</button>
                </div>
            </div>
        `;
        
        alumniContainer.appendChild(card);
    });
    
    // Add event listeners to view profile buttons
    document.querySelectorAll('.view-profile').forEach(button => {
        button.addEventListener('click', () => {
            const userId = button.getAttribute('data-user-id');
            window.profile.loadProfile(userId);
            showPage('profile-view');
        });
    });
}

/**
 * Sets up event listeners for the alumni filters
 */
function setupFilters() {
    document.getElementById('filter-school')?.addEventListener('change', filterAlumni);
    document.getElementById('filter-year')?.addEventListener('change', filterAlumni);
    document.getElementById('search-alumni')?.addEventListener('input', debounce(filterAlumni, 300));
}

/**
 * Creates a simple debounce function for input events
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce delay in milliseconds
 * @returns {Function} - The debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

/**
 * Filters alumni based on selected criteria
 */
async function filterAlumni() {
    const schoolId = document.getElementById('filter-school').value;
    const graduationYear = document.getElementById('filter-year').value;
    const searchQuery = document.getElementById('search-alumni').value.trim();
    
    let url = '/api/users/alumni?';
    
    if (schoolId && schoolId !== '0') {
        url += `schoolId=${schoolId}&`;
    }
    
    if (graduationYear && graduationYear !== '0') {
        url += `graduationYear=${graduationYear}&`;
    }
    
    if (searchQuery) {
        url += `search=${encodeURIComponent(searchQuery)}&`;
    }
    
    try {
        const response = await fetch(url);
        const alumni = await response.json();
        
        displayAlumni(alumni);
        
    } catch (error) {
        console.error('Error filtering alumni:', error);
        alert('Failed to filter alumni. Please try again later.');
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
    
    // Add graduation years from current year to 30 years ago
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 30; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

/**
 * Sets up admin-specific functions
 */
function setupAdminFunctions() {
    // Load admin data when admin page is shown
    document.getElementById('admin-link')?.addEventListener('click', loadAdminData);
    
    // Add school button
    document.getElementById('add-school-btn')?.addEventListener('click', () => {
        // In a real application, this would show a modal to add a new school
        alert('Add school functionality will be implemented in a future version.');
    });
}

/**
 * Loads data for the admin dashboard
 */
async function loadAdminData() {
    if (!window.auth || !window.auth.isAuthenticated() || !window.auth.getCurrentUser() || window.auth.getCurrentUser().role !== 'admin') {
        return;
    }
    
    try {
        // Load pending applications
        const pendingResponse = await fetch('/api/admin/pending-applications', {
            headers: {
                'Authorization': `Bearer ${window.auth.getAuthToken()}`
            }
        });
        
        if (!pendingResponse.ok) {
            throw new Error('Failed to load pending applications');
        }
        
        const pendingApplications = await pendingResponse.json();
        displayPendingApplications(pendingApplications);
        
        // Load all users
        const usersResponse = await fetch('/api/admin/users', {
            headers: {
                'Authorization': `Bearer ${window.auth.getAuthToken()}`
            }
        });
        
        if (!usersResponse.ok) {
            throw new Error('Failed to load users');
        }
        
        const users = await usersResponse.json();
        displayAllUsers(users);
        
        // Load schools for admin
        const schoolsResponse = await fetch('/api/admin/schools', {
            headers: {
                'Authorization': `Bearer ${window.auth.getAuthToken()}`
            }
        });
        
        if (!schoolsResponse.ok) {
            throw new Error('Failed to load schools');
        }
        
        const schools = await schoolsResponse.json();
        displaySchoolsAdmin(schools);
        
    } catch (error) {
        console.error('Error loading admin data:', error);
        alert('Failed to load admin data. Please try again later.');
    }
}

/**
 * Displays pending applications in the admin dashboard
 * @param {Array} applications - The pending applications data
 */
function displayPendingApplications(applications) {
    const tbody = document.getElementById('pending-applications');
    tbody.innerHTML = '';
    
    if (applications.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No pending applications</td></tr>';
        return;
    }
    
    applications.forEach(app => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${app.firstName} ${app.lastName}</td>
            <td>${app.email}</td>
            <td>${app.schoolName || 'Not specified'}</td>
            <td>${app.graduationYear || 'Not specified'}</td>
            <td>
                <button class="btn btn-sm btn-success approve-application" data-id="${app.id}">Approve</button>
                <button class="btn btn-sm btn-danger reject-application" data-id="${app.id}">Reject</button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.approve-application').forEach(button => {
        button.addEventListener('click', async () => {
            const id = button.getAttribute('data-id');
            await handleApplicationAction(id, 'approve');
        });
    });
    
    document.querySelectorAll('.reject-application').forEach(button => {
        button.addEventListener('click', async () => {
            const id = button.getAttribute('data-id');
            await handleApplicationAction(id, 'reject');
        });
    });
}

/**
 * Handles approval or rejection of an application
 * @param {string} id - The application ID
 * @param {string} action - The action to take ('approve' or 'reject')
 */
async function handleApplicationAction(id, action) {
    try {
        const response = await fetch(`/api/admin/applications/${id}/${action}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${window.auth.getAuthToken()}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to ${action} application`);
        }
        
        // Reload admin data
        loadAdminData();
        
        alert(`Application ${action === 'approve' ? 'approved' : 'rejected'} successfully.`);
        
    } catch (error) {
        console.error(`Error ${action}ing application:`, error);
        alert(`Failed to ${action} application. Please try again later.`);
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
    
    // Add event listeners to buttons
    document.querySelectorAll('.view-user').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            window.profile.loadProfile(id);
            showPage('profile-view');
        });
    });
    
    document.querySelectorAll('.edit-user-role').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            // In a real application, this would show a modal to edit the user's role
            alert('Edit role functionality will be implemented in a future version.');
        });
    });
    
    document.querySelectorAll('.delete-user').forEach(button => {
        button.addEventListener('click', async () => {
            const id = button.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
                await handleDeleteUser(id);
            }
        });
    });
}

/**
 * Handles deletion of a user
 * @param {string} id - The user ID
 */
async function handleDeleteUser(id) {
    try {
        const response = await fetch(`/api/admin/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${window.auth.getAuthToken()}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete user');
        }
        
        // Reload admin data
        loadAdminData();
        
        alert('User deleted successfully.');
        
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again later.');
    }
}

/**
 * Displays schools in the admin dashboard
 * @param {Array} schools - The schools data
 */
function displaySchoolsAdmin(schools) {
    const tbody = document.getElementById('schools-list');
    tbody.innerHTML = '';
    
    if (schools.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No schools found</td></tr>';
        return;
    }
    
    schools.forEach(school => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${school.name}</td>
            <td>${school.description || 'No description'}</td>
            <td>${school.alumniCount || 0}</td>
            <td>
                <button class="btn btn-sm btn-warning edit-school" data-id="${school.id}">Edit</button>
                <button class="btn btn-sm btn-danger delete-school" data-id="${school.id}">Delete</button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.edit-school').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            // In a real application, this would show a modal to edit the school
            alert('Edit school functionality will be implemented in a future version.');
        });
    });
    
    document.querySelectorAll('.delete-school').forEach(button => {
        button.addEventListener('click', async () => {
            const id = button.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this school? This will affect all alumni associated with it.')) {
                await handleDeleteSchool(id);
            }
        });
    });
}

/**
 * Handles deletion of a school
 * @param {string} id - The school ID
 */
async function handleDeleteSchool(id) {
    try {
        const response = await fetch(`/api/admin/schools/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${window.auth.getAuthToken()}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete school');
        }
        
        // Reload admin data
        loadAdminData();
        
        // Also reload schools for the main page
        loadSchools();
        
        alert('School deleted successfully.');
        
    } catch (error) {
        console.error('Error deleting school:', error);
        alert('Failed to delete school. Please try again later.');
    }
}
