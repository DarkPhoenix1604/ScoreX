import ResultsChart from './resultcharts';
import WordCloudDisplay from './wordclouddisplay';

export default function Dashboard({ data, onReset }) {
  if (!data || !data.scores) {
    return <p>No analysis data available.</p>;
  }

  const { scores, jobDescription } = data;

  return (
    <div className="space-y-8">
       <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-slate-800">Analysis Results</h2>
            <button
                onClick={onReset}
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
                Start New Analysis
            </button>
        </div>

      {/* Main results chart */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-semibold text-slate-700 mb-4">Resume Score Ranking</h3>
        <ResultsChart scores={scores} />
      </div>

      {/* Word Clouds Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-semibold text-slate-700 mb-6">Keyword Word Clouds</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Job Description Word Cloud */}
          <WordCloudDisplay
            title="Job Description"
            fileName={jobDescription.fileName}
            wordCloudPath={jobDescription.wordCloudPath}
          />
          {/* Resume Word Clouds */}
          {scores.map((result, index) => (
            <WordCloudDisplay
              key={index}
              title={`Resume: ${result.score}%`}
              fileName={result.fileName}
              wordCloudPath={result.wordCloudPath}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
