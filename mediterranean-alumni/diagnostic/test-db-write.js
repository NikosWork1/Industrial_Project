/**
 * Test Database Write Operations
 * This script tests if database writes are working correctly
 * Run with: node diagnostic/test-db-write.js
 */

const { sequelize } = require('../config/database');
const { User, School } = require('../models');

async function testDatabaseWrites() {
    console.log('=== Testing Database Write Operations ===\n');
    
    try {
        // Test 1: Direct SQL write
        console.log('Test 1: Direct SQL write');
        const [results, metadata] = await sequelize.query(
            "INSERT INTO Users (firstName, lastName, email, password, role, isPublic, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            {
                replacements: [
                    'DirectSQL',
                    'Test',
                    `directsql_${Date.now()}@test.com`,
                    'hashedpassword',
                    'pending',
                    true,
                    new Date(),
                    new Date()
                ]
            }
        );
        console.log('✓ Direct SQL insert successful\n');
        
        // Test 2: Sequelize create
        console.log('Test 2: Sequelize create');
        const newUser = await User.create({
            firstName: 'Sequelize',
            lastName: 'Test',
            email: `sequelize_${Date.now()}@test.com`,
            password: 'testpassword',
            role: 'pending',
            schoolId: 1,
            isPublic: true
        });
        console.log(`✓ Sequelize create successful - User ID: ${newUser.id}\n`);
        
        // Test 3: Update operation
        console.log('Test 3: Update operation');
        console.log(`  Current role: ${newUser.role}`);
        newUser.role = 'user';
        await newUser.save();
        console.log(`  Updated role: ${newUser.role}`);
        
        // Verify update
        const verifyUser = await User.findByPk(newUser.id);
        console.log(`  Verified role: ${verifyUser.role}`);
        console.log(`✓ Update ${verifyUser.role === 'user' ? 'successful' : 'failed'}\n`);
        
        // Test 4: Transaction test
        console.log('Test 4: Transaction test');
        const t = await sequelize.transaction();
        
        try {
            const transUser = await User.create({
                firstName: 'Transaction',
                lastName: 'Test',
                email: `transaction_${Date.now()}@test.com`,
                password: 'testpassword',
                role: 'pending',
                schoolId: 1,
                isPublic: true
            }, { transaction: t });
            
            transUser.role = 'user';
            await transUser.save({ transaction: t });
            
            await t.commit();
            console.log('✓ Transaction committed successfully\n');
            
            // Verify transaction
            const verifyTransUser = await User.findByPk(transUser.id);
            console.log(`  Transaction user role: ${verifyTransUser.role}`);
            
        } catch (error) {
            await t.rollback();
            console.log('✗ Transaction failed:', error.message);
        }
        
        // Test 5: Check database file
        console.log('Test 5: Database file check');
        const fs = require('fs');
        const dbPath = sequelize.config.storage;
        
        if (fs.existsSync(dbPath)) {
            const stats = fs.statSync(dbPath);
            console.log(`  Database file: ${dbPath}`);
            console.log(`  File size: ${stats.size} bytes`);
            console.log(`  Last modified: ${stats.mtime}`);
            console.log('✓ Database file exists and is accessible\n');
        } else {
            console.log('✗ Database file not found at:', dbPath);
        }
        
        // Test 6: Check for WAL mode
        console.log('Test 6: SQLite configuration');
        const [walMode] = await sequelize.query("PRAGMA journal_mode;");
        console.log(`  Journal mode: ${walMode[0].journal_mode}`);
        
        const [syncMode] = await sequelize.query("PRAGMA synchronous;");
        console.log(`  Synchronous: ${syncMode[0].synchronous}`);
        
        // Clean up test data
        console.log('\nCleaning up test data...');
        await sequelize.query(
            "DELETE FROM Users WHERE email LIKE 'directsql_%' OR email LIKE 'sequelize_%' OR email LIKE 'transaction_%'"
        );
        console.log('✓ Test data cleaned up\n');
        
        console.log('=== All tests completed ===');
        
    } catch (error) {
        console.error('Error during tests:', error);
    } finally {
        await sequelize.close();
    }
}

// Run the tests
testDatabaseWrites();