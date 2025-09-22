import { Router } from 'express';
import { Subject } from '../models/subject.model.js';
import { Mark } from '../models/mark.model.js';
import { User } from '../models/user.model.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Middleware to ensure only faculty can access these routes
const facultyOnly = (req, res, next) => {
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Faculty privileges required.'
    });
  }
  next();
};

// Apply authentication and faculty-only middleware to all routes
router.use(verifyJWT);
router.use(facultyOnly);

// POST /api/faculty/subjects - Add a new subject
router.post('/subjects', async (req, res) => {
  try {
    const { name, code, credits, semester, department } = req.body;

    // Validate required fields
    if (!name || !code || !semester || !department) {
      return res.status(400).json({
        success: false,
        message: 'Name, code, semester, and department are required'
      });
    }

    // Check if subject code already exists
    const existingSubject = await Subject.findOne({ code: code.toUpperCase() });
    if (existingSubject) {
      return res.status(409).json({
        success: false,
        message: 'Subject with this code already exists'
      });
    }

    // Create new subject
    const subject = new Subject({
      name: name.trim(),
      code: code.toUpperCase().trim(),
      credits: credits || 3,
      semester,
      department: department.trim(),
      createdBy: req.user._id
    });

    await subject.save();

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: subject
    });

  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /api/faculty/subjects - Get all subjects
router.get('/subjects', async (req, res) => {
  try {
    const { department, semester } = req.query;
    
    let filter = {};
    if (department) filter.department = department;
    if (semester) filter.semester = parseInt(semester);

    const subjects = await Subject.find(filter)
      .populate('createdBy', 'fullName email')
      .sort({ department: 1, semester: 1, name: 1 });

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

// POST /api/faculty/marks - Add or update marks for a student
router.post('/marks', async (req, res) => {
  try {
    const { 
      studentId, 
      subjectId, 
      marksObtained, 
      maxMarks = 100,
      examType = 'final',
      semester,
      academicYear,
      remarks 
    } = req.body;

    // Validate required fields
    if (!studentId || !subjectId || marksObtained === undefined || !semester || !academicYear) {
      return res.status(400).json({
        success: false,
        message: 'StudentId, subjectId, marksObtained, semester, and academicYear are required'
      });
    }

    // Validate student exists and is actually a student
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Validate subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Validate marks
    if (marksObtained < 0 || marksObtained > maxMarks) {
      return res.status(400).json({
        success: false,
        message: `Marks must be between 0 and ${maxMarks}`
      });
    }

    // Check if mark already exists for this combination
    const existingMark = await Mark.findOne({
      studentId,
      subjectId,
      examType,
      semester,
      academicYear
    });

    let mark;
    if (existingMark) {
      // Update existing mark
      existingMark.marksObtained = marksObtained;
      existingMark.maxMarks = maxMarks;
      existingMark.remarks = remarks;
      existingMark.enteredBy = req.user._id;
      
      mark = await existingMark.save();
    } else {
      // Create new mark
      mark = new Mark({
        studentId,
        subjectId,
        marksObtained,
        maxMarks,
        examType,
        semester,
        academicYear,
        enteredBy: req.user._id,
        remarks
      });
      
      await mark.save();
    }

    // Populate the mark with student and subject details
    await mark.populate([
      { path: 'studentId', select: 'fullName studentId email' },
      { path: 'subjectId', select: 'name code credits' },
      { path: 'enteredBy', select: 'fullName email' }
    ]);

    res.status(existingMark ? 200 : 201).json({
      success: true,
      message: existingMark ? 'Marks updated successfully' : 'Marks added successfully',
      data: mark
    });

  } catch (error) {
    console.error('Error adding/updating marks:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Marks already exist for this student, subject, and exam type'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /api/faculty/students - Get all students for marks entry
router.get('/students', async (req, res) => {
  try {
    const { department, semester } = req.query;
    
    let filter = { role: 'student' };
    if (department) filter.department = department;
    if (semester) filter.semester = parseInt(semester);

    const students = await User.find(filter)
      .select('fullName studentId email department semester')
      .sort({ department: 1, semester: 1, fullName: 1 });

    res.json({
      success: true,
      data: students
    });

  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /api/faculty/marks - Get marks with filters
router.get('/marks', async (req, res) => {
  try {
    const { studentId, subjectId, semester, academicYear, department } = req.query;
    
    let filter = {};
    if (studentId) filter.studentId = studentId;
    if (subjectId) filter.subjectId = subjectId;
    if (semester) filter.semester = parseInt(semester);
    if (academicYear) filter.academicYear = academicYear;

    let marks = await Mark.find(filter)
      .populate('studentId', 'fullName studentId email department semester')
      .populate('subjectId', 'name code credits department')
      .populate('enteredBy', 'fullName email')
      .sort({ academicYear: -1, semester: -1, createdAt: -1 });

    // Filter by department if specified
    if (department) {
      marks = marks.filter(mark => {
        const studentDept = mark.studentId && mark.studentId.department;
        const subjectDept = mark.subjectId && mark.subjectId.department;
        return studentDept === department || subjectDept === department;
      });
    }

    res.json({
      success: true,
      data: marks
    });

  } catch (error) {
    console.error('Error fetching marks:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Certificate Verification Routes

// GET /api/faculty/certificates - Get all pending certificates for verification
router.get('/certificates', facultyOnly, async (req, res) => {
  try {
    const { Certificate } = await import('../models/certificate.model.js');
    
    const { status = 'Pending', department, category } = req.query;
    
    let filter = { status };
    
    const certificates = await Certificate.find(filter)
      .populate({
        path: 'userId',
        select: 'fullName email studentId department semester role',
        match: department ? { department } : {}
      })
      .sort({ createdAt: -1 });

    // Filter out certificates where user doesn't match department filter
    const filteredCertificates = certificates.filter(cert => cert.userId);

    // Apply category filter if specified
    const finalCertificates = category 
      ? filteredCertificates.filter(cert => cert.category === category)
      : filteredCertificates;

    res.json({
      success: true,
      data: finalCertificates,
      count: finalCertificates.length
    });

  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// PUT /api/faculty/certificates/:id/verify - Verify a certificate
router.put('/certificates/:id/verify', facultyOnly, async (req, res) => {
  try {
    const { Certificate } = await import('../models/certificate.model.js');
    const { id } = req.params;
    const { points, remarks } = req.body;

    // Validate certificate exists and is pending
    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    if (certificate.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Certificate is not in pending status'
      });
    }

    // Update certificate status to verified
    const updatedCertificate = await Certificate.findByIdAndUpdate(
      id,
      {
        status: 'Verified',
        points: points || certificate.points,
        verifiedBy: req.user._id,
        verifiedAt: new Date(),
        remarks: remarks || ''
      },
      { new: true }
    ).populate('userId', 'fullName email studentId department');

    res.json({
      success: true,
      message: 'Certificate verified successfully',
      data: updatedCertificate
    });

  } catch (error) {
    console.error('Error verifying certificate:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// PUT /api/faculty/certificates/:id/reject - Reject a certificate
router.put('/certificates/:id/reject', facultyOnly, async (req, res) => {
  try {
    const { Certificate } = await import('../models/certificate.model.js');
    const { id } = req.params;
    const { reason } = req.body;

    // Validate certificate exists and is pending
    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    if (certificate.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Certificate is not in pending status'
      });
    }

    // Update certificate status to rejected
    const updatedCertificate = await Certificate.findByIdAndUpdate(
      id,
      {
        status: 'Rejected',
        rejectedBy: req.user._id,
        rejectedAt: new Date(),
        rejectionReason: reason || 'No reason provided'
      },
      { new: true }
    ).populate('userId', 'fullName email studentId department');

    res.json({
      success: true,
      message: 'Certificate rejected successfully',
      data: updatedCertificate
    });

  } catch (error) {
    console.error('Error rejecting certificate:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

export default router;

// Additional faculty utility routes
// GET /api/faculty/dashboard-stats - basic placeholder stats
router.get('/dashboard-stats', async (req, res) => {
  try {
    // Placeholder values; integrate with real DB aggregations as needed
    const data = {
      totalStudents: 0,
      pendingApprovals: 0,
      verifiedCertificates: 0,
      totalPoints: 0,
    };
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching faculty dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET /api/faculty/recent-activity - placeholder recent activity list
router.get('/recent-activity', async (req, res) => {
  try {
    const data = [
      // { id: 1, message: 'Example activity', time: 'Just now', status: 'info', type: 'update' }
    ];
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
