/**
 * Profile Management Module for Mediterranean College Alumni Network
 * Handles viewing and editing user profiles
 * Uses real API calls to fetch and update profile data
 */

// Keep track of current profile being viewed
let currentProfileId = null;

/**
 * Load a user profile by ID
 * Uses real API call to fetch user data
 * @param {string} userId - The ID of the user to load
 */
async function loadProfile(userId) {
    // Show loading indicator if available
    if (window.loading && window.loading.show) {
        window.loading.show('profile-view', 'Loading profile...');
    }
    
    try {
        // Make real API call to fetch user profile
        const response = await fetch(`/api/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${window.auth?.authToken || localStorage.getItem('authToken')}`
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication required to view this profile');
            } else if (response.status === 404) {
                throw new Error('User profile not found');
            } else {
                throw new Error('Failed to load profile');
            }
        }
        
        const user = await response.json();
        
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
        alert(error.message || 'Could not load profile. Please try again later.');
    } finally {
        // Hide loading indicator if it was shown
        if (window.loading && window.loading.hide) {
            window.loading.hide('profile-view');
        }
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
        profileImage.src = 'images/icons/default-avatar.svg';
    }
    
    // Set user details
    document.getElementById('profile-name').textContent = `${user.firstName} ${user.lastName}`;
    
    const jobElement = document.getElementById('profile-job');
    if (user.currentPosition && user.company) {
        jobElement.innerHTML = `<i class="fas fa-briefcase me-2"></i>${user.currentPosition} at ${user.company}`;
    } else if (user.currentPosition) {
        jobElement.innerHTML = `<i class="fas fa-briefcase me-2"></i>${user.currentPosition}`;
    } else if (user.company) {
        jobElement.innerHTML = `<i class="fas fa-building me-2"></i>Works at ${user.company}`;
    } else {
        jobElement.innerHTML = '';
    }
    
    // Set school and graduation info
    const schoolElement = document.getElementById('profile-school');
    const gradElement = document.getElementById('profile-graduation');
    
    if (user.schoolName) {
        schoolElement.innerHTML = `<i class="fas fa-university me-2"></i>${user.schoolName}`;
        schoolElement.style.display = 'block';
    } else {
        schoolElement.style.display = 'none';
    }
    
    if (user.graduationYear) {
        gradElement.innerHTML = `<i class="fas fa-graduation-cap me-2"></i>Class of ${user.graduationYear}`;
        gradElement.style.display = 'block';
    } else {
        gradElement.style.display = 'none';
    }
    
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
 * Uses real API call to fetch user data
 */
async function loadProfileEditForm() {
    console.log('loadProfileEditForm called, currentProfileId:', currentProfileId);
    
    if (!currentProfileId) {
        console.error('No currentProfileId available. Cannot load edit form.');
        return;
    }
    
    // Show loading indicator if available
    if (window.loading && window.loading.show) {
        window.loading.show('profile-edit', 'Loading edit form...');
    }
    
    try {
        // Make real API call to fetch user profile data
        const response = await fetch(`/api/users/${currentProfileId}`, {
            headers: {
                'Authorization': `Bearer ${window.auth?.authToken || localStorage.getItem('authToken')}`
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication required to edit profile');
            } else if (response.status === 404) {
                throw new Error('User profile not found');
            } else {
                throw new Error('Failed to load profile data');
            }
        }
        
        const user = await response.json();
        
        console.log('User data found:', {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email
        });
        
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
                console.error('Failed to create edit form');
                return;
            }
        }
        
        // Fill the form with user data
        document.getElementById('edit-first-name').value = user.firstName || '';
        document.getElementById('edit-last-name').value = user.lastName || '';
        document.getElementById('edit-email').value = user.email || '';
        
        // Load and select school if user has one
        const schoolSelect = document.getElementById('edit-school');
        
        // Load schools for the dropdown
        console.log('Loading schools for dropdown');
        const schoolsResponse = await fetch('/api/schools');
        
        if (schoolsResponse.ok) {
            const schools = await schoolsResponse.json();
            
            // Clear existing options and add default
            schoolSelect.innerHTML = '<option value="">Select School</option>';
            
            // Add school options
            schools.forEach(school => {
                const option = document.createElement('option');
                option.value = school.id;
                option.textContent = school.name;
                if (user.schoolId && school.id === user.schoolId) {
                    option.selected = true;
                }
                schoolSelect.appendChild(option);
            });
            console.log('School options loaded successfully');
        } else {
            console.error('Failed to load schools for dropdown');
        }
        
        // Fill other fields
        if (user.graduationYear) {
            document.getElementById('edit-graduation-year').value = user.graduationYear;
        }
        
        if (user.degree) {
            document.getElementById('edit-degree').value = user.degree;
        }
        
        if (user.currentPosition) {
            document.getElementById('edit-current-position').value = user.currentPosition;
        }
        
        if (user.company) {
            document.getElementById('edit-company').value = user.company;
        }
        
        if (user.bio) {
            document.getElementById('edit-bio').value = user.bio;
        }
        
        if (user.linkedinUrl) {
            document.getElementById('edit-linkedin').value = user.linkedinUrl;
        }
        
        // Set public profile checkbox
        const publicCheckbox = document.getElementById('edit-public-profile');
        if (publicCheckbox) {
            publicCheckbox.checked = user.isPublic !== false;
        }
        
        console.log('Form populated with user data');
        
        // Show the edit form
        if (window.main && typeof window.main.showPage === 'function') {
            window.main.showPage('profile-edit');
        } else {
            // Fallback if main.js hasn't loaded
            document.getElementById('profile-view').style.display = 'none';
            profileEditContainer.style.display = 'block';
        }
        
    } catch (error) {
        console.error('Error loading profile edit form:', error);
        alert(error.message || 'Could not load edit form. Please try again later.');
    } finally {
        // Hide loading indicator if it was shown
        if (window.loading && window.loading.hide) {
            window.loading.hide('profile-edit');
        }
    }
}

