/**
 * Main Application Module for Mediterranean College Alumni Network
 * Handles page navigation, event listeners, and data loading
 * DEMO VERSION: Using mock data instead of API calls
 */

// Keep track of the current page
let currentPage = 'home-page';

// Mock Data for Schools
const mockSchools = [
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

    // Initialize footer positioning
    const footer = document.querySelector('footer');
    const body = document.body;
    footer.classList.add('fixed-footer');
    body.classList.add('fixed-footer-page');
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

    // Footer quick links
    const footerLinks = document.querySelectorAll('footer .list-unstyled a');
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const linkText = link.textContent.toLowerCase();
            
            switch (linkText) {
                case 'home':
                    showPage('home-page');
                    break;
                case 'schools':
                    showPage('schools-page');
                    break;
                case 'alumni directory':
                    showPage('alumni-page');
                    break;
                case 'privacy policy':
                    showPage('privacy-page');
                    break;
            }
        });
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

        // Handle footer positioning
        const footer = document.querySelector('footer');
        const body = document.body;

        if (pageId === 'privacy-page') {
            // Remove fixed positioning for privacy page
            footer.classList.remove('fixed-footer');
            body.classList.remove('fixed-footer-page');
        } else {
            // Add fixed positioning for all other pages
            footer.classList.add('fixed-footer');
            body.classList.add('fixed-footer-page');
        }
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
 * DEMO: Uses mock data instead of fetch
 */
function loadSchools() {
    // Using mockSchools data instead of fetch
    const schools = mockSchools;
    
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
}

/**
 * Loads the alumni directory data
 * DEMO: Uses mock data instead of fetch
 */
function loadAlumniDirectory() {
    // Using mockAlumni data instead of fetch
    const alumni = mockAlumni;
    displayAlumni(alumni);
}

/**
 * Displays alumni in the alumni directory
 * @param {Array} alumni - The alumni data to display
 */
function displayAlumni(alumni) {
    const container = document.getElementById('alumni-container');
    container.innerHTML = '';
    
    alumni.forEach(alumnus => {
        const card = document.createElement('div');
        card.className = 'col';
        card.innerHTML = `
            <div class="card h-100 alumni-card">
                <div class="card-body">
                    <h5 class="card-title">${alumnus.firstName} ${alumnus.lastName}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${alumnus.currentPosition} at ${alumnus.company}</h6>
                    <p class="card-text">${alumnus.bio}</p>
                    <div class="mt-auto">
                        <p class="mb-1"><small class="text-muted">${alumnus.schoolName}, Class of ${alumnus.graduationYear}</small></p>
                        <button class="btn btn-outline-primary btn-sm view-profile" data-id="${alumnus.id}">View Profile</button>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(card);
        
        // Add click event to view profile button
        card.querySelector('.view-profile').addEventListener('click', (e) => {
            const userId = e.target.dataset.id;
            window.showPage('profile-view');
            window.loadProfile(userId);
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
function filterAlumni() {
    const schoolId = parseInt(document.getElementById('filter-school').value);
    const graduationYear = parseInt(document.getElementById('filter-year').value);
    const searchQuery = document.getElementById('search-alumni').value.trim().toLowerCase();
    
    // Filter the mockAlumni data locally
    let filteredAlumni = mockAlumni;
    
    // Filter by school
    if (schoolId && schoolId !== 0) {
        filteredAlumni = filteredAlumni.filter(alumnus => alumnus.schoolId === schoolId);
    }
    
    // Filter by graduation year
    if (graduationYear && graduationYear !== 0) {
        filteredAlumni = filteredAlumni.filter(alumnus => alumnus.graduationYear === graduationYear);
    }
    
    // Filter by search query (name or company)
    if (searchQuery) {
        filteredAlumni = filteredAlumni.filter(alumnus => {
            const fullName = `${alumnus.firstName} ${alumnus.lastName}`.toLowerCase();
            const company = (alumnus.company || '').toLowerCase();
            return fullName.includes(searchQuery) || company.includes(searchQuery);
        });
    }
    
    // Display the filtered alumni
    displayAlumni(filteredAlumni);
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
function loadAdminData() {
    if (!window.auth || !window.auth.isAuthenticated() || !window.auth.getCurrentUser() || window.auth.getCurrentUser().role !== 'admin') {
        return;
    }
    
    // Display pending applications
    displayPendingApplications(mockPendingApplications);
    
    // Display all users
    displayAllUsers(mockUsers);
    
    // Display schools for admin
    displaySchoolsAdmin(mockSchools);
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
 * DEMO: Simulates API call with local data modification
 * @param {string} id - The application ID
 * @param {string} action - The action to take ('approve' or 'reject')
 */
async function handleApplicationAction(id, action) {
    // Remove the application from pending list (in a real app, this would be an API call)
    const appIndex = mockPendingApplications.findIndex(app => app.id.toString() === id);
    if (appIndex !== -1) {
        mockPendingApplications.splice(appIndex, 1);
        
        // If approved, add to users list
        if (action === 'approve') {
            const approvedApp = mockPendingApplications.find(app => app.id.toString() === id) || {};
            mockUsers.push({
                ...approvedApp,
                role: 'user'
            });
        }
        
        // Reload admin data
        loadAdminData();
        
        alert(`Application ${action === 'approve' ? 'approved' : 'rejected'} successfully.`);
    } else {
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
    
    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.schoolName || 'N/A'}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-2 view-user" data-id="${user.id}">View</button>
                <button class="btn btn-sm btn-outline-danger delete-user" data-id="${user.id}">Delete</button>
            </td>
        `;
        
        tbody.appendChild(tr);
        
        // Add click events
        tr.querySelector('.view-user').addEventListener('click', (e) => {
            const userId = e.target.dataset.id;
            window.showPage('profile-view');
            window.loadProfile(userId);
        });
        
        tr.querySelector('.delete-user').addEventListener('click', (e) => {
            const userId = e.target.dataset.id;
            handleDeleteUser(userId);
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

// Make mock data available for other modules
window.mockData = {
    schools: mockSchools,
    alumni: mockAlumni,
    users: mockUsers,
    pendingApplications: mockPendingApplications
};