/**
 * Profile Management Module for Mediterranean College Alumni Network
 * Handles viewing and editing user profiles
 * DEMO VERSION: Using mock data instead of API calls
 */

// Keep track of current profile being viewed
let currentProfileId = null;

/**
 * Load a user profile by ID
 * DEMO: Uses mock data instead of API call
 * @param {string} userId - The ID of the user to load
 */
async function loadProfile(userId) {
    try {
        // In a real app, this would be a fetch request
        // For demo, we'll look for the user in our mock data
        let user;
        
        // Try to find user in mock data
        if (window.mockData) {
            // Check admin user first
            if (userId === '101') {
                user = {
                    id: 101,
                    firstName: 'Admin',
                    lastName: 'User',
                    email: 'admin@medcollege.edu',
                    role: 'admin',
                    schoolId: null,
                    schoolName: null,
                    graduationYear: null,
                    degree: null,
                    currentPosition: 'System Administrator',
                    company: 'Mediterranean College',
                    bio: 'Administrator account for the Mediterranean College Alumni Network.',
                    isPublic: false
                };
            } else {
                // Look in alumni/users arrays
                user = window.mockData.alumni.find(a => a.id.toString() === userId) || 
                       window.mockData.users.find(u => u.id.toString() === userId);
            }
        }
        
        // If user not found, use a default one for demo
        if (!user) {
            user = {
                id: parseInt(userId),
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
            };
        }
        
        displayProfile(user);
        currentProfileId = userId;
        
        // Show edit button if this is the current user's profile
        const currentUser = window.auth?.getCurrentUser();
        if (currentUser && currentUser.id.toString() === userId) {
            document.getElementById('profile-edit-container').style.display = 'block';
        } else {
            document.getElementById('profile-edit-container').style.display = 'none';
        }
        
    } catch (error) {
        console.error('Error loading profile:', error);
        alert('Could not load profile. Please try again later.');
    }
}

/**
 * Display a user's profile in the UI
 * @param {Object} user - The user object to display
 */
function displayProfile(user) {
    // Set profile image
    const profileImage = document.getElementById('profile-image');
    if (user.profileImage) {
        profileImage.src = user.profileImage;
    } else {
        profileImage.src = 'images/default-profile.png';
    }
    
    // Set user details
    document.getElementById('profile-name').textContent = `${user.firstName} ${user.lastName}`;
    
    if (user.currentPosition && user.company) {
        document.getElementById('profile-job').textContent = `${user.currentPosition} at ${user.company}`;
    } else if (user.currentPosition) {
        document.getElementById('profile-job').textContent = user.currentPosition;
    } else if (user.company) {
        document.getElementById('profile-job').textContent = `Works at ${user.company}`;
    } else {
        document.getElementById('profile-job').textContent = '';
    }
    
    // Set school and graduation info
    document.getElementById('profile-school').textContent = user.schoolName || '';
    document.getElementById('profile-graduation').textContent = user.graduationYear ? `Class of ${user.graduationYear}` : '';
    
    // Set LinkedIn link if available
    const linkedinLink = document.getElementById('profile-linkedin');
    if (user.linkedinUrl) {
        linkedinLink.href = user.linkedinUrl;
        linkedinLink.style.display = 'inline-block';
    } else {
        linkedinLink.style.display = 'none';
    }
    
    // Set bio and education
    document.getElementById('profile-bio').textContent = user.bio || 'No biography provided.';
    document.getElementById('profile-degree').textContent = user.degree || 'Degree information not available.';
}

/**
 * Load the profile edit form with current user data
 * DEMO: Uses mock data instead of API call
 */
