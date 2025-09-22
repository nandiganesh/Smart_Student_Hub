const mongoose = require('mongoose')
const Project = require('../models/project.model')
const User = require('../models/user.model')

const sampleProjects = [
  {
    title: 'Smart Campus Management System',
    description: 'Developed a comprehensive web application for managing campus resources, student information, and academic schedules using MERN stack. Implemented real-time notifications and role-based access control.',
    role: 'Team Lead',
    duration: 'Jan 2024 – May 2024',
    link: 'https://github.com/student/smart-campus',
    verified: true
  },
  {
    title: 'AI-Powered Study Assistant',
    description: 'Created an intelligent study companion using Python and machine learning algorithms. The system provides personalized study recommendations and tracks learning progress.',
    role: 'Developer',
    duration: 'Sep 2023 – Dec 2023',
    link: 'https://github.com/student/ai-study-assistant',
    verified: false
  },
  {
    title: 'Sustainable Energy Monitoring IoT System',
    description: 'Designed and implemented an IoT-based system for monitoring energy consumption in residential buildings. Used Arduino, sensors, and cloud computing for data analysis.',
    role: 'Project Manager',
    duration: 'Mar 2023 – Aug 2023',
    link: 'https://github.com/student/energy-monitor',
    verified: true
  },
  {
    title: 'Student Hackathon Organization',
    description: 'Led the organization of the annual college hackathon with 200+ participants. Managed logistics, sponsorships, and technical infrastructure for the 48-hour event.',
    role: 'Team Lead',
    duration: 'Oct 2023 – Nov 2023',
    link: 'https://hackathon2023.college.edu',
    verified: false
  },
  {
    title: 'Mobile App for Local Business Directory',
    description: 'Developed a React Native mobile application to help local businesses connect with customers. Implemented features like location-based search, reviews, and booking system.',
    role: 'Developer',
    duration: 'Jun 2023 – Sep 2023',
    link: 'https://github.com/student/local-business-app',
    verified: true
  }
]

const seedProjects = async () => {
  try {
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-student-hub')
    }

    console.log('🌱 Starting project seeding...')

    // Find a student user to assign projects to
    const student = await User.findOne({ role: 'student' })
    if (!student) {
      console.log('❌ No student user found. Please create a student user first.')
      return
    }

    console.log(`📚 Found student: ${student.name} (${student.email})`)

    // Clear existing projects for this student
    await Project.deleteMany({ studentId: student._id })
    console.log('🗑️  Cleared existing projects')

    // Create sample projects
    const projectsToCreate = sampleProjects.map(project => ({
      ...project,
      studentId: student._id
    }))

    const createdProjects = await Project.insertMany(projectsToCreate)
    console.log(`✅ Created ${createdProjects.length} sample projects`)

    // Display created projects
    createdProjects.forEach((project, index) => {
      console.log(`   ${index + 1}. ${project.title} (${project.role}) - ${project.verified ? '✅ Verified' : '⏳ Pending'}`)
    })

    console.log('🎉 Project seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding projects:', error)
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedProjects().then(() => {
    process.exit(0)
  }).catch(error => {
    console.error('Seeding failed:', error)
    process.exit(1)
  })
}

module.exports = { seedProjects }
