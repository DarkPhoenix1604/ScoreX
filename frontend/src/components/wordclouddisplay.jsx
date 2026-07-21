export default function WordCloudDisplay({ title, fileName, wordCloudPath }) {
  // Get the base URL for the backend from environment variables.
  // This will be your Render URL in production.
  const API_URL = import.meta.env.VITE_API_URL || '';

  // Construct the full, absolute URL to the image on the backend server.
  // The check for wordCloudPath ensures we don't try to build a URL for a placeholder.
  const imageUrl = wordCloudPath 
    ? `${API_URL}/${wordCloudPath}` 
    : 'https://placehold.co/800x400/e2e8f0/64748b?text=Word+Cloud+N/A';
  
  return (
    <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center">
      <h4 className="font-semibold text-slate-700 mb-1">{title}</h4>
      <p className="text-xs text-slate-500 mb-3 truncate w-full text-center" title={fileName}>{fileName}</p>
      <img
        src={imageUrl}
        alt={`Word cloud for ${fileName}`}
        className="rounded-lg w-full h-auto object-cover"
        // Handle image loading errors, just in case
        onError={(e) => {
          e.currentTarget.src = 'https://placehold.co/800x400/e2e8f0/64748b?text=Image+Failed+to+Load';
        }}
      />
    </div>
  );
}