async function loadProfileEditForm() {
    console.log('loadProfileEditForm called, currentProfileId:', currentProfileId);
    
    if (!currentProfileId) {
        console.error('No currentProfileId available. Cannot load edit form.');
        return;
    }
    
    try {
        // In a real app, this would be a fetch request
        // For demo, we'll look for the user in our mock data
        let user;
        
        console.log('Attempting to find user data for ID:', currentProfileId);
        
        // Try to find user in mock data
        if (window.mockData) {
            console.log('mockData found in window object');
            
            if (currentProfileId === '101') {
                console.log('Admin user detected');
                user = {
                    id: 101,
                    firstName: 'Admin',
                    lastName: 'User',
                    email: 'admin@medcollege.edu',
                    role: 'admin',
                    schoolId: null,
                    schoolName: null,
                    graduationYear: null,
                    degree: null,
                    currentPosition: 'System Administrator',
                    company: 'Mediterranean College',
                    bio: 'Administrator account for the Mediterranean College Alumni Network.',
                    isPublic: false
                };
            } else {
                // Look in alumni/users arrays
                console.log('Searching for user in mockData.alumni and mockData.users arrays');
                
                const alumniUser = window.mockData.alumni.find(a => a.id.toString() === currentProfileId);
                const regularUser = window.mockData.users.find(u => u.id.toString() === currentProfileId);
                
                user = alumniUser || regularUser;
                
                console.log('User found in alumni array:', !!alumniUser);
                console.log('User found in users array:', !!regularUser);
            }
        } else {
            console.warn('mockData not found in window object');
        }
        
        // If user not found, use a default one for demo
        if (!user) {
            console.warn('User not found, using default user data');
            user = {
                id: parseInt(currentProfileId),
                firstName: 'John',
                lastName: 'Smith',
                email: 'john.smith@example.com',
                schoolId: 2,
                schoolName: 'School of Computing',
                graduationYear: 2018,
                degree: 'BSc in Computer Science',
                currentPosition: 'Software Engineer',
                company: 'Tech Innovations',
                bio: 'Experienced software engineer with a passion for developing scalable applications.',
                linkedinUrl: 'https://linkedin.com/in/johnsmith',
                profileImage: null,
                isPublic: true
            };
        } else {
            console.log('User data found:', {
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email
            });
        }
        
        // Create the edit form if it doesn't exist yet
        const profileEditContainer = document.getElementById('profile-edit');
        
        if (!profileEditContainer) {
            console.error('profile-edit container not found in the DOM');
            return;
        }
        
        console.log('profile-edit container found');
        
        const hasForm = !!profileEditContainer.querySelector('form');
        console.log('Form already exists in container:', hasForm);
        
        if (!hasForm) {
            console.log('Creating new profile edit form');
            const formHTML = createProfileEditForm();
            profileEditContainer.innerHTML = formHTML;
            
            // Add event listener to form
            const editForm = document.getElementById('profile-edit-form');
            if (editForm) {
                console.log('Adding submit event listener to form');
                editForm.addEventListener('submit', handleProfileUpdate);
            } else {
                console.error('profile-edit-form not found after adding HTML');
            }
        }
        
        // Fill form with user data
        console.log('Populating form with user data');
        await populateProfileEditForm(user);
        console.log('Form populated successfully');
        
        // Show the edit form
        if (typeof window.showPage === 'function') {
            console.log('Using window.showPage to display profile-edit');
            window.showPage('profile-edit');
        } else {
            console.warn('window.showPage not available, using fallback display method');
            // Fallback if main.js hasn't loaded
            const profileView = document.getElementById('profile-view');
            if (profileView) profileView.style.display = 'none';
            profileEditContainer.style.display = 'block';
        }
        
    } catch (error) {
        console.error('Error loading profile data for editing:', error);
        console.error('Stack trace:', error.stack);
        alert('Could not load profile data. Please try again later.');
    }
}

/**
 * Creates the HTML for the profile edit form
 * @returns {string} The HTML for the profile edit form
 */
