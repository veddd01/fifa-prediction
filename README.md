# ⚽ Futora — FIFA World Cup 2026 AI Companion

Futora is an AI-powered football intelligence platform built for the FIFA World Cup 2026. It combines advanced match analytics, AI-powered predictions, player insights, and a conversational AI assistant into a modern enterprise dashboard.

---

# Features

- 🔐 Google & Microsoft OAuth login
- 🤖 Gemini AI football assistant
- 📊 Match analytics dashboard
- 📈 AI match predictions
- ⚽ Live match tracking
- 👥 Player performance analytics
- 🎓 Football Academy
- 🎥 VAR Analysis
- 🌙 Light/Dark mode
- 📱 Fully responsive interface

---

# Tech Stack

## Frontend

- HTML5
- Vanilla JavaScript
- TailwindCSS (CDN)
- Google Identity Services
- Microsoft MSAL

## Backend

- Node.js
- Express
- Google Gemini API
- dotenv
- CORS

---

# Project Structure

```
Futora/
│
├── index.html
├── dashboard.html
├── privacy.html
├── terms.html
├── server.js
├── package.json
├── package-lock.json
├── .env
├── .gitignore
└── README.md
```

---

# Installation

Clone the repository

```bash
git clone <your-repository-url>
cd Futora
```

Install dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the project root.

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

You can generate a Gemini API key from Google AI Studio.

---

# Running the Application

Start the backend server

```bash
npm start
```

or

```bash
node server.js
```

The application will be available at

```
http://localhost:3000
```

---

# Authentication

## Google Login

Create an OAuth Client ID in Google Cloud Console.

Replace

```javascript
GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
```

with your own Client ID.

---

## Microsoft Login

Register an application in Azure Portal.

Replace

```javascript
MSAL_CLIENT_ID = "YOUR_MSAL_CLIENT_ID"
```

with your Azure Application (Client) ID.

---

# Gemini AI

Futora uses a secure backend proxy.

```
Browser
      │
      ▼
Express Backend
      │
      ▼
Gemini API
```

The Gemini API key is stored only inside `.env`.

The frontend never receives or exposes the API key.

---

# API Endpoints

### Health Check

```
GET /api/health
```

Returns

```json
{
  "status": "ok",
  "geminiConfigured": true
}
```

---

### Chat

```
POST /api/chat
```

Request

```json
{
  "message": "Who is the favorite to win?",
  "history": []
}
```

Response

```json
{
  "reply": "..."
}
```

---

# Security

- ✅ Gemini API key stored in `.env`
- ✅ API requests proxied through Express
- ✅ Frontend never exposes the Gemini API key
- ✅ `.env` excluded using `.gitignore`

---

# Development

Install packages

```bash
npm install
```

Start server

```bash
npm run dev
```

---

# Deployment

Before deploying, ensure:

- Gemini API key is configured
- Google OAuth Client ID is configured
- Microsoft Client ID is configured
- `.env` is **not** committed to Git
- HTTPS is enabled in production

---

# License

MIT License

---

Built for the future of football.