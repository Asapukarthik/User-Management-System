// Admin User Seeder
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing test users to ensure they are recreated with hashed passwords
    await User.deleteMany({
      email: { $in: ['admin@example.com', 'manager@example.com', 'user@example.com'] }
    });
    console.log('Existing test users cleared');

    // Create test users
    const users = [
      {
        name: 'Admin User',
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
      },
      {
        name: 'Manager User',
        username: 'manager',
        email: 'manager@example.com',
        password: 'manager123',
        role: 'manager',
      },
      {
        name: 'Regular User',
        username: 'user',
        email: 'user@example.com',
        password: 'user123',
        role: 'user',
      },
    ];

    // Create users one by one to trigger the 'save' middleware for hashing
    for (const userData of users) {
      await User.create(userData);
    }

    console.log(`${users.length} test users created successfully with hashed passwords.`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

// Run seeder if this file is executed directly
if (require.main === module) {
  seedUsers();
}

module.exports = seedUsers;
