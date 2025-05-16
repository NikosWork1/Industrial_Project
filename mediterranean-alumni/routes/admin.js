const express = require('express');
const router = express.Router();
const { User, School } = require('../models');
const { sequelize } = require('../config/database');

// GET /api/admin/users/pending - Get all pending user applications
router.get('/users/pending', async (req, res) => {
  try {
    const pendingUsers = await User.findAll({
      where: { role: 'pending' },
      include: [{
        model: School,
        attributes: ['name']
      }],
      attributes: { exclude: ['password'] }
    });
    
    // Format the response to include schoolName directly
    const formattedUsers = pendingUsers.map(user => {
      const userObj = user.toJSON();
      userObj.schoolName = userObj.School ? userObj.School.name : null;
      delete userObj.School;
      return userObj;
    });
    
    res.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching pending users:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch pending users' 
    });
  }
});

// GET /api/admin/users/all - Get all users (admin only)
router.get('/users/all', async (req, res) => {
  try {
    const allUsers = await User.findAll({
      include: [{
        model: School,
        attributes: ['name']
      }],
      attributes: { exclude: ['password'] }
    });
    
    // Format the response to include schoolName directly
    const formattedUsers = allUsers.map(user => {
      const userObj = user.toJSON();
      userObj.schoolName = userObj.School ? userObj.School.name : null;
      delete userObj.School;
      return userObj;
    });
    
    res.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch users' 
    });
  }
});

// PUT /api/admin/applications/:id/approve - Approve a pending user application
router.put('/applications/:id/approve', async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const userId = parseInt(req.params.id);
    
    // Validate the ID
    if (isNaN(userId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid user ID format' 
      });
    }
    
    // Find the user by ID
    const user = await User.findByPk(userId, { transaction });
    
    // Check if user exists
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    // Check if user is already approved
    if (user.role !== 'pending') {
      await transaction.rollback();
      return res.status(400).json({ 
        success: false,
        message: 'User is already approved or has a different role' 
      });
    }
    
    // Update user role from 'pending' to 'user'
    user.role = 'user';
    await user.save({ transaction });
    
    // Commit the transaction
    await transaction.commit();
    
    res.json({ 
      success: true,
      message: 'User application approved successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    await transaction.rollback();
    console.error('Error approving user application:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to approve user application' 
    });
  }
});

// PUT /api/admin/applications/:id/reject - Reject a pending user application
router.put('/applications/:id/reject', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Validate the ID
    if (isNaN(userId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid user ID format' 
      });
    }
    
    // Find the user by ID
    const user = await User.findByPk(userId);
    
    // Check if user exists
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    // Check if user is pending
    if (user.role !== 'pending') {
      return res.status(400).json({ 
        success: false,
        message: 'User is not in pending status' 
      });
    }
    
    // Delete the rejected user application
    await user.destroy();
    
    res.json({ 
      success: true,
      message: 'User application rejected and removed successfully'
    });
    
  } catch (error) {
    console.error('Error rejecting user application:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to reject user application' 
    });
  }
});

module.exports = router;