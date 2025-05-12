const { Sequelize } = require('sequelize');
const path = require('path');
const config = require('./config');

// Initialize Sequelize with configuration from config.js
const sequelize = new Sequelize({
  dialect: config.database.dialect,
  storage: path.resolve(process.cwd(), config.database.storage),
  logging: config.database.logging,
  dialectOptions: {
    // Use a more compatible approach for SQLite
    mode: require('fs').constants.OPEN_READWRITE | 
          require('fs').constants.OPEN_CREATE | 
          require('fs').constants.OPEN_FULLMUTEX
  }
});

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
}

// Export the sequelize instance
module.exports = {
  sequelize,
  testConnection,
};