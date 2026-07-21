// Import necessary packages using ES module syntax
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import apiRoutes from './routes/api.route.js';

// --- ES Module Workaround for __dirname ---
// This is necessary to get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

// Initialize the Express app
const app = express();

// --- Ensure 'uploads' directory exists ---
// We create the 'uploads' directory synchronously during startup if it doesn't exist.
// This prevents errors from multer trying to save files to a non-existent directory.
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log(`Created 'uploads' directory at: ${uploadsDir}`);
}

// Middleware setup
// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());
// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// --- Serve Static Files ---
// This middleware makes the 'uploads' directory, which will contain the word clouds,
// publicly accessible. The frontend will request images from the '/uploads' route.
app.use('/uploads', express.static(uploadsDir));


// Define a simple root route for testing
app.get('/', (req, res) => {
  res.send('ScoreX API is running...');
});

// Use the API routes for any requests to /api
app.use('/api', apiRoutes);

// Set the port for the server to listen on
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
