const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const School = require('./School');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'start_time',
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'end_time',
  },
  organizerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'organizer_id',
    references: {
      model: User,
      key: 'id',
    },
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
  isPublic: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_public',
  },
  maxAttendees: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'max_attendees',
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Set up associations
Event.belongsTo(User, { foreignKey: 'organizer_id', as: 'organizer' });
Event.belongsTo(School, { foreignKey: 'school_id' });
Event.belongsToMany(User, { through: 'EventAttendee', foreignKey: 'event_id', as: 'attendees' });
User.belongsToMany(Event, { through: 'EventAttendee', foreignKey: 'user_id', as: 'events' });

module.exports = Event;