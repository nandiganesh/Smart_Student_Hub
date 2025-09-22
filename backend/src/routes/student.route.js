import { Router } from 'express';
import { Mark } from '../models/mark.model.js';
import { Subject } from '../models/subject.model.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Middleware to ensure only students can access these routes
const studentOnly = (req, res, next) => {
  if (req.user.role !== 'student' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Student privileges required.'
    });
  }
  next();
};

// Apply authentication middleware to all routes
router.use(verifyJWT);

// GET /api/student/marks - Get logged-in student's marks and calculate CGPA
router.get('/marks', studentOnly, async (req, res) => {
  try {
    const { semester, academicYear } = req.query;
    const studentId = req.user._id;

    // Build filter for marks
    let filter = { studentId };
    if (semester) filter.semester = parseInt(semester);
    if (academicYear) filter.academicYear = academicYear;

    // Get all marks for the student
    const marks = await Mark.find(filter)
      .populate('subjectId', 'name code credits department semester')
      .populate('enteredBy', 'fullName email')
      .sort({ academicYear: -1, semester: -1, 'subjectId.name': 1 });

    // Calculate CGPA and semester-wise GPA
    const semesterData = {};
    let totalCredits = 0;
    let totalGradePoints = 0;

    marks.forEach(mark => {
      const semKey = `${mark.academicYear}-S${mark.semester}`;
      
      if (!semesterData[semKey]) {
        semesterData[semKey] = {
          semester: mark.semester,
          academicYear: mark.academicYear,
          subjects: [],
          totalCredits: 0,
          totalGradePoints: 0,
          gpa: 0
        };
      }

      const credits = mark.subjectId.credits || 3;
      const gradePoints = mark.gradePoint * credits;

      semesterData[semKey].subjects.push({
        subject: mark.subjectId,
        marksObtained: mark.marksObtained,
        maxMarks: mark.maxMarks,
        percentage: ((mark.marksObtained / mark.maxMarks) * 100).toFixed(2),
        grade: mark.grade,
        gradePoint: mark.gradePoint,
        credits: credits,
        examType: mark.examType,
        remarks: mark.remarks,
        enteredBy: mark.enteredBy,
        updatedAt: mark.updatedAt
      });

      semesterData[semKey].totalCredits += credits;
      semesterData[semKey].totalGradePoints += gradePoints;
      
      // For overall CGPA calculation
      totalCredits += credits;
      totalGradePoints += gradePoints;
    });

    // Calculate GPA for each semester
    Object.keys(semesterData).forEach(semKey => {
      const sem = semesterData[semKey];
      sem.gpa = sem.totalCredits > 0 ? (sem.totalGradePoints / sem.totalCredits).toFixed(2) : 0;
    });

    // Calculate overall CGPA
    const cgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;

    // Convert semesterData object to array and sort
    const semesters = Object.values(semesterData).sort((a, b) => {
      if (a.academicYear !== b.academicYear) {
        return b.academicYear.localeCompare(a.academicYear);
      }
      return b.semester - a.semester;
    });

    // Calculate additional statistics
    const totalSubjects = marks.length;
    const passedSubjects = marks.filter(mark => mark.gradePoint >= 4).length;
    const failedSubjects = totalSubjects - passedSubjects;
    const averagePercentage = marks.length > 0 
      ? (marks.reduce((sum, mark) => sum + (mark.marksObtained / mark.maxMarks * 100), 0) / marks.length).toFixed(2)
      : 0;

    res.json({
      success: true,
      data: {
        student: {
          id: req.user._id,
          name: req.user.fullName,
          studentId: req.user.studentId,
          department: req.user.department,
          semester: req.user.semester
        },
        academicSummary: {
          cgpa: parseFloat(cgpa),
          totalCredits,
          totalSubjects,
          passedSubjects,
          failedSubjects,
          averagePercentage: parseFloat(averagePercentage)
        },
        semesters,
        allMarks: marks
      }
    });

  } catch (error) {
    console.error('Error fetching student marks:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /api/student/subjects - Get subjects for student's semester/department
router.get('/subjects', studentOnly, async (req, res) => {
  try {
    const { semester, department } = req.query;
    
    let filter = {};
    
    // Use student's own semester and department if not specified
    if (semester) {
      filter.semester = parseInt(semester);
    } else if (req.user.semester) {
      filter.semester = req.user.semester;
    }
    
    if (department) {
      filter.department = department;
    } else if (req.user.department) {
      filter.department = req.user.department;
    }

    const subjects = await Subject.find(filter)
      .populate('createdBy', 'fullName email')
      .sort({ semester: 1, name: 1 });

    res.json({
      success: true,
      data: subjects
    });

  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /api/student/performance - Get detailed performance analytics
router.get('/performance', studentOnly, async (req, res) => {
  try {
    const studentId = req.user._id;

    // Get all marks for performance analysis
    const marks = await Mark.find({ studentId })
      .populate('subjectId', 'name code credits department')
      .sort({ academicYear: 1, semester: 1 });

    if (marks.length === 0) {
      return res.json({
        success: true,
        data: {
          message: 'No academic records found',
          trends: [],
          gradeDistribution: {},
          semesterProgress: []
        }
      });
    }

    // Grade distribution
    const gradeDistribution = {};
    marks.forEach(mark => {
      gradeDistribution[mark.grade] = (gradeDistribution[mark.grade] || 0) + 1;
    });

    // Semester-wise progress
    const semesterProgress = {};
    marks.forEach(mark => {
      const semKey = `${mark.academicYear}-S${mark.semester}`;
      if (!semesterProgress[semKey]) {
        semesterProgress[semKey] = {
          semester: mark.semester,
          academicYear: mark.academicYear,
          totalMarks: 0,
          totalSubjects: 0,
          averagePercentage: 0,
          gpa: 0
        };
      }
      
      semesterProgress[semKey].totalMarks += (mark.marksObtained / mark.maxMarks * 100);
      semesterProgress[semKey].totalSubjects += 1;
    });

    // Calculate averages for each semester
    Object.keys(semesterProgress).forEach(semKey => {
      const sem = semesterProgress[semKey];
      sem.averagePercentage = (sem.totalMarks / sem.totalSubjects).toFixed(2);
    });

    const semesterArray = Object.values(semesterProgress).sort((a, b) => {
      if (a.academicYear !== b.academicYear) {
        return a.academicYear.localeCompare(b.academicYear);
      }
      return a.semester - b.semester;
    });

    res.json({
      success: true,
      data: {
        gradeDistribution,
        semesterProgress: semesterArray,
        trends: {
          improving: semesterArray.length > 1 ? 
            parseFloat(semesterArray[semesterArray.length - 1].averagePercentage) > 
            parseFloat(semesterArray[0].averagePercentage) : false,
          bestSemester: semesterArray.reduce((best, current) => 
            parseFloat(current.averagePercentage) > parseFloat(best.averagePercentage) ? current : best, 
            semesterArray[0]
          ),
          totalSemesters: semesterArray.length
        }
      }
    });

  } catch (error) {
    console.error('Error fetching performance data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /api/student/achievements - Get verified certificates for the logged-in student
router.get('/achievements', studentOnly, async (req, res) => {
  try {
    const { Certificate } = await import('../models/certificate.model.js');
    const studentId = req.user._id;
    const { category, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Build filter for verified certificates only
    let filter = { 
      userId: studentId, 
      status: 'Verified' 
    };

    if (category && category !== 'all') {
      filter.category = category;
    }

    // Build sort object
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const certificates = await Certificate.find(filter)
      .populate('userId', 'fullName email studentId department')
      .sort(sortObj);

    // Calculate achievement statistics
    const stats = {
      totalAchievements: certificates.length,
      totalPoints: certificates.reduce((sum, cert) => sum + (cert.points || 0), 0),
      categoriesCount: {},
      recentAchievements: certificates.slice(0, 5)
    };

    // Count by category
    certificates.forEach(cert => {
      stats.categoriesCount[cert.category] = (stats.categoriesCount[cert.category] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        certificates,
        stats,
        student: {
          id: req.user._id,
          name: req.user.fullName,
          email: req.user.email,
          studentId: req.user.studentId,
          department: req.user.department
        }
      }
    });

  } catch (error) {
    console.error('Error fetching student achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /api/student/certificates/status - Get certificate status summary
router.get('/certificates/status', studentOnly, async (req, res) => {
  try {
    const { Certificate } = await import('../models/certificate.model.js');
    const studentId = req.user._id;

    const statusCounts = await Certificate.aggregate([
      { $match: { userId: studentId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const summary = {
      pending: 0,
      verified: 0,
      rejected: 0,
      total: 0
    };

    statusCounts.forEach(item => {
      const status = item._id.toLowerCase();
      summary[status] = item.count;
      summary.total += item.count;
    });

    res.json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('Error fetching certificate status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// DELETE /api/student/certificates/:id - Delete own certificate
router.delete('/certificates/:id', studentOnly, async (req, res) => {
  try {
    const { Certificate } = await import('../models/certificate.model.js');
    const { id } = req.params;
    const studentId = req.user._id;

    // Find certificate and verify ownership
    const certificate = await Certificate.findOne({ _id: id, userId: studentId });
    
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found or you do not have permission to delete it'
      });
    }

    // Only allow deletion of pending or rejected certificates
    if (certificate.status === 'Verified') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete verified certificates'
      });
    }

    await Certificate.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Certificate deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

export default router;
