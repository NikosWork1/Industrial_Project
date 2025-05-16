/**
 * Main Application Module for Mediterranean College Alumni Network
 * Handles page navigation, event listeners, and data loading
 * Uses real API calls to fetch and manage data
 */

// Keep track of the current page
let currentPage = 'home-page';
    {
        id: 1,
        name: 'School of Business',
        description: 'The School of Business offers degrees in Business Administration, Marketing, Finance, and Management.',
        alumniCount: 145
    },
    {
        id: 2,
        name: 'School of Computing',
        description: 'The School of Computing offers degrees in Computer Science, Software Engineering, Data Science, and Cybersecurity.',
        alumniCount: 124
    },
    {
        id: 3,
        name: 'School of Engineering',
        description: 'The School of Engineering offers degrees in Civil Engineering, Mechanical Engineering, Electrical Engineering, and Chemical Engineering.',
        alumniCount: 98
    },
    {
        id: 4,
        name: 'School of Health Sciences',
        description: 'The School of Health Sciences offers degrees in Nursing, Pharmacy, Physical Therapy, and Public Health.',
        alumniCount: 112
    },
    {
        id: 5,
        name: 'School of Humanities',
        description: 'The School of Humanities offers degrees in English, History, Philosophy, and Psychology.',
        alumniCount: 86
    }
];

// Mock Data for Alumni
const mockAlumni = [
    {
        id: 1,
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        schoolId: 2,
        schoolName: 'School of Computing',
        graduationYear: 2018,
        degree: 'BSc in Computer Science',
        currentPosition: 'Software Engineer',
        company: 'Tech Innovations',
        bio: 'Experienced software engineer with a passion for developing scalable applications. I have contributed to several open-source projects and enjoy mentoring junior developers.',
        linkedinUrl: 'https://linkedin.com/in/johnsmith',
        profileImage: null,
        isPublic: true
    },
    {
        id: 2,
        firstName: 'Maria',
        lastName: 'Papadopoulos',
        email: 'maria.p@example.com',
        schoolId: 1,
        schoolName: 'School of Business',
        graduationYear: 2019,
        degree: 'MBA in International Business',
        currentPosition: 'Marketing Manager',
        company: 'Global Marketing Solutions',
        bio: 'Marketing professional with expertise in digital marketing strategies. I specialize in social media marketing and content creation for international brands.',
        linkedinUrl: 'https://linkedin.com/in/maria-p',
        profileImage: null,
        isPublic: true
    },
    {
        id: 3,
        firstName: 'Nikos',
        lastName: 'Andreou',
        email: 'nikos.a@example.com',
        schoolId: 3,
        schoolName: 'School of Engineering',
        graduationYear: 2020,
        degree: 'MSc in Civil Engineering',
        currentPosition: 'Structural Engineer',
        company: 'Athens Construction Group',
        bio: 'Civil engineer specializing in structural design and analysis. I have worked on several major infrastructure projects across Greece and Europe.',
        linkedinUrl: 'https://linkedin.com/in/nikos-andreou',
        profileImage: null,
        isPublic: true
    },
    {
        id: 4,
        firstName: 'Elena',
        lastName: 'Dimitriou',
        email: 'elena.d@example.com',
        schoolId: 4,
        schoolName: 'School of Health Sciences',
        graduationYear: 2021,
        degree: 'BSc in Nursing',
        currentPosition: 'Registered Nurse',
        company: 'Athens General Hospital',
        bio: 'Registered nurse with experience in emergency care. I am passionate about patient care and continuous professional development in healthcare.',
        linkedinUrl: 'https://linkedin.com/in/elena-d',
        profileImage: null,
        isPublic: true
    },
    {
        id: 5,
        firstName: 'Dimitris',
        lastName: 'Georgiou',
        email: 'dimitris.g@example.com',
        schoolId: 5,
        schoolName: 'School of Humanities',
        graduationYear: 2017,
        degree: 'BA in Psychology',
        currentPosition: 'Clinical Psychologist',
        company: 'Athens Mental Health Center',
        bio: 'Clinical psychologist specializing in cognitive behavioral therapy. I work with clients of all ages and have a particular interest in anxiety disorders.',
        linkedinUrl: 'https://linkedin.com/in/dimitris-g',
        profileImage: null,
        isPublic: true
    },
    {
        id: 6,
        firstName: 'Sophia',
        lastName: 'Karagianni',
        email: 'sophia.k@example.com',
        schoolId: 2,
        schoolName: 'School of Computing',
        graduationYear: 2022,
        degree: 'MSc in Data Science',
        currentPosition: 'Data Scientist',
        company: 'Analytics Solutions',
        bio: 'Data scientist with expertise in machine learning and statistical analysis. I enjoy solving complex problems using data-driven approaches.',
        linkedinUrl: 'https://linkedin.com/in/sophia-k',
        profileImage: null,
        isPublic: true
    },
    {
        id: 7,
        firstName: 'Andreas',
        lastName: 'Panagiotou',
        email: 'andreas.p@example.com',
        schoolId: 1,
        schoolName: 'School of Business',
        graduationYear: 2018,
        degree: 'BSc in Finance',
        currentPosition: 'Financial Analyst',
        company: 'National Bank of Greece',
        bio: 'Financial analyst with experience in investment banking and asset management. I provide strategic financial advice to businesses and individuals.',
        linkedinUrl: 'https://linkedin.com/in/andreas-p',
        profileImage: null,
        isPublic: true
    },
    {
        id: 8,
        firstName: 'Christina',
        lastName: 'Alexiou',
        email: 'christina.a@example.com',
        schoolId: 3,
        schoolName: 'School of Engineering',
        graduationYear: 2019,
        degree: 'BSc in Electrical Engineering',
        currentPosition: 'Electrical Engineer',
        company: 'Power Systems Ltd',
        bio: 'Electrical engineer specializing in power systems and renewable energy. I have worked on several sustainable energy projects across Greece.',
        linkedinUrl: 'https://linkedin.com/in/christina-a',
        profileImage: null,
        isPublic: true
    },
    {
        id: 9,
        firstName: 'George',
        lastName: 'Papadakis',
        email: 'george.p@example.com',
        schoolId: 4,
        schoolName: 'School of Health Sciences',
        graduationYear: 2020,
        degree: 'PharmD in Pharmacy',
        currentPosition: 'Pharmacist',
        company: 'Central Pharmacy',
        bio: 'Licensed pharmacist with experience in community and clinical pharmacy. I am committed to providing quality healthcare services and medication advice.',
        linkedinUrl: 'https://linkedin.com/in/george-p',
        profileImage: null,
        isPublic: true
    }
];

