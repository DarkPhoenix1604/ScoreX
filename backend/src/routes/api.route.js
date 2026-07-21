import express from 'express';
import multer from 'multer';
import { analyzeResumes } from '../controllers/resumeController.controller.js';

// Initialize the express router
const router = express.Router();

// Configure multer for file storage. This saves files to a temporary 'uploads/' directory.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Create a unique filename to avoid conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    console.log('Multer storage configured:', storage);
  }
});

const upload = multer({ storage: storage });

/**
 * @route   POST /api/analyze
 * @desc    Upload resumes and a job description for analysis
 * @access  Public
 */
router.post(
  '/analyze',
  // Use multer middleware to handle file uploads.
  // 'resumes' can take up to 15 files. 'jobDescription' takes a single file.
  upload.fields([
    { name: 'resumes', maxCount: 15 },
    { name: 'jobDescription', maxCount: 1 }
  ]),
  analyzeResumes
);

export default router;
