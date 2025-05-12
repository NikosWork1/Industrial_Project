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

// Load configuration
const config = require('./config/config');

// Database configuration
const { sequelize, testConnection } = require('./config/database');
const { School, User, Event } = require('./models');

// Create Express app
const app = express();
const PORT = config.server.port;
const JWT_SECRET = config.jwt.secret;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client')));

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
app.get('/api/schools', async (req, res) => {
  try {
    const schools = await School.findAll({
      attributes: [
        'id', 'name', 'description',
        [sequelize.fn('COUNT', sequelize.col('Users.id')), 'alumniCount']
      ],
      include: [{
        model: User,
        attributes: [],
        where: { role: 'user' },
        required: false
      }],
      group: ['School.id'],
      raw: true
    });
    
    res.json(schools);
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({ message: 'Failed to fetch schools' });
  }
});

// GET /api/users/alumni - Get all public alumni profiles (with optional filtering)
app.get('/api/users/alumni', async (req, res) => {
  try {
    // Build query conditions
    const whereConditions = { 
      role: 'user',
      isPublic: true
    };
    
    // Apply filtering if provided
    const { schoolId, graduationYear, search } = req.query;
    
    if (schoolId && schoolId !== '0') {
      whereConditions.schoolId = parseInt(schoolId);
    }
    
    if (graduationYear && graduationYear !== '0') {
      whereConditions.graduationYear = parseInt(graduationYear);
    }
    
    if (search) {
      const query = search.toLowerCase();
      whereConditions[sequelize.Op.or] = [
        sequelize.where(
          sequelize.fn('LOWER', sequelize.fn('CONCAT', sequelize.col('first_name'), ' ', sequelize.col('last_name'))),
          'LIKE',
          `%${query}%`
        ),
        sequelize.where(
          sequelize.fn('LOWER', sequelize.col('company')),
          'LIKE',
          `%${query}%`
        )
      ];
    }
    
    // Execute query
    const alumni = await User.findAll({
      where: whereConditions,
      include: [{
        model: School,
        attributes: ['name']
      }],
      attributes: { exclude: ['password'] }
    });
    
    // Map results to add schoolName directly to user object
    const formattedAlumni = alumni.map(alumnus => {
      const alumObj = alumnus.toJSON();
      alumObj.schoolName = alumObj.School ? alumObj.School.name : null;
      delete alumObj.School;
      return alumObj;
    });
    
    res.json(formattedAlumni);
  } catch (error) {
    console.error('Error fetching alumni:', error);
    res.status(500).json({ message: 'Failed to fetch alumni' });
  }
});

// GET /api/users/:id - Get a specific user profile
app.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    const user = await User.findOne({
      where: { id: userId },
      include: [{
        model: School,
        attributes: ['name']
      }],
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If not admin and not the user themselves, and profile is not public, deny access
    if (req.user.role !== 'admin' && req.user.id !== userId && !user.isPublic) {
      return res.status(403).json({ message: 'Access denied to this profile' });
    }
    
    // Format user with school name
    const userObj = user.toJSON();
    userObj.schoolName = userObj.School ? userObj.School.name : null;
    delete userObj.School;
    
    res.json(userObj);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// POST /api/auth/login - Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({
      where: { email },
      include: [{
        model: School,
        attributes: ['name']
      }]
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Create and sign JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        firstName: user.firstName, 
        lastName: user.lastName,
        schoolId: user.schoolId,
        schoolName: user.School ? user.School.name : null
      }, 
      JWT_SECRET,
      { expiresIn: config.jwt.expiresIn }
    );
    
    // Return user info (without password) and token
    const userObj = user.toJSON();
    delete userObj.password;
    userObj.schoolName = userObj.School ? userObj.School.name : null;
    delete userObj.School;
    
    res.json({ 
      token, 
      user: userObj
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// POST /api/auth/register - Registration endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { 
      firstName, lastName, email, password, 
      schoolId, graduationYear, degree, 
      currentPosition, company, bio, 
      linkedinUrl, isPublic
    } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Find school if provided
    let schoolName = null;
    if (schoolId) {
      const school = await School.findByPk(schoolId);
      if (school) {
        schoolName = school.name;
      }
    }
    
    // Create a new pending user
    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'pending',
      schoolId: schoolId ? parseInt(schoolId) : null,
      graduationYear: graduationYear ? parseInt(graduationYear) : null,
      degree,
      currentPosition,
      company,
      bio,
      linkedinUrl,
      isPublic: isPublic === true || isPublic === 'true',
    });
    
    res.status(201).json({ 
      message: 'Registration successful. Your application is pending approval.' 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// PUT /api/users/:id - Update user profile
app.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Check if user exists
    const user = await User.findByPk(userId);
    
    if (!user) {
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
    
    // Update the user object
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (schoolId) user.schoolId = parseInt(schoolId);
    if (graduationYear) user.graduationYear = parseInt(graduationYear);
    if (degree !== undefined) user.degree = degree;
    if (currentPosition !== undefined) user.currentPosition = currentPosition;
    if (company !== undefined) user.company = company;
    if (bio !== undefined) user.bio = bio;
    if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl;
    if (isPublic !== undefined) user.isPublic = isPublic === true || isPublic === 'true';
    
    await user.save();
    
    // Fetch updated user with school info
    const updatedUser = await User.findOne({
      where: { id: userId },
      include: [{
        model: School,
        attributes: ['name']
      }],
      attributes: { exclude: ['password'] }
    });
    
    // Format response
    const userObj = updatedUser.toJSON();
    userObj.schoolName = userObj.School ? userObj.School.name : null;
    delete userObj.School;
    
    res.json(userObj);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// Admin Routes

// GET /api/admin/users - Get all users (admin only)
app.get('/api/admin/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: School,
        attributes: ['name']
      }],
      attributes: { exclude: ['password'] }
    });
    
    // Format users with school name
    const formattedUsers = users.map(user => {
      const userObj = user.toJSON();
      userObj.schoolName = userObj.School ? userObj.School.name : null;
      delete userObj.School;
      return userObj;
    });
    
    res.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// GET /api/admin/pending-applications - Get all pending applications (admin only)
