/**
 * Profile Management Module for Mediterranean College Alumni Network
 * Handles viewing and editing user profiles
 */

// Keep track of current profile being viewed
let currentProfileId = null;

/**
 * Load a user profile by ID
 * @param {string} userId - The ID of the user to load
 */
async function loadProfile(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${window.auth.getAuthToken()}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load profile');
        }
        
        const user = await response.json();
        displayProfile(user);
        currentProfileId = userId;
        
        // Show edit button if this is the current user's profile
        const currentUser = window.auth.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
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
 */
async function loadProfileEditForm() {
    if (!currentProfileId) return;
    
    try {
        const response = await fetch(`/api/users/${currentProfileId}`, {
            headers: {
                'Authorization': `Bearer ${window.auth.getAuthToken()}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load profile data');
        }
        
        const user = await response.json();
        
        // Create the edit form if it doesn't exist yet
        const profileEditContainer = document.getElementById('profile-edit');
        if (!profileEditContainer.querySelector('form')) {
            const formHTML = createProfileEditForm();
            profileEditContainer.innerHTML = formHTML;
            
            // Add event listener to form
            document.getElementById('profile-edit-form').addEventListener('submit', handleProfileUpdate);
        }
        
        // Fill form with user data
        populateProfileEditForm(user);
        
        // Show the edit form
        showPage('profile-edit');
        
    } catch (error) {
        console.error('Error loading profile data for editing:', error);
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
    document.getElementById('edit-first-name').value = user.firstName || '';
    document.getElementById('edit-last-name').value = user.lastName || '';
    document.getElementById('edit-email').value = user.email || '';
    document.getElementById('edit-graduation-year').value = user.graduationYear || '';
    document.getElementById('edit-degree').value = user.degree || '';
    document.getElementById('edit-current-position').value = user.currentPosition || '';
    document.getElementById('edit-company').value = user.company || '';
    document.getElementById('edit-bio').value = user.bio || '';
    document.getElementById('edit-linkedin').value = user.linkedinUrl || '';
    document.getElementById('edit-public-profile').checked = user.isPublic || false;
    
    // Load schools dropdown
    try {
        const response = await fetch('/api/schools');
        const schools = await response.json();
        
        const schoolSelect = document.getElementById('edit-school');
        schoolSelect.innerHTML = '<option value="" disabled>Select your school</option>';
        
        schools.forEach(school => {
            const option = document.createElement('option');
            option.value = school.id;
            option.textContent = school.name;
            option.selected = school.id == user.schoolId;
            schoolSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading schools:', error);
    }
    
    // Add event listener to cancel button
    document.getElementById('cancel-edit-btn').addEventListener('click', () => {
        showPage('profile-view');
    });
}

/**
 * Handles profile update form submission
 * @param {Event} e - The form submit event
 */
async function handleProfileUpdate(e) {
    e.preventDefault();
    
    if (!currentProfileId) return;
    
    const formData = new FormData();
    formData.append('firstName', document.getElementById('edit-first-name').value);
    formData.append('lastName', document.getElementById('edit-last-name').value);
    formData.append('schoolId', document.getElementById('edit-school').value);
    formData.append('graduationYear', document.getElementById('edit-graduation-year').value);
    formData.append('degree', document.getElementById('edit-degree').value);
    formData.append('currentPosition', document.getElementById('edit-current-position').value);
    formData.append('company', document.getElementById('edit-company').value);
    formData.append('bio', document.getElementById('edit-bio').value);
    formData.append('linkedinUrl', document.getElementById('edit-linkedin').value);
    formData.append('isPublic', document.getElementById('edit-public-profile').checked);
    
    // Add profile image if selected
    const imageInput = document.getElementById('profile-image-upload');
    if (imageInput.files && imageInput.files[0]) {
        formData.append('profileImage', imageInput.files[0]);
    }
    
    try {
        const response = await fetch(`/api/users/${currentProfileId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${window.auth.getAuthToken()}`
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
        
        // Reload the profile view
        await loadProfile(currentProfileId);
        showPage('profile-view');
        
        alert('Profile updated successfully!');
        
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Could not update profile. Please try again later.');
    }
}

// Event listener for viewing profile from navbar
document.getElementById('view-profile')?.addEventListener('click', (e) => {
    e.preventDefault();
    
    const currentUser = window.auth.getCurrentUser();
    if (currentUser) {
        loadProfile(currentUser.id);
        showPage('profile-view');
    }
});

// Event listener for editing profile
document.getElementById('edit-profile')?.addEventListener('click', (e) => {
    e.preventDefault();
    
    const currentUser = window.auth.getCurrentUser();
    if (currentUser) {
        currentProfileId = currentUser.id;
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
