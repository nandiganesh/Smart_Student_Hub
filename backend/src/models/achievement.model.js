import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Academic', 'Technical', 'Sports', 'Cultural', 'Leadership', 'Community Service', 'Internship', 'Project', 'Certification'],
    default: 'Academic'
  },
  organizer: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  verified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending'
  },
  points: {
    type: Number,
    default: 0
  },
  credits: {
    type: Number,
    default: 0
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  certificateUrl: {
    type: String // URL to certificate/proof document
  },
  semester: {
    type: Number,
    min: 1,
    max: 8
  },
  academicYear: {
    type: String // e.g., "2023-24"
  }
}, {
  timestamps: true
});

// Index for faster queries
achievementSchema.index({ studentId: 1, status: 1 });
achievementSchema.index({ studentId: 1, date: -1 });

export const Achievement = mongoose.model('Achievement', achievementSchema);
