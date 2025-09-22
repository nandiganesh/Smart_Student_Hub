// Sample data for testing Student Dashboard
import mongoose from 'mongoose';
import { User } from './src/models/user.model.js';
import { Student } from './src/models/student.model.js';
import { Achievement } from './src/models/achievement.model.js';
import { Certificate } from './src/models/certificate.model.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleAchievements = [
  {
    title: 'React.js Complete Course',
    category: 'Technical',
    organizer: 'Coursera',
    description: 'Completed comprehensive React.js course covering hooks, context, and modern patterns',
    date: new Date('2024-01-15'),
    status: 'Verified',
    points: 50,
    credits: 2,
    semester: 6,
    academicYear: '2023-24'
  },
  {
    title: 'Smart City Hackathon Winner',
    category: 'Technical',
    organizer: 'TechFest 2024',
    description: 'First place winner in 48-hour hackathon for developing smart city solutions',
    date: new Date('2024-02-20'),
    status: 'Verified',
    points: 100,
    credits: 3,
    semester: 6,
    academicYear: '2023-24'
  },
  {
    title: 'Leadership Workshop',
    category: 'Leadership',
    organizer: 'Student Council',
    description: 'Completed 3-day intensive leadership and team management workshop',
    date: new Date('2024-03-10'),
    status: 'Verified',
    points: 30,
    credits: 1,
    semester: 6,
    academicYear: '2023-24'
  },
  {
    title: 'Blood Donation Drive Organizer',
    category: 'Community Service',
    organizer: 'Red Cross Society',
    description: 'Organized and led blood donation drive serving 200+ donors',
    date: new Date('2024-03-25'),
    status: 'Verified',
    points: 40,
    credits: 2,
    semester: 6,
    academicYear: '2023-24'
  },
  {
    title: 'Machine Learning Certification',
    category: 'Technical',
    organizer: 'Stanford Online',
    description: 'Completed Andrew Ng\'s Machine Learning course with distinction',
    date: new Date('2024-04-05'),
    status: 'Pending',
    points: 0,
    credits: 0,
    semester: 6,
    academicYear: '2023-24'
  },
  {
    title: 'Inter-College Cricket Tournament',
    category: 'Sports',
    organizer: 'Sports Committee',
    description: 'Participated in inter-college cricket tournament as team captain',
    date: new Date('2024-04-15'),
    status: 'Verified',
    points: 25,
    credits: 1,
    semester: 6,
    academicYear: '2023-24'
  }
];

const sampleAcademicRecords = [
  { semester: 1, cgpa: 8.2, attendance: 92, credits: 24, academicYear: '2021-22' },
  { semester: 2, cgpa: 8.5, attendance: 89, credits: 26, academicYear: '2021-22' },
  { semester: 3, cgpa: 8.8, attendance: 94, credits: 25, academicYear: '2022-23' },
  { semester: 4, cgpa: 9.1, attendance: 96, credits: 27, academicYear: '2022-23' },
  { semester: 5, cgpa: 8.9, attendance: 91, credits: 26, academicYear: '2023-24' },
  { semester: 6, cgpa: 9.2, attendance: 95, credits: 25, academicYear: '2023-24' }
];

async function createSampleStudentData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-student-hub');
    console.log('Connected to MongoDB');

    // Find a sample student user
    const sampleUser = await User.findOne({ role: 'student' });
    
    if (!sampleUser) {
      console.log('No student user found. Creating a sample student user...');
      
      // Create a sample student user
      const newUser = new User({
        username: 'john.doe',
        email: 'john.doe@student.edu',
        fullName: 'John Doe',
        role: 'student',
        studentId: 'CS2021001',
        department: 'Computer Science',
        semester: 6,
        password: 'password123' // This will be hashed by the pre-save middleware
      });
      
      await newUser.save();
      console.log('Sample student user created');
      
      // Create student profile
      const studentProfile = new Student({
        userId: newUser._id,
        rollNo: 'CS2021001',
        batch: '2021-2025',
        bio: 'Passionate computer science student with interests in web development and machine learning.',
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB'],
        interests: ['Web Development', 'Machine Learning', 'Open Source'],
        academicRecords: sampleAcademicRecords,
        socialLinks: {
          linkedin: 'https://linkedin.com/in/johndoe',
          github: 'https://github.com/johndoe',
          portfolio: 'https://johndoe.dev'
        }
      });
      
      await studentProfile.save();
      console.log('Sample student profile created');
      
      // Add sample achievements
      for (const achievementData of sampleAchievements) {
        const achievement = new Achievement({
          ...achievementData,
          studentId: newUser._id
        });
        
        await achievement.save();
        console.log(`Added achievement: ${achievementData.title}`);
      }
      
      console.log('Sample student data created successfully!');
      console.log(`User ID: ${newUser._id}`);
      console.log(`Email: ${newUser.email}`);
      console.log(`Password: password123`);
      
    } else {
      console.log(`Found existing student: ${sampleUser.fullName}`);
      
      // Check if student profile exists
      let studentProfile = await Student.findOne({ userId: sampleUser._id });
      
      if (!studentProfile) {
        studentProfile = new Student({
          userId: sampleUser._id,
          rollNo: sampleUser.studentId || 'CS2021001',
          batch: '2021-2025',
          bio: 'Passionate computer science student with interests in web development and machine learning.',
          skills: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB'],
          interests: ['Web Development', 'Machine Learning', 'Open Source'],
          academicRecords: sampleAcademicRecords,
          socialLinks: {
            linkedin: 'https://linkedin.com/in/johndoe',
            github: 'https://github.com/johndoe',
            portfolio: 'https://johndoe.dev'
          }
        });
        
        await studentProfile.save();
        console.log('Student profile created for existing user');
      }
      
      // Add sample achievements if they don't exist
      const existingAchievements = await Achievement.find({ studentId: sampleUser._id });
      
      if (existingAchievements.length === 0) {
        for (const achievementData of sampleAchievements) {
          const achievement = new Achievement({
            ...achievementData,
            studentId: sampleUser._id
          });
          
          await achievement.save();
          console.log(`Added achievement: ${achievementData.title}`);
        }
      }
      
      console.log('Sample data updated successfully!');
      console.log(`User ID: ${sampleUser._id}`);
    }
    
  } catch (error) {
    console.error('Error creating sample data:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createSampleStudentData();
