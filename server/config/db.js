import mongoose from 'mongoose'

/**
 * Connect to MongoDB
 * Fill in error handling / retry logic as needed.
 */
const connectDB = async () => {
  // TODO: implement connection
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hireflow'
  await mongoose.connect(uri)
  console.log('✅ MongoDB connected')
}

export default connectDB
