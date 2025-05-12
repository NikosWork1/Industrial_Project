const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const { School, User } = require('../models');

async function initializeDatabase() {
  try {
    // Sync all models with the database
    // Note: {force: true} will drop tables if they exist
    // Use {alter: true} for development to update existing tables
    // In production, you would want to use migrations instead
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully');

    // Seed initial schools
    const schools = await School.bulkCreate([
      {
        name: 'School of Business',
        description: 'The School of Business offers degrees in Business Administration, Marketing, Finance, and Management.',
      },
      {
        name: 'School of Computing',
        description: 'The School of Computing offers degrees in Computer Science, Software Engineering, Data Science, and Cybersecurity.',
      },
      {
        name: 'School of Engineering',
        description: 'The School of Engineering offers degrees in Civil Engineering, Mechanical Engineering, Electrical Engineering, and Chemical Engineering.',
      },
      {
        name: 'School of Health Sciences',
        description: 'The School of Health Sciences offers degrees in Nursing, Pharmacy, Physical Therapy, and Public Health.',
      },
      {
        name: 'School of Humanities',
        description: 'The School of Humanities offers degrees in English, History, Philosophy, and Psychology.',
      },
    ]);
    console.log('Schools seeded successfully');

    // Hash admin password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin user
    await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@medcollege.edu',
      password: hashedPassword,
      role: 'admin',
      currentPosition: 'System Administrator',
      company: 'Mediterranean College',
      bio: 'Administrator account for the Mediterranean College Alumni Network.',
      isPublic: false,
    });
    console.log('Admin user created successfully');

    // Create sample alumni
    const sampleAlumni = [
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        password: await bcrypt.hash('password123', salt),
        role: 'user',
        schoolId: 2,
        graduationYear: 2018,
        degree: 'BSc in Computer Science',
        currentPosition: 'Software Engineer',
        company: 'Tech Innovations',
        bio: 'Experienced software engineer with a passion for developing scalable applications. I have contributed to several open-source projects and enjoy mentoring junior developers.',
        linkedinUrl: 'https://linkedin.com/in/johnsmith',
        isPublic: true,
      },
      {
        firstName: 'Maria',
        lastName: 'Papadopoulos',
        email: 'maria.p@example.com',
        password: await bcrypt.hash('password123', salt),
        role: 'user',
        schoolId: 1,
        graduationYear: 2019,
        degree: 'MBA in International Business',
        currentPosition: 'Marketing Manager',
        company: 'Global Marketing Solutions',
        bio: 'Marketing professional with expertise in digital marketing strategies. I specialize in social media marketing and content creation for international brands.',
        linkedinUrl: 'https://linkedin.com/in/maria-p',
        isPublic: true,
      },
      // Add more sample users as needed
    ];

    await User.bulkCreate(sampleAlumni);
    console.log('Sample alumni created successfully');

    // Create sample pending applications
    const pendingApplications = [
      {
        firstName: 'Katerina',
        lastName: 'Nikolaou',
        email: 'katerina.n@example.com',
        password: await bcrypt.hash('password123', salt),
        role: 'pending',
        schoolId: 5,
        graduationYear: 2022,
        degree: 'BA in English Literature',
        currentPosition: 'Content Writer',
        company: 'Digital Media Agency',
        bio: 'Recent graduate with a passion for literature and creative writing. Looking to connect with fellow alumni and explore career opportunities.',
        isPublic: true,
      },
    ];

    await User.bulkCreate(pendingApplications);
    console.log('Sample pending applications created successfully');

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

module.exports = { initializeDatabase };

// If this script is run directly (not imported), initialize the database
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database initialization completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
}