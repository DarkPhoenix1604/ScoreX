import mongoose from 'mongoose';

// Define the schema for individual resume data
const resumeSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  // You can add more fields here later, like word cloud paths
  wordCloudPath: {
    type: String
  }
});

// Define the main schema for a single analysis session
const analysisSessionSchema = new mongoose.Schema({
  jobDescription: {
    originalName: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    }
  },
  resumes: [resumeSchema], // An array of resumes
  results: {
    type: mongoose.Schema.Types.Mixed, // To store the JSON output from the Python script
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{timestamps: true} // Automatically add createdAt and updatedAt fields
);

// Create the Mongoose model from the schema
const AnalysisSession = mongoose.model('AnalysisSession', analysisSessionSchema);

export default AnalysisSession;
