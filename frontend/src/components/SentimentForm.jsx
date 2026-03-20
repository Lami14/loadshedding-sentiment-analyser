import { useState } from "react";

export default function SentimentForm({ onResult, onLoading }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError("Please enter some text to analyse.");
      return;
    }
    setError("");
    onLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/analyse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      onResult(data);
    } catch (err) {
      setError("Failed to connect to the API. Is the backend running?");
    } finally {
      onLoading(false);
    }
  };

  const examples = [
    "Load shedding is destroying small businesses in South Africa!",
    "Finally installed solar panels — no more loadshedding stress 🙌",
    "Stage 4 loadshedding announced again for this week.",
  ];

  return (
    <div className="form-card">
      <h2 className="form-title">🔍 Analyse a Tweet or Statement</h2>
      <p className="form-subtitle">
        Enter any text about load shedding to detect its sentiment using AI.
      </p>

      <textarea
        className="text-input"
        placeholder="e.g. Load shedding stage 6 is ruining my business! #EskomMustFall"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={1000}
        rows={4}
      />

      <div className="char-count">{text.length} / 1000</div>

      {error && <p className="error-msg">⚠️ {error}</p>}

      <button className="analyse-btn" onClick={handleSubmit}>
        Analyse Sentiment
      </button>

      <div className="examples-section">
        <p className="examples-label">Try an example:</p>
        <div className="examples-list">
          {examples.map((ex, i) => (
            <button
              key={i}
              className="example-chip"
              onClick={() => setText(ex)}
            >
              {ex.length > 55 ? ex.slice(0, 55) + "..." : ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
