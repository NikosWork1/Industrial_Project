const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, School } = require('../models');
const { Op } = require('sequelize');
const config = require('../config/config');

const JWT_SECRET = config.jwt.secret;

// POST /api/auth/register - Registration endpoint
router.post('/register', async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      schoolId,
      graduationYear, 
      degree, 
      currentPosition, 
      company, 
      bio, 
      linkedinUrl, 
      isPublic 
    } = req.body;

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'schoolId'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields',
        missingFields 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email format' 
      });
    }

    // Validate password strength (at least 6 characters)
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ 
      where: { 
        email: {
          [Op.eq]: email.toLowerCase()
        }
      } 
    });
    
    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        message: 'Email already registered' 
      });
    }

    // Validate schoolId
    const schoolIdNum = parseInt(schoolId);
    if (isNaN(schoolIdNum)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid school ID' 
      });
    }

    // Check if school exists
    const school = await School.findByPk(schoolIdNum);
    if (!school) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid school selected' 
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user with pending status
    const newUser = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'pending',
      schoolId: schoolIdNum,
      graduationYear: graduationYear ? parseInt(graduationYear) : null,
      degree: degree ? degree.trim() : null,
      currentPosition: currentPosition ? currentPosition.trim() : null,
      company: company ? company.trim() : null,
      bio: bio ? bio.trim() : null,
      linkedinUrl: linkedinUrl ? linkedinUrl.trim() : null,
      isPublic: isPublic === true || isPublic === 'true',
    });

    res.status(201).json({ 
      success: true,
      message: 'Registration successful. Your account is pending approval by an administrator.',
      userId: newUser.id
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Check for specific Sequelize errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => ({
          field: e.path,
          message: e.message
        }))
      });
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    // Generic error response
    res.status(500).json({ 
      success: false,
      message: 'Registration failed. Please try again later.' 
    });
  }
});

// POST /api/auth/login - Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    // Find user by email (case-insensitive)
    const user = await User.findOne({
      where: { 
        email: {
          [Op.eq]: email.toLowerCase()
        }
      },
      include: [{
        model: School,
        attributes: ['name']
      }]
    });
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Check if user account is approved
    if (user.role === 'pending') {
      return res.status(403).json({ 
        success: false,
        message: 'Your account is pending approval. Please wait for an administrator to approve your registration.' 
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Create JWT token
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

    // Prepare user data (exclude password)
    const userObj = user.toJSON();
    delete userObj.password;
    userObj.schoolName = userObj.School ? userObj.School.name : null;
    delete userObj.School;

    res.json({ 
      success: true,
      token, 
      user: userObj,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Login failed. Please try again later.' 
    });
  }
});

module.exports = router;