function createProfileEditForm() {
    return `
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Edit Profile</h3>
                </div>
                <div class="card-body">
                    <form id="profile-edit-form">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="edit-first-name" class="form-label">First Name</label>
                                <input type="text" class="form-control" id="edit-first-name" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="edit-last-name" class="form-label">Last Name</label>
                                <input type="text" class="form-control" id="edit-last-name" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="edit-email" class="form-label">Email address</label>
                            <input type="email" class="form-control" id="edit-email" required readonly>
                            <small class="text-muted">Email cannot be changed</small>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="edit-school" class="form-label">School</label>
                                <select class="form-select" id="edit-school" required>
                                    <option value="" disabled>Select your school</option>
                                    <!-- Schools will be loaded dynamically -->
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="edit-graduation-year" class="form-label">Graduation Year</label>
                                <input type="number" class="form-control" id="edit-graduation-year" min="1900" max="2025">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="edit-degree" class="form-label">Degree</label>
                            <input type="text" class="form-control" id="edit-degree">
                        </div>
                        <div class="mb-3">
                            <label for="edit-current-position" class="form-label">Current Position</label>
                            <input type="text" class="form-control" id="edit-current-position">
                        </div>
                        <div class="mb-3">
                            <label for="edit-company" class="form-label">Company</label>
                            <input type="text" class="form-control" id="edit-company">
                        </div>
                        <div class="mb-3">
                            <label for="edit-bio" class="form-label">Short Bio</label>
                            <textarea class="form-control" id="edit-bio" rows="3"></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="edit-linkedin" class="form-label">LinkedIn URL (optional)</label>
                            <input type="url" class="form-control" id="edit-linkedin">
                        </div>
                        <div class="mb-3">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="edit-public-profile">
                                <label class="form-check-label" for="edit-public-profile">
                                    Make my profile public to other alumni
                                </label>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="profile-image-upload" class="form-label">Profile Image</label>
                            <input type="file" class="form-control" id="profile-image-upload" accept="image/*">
                        </div>
                        <div class="d-flex justify-content-between">
                            <button type="button" class="btn btn-secondary" id="cancel-edit-btn">Cancel</button>
                            <button type="submit" class="btn btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>`;
}

/**
 * Populates the profile edit form with user data
 * @param {Object} user - The user data to populate the form with
 */
async function populateProfileEditForm(user) {
    console.log('populateProfileEditForm called with user:', user ? user.id : 'no user');
    
    if (!user) {
        console.error('No user data provided to populateProfileEditForm');
        return;
    }
    
    try {
        // Helper function to safely set form values
        const setFormValue = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = !!value;
                } else {
                    element.value = value || '';
                }
                console.log(`Set ${id} to:`, element.type === 'checkbox' ? !!value : (value || ''));
            } else {
                console.error(`Element not found: ${id}`);
            }
        };
        
        // Set form field values
        setFormValue('edit-first-name', user.firstName);
        setFormValue('edit-last-name', user.lastName);
        setFormValue('edit-email', user.email);
        setFormValue('edit-graduation-year', user.graduationYear);
        setFormValue('edit-degree', user.degree);
        setFormValue('edit-current-position', user.currentPosition);
        setFormValue('edit-company', user.company);
        setFormValue('edit-bio', user.bio);
        setFormValue('edit-linkedin', user.linkedinUrl);
        setFormValue('edit-public-profile', user.isPublic);
        
        // Load schools dropdown using mock data
        console.log('Loading schools dropdown');
        const schools = window.mockData?.schools || [
            { id: 1, name: 'School of Business' },
            { id: 2, name: 'School of Computing' },
            { id: 3, name: 'School of Engineering' },
            { id: 4, name: 'School of Health Sciences' },
            { id: 5, name: 'School of Humanities' }
        ];
        
        const schoolSelect = document.getElementById('edit-school');
        if (!schoolSelect) {
            console.error('School select element not found!');
            return;
        }
        
        console.log('Populating schools dropdown with', schools.length, 'schools');
        schoolSelect.innerHTML = '<option value="" disabled>Select your school</option>';
        
        schools.forEach(school => {
            const option = document.createElement('option');
            option.value = school.id;
            option.textContent = school.name;
            option.selected = school.id == user.schoolId;
            schoolSelect.appendChild(option);
            
            if (school.id == user.schoolId) {
                console.log(`Selected school: ${school.name} (ID: ${school.id})`);
            }
        });
        
        // Add event listener to cancel button (using event delegation to avoid duplicates)
        const cancelBtn = document.getElementById('cancel-edit-btn');
        if (cancelBtn) {
            console.log('Setting up cancel button event listener');
            
            // Remove existing listeners to prevent duplicates
            const newCancelBtn = cancelBtn.cloneNode(true);
            cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
            
            newCancelBtn.addEventListener('click', () => {
                console.log('Cancel button clicked');
                if (typeof window.showPage === 'function') {
                    console.log('Using window.showPage to return to profile-view');
                    window.showPage('profile-view');
                } else {
                    console.warn('window.showPage not available, using fallback display method');
                    // Fallback if main.js hasn't loaded
                    const profileEdit = document.getElementById('profile-edit');
                    const profileView = document.getElementById('profile-view');
                    
                    if (profileEdit) profileEdit.style.display = 'none';
                    if (profileView) profileView.style.display = 'block';
                }
            });
        } else {
            console.error('Cancel button element not found!');
        }
        
        console.log('Form populated successfully');
    } catch (error) {
        console.error('Error populating profile form:', error);
        console.error('Stack trace:', error.stack);
    }
}

