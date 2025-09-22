// Sample data for testing PDF portfolio generation
// Run this script to add sample certificates to your database

import mongoose from 'mongoose';
import { User } from './src/models/user.model.js';
import { Certificate } from './src/models/certificate.model.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleCertificates = [
  {
    title: 'React.js Complete Course Certification',
    description: 'Completed comprehensive React.js course covering hooks, context, and modern patterns',
    category: 'Technical',
    imageUrl: '/uploads/sample-cert-1.jpg',
    status: 'Verified',
    points: 50
  },
  {
    title: 'Hackathon Winner - Smart City Solutions',
    description: 'First place winner in 48-hour hackathon for developing smart city solutions',
    category: 'Technical',
    imageUrl: '/uploads/sample-cert-2.jpg',
    status: 'Verified',
    points: 100
  },
  {
    title: 'Leadership Workshop Certificate',
    description: 'Completed 3-day intensive leadership and team management workshop',
    category: 'Leadership',
    imageUrl: '/uploads/sample-cert-3.jpg',
    status: 'Verified',
    points: 30
  },
  {
    title: 'Community Service - Blood Donation Drive',
    description: 'Organized and led blood donation drive serving 200+ donors',
    category: 'Community Service',
    imageUrl: '/uploads/sample-cert-4.jpg',
    status: 'Verified',
    points: 40
  }
];

async function addSampleData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-student-hub');
    console.log('Connected to MongoDB');

    // Find a sample user (you'll need to replace this with an actual user ID)
    const sampleUser = await User.findOne({ role: 'student' });
    
    if (!sampleUser) {
      console.log('No student user found. Please create a student user first.');
      return;
    }

    console.log(`Adding sample certificates for user: ${sampleUser.fullName}`);

    // Add sample certificates
    for (const certData of sampleCertificates) {
      const certificate = new Certificate({
        ...certData,
        userId: sampleUser._id,
        userEmail: sampleUser.email
      });
      
      await certificate.save();
      console.log(`Added certificate: ${certData.title}`);
    }

    console.log('Sample data added successfully!');
    console.log(`User ID for testing: ${sampleUser._id}`);
    
  } catch (error) {
    console.error('Error adding sample data:', error);
  } finally {
    await mongoose.disconnect();
  }
}

addSampleData();