// Mock Data for Users
const mockUsers = [
    {
        id: 101,
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@medcollege.edu',
        role: 'admin',
        schoolId: null,
        graduationYear: null,
        degree: null,
        currentPosition: 'System Administrator',
        company: 'Mediterranean College',
        bio: 'Administrator account for the Mediterranean College Alumni Network.',
        isPublic: false
    },
    ...mockAlumni
];

// Mock Data for Pending Applications
const mockPendingApplications = [
    {
        id: 201,
        firstName: 'Katerina',
        lastName: 'Nikolaou',
        email: 'katerina.n@example.com',
        schoolId: 5,
        schoolName: 'School of Humanities',
        graduationYear: 2022,
        degree: 'BA in English Literature',
        currentPosition: 'Content Writer',
        company: 'Digital Media Agency',
        bio: 'Recent graduate with a passion for literature and creative writing. Looking to connect with fellow alumni and explore career opportunities.',
        isPublic: true
    },
    {
        id: 202,
        firstName: 'Kostas',
        lastName: 'Vlachos',
        email: 'kostas.v@example.com',
        schoolId: 2,
        schoolName: 'School of Computing',
        graduationYear: 2023,
        degree: 'BSc in Cybersecurity',
        currentPosition: 'Security Analyst',
        company: 'Secure Systems',
        bio: 'Cybersecurity professional with a focus on network security and penetration testing. Eager to connect with alumni in the tech industry.',
        isPublic: true
    },
    {
        id: 203,
        firstName: 'Eleni',
        lastName: 'Papanikolaou',
        email: 'eleni.p@example.com',
        schoolId: 1,
        schoolName: 'School of Business',
        graduationYear: 2021,
        degree: 'BSc in Marketing',
        currentPosition: 'Digital Marketing Specialist',
        company: 'Creative Marketing',
        bio: 'Marketing specialist with expertise in SEO and content marketing. Looking to network with fellow Mediterranean College alumni.',
        isPublic: true
    }
];

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
            console.log('Profile page - not highlighting any nav link');
            return;
        default:
            console.log('Form or other page - not highlighting any nav link');
            return;
    }
    
    if (activeLink) {
        console.log(`Setting active class on: ${activeLink.id || 'unnamed link'}`);
        activeLink.classList.add('active');
    } else {
        console.warn(`No active link found for page: ${pageId}`);
    }
}

