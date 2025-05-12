/**
 * Mediterranean College Alumni Network - Server
 * A backend server implementation for the Mediterranean College Alumni website
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'mediterranean_college_alumni_secret';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client')));

// Mock Data - Schools
const schools = [
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

// Mock Data - Users & Alumni
const users = [
    {
        id: 101,
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@medcollege.edu',
        password: '$2a$10$v/rlxm9LlI6LP1uxRU93u.0yxVx8fMIkJMwkmmSXoVaJEt1EzXQ8S', // admin123
        role: 'admin',
        schoolId: null,
        schoolName: null,
        graduationYear: null,
        degree: null,
        currentPosition: 'System Administrator',
        company: 'Mediterranean College',
        bio: 'Administrator account for the Mediterranean College Alumni Network.',
        isPublic: false,
        createdAt: new Date('2023-01-01')
    },
    {
        id: 1,
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        password: '$2a$10$4rBCmIQZLEeEF8TZZDa45eaIz1N/nncWuN1Uyt5ux0k86QTbMG5/q', // password123
        role: 'alumni',
        schoolId: 2,
        schoolName: 'School of Computing',
        graduationYear: 2018,
        degree: 'BSc in Computer Science',
        currentPosition: 'Software Engineer',
        company: 'Tech Innovations',
        bio: 'Experienced software engineer with a passion for developing scalable applications. I have contributed to several open-source projects and enjoy mentoring junior developers.',
        linkedinUrl: 'https://linkedin.com/in/johnsmith',
        profileImage: null,
        isPublic: true,
        createdAt: new Date('2023-02-15')
    },
    {
        id: 2,
        firstName: 'Maria',
        lastName: 'Papadopoulos',
        email: 'maria.p@example.com',
        password: '$2a$10$4rBCmIQZLEeEF8TZZDa45eaIz1N/nncWuN1Uyt5ux0k86QTbMG5/q', // password123
        role: 'alumni',
        schoolId: 1,
        schoolName: 'School of Business',
        graduationYear: 2019,
        degree: 'MBA in International Business',
        currentPosition: 'Marketing Manager',
        company: 'Global Marketing Solutions',
        bio: 'Marketing professional with expertise in digital marketing strategies. I specialize in social media marketing and content creation for international brands.',
        linkedinUrl: 'https://linkedin.com/in/maria-p',
        profileImage: null,
        isPublic: true,
        createdAt: new Date('2023-03-10')
    },
    {
        id: 3,
        firstName: 'Nikos',
        lastName: 'Andreou',
        email: 'nikos.a@example.com',
        password: '$2a$10$4rBCmIQZLEeEF8TZZDa45eaIz1N/nncWuN1Uyt5ux0k86QTbMG5/q', // password123
        role: 'alumni',
        schoolId: 3,
        schoolName: 'School of Engineering',
        graduationYear: 2020,
        degree: 'MSc in Civil Engineering',
        currentPosition: 'Structural Engineer',
        company: 'Athens Construction Group',
        bio: 'Civil engineer specializing in structural design and analysis. I have worked on several major infrastructure projects across Greece and Europe.',
        linkedinUrl: 'https://linkedin.com/in/nikos-andreou',
        profileImage: null,
        isPublic: true,
        createdAt: new Date('2023-01-22')
    },
    {
        id: 4,
        firstName: 'Elena',
        lastName: 'Dimitriou',
        email: 'elena.d@example.com',
        password: '$2a$10$4rBCmIQZLEeEF8TZZDa45eaIz1N/nncWuN1Uyt5ux0k86QTbMG5/q', // password123
        role: 'alumni',
        schoolId: 4,
        schoolName: 'School of Health Sciences',
        graduationYear: 2021,
        degree: 'BSc in Nursing',
        currentPosition: 'Registered Nurse',
        company: 'Athens General Hospital',
        bio: 'Registered nurse with experience in emergency care. I am passionate about patient care and continuous professional development in healthcare.',
        linkedinUrl: 'https://linkedin.com/in/elena-d',
        profileImage: null,
        isPublic: true,
        createdAt: new Date('2023-04-05')
    },
    {
        id: 5,
        firstName: 'Dimitris',
        lastName: 'Georgiou',
        email: 'dimitris.g@example.com',
        password: '$2a$10$4rBCmIQZLEeEF8TZZDa45eaIz1N/nncWuN1Uyt5ux0k86QTbMG5/q', // password123
        role: 'alumni',
        schoolId: 5,
        schoolName: 'School of Humanities',
        graduationYear: 2017,
        degree: 'BA in Psychology',
        currentPosition: 'Clinical Psychologist',
        company: 'Athens Mental Health Center',
        bio: 'Clinical psychologist specializing in cognitive behavioral therapy. I work with clients of all ages and have a particular interest in anxiety disorders.',
        linkedinUrl: 'https://linkedin.com/in/dimitris-g',
        profileImage: null,
        isPublic: true,
        createdAt: new Date('2023-02-28')
    }
];

// Mock Data - Pending Applications
let pendingApplications = [
    {
        id: 201,
        firstName: 'Katerina',
        lastName: 'Nikolaou',
        email: 'katerina.n@example.com',
        password: '$2a$10$4rBCmIQZLEeEF8TZZDa45eaIz1N/nncWuN1Uyt5ux0k86QTbMG5/q', // password123
        schoolId: 5,
        schoolName: 'School of Humanities',
        graduationYear: 2022,
        degree: 'BA in English Literature',
        currentPosition: 'Content Writer',
        company: 'Digital Media Agency',
        bio: 'Recent graduate with a passion for literature and creative writing. Looking to connect with fellow alumni and explore career opportunities.',
        isPublic: true,
        createdAt: new Date('2023-05-01')
    },
    {
        id: 202,
        firstName: 'Kostas',
        lastName: 'Vlachos',
        email: 'kostas.v@example.com',
        password: '$2a$10$4rBCmIQZLEeEF8TZZDa45eaIz1N/nncWuN1Uyt5ux0k86QTbMG5/q', // password123
        schoolId: 2,
        schoolName: 'School of Computing',
        graduationYear: 2023,
        degree: 'BSc in Cybersecurity',
        currentPosition: 'Security Analyst',
        company: 'Secure Systems',
        bio: 'Cybersecurity professional with a focus on network security and penetration testing. Eager to connect with alumni in the tech industry.',
        isPublic: true,
        createdAt: new Date('2023-05-10')
    }
];

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        
        req.user = user;
        next();
    });
};

// Admin Authentication Middleware
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

// API Routes

// GET /api/schools - Get all schools
app.get('/api/schools', (req, res) => {
    res.json(schools);
});

// GET /api/users/alumni - Get all public alumni profiles (with optional filtering)
app.get('/api/users/alumni', (req, res) => {
    let alumni = users.filter(user => user.role === 'alumni' && user.isPublic);
    
    // Apply filtering if provided
    const { schoolId, graduationYear, search } = req.query;
    
    if (schoolId && schoolId !== '0') {
        alumni = alumni.filter(a => a.schoolId === parseInt(schoolId));
    }
    
    if (graduationYear && graduationYear !== '0') {
        alumni = alumni.filter(a => a.graduationYear === parseInt(graduationYear));
    }
    
    if (search) {
        const query = search.toLowerCase();
        alumni = alumni.filter(a => {
            const fullName = `${a.firstName} ${a.lastName}`.toLowerCase();
            const company = (a.company || '').toLowerCase();
            return fullName.includes(query) || company.includes(query);
        });
    }
    
    // Return a simplified version without passwords
    const safeAlumni = alumni.map(({ password, ...safeUser }) => safeUser);
    res.json(safeAlumni);
});

// GET /api/users/:id - Get a specific user profile
app.get('/api/users/:id', authenticateToken, (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    // If not admin and not the user themselves, and profile is not public, deny access
    if (req.user.role !== 'admin' && req.user.id !== userId && !user.isPublic) {
        return res.status(403).json({ message: 'Access denied to this profile' });
    }
    
    // Return without password
    const { password, ...safeUser } = user;
    res.json(safeUser);
});

// POST /api/auth/login - Login endpoint
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Check if email exists
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Create and sign JWT
    const token = jwt.sign(
        { 
            id: user.id, 
            email: user.email, 
            role: user.role, 
            firstName: user.firstName, 
            lastName: user.lastName,
            schoolId: user.schoolId,
            schoolName: user.schoolName
        }, 
        JWT_SECRET,
        { expiresIn: '1h' }
    );
    
    // Return user info (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    res.json({ 
        token, 
        user: userWithoutPassword
    });
});

// POST /api/auth/register - Registration endpoint
app.post('/api/auth/register', async (req, res) => {
    const { 
        firstName, lastName, email, password, 
        schoolId, graduationYear, degree, 
        currentPosition, company, bio, 
        linkedinUrl, isPublic
    } = req.body;
    
    // Check if email already exists in users or pending
    if (users.some(u => u.email === email) || pendingApplications.some(p => p.email === email)) {
        return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Get school name
    const school = schools.find(s => s.id === parseInt(schoolId));
    const schoolName = school ? school.name : null;
    
    // Create a new pending application
    const newApplication = {
        id: Date.now(), // Simple ID generation
        firstName,
        lastName,
        email,
        password: hashedPassword,
        schoolId: parseInt(schoolId),
        schoolName,
        graduationYear: parseInt(graduationYear),
        degree,
        currentPosition,
        company,
        bio,
        linkedinUrl,
        isPublic: isPublic === true || isPublic === 'true',
        createdAt: new Date()
    };
    
    pendingApplications.push(newApplication);
    
    res.status(201).json({ 
        message: 'Registration successful. Your application is pending approval.' 
    });
});

// PUT /api/users/:id - Update user profile
app.put('/api/users/:id', authenticateToken, async (req, res) => {
    const userId = parseInt(req.params.id);
    
    // Check if user exists
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    // Only admin or the user themselves can update profile
    if (req.user.role !== 'admin' && req.user.id !== userId) {
        return res.status(403).json({ message: 'Not authorized to update this profile' });
    }
    
    // Update fields (ignoring sensitive ones like password)
    const { 
        firstName, lastName, schoolId, graduationYear, 
        degree, currentPosition, company, bio, 
        linkedinUrl, isPublic 
    } = req.body;
    
    // Update school name if school ID changed
    let schoolName = users[userIndex].schoolName;
    if (schoolId && schoolId !== users[userIndex].schoolId) {
        const school = schools.find(s => s.id === parseInt(schoolId));
        schoolName = school ? school.name : null;
    }
    
    // Update the user object
    users[userIndex] = {
        ...users[userIndex],
        firstName: firstName || users[userIndex].firstName,
        lastName: lastName || users[userIndex].lastName,
        schoolId: schoolId ? parseInt(schoolId) : users[userIndex].schoolId,
        schoolName,
        graduationYear: graduationYear ? parseInt(graduationYear) : users[userIndex].graduationYear,
        degree: degree !== undefined ? degree : users[userIndex].degree,
        currentPosition: currentPosition !== undefined ? currentPosition : users[userIndex].currentPosition,
        company: company !== undefined ? company : users[userIndex].company,
        bio: bio !== undefined ? bio : users[userIndex].bio,
        linkedinUrl: linkedinUrl !== undefined ? linkedinUrl : users[userIndex].linkedinUrl,
        isPublic: isPublic !== undefined ? (isPublic === true || isPublic === 'true') : users[userIndex].isPublic
    };
    
    // Return the updated user (without password)
    const { password, ...updatedUser } = users[userIndex];
    res.json(updatedUser);
});

// Admin Routes

// GET /api/admin/users - Get all users (admin only)
app.get('/api/admin/users', authenticateToken, isAdmin, (req, res) => {
    // Return all users without passwords
    const safeUsers = users.map(({ password, ...user }) => user);
    res.json(safeUsers);
});

// GET /api/admin/pending-applications - Get all pending applications (admin only)
app.get('/api/admin/pending-applications', authenticateToken, isAdmin, (req, res) => {
    // Return pending applications without passwords
    const safePendingApps = pendingApplications.map(({ password, ...app }) => app);
    res.json(safePendingApps);
});

// PUT /api/admin/applications/:id/approve - Approve application (admin only)
app.put('/api/admin/applications/:id/approve', authenticateToken, isAdmin, (req, res) => {
    const applicationId = parseInt(req.params.id);
    
    // Find application
    const applicationIndex = pendingApplications.findIndex(app => app.id === applicationId);
    
    if (applicationIndex === -1) {
        return res.status(404).json({ message: 'Application not found' });
    }
    
    // Create a new user from the application
    const application = pendingApplications[applicationIndex];
    const newUser = {
        ...application,
        role: 'alumni'
    };
    
    // Generate new unique ID for user
    newUser.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    
    // Add to users array
    users.push(newUser);
    
    // Remove from pending applications
    pendingApplications.splice(applicationIndex, 1);
    
    res.json({ message: 'Application approved successfully' });
});

// PUT /api/admin/applications/:id/reject - Reject application (admin only)
app.put('/api/admin/applications/:id/reject', authenticateToken, isAdmin, (req, res) => {
    const applicationId = parseInt(req.params.id);
    
    // Find application
    const applicationIndex = pendingApplications.findIndex(app => app.id === applicationId);
    
    if (applicationIndex === -1) {
        return res.status(404).json({ message: 'Application not found' });
    }
    
    // Remove from pending applications
    pendingApplications.splice(applicationIndex, 1);
    
    res.json({ message: 'Application rejected successfully' });
});

// DELETE /api/admin/users/:id - Delete user (admin only)
app.delete('/api/admin/users/:id', authenticateToken, isAdmin, (req, res) => {
    const userId = parseInt(req.params.id);
    
    // Find user
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if trying to delete admin (for safety)
    if (users[userIndex].role === 'admin') {
        return res.status(400).json({ message: 'Cannot delete admin user' });
    }
    
    // Remove user
    users.splice(userIndex, 1);
    
    res.json({ message: 'User deleted successfully' });
});

// GET /api/admin/schools - Get schools with admin details
app.get('/api/admin/schools', authenticateToken, isAdmin, (req, res) => {
    res.json(schools);
});

// PUT /api/admin/schools/:id - Update school (admin only)
app.put('/api/admin/schools/:id', authenticateToken, isAdmin, (req, res) => {
    const schoolId = parseInt(req.params.id);
    
    // Find school
    const schoolIndex = schools.findIndex(s => s.id === schoolId);
    
    if (schoolIndex === -1) {
        return res.status(404).json({ message: 'School not found' });
    }
    
    // Update school
    const { name, description } = req.body;
    
    schools[schoolIndex] = {
        ...schools[schoolIndex],
        name: name || schools[schoolIndex].name,
        description: description || schools[schoolIndex].description
    };
    
    res.json(schools[schoolIndex]);
});

// DELETE /api/admin/schools/:id - Delete school (admin only)
app.delete('/api/admin/schools/:id', authenticateToken, isAdmin, (req, res) => {
    const schoolId = parseInt(req.params.id);
    
    // Find school
    const schoolIndex = schools.findIndex(s => s.id === schoolId);
    
    if (schoolIndex === -1) {
        return res.status(404).json({ message: 'School not found' });
    }
    
    // Check if school has alumni
    const hasAlumni = users.some(u => u.schoolId === schoolId);
    
    if (hasAlumni) {
        return res.status(400).json({ 
            message: 'Cannot delete school with associated alumni. Reassign alumni first.' 
        });
    }
    
    // Remove school
    schools.splice(schoolIndex, 1);
    
    res.json({ message: 'School deleted successfully' });
});

// Serve the main HTML page for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Mediterranean College Alumni server running on port ${PORT}`);
});