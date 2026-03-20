# ⚡ LoadShedding Sentiment Analyser

An AI-powered full stack web app that analyses public sentiment around South Africa's load shedding crisis. Uses a HuggingFace RoBERTa model trained on tweets to classify opinions as Positive, Negative, or Neutral — with a React frontend and Flask REST API backend.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Flask](https://img.shields.io/badge/Flask-3.0-000000?logo=flask)
![HuggingFace](https://img.shields.io/badge/HuggingFace-Transformers-FFD21E?logo=huggingface)
![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)

---

## 📸 App Preview

> *(Add a screenshot or GIF of your running app here)*

---

## ✨ Features

- 🔍 **Live text analysis** — paste any tweet or statement and get instant sentiment
- 📊 **Dashboard** — analyse 50 real load shedding tweets with summary stats and filtering
- 🤗 **Twitter-trained model** — uses `cardiffnlp/twitter-roberta-base-sentiment-latest`
- 🧹 **Tweet preprocessing** — cleans URLs, mentions and hashtags before inference
- 📈 **Confidence scores** — shows model confidence percentage per prediction
- 🎨 **Clean UI** — colour-coded results, filter by sentiment, responsive design

---

## 🏗️ Architecture

```
React Frontend (port 3000)
        │
        │  HTTP POST /api/analyse
        │  HTTP GET  /api/dashboard
        ▼
Flask REST API (port 5000)
        │
        ▼
HuggingFace Transformers
cardiffnlp/twitter-roberta-base-sentiment-latest
```

---

## 📁 Project Structure

```
loadshedding-sentiment-app/
├── backend/
│   ├── app.py                      # Flask REST API
│   ├── sentiment.py                # HuggingFace NLP engine
│   ├── data/
│   │   └── loadshedding_tweets.csv # 50 sample tweets
│   └── requirements.txt
├── frontend/
│   ├── public/index.html
│   ├── src/
│   │   ├── App.jsx                 # Main app with tab navigation
│   │   ├── components/
│   │   │   ├── SentimentForm.jsx   # Text input + example buttons
│   │   │   ├── SentimentResult.jsx # Result display with confidence bar
│   │   │   ├── Dashboard.jsx       # Stats + tweet feed
│   │   │   └── TweetCard.jsx       # Individual tweet card
│   │   └── index.css
│   └── package.json
├── .env.example
├── docker-compose.yml
└── README.md
```

---

## 🚀 Getting Started

### Option A — Run Manually

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python app.py
# API running at http://localhost:5000
```

**Frontend:**
```bash
cd frontend
cp ../.env.example .env        # Sets VITE_API_URL
npm install
npm run dev
# App running at http://localhost:3000
```

### Option B — Docker Compose
```bash
docker-compose up --build
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/analyse` | Analyse single text |
| POST | `/api/analyse/batch` | Analyse up to 20 texts |
| GET | `/api/dashboard` | Run analysis on full dataset |

**POST `/api/analyse` example:**
```json
// Request
{ "text": "Load shedding is destroying small businesses!" }

// Response
{
  "label": "negative",
  "label_display": "Negative 😤",
  "score": 97.3,
  "color": "#dc2626",
  "original_text": "Load shedding is destroying small businesses!",
  "cleaned_text": "Load shedding is destroying small businesses!",
  "timestamp": "2024-03-25T10:30:00"
}
```

---

## 🤖 Model Details

| Property | Value |
|---|---|
| Model | `cardiffnlp/twitter-roberta-base-sentiment-latest` |
| Architecture | RoBERTa (Robustly Optimised BERT) |
| Training data | 124M tweets |
| Labels | Positive · Negative · Neutral |
| Max input length | 512 tokens |

---

## 💡 What I Learned

- Integrating HuggingFace Transformer models into a Python backend
- Building and consuming a REST API between React and Flask
- Preprocessing social media text for NLP inference
- Designing a clean, responsive React UI from scratch
- Containerising a full stack app with Docker Compose

---

## 🔮 Future Improvements

- [ ] Connect to Twitter/X API for live tweet streaming
- [ ] Add time-series sentiment trend chart
- [ ] Support Zulu and Afrikaans text via multilingual model
- [ ] Deploy to Render (backend) + Vercel (frontend)
- [ ] Add word cloud of most common terms per sentiment

---

*Built by [Lamla](https://github.com/Lami14) · NLP Portfolio Project · South Africa 🇿🇦*

