document.addEventListener('DOMContentLoaded', function() {
    // Get all footer links
    const footerHomeLink = document.getElementById('footer-home-link');
    const footerSchoolsLink = document.getElementById('footer-schools-link');
    const footerAlumniLink = document.getElementById('footer-alumni-link');
    const footerPrivacyLink = document.getElementById('footer-privacy-link');

    // Get all page sections
    const homePage = document.getElementById('home-page');
    const schoolsPage = document.getElementById('schools-page');
    const alumniPage = document.getElementById('alumni-page');
    const privacyPage = document.getElementById('privacy-page');

    // Function to hide all pages
    function hideAllPages() {
        homePage.style.display = 'none';
        schoolsPage.style.display = 'none';
        alumniPage.style.display = 'none';
        privacyPage.style.display = 'none';
    }

    // Home link click handler
    footerHomeLink.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllPages();
        homePage.style.display = 'block';
        // Update active state in navigation
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.getElementById('home-link').classList.add('active');
    });

    // Schools link click handler
    footerSchoolsLink.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllPages();
        schoolsPage.style.display = 'block';
        // Update active state in navigation
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.getElementById('schools-link').classList.add('active');
    });

    // Alumni Directory link click handler
    footerAlumniLink.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllPages();
        alumniPage.style.display = 'block';
        // Update active state in navigation
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.getElementById('alumni-link').classList.add('active');
    });

    // Privacy Policy link click handler
    footerPrivacyLink.addEventListener('click', function(e) {
        e.preventDefault();
        hideAllPages();
        privacyPage.style.display = 'block';
        // Remove active state from navigation since privacy policy is not in the main nav
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    });
}); 
