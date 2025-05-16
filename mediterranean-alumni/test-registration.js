// Test the registration endpoint
const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5000';
const REGISTRATION_ENDPOINT = `${BASE_URL}/api/auth/register`;

// Test data
const validUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'securePassword123',
  schoolId: 1,
  graduationYear: 2020,
  degree: 'Bachelor of Computer Science',
  currentPosition: 'Software Developer',
  company: 'Tech Corp',
  bio: 'Passionate about software development',
  linkedinUrl: 'https://linkedin.com/in/johndoe',
  isPublic: true
};

// Test cases
async function testRegistration() {
  console.log('Starting registration tests...\n');

  // Test 1: Valid registration
  try {
    console.log('Test 1: Valid registration');
    const response = await axios.post(REGISTRATION_ENDPOINT, validUser);
    console.log('Success:', response.data);
    console.log('---\n');
  } catch (error) {
    console.log('Error:', error.response?.data || error.message);
    console.log('---\n');
  }

  // Test 2: Duplicate email (should fail)
  try {
    console.log('Test 2: Duplicate email');
    const response = await axios.post(REGISTRATION_ENDPOINT, validUser);
    console.log('Success:', response.data);
    console.log('---\n');
  } catch (error) {
    console.log('Error:', error.response?.data || error.message);
    console.log('---\n');
  }

  // Test 3: Missing required fields
  try {
    console.log('Test 3: Missing required fields');
    const incompleteUser = {
      firstName: 'Jane',
      email: 'jane@example.com'
    };
    const response = await axios.post(REGISTRATION_ENDPOINT, incompleteUser);
    console.log('Success:', response.data);
    console.log('---\n');
  } catch (error) {
    console.log('Error:', error.response?.data || error.message);
    console.log('---\n');
  }

  // Test 4: Invalid email format
  try {
    console.log('Test 4: Invalid email format');
    const invalidEmailUser = {
      ...validUser,
      email: 'invalid-email'
    };
    const response = await axios.post(REGISTRATION_ENDPOINT, invalidEmailUser);
    console.log('Success:', response.data);
    console.log('---\n');
  } catch (error) {
    console.log('Error:', error.response?.data || error.message);
    console.log('---\n');
  }

  // Test 5: Short password
  try {
    console.log('Test 5: Short password');
    const shortPasswordUser = {
      ...validUser,
      email: 'short@example.com',
      password: '123'
    };
    const response = await axios.post(REGISTRATION_ENDPOINT, shortPasswordUser);
    console.log('Success:', response.data);
    console.log('---\n');
  } catch (error) {
    console.log('Error:', error.response?.data || error.message);
    console.log('---\n');
  }

  // Test 6: Invalid school ID
  try {
    console.log('Test 6: Invalid school ID');
    const invalidSchoolUser = {
      ...validUser,
      email: 'invalidschool@example.com',
      schoolId: 999
    };
    const response = await axios.post(REGISTRATION_ENDPOINT, invalidSchoolUser);
    console.log('Success:', response.data);
    console.log('---\n');
  } catch (error) {
    console.log('Error:', error.response?.data || error.message);
    console.log('---\n');
  }
}

// Run tests
testRegistration();