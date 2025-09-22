import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true,
    enum: ['Team Lead', 'Project Manager', 'Developer', 'Designer', 'Researcher', 'Member', 'Other']
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  link: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true // Allow empty links
        return /^https?:\/\/.+/.test(v)
      },
      message: 'Link must be a valid URL starting with http:// or https://'
    }
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

// Index for efficient queries
projectSchema.index({ studentId: 1, createdAt: -1 })
projectSchema.index({ verified: 1 })

// Virtual for verification status
projectSchema.virtual('status').get(function() {
  if (this.verified) return 'Verified'
  if (this.rejectionReason) return 'Rejected'
  return 'Pending'
})

// Ensure virtual fields are serialized
projectSchema.set('toJSON', { virtuals: true })
projectSchema.set('toObject', { virtuals: true })

export default mongoose.model('Project', projectSchema)
