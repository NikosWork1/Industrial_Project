/**
 * Database Diagnostic Script
 * This script helps diagnose database persistence issues
 * Run with: node diagnostic/db-diagnostic.js
 */

const { sequelize } = require('../config/database');
const { User, School } = require('../models');

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m'
};

async function runDiagnostics() {
    console.log(`${colors.bright}${colors.blue}=== Database Diagnostics Starting ===${colors.reset}\n`);
    
    try {
        // 1. Test database connection
        console.log(`${colors.yellow}1. Testing database connection...${colors.reset}`);
        await sequelize.authenticate();
        console.log(`${colors.green}✓ Database connection successful${colors.reset}`);
        
        // 2. Check database file path
        console.log(`\n${colors.yellow}2. Database configuration:${colors.reset}`);
        console.log(`   Database: ${sequelize.config.database}`);
        console.log(`   Storage: ${sequelize.config.storage}`);
        console.log(`   Dialect: ${sequelize.options.dialect}`);
        
        // 3. Check if tables exist
        console.log(`\n${colors.yellow}3. Checking tables...${colors.reset}`);
        const [results] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table';");
        console.log('   Tables found:', results.map(r => r.name).join(', '));
        
        // 4. Count records in each table
        console.log(`\n${colors.yellow}4. Record counts:${colors.reset}`);
        const userCount = await User.count();
        const pendingCount = await User.count({ where: { role: 'pending' } });
        const approvedCount = await User.count({ where: { role: 'user' } });
        const adminCount = await User.count({ where: { role: 'admin' } });
        const schoolCount = await School.count();
        
        console.log(`   Total users: ${userCount}`);
        console.log(`   - Pending: ${pendingCount}`);
        console.log(`   - Approved: ${approvedCount}`);
        console.log(`   - Admin: ${adminCount}`);
        console.log(`   Schools: ${schoolCount}`);
        
        // 5. Test user creation and update
        console.log(`\n${colors.yellow}5. Testing user creation and update...${colors.reset}`);
        
        // Create a test user
        const testUser = await User.create({
            firstName: 'Test',
            lastName: 'User',
            email: `test_${Date.now()}@test.com`,
            password: 'test123',
            role: 'pending',
            schoolId: 1,
            isPublic: true
        });
        
        console.log(`${colors.green}✓ Test user created with ID: ${testUser.id}${colors.reset}`);
        console.log(`   Initial role: ${testUser.role}`);
        
        // Update the test user
        testUser.role = 'user';
        await testUser.save();
        
        // Verify the update
        const updatedUser = await User.findByPk(testUser.id);
        console.log(`   Updated role: ${updatedUser.role}`);
        
        if (updatedUser.role === 'user') {
            console.log(`${colors.green}✓ User update successful${colors.reset}`);
        } else {
            console.log(`${colors.red}✗ User update failed${colors.reset}`);
        }
        
        // 6. Test transaction
        console.log(`\n${colors.yellow}6. Testing transaction commit...${colors.reset}`);
        const transaction = await sequelize.transaction();
        
        try {
            // Update user in transaction
            testUser.bio = 'Updated via transaction';
            await testUser.save({ transaction });
            
            // Commit transaction
            await transaction.commit();
            console.log(`${colors.green}✓ Transaction committed successfully${colors.reset}`);
            
            // Verify commit
            const verifyUser = await User.findByPk(testUser.id);
            if (verifyUser.bio === 'Updated via transaction') {
                console.log(`${colors.green}✓ Transaction changes persisted${colors.reset}`);
            } else {
                console.log(`${colors.red}✗ Transaction changes not persisted${colors.reset}`);
            }
        } catch (error) {
            await transaction.rollback();
            console.log(`${colors.red}✗ Transaction failed: ${error.message}${colors.reset}`);
        }
        
        // Clean up test user
        await testUser.destroy();
        console.log(`\n${colors.green}✓ Test user cleaned up${colors.reset}`);
        
        // 7. Check for mock data usage
        console.log(`\n${colors.yellow}7. Checking for mock data usage...${colors.reset}`);
        
        // Check if any files reference mockData
        const fs = require('fs');
        const path = require('path');
        
        const checkForMockData = (dir) => {
            if (!fs.existsSync(dir)) return [];
            
            const files = fs.readdirSync(dir);
            const mockReferences = [];
            
            files.forEach(file => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                
                if (stat.isDirectory() && !file.includes('node_modules')) {
                    mockReferences.push(...checkForMockData(filePath));
                } else if (file.endsWith('.js')) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    if (content.includes('mockData') || content.includes('mock data')) {
                        mockReferences.push(filePath);
                    }
                }
            });
            
            return mockReferences;
        };
        
        const projectDir = path.join(__dirname, '..');
        const mockReferences = checkForMockData(projectDir);
        
        if (mockReferences.length > 0) {
            console.log(`${colors.yellow}   Found mock data references in:${colors.reset}`);
            mockReferences.forEach(file => {
                console.log(`   - ${file}`);
            });
        } else {
            console.log(`${colors.green}   No mock data references found${colors.reset}`);
        }
        
        console.log(`\n${colors.bright}${colors.green}=== Diagnostics Complete ===${colors.reset}`);
        
    } catch (error) {
        console.error(`${colors.red}Error during diagnostics: ${error.message}${colors.reset}`);
        console.error(error.stack);
    } finally {
        await sequelize.close();
    }
}

// Run the diagnostics
runDiagnostics();