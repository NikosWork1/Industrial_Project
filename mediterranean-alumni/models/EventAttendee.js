const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EventAttendee = sequelize.define('EventAttendee', {
  eventId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    field: 'event_id',
  },
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    field: 'user_id',
  },
  rsvpStatus: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'rsvp_status',
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  tableName: 'event_attendees',
});

module.exports = EventAttendee;