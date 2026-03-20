import { useState } from "react";
import SentimentForm from "./components/SentimentForm";
import SentimentResult from "./components/SentimentResult";
import Dashboard from "./components/Dashboard";
import "./index.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("analyse");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div>
            <h1 className="header-title">⚡ LoadShedding Sentiment Analyser</h1>
            <p className="header-subtitle">
              AI-powered sentiment analysis of South African load shedding opinions
            </p>
          </div>
          <div className="model-badge">
            🤗 RoBERTa · Twitter-trained
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "analyse" ? "active" : ""}`}
            onClick={() => setActiveTab("analyse")}
          >
            🔍 Analyse Text
          </button>
          <button
            className={`tab ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            📊 Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {activeTab === "analyse" && (
          <div className="analyse-layout">
            <SentimentForm onResult={setResult} onLoading={setLoading} />
            {loading && (
              <div className="loading-state">
                <div className="spinner" />
                <p>Analysing with RoBERTa model...</p>
              </div>
            )}
            {!loading && result && <SentimentResult result={result} />}
          </div>
        )}

        {activeTab === "dashboard" && <Dashboard />}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          Built by <a href="https://github.com/Lami14" target="_blank" rel="noreferrer">Lamla</a>
          {" · "}Model: <code>cardiffnlp/twitter-roberta-base-sentiment-latest</code>
          {" · "}Stack: React + Flask + HuggingFace Transformers
        </p>
      </footer>
    </div>
  );
}

