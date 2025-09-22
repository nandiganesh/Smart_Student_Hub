import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Fallback to local MongoDB if env var not set
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-student-hub';
    
    console.log('Attempting to connect to MongoDB:', mongoURI);
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('Continuing without database connection for development...');
    // Don't exit in development, allow server to start
  }
};

export default connectDB;