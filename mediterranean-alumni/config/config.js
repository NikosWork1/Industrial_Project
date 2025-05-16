/**
 * Configuration for Mediterranean College Alumni Network
 * Loads environment variables from .env file
 */

require('dotenv').config();

const config = {
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },
  database: {
    dialect: process.env.DB_DIALECT || 'sqlite',
    storage: process.env.DB_STORAGE || './database/mediterranean-alumni.sqlite',
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'mediterranean_college_alumni_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  app: {
    initializeDb: process.env.INITIALIZE_DB === 'true',
  }
};

module.exports = config;