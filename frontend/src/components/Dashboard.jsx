import { useState, useEffect } from "react";
import TweetCard from "./TweetCard";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/dashboard`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError("Could not load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">⏳ Loading dashboard data...</div>;
  if (error)   return <div className="error-msg">❌ {error}</div>;
  if (!data)   return null;

  const { summary, tweets } = data;

  const filtered = filter === "all"
    ? tweets
    : tweets.filter((t) => t.label === filter);

  const stats = [
    { label: "Total Analysed", value: summary.total_analysed, color: "#6366f1" },
    { label: "😤 Negative",    value: `${summary.negative_pct}%`, color: "#dc2626" },
    { label: "😊 Positive",    value: `${summary.positive_pct}%`, color: "#16a34a" },
    { label: "😐 Neutral",     value: `${summary.neutral_pct}%`,  color: "#d97706" },
    { label: "Avg Confidence", value: `${summary.avg_confidence}%`, color: "#0ea5e9" },
  ];

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">📊 Load Shedding Sentiment Dashboard</h2>
      <p className="dashboard-subtitle">
        Analysed {summary.total_analysed} tweets about load shedding in South Africa.
      </p>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {stats.map((s) => (
          <div key={s.label} className="kpi-card" style={{ borderTop: `4px solid ${s.color}` }}>
            <p className="kpi-label">{s.label}</p>
            <p className="kpi-value" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Sentiment Bar */}
      <div className="sentiment-bar-section">
        <p className="bar-label">Overall Sentiment Distribution</p>
        <div className="sentiment-bar">
          <div style={{ width: `${summary.negative_pct}%`, backgroundColor: "#dc2626" }}
               title={`Negative: ${summary.negative_pct}%`} />
          <div style={{ width: `${summary.neutral_pct}%`, backgroundColor: "#d97706" }}
               title={`Neutral: ${summary.neutral_pct}%`} />
          <div style={{ width: `${summary.positive_pct}%`, backgroundColor: "#16a34a" }}
               title={`Positive: ${summary.positive_pct}%`} />
        </div>
        <div className="bar-legend">
          <span style={{ color: "#dc2626" }}>■ Negative {summary.negative_pct}%</span>
          <span style={{ color: "#d97706" }}>■ Neutral {summary.neutral_pct}%</span>
          <span style={{ color: "#16a34a" }}>■ Positive {summary.positive_pct}%</span>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        {["all", "negative", "neutral", "positive"].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== "all" && ` (${tweets.filter((t) => t.label === f).length})`}
          </button>
        ))}
      </div>

      {/* Tweet Feed */}
      <div className="tweet-feed">
        {filtered.map((tweet, i) => (
          <TweetCard key={i} tweet={tweet} />
        ))}
      </div>
    </div>
  );
}

