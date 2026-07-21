export default function ResultsChart({ scores }) {
    if (!scores || scores.length === 0) {
      return <p>No scores to display.</p>;
    }
  
    const maxScore = Math.max(...scores.map(s => s.score), 100);
  
    return (
      <div className="space-y-4">
        {scores.map((item, index) => {
          const barWidth = item.score > 0 ? `${(item.score / maxScore) * 100}%` : '1%';
          return (
            <div key={index} className="flex items-center gap-4">
              <div className="w-1/3 text-sm text-slate-600 truncate" title={item.fileName}>
                {item.fileName}
              </div>
              <div className="w-2/3 bg-slate-200 rounded-full h-6">
                <div
                  className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2 text-white font-medium text-sm transition-all duration-500 ease-out"
                  style={{ width: barWidth }}
                >
                  {item.score}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  