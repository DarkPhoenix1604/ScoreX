// import axios from 'axios';

// /**
//  * Uploads files to the backend for analysis using Axios.
//  * @param {File} jdFile - The job description file.
//  * @param {File[]} resumeFiles - An array of resume files.
//  * @returns {Promise<object>} - The analysis results from the backend.
//  */
// export const analyzeFiles = async (jdFile, resumeFiles) => {
//   const formData = new FormData();
  
//   // Append the job description file
//   formData.append('jobDescription', jdFile);
  
//   // Append all resume files
//   resumeFiles.forEach(file => {
//     formData.append('resumes', file);
//   });

//   try {
//     // Make the POST request to the /api/analyze endpoint
//     const response = await axios.post('/api/analyze', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
    
//     // Return the data from the response
//     return response.data;

//   } catch (error) {
//     // Handle potential errors, such as network issues or server-side errors
//     if (error.response) {
//       // The request was made and the server responded with a status code
//       // that falls out of the range of 2xx
//       console.error('Error response:', error.response.data);
//       // Throw an error with the message from the backend, or a default one
//       throw new Error(error.response.data.message || 'An error occurred during analysis.');
//     } else if (error.request) {
//       // The request was made but no response was received
//       console.error('Error request:', error.request);
//       throw new Error('Could not connect to the server. Please check your connection.');
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       console.error('Error', error.message);
//       throw error;
//     }
//   }
// };
import axios from 'axios';

// This is the key change.
// In production (on Netlify), import.meta.env.VITE_API_URL will be your Render URL.
// Locally, it will be undefined, so API_URL will be an empty string, and the proxy will work.
const API_URL = import.meta.env.VITE_API_URL || '';

export const analyzeFiles = async (jdFile, resumeFiles) => {
  const formData = new FormData();
  formData.append('jobDescription', jdFile);
  resumeFiles.forEach(file => {
    formData.append('resumes', file);
  });

  try {
    // We prepend the API_URL to the request path.
    const response = await axios.post(`${API_URL}/api/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;

  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'An error occurred during analysis.');
    } else if (error.request) {
      console.error('Error request:', error.request);
      throw new Error('Could not connect to the server. Please check your connection.');
    } else {
      console.error('Error', error.message);
      throw error;
    }
  }
};