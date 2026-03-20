export default function SentimentResult({ result }) {
  if (!result) return null;

  if (result.error) {
    return (
      <div className="result-card result-error">
        <p>❌ Error: {result.error}</p>
      </div>
    );
  }

  const confidenceWidth = `${result.score}%`;

  return (
    <div className="result-card" style={{ borderLeft: `5px solid ${result.color}` }}>
      <div className="result-header">
        <span className="result-label" style={{ color: result.color }}>
          {result.label_display}
        </span>
        <span className="result-confidence">{result.score}% confidence</span>
      </div>

      <div className="confidence-bar-bg">
        <div
          className="confidence-bar-fill"
          style={{ width: confidenceWidth, backgroundColor: result.color }}
        />
      </div>

      <div className="result-text-section">
        <p className="result-text-label">Original text:</p>
        <p className="result-text">"{result.original_text}"</p>
      </div>

      {result.cleaned_text !== result.original_text && (
        <div className="result-text-section">
          <p className="result-text-label">Cleaned for model:</p>
          <p className="result-text muted">"{result.cleaned_text}"</p>
        </div>
      )}

      <p className="result-timestamp">
        Analysed at {new Date(result.timestamp).toLocaleTimeString()}
      </p>
    </div>
  );
}