/**
 * Handles profile update form submission
 * DEMO: Simulates API call with local data update
 * @param {Event} e - The form submit event
 */
async function handleProfileUpdate(e) {
    e.preventDefault();
    
    if (!currentProfileId) return;
    
    // In a real app, this would be a FormData object sent to the server
    // For demo, we'll update the mock data directly
    const updatedUser = {
        id: parseInt(currentProfileId),
        firstName: document.getElementById('edit-first-name').value,
        lastName: document.getElementById('edit-last-name').value,
        email: document.getElementById('edit-email').value,
        schoolId: parseInt(document.getElementById('edit-school').value),
        schoolName: document.getElementById('edit-school').options[document.getElementById('edit-school').selectedIndex].textContent,
        graduationYear: parseInt(document.getElementById('edit-graduation-year').value),
        degree: document.getElementById('edit-degree').value,
        currentPosition: document.getElementById('edit-current-position').value,
        company: document.getElementById('edit-company').value,
        bio: document.getElementById('edit-bio').value,
        linkedinUrl: document.getElementById('edit-linkedin').value,
        isPublic: document.getElementById('edit-public-profile').checked,
        profileImage: null // We'd handle file uploads in a real app
    };
    
    try {
        // Update mock data if available
        if (window.mockData) {
            // Find the user in the appropriate array
            if (currentProfileId === '101') {
                // Admin user - special case
                Object.assign(window.auth.getCurrentUser(), {
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName
                });
            } else {
                // Regular user - find and update in arrays
                let userIndex = window.mockData.alumni.findIndex(a => a.id.toString() === currentProfileId);
                if (userIndex !== -1) {
                    window.mockData.alumni[userIndex] = { ...window.mockData.alumni[userIndex], ...updatedUser };
                }
                
                userIndex = window.mockData.users.findIndex(u => u.id.toString() === currentProfileId);
                if (userIndex !== -1) {
                    window.mockData.users[userIndex] = { ...window.mockData.users[userIndex], ...updatedUser };
                }
                
                // Update current user if this is the logged-in user
                const currentUser = window.auth.getCurrentUser();
                if (currentUser && currentUser.id.toString() === currentProfileId) {
                    Object.assign(currentUser, {
                        firstName: updatedUser.firstName,
                        lastName: updatedUser.lastName,
                        schoolId: updatedUser.schoolId,
                        schoolName: updatedUser.schoolName
                    });
                    window.auth.updateUIForLoggedInUser(currentUser);
                }
            }
        }
        
        // Reload the profile view with updated data
        await loadProfile(currentProfileId);
        
        // Show profile view
        if (typeof window.showPage === 'function') {
            window.showPage('profile-view');
        } else {
            // Fallback if main.js hasn't loaded
            document.getElementById('profile-edit').style.display = 'none';
            document.getElementById('profile-view').style.display = 'block';
        }
        
        alert('Profile updated successfully!');
        
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Could not update profile. Please try again later.');
    }
}

// Event listener for viewing profile from navbar
document.getElementById('view-profile')?.addEventListener('click', (e) => {
    e.preventDefault();
    
    const currentUser = window.auth?.getCurrentUser();
    if (currentUser) {
        loadProfile(currentUser.id.toString());
        if (typeof window.showPage === 'function') {
            window.showPage('profile-view');
        } else {
            // Make profile visible if main.js hasn't loaded
            const pages = document.querySelectorAll('.container > div[id$="-page"], .container > div[id$="-form"], .container > div[id="profile-edit"]');
            pages.forEach(page => {
                page.style.display = 'none';
            });
            document.getElementById('profile-view').style.display = 'block';
        }
    }
});

// Event listener for editing profile
document.getElementById('edit-profile')?.addEventListener('click', (e) => {
    e.preventDefault();
    
    const currentUser = window.auth?.getCurrentUser();
    if (currentUser) {
        currentProfileId = currentUser.id.toString();
        loadProfileEditForm();
    }
});

// Event listener for Edit Profile button on profile view
document.getElementById('edit-profile-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    loadProfileEditForm();
});

// Export functions for other modules
window.profile = {
    loadProfile
};