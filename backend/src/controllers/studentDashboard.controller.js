import { User } from '../models/user.model.js';
import { Student } from '../models/student.model.js';
import { Achievement } from '../models/achievement.model.js';
import { Certificate } from '../models/certificate.model.js';
import { asyncHandler } from '../utils/asyncHandlers.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Get student dashboard data
const getStudentDashboard = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  // Verify the requested student ID matches the authenticated user
  if (id !== userId.toString()) {
    throw new ApiError(403, 'Access denied. You can only view your own dashboard.');
  }

  // Get user details
  const user = await User.findById(userId).select('-password -refreshToken');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Get or create student profile
  let student = await Student.findOne({ userId }).populate('userDetails');
  
  if (!student) {
    // Create default student profile if it doesn't exist
    student = new Student({
      userId,
      rollNo: user.studentId || `STU${Date.now()}`,
      batch: '2021-2025', // Default batch
      stats: {
        totalActivities: 0,
        verifiedActivities: 0,
        credits: 0,
        pending: 0,
        totalPoints: 0
      }
    });
    await student.save();
  }

  // Get achievements from both Achievement and Certificate models
  const achievements = await Achievement.find({ studentId: userId })
    .sort({ date: -1 })
    .limit(10);

  const certificates = await Certificate.find({ userId })
    .sort({ createdAt: -1 })
    .limit(10);

  // Combine and format activities for timeline
  const activities = [];
  
  // Add achievements
  achievements.forEach(achievement => {
    activities.push({
      id: achievement._id,
      title: achievement.title,
      category: achievement.category,
      organizer: achievement.organizer,
      date: achievement.date,
      status: achievement.status,
      points: achievement.points,
      credits: achievement.credits,
      type: 'achievement'
    });
  });

  // Add certificates
  certificates.forEach(cert => {
    activities.push({
      id: cert._id,
      title: cert.title,
      category: cert.category,
      organizer: 'Certificate Authority',
      date: cert.createdAt,
      status: cert.status,
      points: cert.points,
      credits: 0,
      type: 'certificate'
    });
  });

  // Sort combined activities by date
  activities.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calculate updated stats
  const totalActivities = activities.length;
  const verifiedActivities = activities.filter(a => a.status === 'Verified').length;
  const pendingActivities = activities.filter(a => a.status === 'Pending').length;
  const totalPoints = activities
    .filter(a => a.status === 'Verified')
    .reduce((sum, a) => sum + (a.points || 0), 0);
  const totalCredits = activities
    .filter(a => a.status === 'Verified')
    .reduce((sum, a) => sum + (a.credits || 0), 0);

  // Update student stats
  student.stats = {
    totalActivities,
    verifiedActivities,
    credits: totalCredits,
    pending: pendingActivities,
    totalPoints
  };
  await student.save();

  // Prepare academic progress data (sample data for chart)
  const academicProgress = student.academicRecords.length > 0 
    ? student.academicRecords 
    : [
        { semester: 1, cgpa: 8.2, attendance: 92, academicYear: '2021-22' },
        { semester: 2, cgpa: 8.5, attendance: 89, academicYear: '2021-22' },
        { semester: 3, cgpa: 8.8, attendance: 94, academicYear: '2022-23' },
        { semester: 4, cgpa: 9.1, attendance: 96, academicYear: '2022-23' },
        { semester: 5, cgpa: 8.9, attendance: 91, academicYear: '2023-24' },
        { semester: 6, cgpa: 9.2, attendance: 95, academicYear: '2023-24' }
      ];

  const dashboardData = {
    user: {
      id: user._id,
      name: user.fullName,
      email: user.email,
      department: user.department,
      semester: user.semester,
      avatar: user.avatar
    },
    student: {
      rollNo: student.rollNo,
      batch: student.batch,
      photoUrl: student.photoUrl,
      bio: student.bio,
      skills: student.skills,
      interests: student.interests,
      socialLinks: student.socialLinks
    },
    stats: student.stats,
    activities: activities.slice(0, 8), // Latest 8 activities for timeline
    academicProgress,
    quickActions: [
      { id: 'upload', title: 'Upload Certificate', icon: '📄', color: 'blue' },
      { id: 'download', title: 'Download Portfolio', icon: '📥', color: 'green' },
      { id: 'share', title: 'Share Profile Link', icon: '🔗', color: 'purple' },
      { id: 'explore', title: 'Explore Opportunities', icon: '🌟', color: 'orange' }
    ]
  };

  return res.status(200).json(
    new ApiResponse(200, dashboardData, 'Dashboard data retrieved successfully')
  );
});

// Upload achievement/certificate
const uploadAchievement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  // Verify the requested student ID matches the authenticated user
  if (id !== userId.toString()) {
    throw new ApiError(403, 'Access denied. You can only upload to your own profile.');
  }

  const {
    title,
    category,
    organizer,
    description,
    date,
    semester,
    academicYear,
    credits
  } = req.body;

  if (!title || !category || !organizer) {
    throw new ApiError(400, 'Title, category, and organizer are required');
  }

  const achievement = new Achievement({
    title,
    category,
    organizer,
    description,
    date: date || new Date(),
    semester,
    academicYear,
    credits: credits || 0,
    studentId: userId,
    status: 'Pending'
  });

  await achievement.save();

  return res.status(201).json(
    new ApiResponse(201, achievement, 'Achievement uploaded successfully')
  );
});

// Update student profile
const updateStudentProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (id !== userId.toString()) {
    throw new ApiError(403, 'Access denied. You can only update your own profile.');
  }

  const {
    bio,
    skills,
    interests,
    socialLinks,
    photoUrl
  } = req.body;

  let student = await Student.findOne({ userId });
  
  if (!student) {
    throw new ApiError(404, 'Student profile not found');
  }

  // Update fields if provided
  if (bio !== undefined) student.bio = bio;
  if (skills !== undefined) student.skills = skills;
  if (interests !== undefined) student.interests = interests;
  if (socialLinks !== undefined) student.socialLinks = { ...student.socialLinks, ...socialLinks };
  if (photoUrl !== undefined) student.photoUrl = photoUrl;

  await student.save();

  return res.status(200).json(
    new ApiResponse(200, student, 'Profile updated successfully')
  );
});

export {
  getStudentDashboard,
  uploadAchievement,
  updateStudentProfile
};
