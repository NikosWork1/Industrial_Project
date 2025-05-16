/**
 * Quick Database Configuration Check
 * Run this to verify your database configuration
 * Run with: node diagnostic/check-db-config.js
 */

const path = require('path');
const fs = require('fs');

// Load config
const config = require('../config/config');

console.log('=== Database Configuration Check ===\n');

// 1. Check config settings
console.log('1. Configuration settings:');
console.log('   Environment:', process.env.NODE_ENV || 'development');
console.log('   Database config:', JSON.stringify(config.database, null, 2));

// 2. Check if database file exists
const dbPath = path.resolve(__dirname, '..', config.database.storage);
console.log('\n2. Database file:');
console.log('   Expected path:', dbPath);

if (fs.existsSync(dbPath)) {
    const stats = fs.statSync(dbPath);
    console.log('   ✓ File exists');
    console.log('   File size:', stats.size, 'bytes');
    console.log('   Last modified:', stats.mtime);
    
    // Check if file is writable
    try {
        fs.accessSync(dbPath, fs.constants.W_OK);
        console.log('   ✓ File is writable');
    } catch (err) {
        console.log('   ✗ File is NOT writable');
    }
} else {
    console.log('   ✗ File does NOT exist');
}

// 3. Check if using memory database
if (config.database.storage === ':memory:') {
    console.log('\n⚠️  WARNING: Using in-memory database!');
    console.log('   Changes will not persist after restart');
}

// 4. Check environment variables
console.log('\n3. Environment variables:');
const envVars = ['NODE_ENV', 'DB_STORAGE', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
envVars.forEach(varName => {
    const value = process.env[varName];
    console.log(`   ${varName}: ${value || '(not set)'}`);
});

console.log('\n=== Check complete ===');