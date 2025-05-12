const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const School = require('./School');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'first_name',
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'last_name',
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'pending',
  },
  schoolId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'school_id',
    references: {
      model: School,
      key: 'id',
    },
  },
  graduationYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'graduation_year',
  },
  degree: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  currentPosition: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'current_position',
  },
  company: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  linkedinUrl: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'linkedin_url',
  },
  profileImage: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'profile_image',
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_public',
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_login',
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Set up associations
User.belongsTo(School, { foreignKey: 'school_id' });
School.hasMany(User, { foreignKey: 'school_id' });

module.exports = User;