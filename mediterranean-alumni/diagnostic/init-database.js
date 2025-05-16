/**
 * Initialize Database
 * This script creates the database tables from the schema
 */

const { sequelize } = require('../config/database');
const { School, User, Event, EventAttendee } = require('../models');

async function initializeDatabase() {
    console.log('=== Database Initialization ===\n');
    
    try {
        // 1. Test connection
        console.log('1. Testing connection...');
        await sequelize.authenticate();
        console.log('✓ Connected to database\n');
        
        // 2. Sync all models
        console.log('2. Creating tables...');
        
        // Force: true will drop existing tables
        // Use force: false in production
        await sequelize.sync({ force: false });
        
        console.log('✓ Tables created/synchronized\n');
        
        // 3. Verify tables exist
        console.log('3. Verifying tables...');
        const [tables] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table';");
        
        console.log('Tables in database:');
        tables.forEach(table => {
            console.log('  -', table.name);
        });
        
        // 4. Create default data if needed
        console.log('\n4. Checking for default data...');
        
        // Check if schools exist
        const schoolCount = await School.count();
        if (schoolCount === 0) {
            console.log('Creating default schools...');
            
            const schools = [
                { name: 'School of Business', description: 'Business and Management Studies' },
                { name: 'School of Computing', description: 'Computer Science and IT' },
                { name: 'School of Health Sciences', description: 'Health and Medical Studies' },
                { name: 'School of Engineering', description: 'Engineering and Technology' },
                { name: 'School of Arts', description: 'Arts and Humanities' }
            ];
            
            for (const school of schools) {
                await School.create(school);
            }
            
            console.log('✓ Default schools created');
        } else {
            console.log('Schools already exist:', schoolCount);
        }
        
        // Check if admin user exists
        const adminCount = await User.count({ where: { role: 'admin' } });
        if (adminCount === 0) {
            console.log('Creating default admin user...');
            
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            
            await User.create({
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@medcollege.edu',
                password: hashedPassword,
                role: 'admin',
                schoolId: 1,
                isPublic: false,
                bio: 'System Administrator'
            });
            
            console.log('✓ Default admin user created');
            console.log('  Email: admin@medcollege.edu');
            console.log('  Password: admin123');
        } else {
            console.log('Admin user already exists');
        }
        
        console.log('\n✓ Database initialization complete');
        
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await sequelize.close();
    }
}

// Run initialization
initializeDatabase();