/**
 * Loads the schools data and populates the schools page
 * DEMO: Uses mock data instead of fetch
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
                        <i class="fas fa-briefcase me-1"></i> 
                        ${alumnus.currentPosition ? alumnus.currentPosition + (alumnus.company ? ' at ' + alumnus.company : '') : 'Position not specified'}
                    </p>
                    ${alumnus.bio ? `<p class="card-text small text-muted text-truncate">${alumnus.bio.substring(0, 100)}${alumnus.bio.length > 100 ? '...' : ''}</p>` : ''}
                </div>
                <div class="card-footer">
                    <button class="btn btn-primary btn-sm view-profile" data-user-id="${alumnus.id}">
                        <i class="fas fa-user me-1"></i> View Profile
                    </button>
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
 * DEMO: Filters mock data locally instead of making API calls
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
 * DEMO: Uses mock data instead of fetch
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
 * Handles approval or rejection of an application
 * DEMO: Simulates API call with local data modification
 * @param {string} id - The application ID
 * @param {string} action - The action to take ('approve' or 'reject')
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
 * DEMO: Simulates API call with local data modification
 * @param {string} id - The user ID
 */
async function handleDeleteUser(id) {
    // Remove the user from users list (in a real app, this would be an API call)
    const userIndex = mockUsers.findIndex(user => user.id.toString() === id);
    if (userIndex !== -1) {
        mockUsers.splice(userIndex, 1);
        
        // Reload admin data
        loadAdminData();
        
        alert('User deleted successfully.');
    } else {
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
 * DEMO: Simulates API call with local data modification
 * @param {string} id - The school ID
 */
async function handleDeleteSchool(id) {
    // Remove the school from schools list (in a real app, this would be an API call)
    const schoolIndex = mockSchools.findIndex(school => school.id.toString() === id);
    if (schoolIndex !== -1) {
        mockSchools.splice(schoolIndex, 1);
        
        // Reload admin data
        loadAdminData();
        
        // Also reload schools for the main page
        loadSchools();
        
        alert('School deleted successfully.');
    } else {
        alert('Failed to delete school. Please try again later.');
    }
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
        const data = await response.json();
        
        // Log success
        console.log(`✅ Server connection successful! Response time: ${responseTime}ms`);
        console.log(`Received data for ${data.length} schools:`);
        console.table(data);
        
        return data;
    } catch (error) {
        // Log error details
        console.error('❌ Server connection failed!');
        
        if (error.message.includes('Failed to fetch')) {
            console.error('Could not reach the server. Possible causes:');
            console.error('1. Server is not running on the specified port');
            console.error('2. CORS is not properly configured on the server');
            console.error('3. Network or firewall issues are blocking the connection');
        } else {
            console.error(`Error: ${error.message}`);
        }
        
        // Re-throw the error for further handling
        throw error;
    }
}

// Export the test function to the global scope for console access
window.testServerConnection = testServerConnection;

// Auto-run the server test on page load if the URL parameter is set
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('autotest') === 'true') {
        console.log('Auto-running server connection test...');
        setTimeout(() => {
            if (window.serverTest && window.serverTest.run) {
                window.serverTest.run('server-test-container');
            } else {
                testServerConnection().catch(err => console.error('Auto-test failed:', err));
            }
        }, 1000); // Slight delay to ensure everything else is loaded
    }
});

// Export key functions to global scope
window.main = {
    showPage: showPage
};