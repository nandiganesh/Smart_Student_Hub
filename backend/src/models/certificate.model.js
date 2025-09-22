import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Certificate', 'Academic', 'Sports', 'Cultural', 'Technical', 'Leadership', 'Community Service'],
    default: 'Certificate'
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending'
  },
  points: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export const Certificate = mongoose.model('Certificate', certificateSchema);