app.get('/api/admin/pending-applications', authenticateToken, isAdmin, async (req, res) => {
  try {
    const pendingApps = await User.findAll({
      where: { role: 'pending' },
      include: [{
        model: School,
        attributes: ['name']
      }],
      attributes: { exclude: ['password'] }
    });
    
    // Format applications with school name
    const formattedApps = pendingApps.map(app => {
      const appObj = app.toJSON();
      appObj.schoolName = appObj.School ? appObj.School.name : null;
      delete appObj.School;
      return appObj;
    });
    
    res.json(formattedApps);
  } catch (error) {
    console.error('Error fetching pending applications:', error);
    res.status(500).json({ message: 'Failed to fetch pending applications' });
  }
});

// PUT /api/admin/applications/:id/approve - Approve application (admin only)
app.put('/api/admin/applications/:id/approve', authenticateToken, isAdmin, async (req, res) => {
  try {
    const applicationId = parseInt(req.params.id);
    
    // Find application
    const application = await User.findOne({
      where: { id: applicationId, role: 'pending' }
    });
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Update role to 'user'
    application.role = 'user';
    await application.save();
    
    res.json({ message: 'Application approved successfully' });
  } catch (error) {
    console.error('Error approving application:', error);
    res.status(500).json({ message: 'Failed to approve application' });
  }
});

// PUT /api/admin/applications/:id/reject - Reject application (admin only)
app.put('/api/admin/applications/:id/reject', authenticateToken, isAdmin, async (req, res) => {
  try {
    const applicationId = parseInt(req.params.id);
    
    // Find application
    const application = await User.findOne({
      where: { id: applicationId, role: 'pending' }
    });
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Delete the application
    await application.destroy();
    
    res.json({ message: 'Application rejected successfully' });
  } catch (error) {
    console.error('Error rejecting application:', error);
    res.status(500).json({ message: 'Failed to reject application' });
  }
});

// DELETE /api/admin/users/:id - Delete user (admin only)
app.delete('/api/admin/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Find user
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if trying to delete admin (for safety)
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin user' });
    }
    
    // Remove user
    await user.destroy();
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// GET /api/admin/schools - Get schools with admin details
app.get('/api/admin/schools', authenticateToken, isAdmin, async (req, res) => {
  try {
    const schools = await School.findAll({
      attributes: [
        'id', 'name', 'description',
        [sequelize.fn('COUNT', sequelize.col('Users.id')), 'alumniCount']
      ],
      include: [{
        model: User,
        attributes: [],
        where: { role: 'user' },
        required: false
      }],
      group: ['School.id'],
      raw: true
    });
    
    res.json(schools);
  } catch (error) {
    console.error('Error fetching schools for admin:', error);
    res.status(500).json({ message: 'Failed to fetch schools' });
  }
});

// PUT /api/admin/schools/:id - Update school (admin only)
app.put('/api/admin/schools/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const schoolId = parseInt(req.params.id);
    
    // Find school
    const school = await School.findByPk(schoolId);
    
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    
    // Update school
    const { name, description } = req.body;
    
    if (name) school.name = name;
    if (description !== undefined) school.description = description;
    
    await school.save();
    
    res.json(school);
  } catch (error) {
    console.error('Error updating school:', error);
    res.status(500).json({ message: 'Failed to update school' });
  }
});

// DELETE /api/admin/schools/:id - Delete school (admin only)
app.delete('/api/admin/schools/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const schoolId = parseInt(req.params.id);
    
    // Find school
    const school = await School.findByPk(schoolId);
    
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    
    // Check if school has alumni
    const hasAlumni = await User.count({
      where: { schoolId, role: 'user' }
    });
    
    if (hasAlumni > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete school with associated alumni. Reassign alumni first.' 
      });
    }
    
    // Remove school
    await school.destroy();
    
    res.json({ message: 'School deleted successfully' });
  } catch (error) {
    console.error('Error deleting school:', error);
    res.status(500).json({ message: 'Failed to delete school' });
  }
});

// Add a status endpoint for connection testing
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online', 
    timestamp: new Date().toISOString(), 
    message: 'Server is running successfully' 
  });
});

// Import error handling middleware
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Serve the main HTML page for non-API routes
app.get('*', (req, res, next) => {
  // Only serve index.html for non-API routes
  if (!req.path.startsWith('/api/')) {
    return res.sendFile(path.join(__dirname, 'client', 'index.html'));
  }
  
  // If it's an API route that wasn't matched, pass to the 404 handler
  next();
});

// Add 404 handler for routes that don't exist
app.use(notFoundHandler);

// Add error handling middleware
app.use(errorHandler);

// Initialize database connection and start server
async function startServer() {
  try {
    // Test database connection
    await testConnection();
    
    // Initialize database if needed
    const { initializeDatabase } = require('./database/init');
    
    // Initialize the database on server start if configured to do so
    if (config.app.initializeDb) {
      console.log('Initializing database...');
      await initializeDatabase();
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Mediterranean College Alumni server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();