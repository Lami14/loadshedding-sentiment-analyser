"""
app.py
------
Flask REST API exposing sentiment analysis endpoints.
Consumed by the React frontend.
"""

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from sentiment import analyse_sentiment, analyse_batch, analyse_dataset

app = Flask(__name__)
CORS(app)  # Allow React frontend to call the API

DATASET_PATH = os.path.join(os.path.dirname(__file__), "data", "loadshedding_tweets.csv")


# ─── Health Check ─────────────────────────────────────────────────────────────

@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "message": "Sentiment API is running 🚀"})


# ─── Single Text Analysis ─────────────────────────────────────────────────────

@app.route("/api/analyse", methods=["POST"])
def analyse():
    """
    Analyse sentiment of a single text input.

    Request body:
        { "text": "Load shedding is ruining my business!" }

    Response:
        {
            "label": "negative",
            "label_display": "Negative 😤",
            "score": 97.3,
            "color": "#dc2626",
            ...
        }
    """
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' field in request body."}), 400

    text = data["text"].strip()
    if not text:
        return jsonify({"error": "Text cannot be empty."}), 400
    if len(text) > 1000:
        return jsonify({"error": "Text too long. Max 1000 characters."}), 400

    result = analyse_sentiment(text)

    if "error" in result:
        return jsonify(result), 500

    return jsonify(result), 200


# ─── Batch Analysis ───────────────────────────────────────────────────────────

@app.route("/api/analyse/batch", methods=["POST"])
def batch():
    """
    Analyse sentiment for multiple texts at once.

    Request body:
        { "texts": ["text1", "text2", ...] }

    Response:
        { "results": [ {...}, {...} ] }
    """
    data = request.get_json()

    if not data or "texts" not in data:
        return jsonify({"error": "Missing 'texts' field in request body."}), 400

    texts = data["texts"]
    if not isinstance(texts, list) or len(texts) == 0:
        return jsonify({"error": "'texts' must be a non-empty list."}), 400
    if len(texts) > 20:
        return jsonify({"error": "Max 20 texts per batch request."}), 400

    results = analyse_batch(texts)
    return jsonify({"results": results}), 200


# ─── Dataset Dashboard ────────────────────────────────────────────────────────

@app.route("/api/dashboard", methods=["GET"])
def dashboard():
    """
    Run sentiment analysis on the full sample dataset.
    Returns summary stats + per-tweet results for the dashboard.

    Response:
        {
            "summary": {
                "total_analysed": 50,
                "positive_pct": 22.0,
                "negative_pct": 61.0,
                "neutral_pct": 17.0,
                ...
            },
            "tweets": [ {...}, {...} ]
        }
    """
    result = analyse_dataset(DATASET_PATH)

    if "error" in result:
        return jsonify(result), 500

    return jsonify(result), 200


# ─── Run ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)
  
