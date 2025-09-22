import mongoose from 'mongoose';

const studentStatsSchema = new mongoose.Schema({
  totalActivities: {
    type: Number,
    default: 0
  },
  verifiedActivities: {
    type: Number,
    default: 0
  },
  credits: {
    type: Number,
    default: 0
  },
  pending: {
    type: Number,
    default: 0
  },
  totalPoints: {
    type: Number,
    default: 0
  }
}, { _id: false });

const academicRecordSchema = new mongoose.Schema({
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  cgpa: {
    type: Number,
    min: 0,
    max: 10
  },
  attendance: {
    type: Number,
    min: 0,
    max: 100
  },
  credits: {
    type: Number,
    default: 0
  },
  academicYear: {
    type: String
  }
}, { _id: false });

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  rollNo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  batch: {
    type: String,
    required: true,
    trim: true // e.g., "2021-2025"
  },
  photoUrl: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: 500,
    trim: true
  },
  stats: {
    type: studentStatsSchema,
    default: () => ({})
  },
  academicRecords: [academicRecordSchema],
  skills: [{
    type: String,
    trim: true
  }],
  interests: [{
    type: String,
    trim: true
  }],
  socialLinks: {
    linkedin: String,
    github: String,
    portfolio: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual to populate user details
studentSchema.virtual('userDetails', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Ensure virtual fields are serialized
studentSchema.set('toJSON', { virtuals: true });
studentSchema.set('toObject', { virtuals: true });

// Index for faster queries
studentSchema.index({ userId: 1 });
studentSchema.index({ rollNo: 1 });
studentSchema.index({ batch: 1 });

export const Student = mongoose.model('Student', studentSchema);
