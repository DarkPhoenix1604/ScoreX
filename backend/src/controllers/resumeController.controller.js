import AnalysisSession from '../models/resume.js';
import { exec } from 'child_process';
import path from 'path';
import util from 'util';

// Promisify the exec function to use it with async/await
const execPromise = util.promisify(exec);

/**
 * @desc    Handles the analysis of resumes against a job description.
 * @param   {object} req - The request object from Express.
 * @param   {object} res - The response object from Express.
 */
export const analyzeResumes = async (req, res) => {
  // Check if files were uploaded
  if (!req.files || !req.files.resumes || !req.files.jobDescription) {
    return res.status(400).json({ message: 'Please upload resumes and a job description.' });
  }

  const { resumes, jobDescription } = req.files;
  const jdPath = jobDescription[0].path;
  const resumePaths = resumes.map(file => file.path);

  try {
    // --- Execute Python Script ---
    // Construct the path to the main Python script.
    // Using path.resolve ensures a correct absolute path is formed.
    const scriptPath = path.resolve(process.cwd(), '..', 'python-model', 'main.py');
    
    // Construct the command. Using 'python3' is often more reliable.
    // Wrap all file paths in quotes to handle spaces or special characters.
    const command = `python3 "${scriptPath}" "${jdPath}" ${resumePaths.map(p => `"${p}"`).join(' ')}`;
    
    console.log('Executing command:', command);

    // Await the promise-based exec function
    const { stdout, stderr } = await execPromise(command);

    // If the script writes to stderr, log it. This could be warnings or errors.
    if (stderr) {
      console.warn(`Python script stderr: ${stderr}`);
    }
    
    console.log(`Python script stdout: ${stdout}`);

    // The script should only output JSON to stdout on success.
    // If stdout is empty, it indicates a problem.
    if (!stdout) {
        throw new Error('Python script executed but produced no output.');
    }
    
    const analysisResults = JSON.parse(stdout);

    // --- Save to Database ---
    const newSession = new AnalysisSession({
      jobDescription: {
        originalName: jobDescription[0].originalname,
        path: jdPath
      },
      resumes: resumes.map(file => {
          // Find the corresponding score from the analysis results
          const result = analysisResults.scores.find(s => s.fileName === file.originalname);
          return {
              originalName: file.originalname,
              path: file.path,
              score: result ? result.score : 0,
              wordCloudPath: result ? result.wordCloudPath : null
          };
      }),
      results: analysisResults
    });

    await newSession.save();

    // Send the successful results back to the frontend
    res.status(200).json(analysisResults);

  } catch (error) {
    // This block now catches errors from exec, JSON.parse, and database saves.
    console.error('--- ANALYSIS FAILED ---');
    console.error(`Error executing Python script or processing results:`, error);
    
    // Send a detailed error message back to the frontend.
    // The 'error.stderr' from exec is particularly useful for debugging Python issues.
    res.status(500).json({ 
        message: 'Analysis failed on the server.',
        error: error.stderr || error.message 
    });
  }
};
