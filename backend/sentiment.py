"""
sentiment.py
------------
Core NLP engine using HuggingFace Transformers.
Uses the cardiffnlp/twitter-roberta-base-sentiment model —
trained specifically on tweets, making it ideal for this project.
"""

import re
import logging
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import pandas as pd
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ─── Model ────────────────────────────────────────────────────────────────────
# Twitter-trained RoBERTa model — perfect for tweet sentiment
MODEL_NAME = "cardiffnlp/twitter-roberta-base-sentiment-latest"

LABELS = {
    "positive": "Positive 😊",
    "negative": "Negative 😤",
    "neutral":  "Neutral 😐"
}

LABEL_COLORS = {
    "positive": "#16a34a",
    "negative": "#dc2626",
    "neutral":  "#d97706"
}

# Load model once at startup (cached)
logger.info(f"[NLP] Loading model: {MODEL_NAME}")
sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model=MODEL_NAME,
    tokenizer=MODEL_NAME,
    max_length=512,
    truncation=True
)
logger.info("[NLP] Model loaded successfully.")


# ─── Text Cleaning ────────────────────────────────────────────────────────────

def clean_tweet(text: str) -> str:
    """
    Clean raw tweet text before passing to the model.
    Removes URLs, mentions, hashtag symbols and extra whitespace.
    Keeps hashtag words (e.g. #loadshedding → loadshedding).
    """
    text = re.sub(r"http\S+|www\S+", "", text)          # Remove URLs
    text = re.sub(r"@\w+", "", text)                     # Remove @mentions
    text = re.sub(r"#(\w+)", r"\1", text)                # Strip # but keep word
    text = re.sub(r"\s+", " ", text).strip()             # Normalise whitespace
    return text


# ─── Single Text Analysis ─────────────────────────────────────────────────────

def analyse_sentiment(text: str) -> dict:
    """
    Analyse the sentiment of a single text input.

    Returns:
        dict with keys: original_text, cleaned_text, label,
                        label_display, score, color, timestamp
    """
    cleaned = clean_tweet(text)

    if not cleaned:
        return {"error": "Text is empty after cleaning."}

    try:
        result = sentiment_pipeline(cleaned)[0]
        label = result["label"].lower()

        return {
            "original_text":  text,
            "cleaned_text":   cleaned,
            "label":          label,
            "label_display":  LABELS.get(label, label),
            "score":          round(result["score"] * 100, 2),
            "color":          LABEL_COLORS.get(label, "#6b7280"),
            "timestamp":      datetime.utcnow().isoformat()
        }

    except Exception as e:
        logger.error(f"[NLP] Inference error: {e}")
        return {"error": str(e)}


# ─── Batch Analysis ───────────────────────────────────────────────────────────

def analyse_batch(texts: list[str]) -> list[dict]:
    """
    Analyse sentiment for a list of texts.
    Returns list of result dicts.
    """
    return [analyse_sentiment(t) for t in texts]


def analyse_dataset(filepath: str) -> dict:
    """
    Load the sample CSV dataset and run batch sentiment analysis.
    Returns summary stats and per-tweet results.
    """
    try:
        df = pd.read_csv(filepath)
        df = df.dropna(subset=["text"])
        df = df.head(50)  # Limit for demo performance

        logger.info(f"[NLP] Analysing {len(df)} tweets from dataset...")
        results = analyse_batch(df["text"].tolist())

        # Filter out errors
        valid = [r for r in results if "error" not in r]

        # Summary stats
        labels = [r["label"] for r in valid]
        total = len(valid)

        summary = {
            "total_analysed": total,
            "positive_count": labels.count("positive"),
            "negative_count": labels.count("negative"),
            "neutral_count":  labels.count("neutral"),
            "positive_pct":   round(labels.count("positive") / total * 100, 1) if total else 0,
            "negative_pct":   round(labels.count("negative") / total * 100, 1) if total else 0,
            "neutral_pct":    round(labels.count("neutral")  / total * 100, 1) if total else 0,
            "avg_confidence": round(sum(r["score"] for r in valid) / total, 2) if total else 0,
        }

        return {"summary": summary, "tweets": valid}

    except FileNotFoundError:
        logger.error(f"[NLP] Dataset not found at: {filepath}")
        return {"error": "Dataset file not found."}
    except Exception as e:
        logger.error(f"[NLP] Dataset analysis error: {e}")
        return {"error": str(e)}


if __name__ == "__main__":
    # Quick test
    tests = [
        "Load shedding is destroying small businesses in South Africa! #EskomMustFall",
        "Finally got a solar inverter installed. No more loadshedding stress 🙌",
        "Stage 4 loadshedding again today in Johannesburg.",
    ]
    for t in tests:
        r = analyse_sentiment(t)
        print(f"\n📝 {t[:60]}...")
        print(f"   → {r['label_display']} ({r['score']}% confidence)")
