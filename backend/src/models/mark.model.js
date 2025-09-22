import mongoose from 'mongoose';

const markSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
    index: true
  },
  marksObtained: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  maxMarks: {
    type: Number,
    required: true,
    default: 100,
    min: 1
  },
  gradePoint: {
    type: Number,
    min: 0,
    max: 10
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
    uppercase: true
  },
  examType: {
    type: String,
    enum: ['midterm', 'final', 'assignment', 'quiz', 'project'],
    default: 'final',
    lowercase: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  academicYear: {
    type: String,
    required: true,
    match: /^\d{4}-\d{4}$/
  },
  enteredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  remarks: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true,
});

// Calculate grade and grade point before saving
markSchema.pre('save', function(next) {
  const percentage = (this.marksObtained / this.maxMarks) * 100;
  
  if (percentage >= 90) {
    this.grade = 'A+';
    this.gradePoint = 10;
  } else if (percentage >= 80) {
    this.grade = 'A';
    this.gradePoint = 9;
  } else if (percentage >= 70) {
    this.grade = 'B+';
    this.gradePoint = 8;
  } else if (percentage >= 60) {
    this.grade = 'B';
    this.gradePoint = 7;
  } else if (percentage >= 50) {
    this.grade = 'C+';
    this.gradePoint = 6;
  } else if (percentage >= 40) {
    this.grade = 'C';
    this.gradePoint = 5;
  } else if (percentage >= 35) {
    this.grade = 'D';
    this.gradePoint = 4;
  } else {
    this.grade = 'F';
    this.gradePoint = 0;
  }
  
  next();
});

// Compound indexes for efficient queries
markSchema.index({ studentId: 1, semester: 1, academicYear: 1 });
markSchema.index({ subjectId: 1, semester: 1 });

// Ensure one mark entry per student per subject per exam type
markSchema.index({ 
  studentId: 1, 
  subjectId: 1, 
  examType: 1, 
  semester: 1, 
  academicYear: 1 
}, { unique: true });

export const Mark = mongoose.model('Mark', markSchema);