/**
 * Creates the HTML for the profile edit form
 * @returns {string} The HTML string for the form
 */
function createProfileEditForm() {
    return `
        <div class="card profile-edit-card">
            <div class="card-header">
                <h3>Edit Profile</h3>
            </div>
            <div class="card-body">
                <form id="profile-edit-form">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="edit-first-name" class="form-label">First Name</label>
                            <input type="text" class="form-control" id="edit-first-name" required>
                        </div>
                        <div class="col-md-6">
                            <label for="edit-last-name" class="form-label">Last Name</label>
                            <input type="text" class="form-control" id="edit-last-name" required>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="edit-email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="edit-email" required>
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="edit-school" class="form-label">School</label>
                            <select class="form-control" id="edit-school">
                                <option value="">Select School</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label for="edit-graduation-year" class="form-label">Graduation Year</label>
                            <input type="number" class="form-control" id="edit-graduation-year" min="1900" max="2100">
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="edit-degree" class="form-label">Degree</label>
                        <input type="text" class="form-control" id="edit-degree">
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="edit-current-position" class="form-label">Current Position</label>
                            <input type="text" class="form-control" id="edit-current-position">
                        </div>
                        <div class="col-md-6">
                            <label for="edit-company" class="form-label">Company</label>
                            <input type="text" class="form-control" id="edit-company">
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="edit-bio" class="form-label">Bio</label>
                        <textarea class="form-control" id="edit-bio" rows="4"></textarea>
                    </div>
                    
                    <div class="mb-3">
                        <label for="edit-linkedin" class="form-label">LinkedIn URL</label>
                        <input type="url" class="form-control" id="edit-linkedin">
                    </div>
                    
                    <div class="mb-3">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="edit-public-profile" checked>
                            <label class="form-check-label" for="edit-public-profile">
                                Make my profile public
                            </label>
                        </div>
                    </div>
                    
                    <div class="d-flex justify-content-between">
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                        <button type="button" class="btn btn-secondary" onclick="cancelProfileEdit()">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

/**
 * Handles profile update form submission
 * @param {Event} e - The form submit event
 */
async function handleProfileUpdate(e) {
    e.preventDefault();
    
    if (!currentProfileId) return;
    
    // Show loading indicator if available
    if (window.loading && window.loading.show) {
        window.loading.show('profile-edit', 'Updating profile...');
    }
    
    // Gather updated user data from form
    const updatedUser = {
        firstName: document.getElementById('edit-first-name').value,
        lastName: document.getElementById('edit-last-name').value,
        email: document.getElementById('edit-email').value,
        schoolId: parseInt(document.getElementById('edit-school').value),
        graduationYear: parseInt(document.getElementById('edit-graduation-year').value),
        degree: document.getElementById('edit-degree').value,
        currentPosition: document.getElementById('edit-current-position').value,
        company: document.getElementById('edit-company').value,
        bio: document.getElementById('edit-bio').value,
        linkedinUrl: document.getElementById('edit-linkedin').value,
        isPublic: document.getElementById('edit-public-profile').checked
    };
    
    try {
        // Make real API call to update user profile
        const response = await fetch(`/api/users/${currentProfileId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.auth?.authToken || localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(updatedUser)
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication required to update profile');
            } else if (response.status === 403) {
                throw new Error('You do not have permission to update this profile');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }
        }
        
        const result = await response.json();
        
        // Update current user data if this is the logged-in user
        const currentUser = window.auth?.getCurrentUser();
        if (currentUser && currentUser.id.toString() === currentProfileId) {
            Object.assign(currentUser, {
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                schoolId: updatedUser.schoolId,
                schoolName: document.getElementById('edit-school').options[document.getElementById('edit-school').selectedIndex].textContent
            });
            window.auth.updateUIForLoggedInUser(currentUser);
        }
        
        // Reload the profile view with updated data
        await loadProfile(currentProfileId);
        
        // Show profile view
        if (window.main && typeof window.main.showPage === 'function') {
            window.main.showPage('profile-view');
        } else {
            // Fallback if main.js hasn't loaded
            document.getElementById('profile-edit').style.display = 'none';
            document.getElementById('profile-view').style.display = 'block';
        }
        
        alert('Profile updated successfully!');
        
    } catch (error) {
        console.error('Error updating profile:', error);
        alert(error.message || 'Could not update profile. Please try again later.');
    } finally {
        // Hide loading indicator if it was shown
        if (window.loading && window.loading.hide) {
            window.loading.hide('profile-edit');
        }
    }
}

// Event listener for viewing profile from navbar
document.getElementById('view-profile')?.addEventListener('click', (e) => {
    e.preventDefault();
    
    const currentUser = window.auth?.getCurrentUser();
    if (currentUser) {
        loadProfile(currentUser.id.toString());
        if (window.main && typeof window.main.showPage === 'function') {
            window.main.showPage('profile-view');
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

// Event listener for edit profile button
document.getElementById('edit-profile-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    loadProfileEditForm();
});

// Function to cancel profile edit
window.cancelProfileEdit = function() {
    if (window.main && typeof window.main.showPage === 'function') {
        window.main.showPage('profile-view');
    } else {
        document.getElementById('profile-edit').style.display = 'none';
        document.getElementById('profile-view').style.display = 'block';
    }
};

// Export functions for other modules
window.profile = {
    loadProfile
};