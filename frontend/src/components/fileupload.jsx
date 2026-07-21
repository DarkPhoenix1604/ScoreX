import { useState } from 'react';
import { analyzeFiles } from '../api/apiservice';
import { UploadCloud, File, Trash2, Loader, Send } from 'lucide-react'; // Using lucide-react for modern icons

// A single, reusable component for the dropzone UI
const Dropzone = ({ onFilesAdded, multiple, label, acceptedFileTypes, files }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      onFilesAdded(e);
    }
  };

  const fileCountText = files.length > 0
    ? `${files.length} file${files.length > 1 ? 's' : ''} selected`
    : `Drag & drop or click to upload`;

  return (
    <label
      htmlFor={label}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300
        ${isDragOver ? 'border-cyan-400 bg-white/10' : 'border-white/20 hover:bg-white/5'}`}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <UploadCloud className="w-10 h-10 mb-4 text-gray-400" />
        <p className="mb-2 text-base text-white/90 font-semibold">{label}</p>
        <p className={`text-sm ${files.length > 0 ? 'text-cyan-400' : 'text-gray-500'}`}>{fileCountText}</p>
        <p className="text-xs text-gray-500 mt-1">{acceptedFileTypes}</p>
      </div>
      <input
        id={label}
        type="file"
        multiple={multiple}
        onChange={onFilesAdded}
        className="hidden"
      />
    </label>
  );
};

export default function FileUpload({ setAnalysisData, setIsLoading, setError, isLoading }) {
  const [jdFile, setJdFile] = useState(null);
  const [resumeFiles, setResumeFiles] = useState([]);

  const handleJdChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) setJdFile(file);
  };

  const handleResumesChange = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      setResumeFiles(prev => [...prev, ...files].slice(0, 10)); // Allow adding more files up to 10
    }
  };

  const removeResume = (indexToRemove) => {
    setResumeFiles(resumeFiles.filter((_, index) => index !== indexToRemove));
  };
  
  const removeJd = () => {
    setJdFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jdFile || resumeFiles.length < 2) {
      setError('Please upload a job description and at least two resumes.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const data = await analyzeFiles(jdFile, resumeFiles);
      setAnalysisData(data);
    } catch (err) {
      setError(err.message || 'An unknown error occurred.');
      setAnalysisData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = !isLoading && jdFile && resumeFiles.length >= 2;

  return (
    <div className="w-full max-w-3xl mx-auto bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl transform transition-all duration-300 hover:shadow-purple-500/20">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white tracking-tight">AI-Powered Resume Analysis</h2>
        <p className="text-slate-300 mt-2">Upload a job description and multiple resumes to find the best fit.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Description Dropzone */}
          <div>
            <Dropzone
              label="Job Description"
              onFilesAdded={handleJdChange}
              acceptedFileTypes="PDF, DOCX"
              files={jdFile ? [jdFile] : []}
            />
            {jdFile && (
              <div className="mt-3 bg-white/5 p-2.5 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <File className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm text-white/80 truncate">{jdFile.name}</span>
                </div>
                <button onClick={removeJd} className="text-gray-500 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Resumes Dropzone */}
          <div>
            <Dropzone
              label="Resumes"
              onFilesAdded={handleResumesChange}
              multiple
              acceptedFileTypes="Up to 10 files (PDF, DOCX)"
              files={resumeFiles}
            />
          </div>
        </div>

        {/* Resume File List */}
        {resumeFiles.length > 0 && (
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {resumeFiles.map((file, index) => (
              <div key={index} className="bg-white/5 p-2.5 rounded-lg flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-3">
                  <File className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-white/80 truncate">{file.name}</span>
                </div>
                <button onClick={() => removeResume(index)} className="text-gray-500 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full flex items-center justify-center gap-3 text-lg font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform
            bg-gradient-to-r from-cyan-500 to-blue-500 text-white
            hover:from-cyan-400 hover:to-blue-400 hover:scale-[1.02]
            disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin h-6 w-6" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Send className="h-6 w-6" />
              <span>Analyze Documents</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}