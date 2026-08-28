# Futora — FIFA World Cup 2026 AI Companion

A football-focused web application combining a responsive dashboard with match information, player insights, football analysis, and a Gemini-powered conversational assistant.

## Overview

Futora is a full-stack JavaScript project with a static frontend and a Node.js/Express backend. The backend serves the web application, handles API requests, proxies conversations to the Gemini API without exposing the API key to the browser, and provides local SQLite-backed authentication.

## Features

- Football intelligence dashboard
- Gemini-powered conversational football assistant
- Match and player-focused interface
- User registration and login
- Password hashing with bcrypt
- JWT-based session tokens
- SQLite persistence
- API rate limiting for the chat endpoint
- Responsive frontend with light/dark interface support
- Terms and privacy pages

## Tech Stack

**Frontend**

- HTML5
- Vanilla JavaScript
- TailwindCSS via CDN
- Google Identity Services / Microsoft MSAL integration in the frontend

**Backend**

- Node.js
- Express
- Gemini API
- CORS
- dotenv
- express-rate-limit
- bcrypt
- jsonwebtoken
- SQLite (`sqlite3`)

## Architecture

```text
Browser
   │
   ├── Static HTML / JavaScript / CSS
   │
   ▼
Node.js + Express
   │
   ├── Authentication ──► SQLite
   │
   ├── Chat endpoint ────► Gemini API
   │
   └── Static file serving
```

The Gemini API key is read from the server environment and used only by the backend. The chat route is rate-limited before requests are forwarded to Gemini.

## Repository Structure

```text
fifa-prediction/
├── index.html
├── dashboard.html
├── privacy.html
├── terms.html
├── server.js
├── package.json
├── package-lock.json
├── DESIGN.md
├── .gitignore
└── README.md
```

## Installation

### Prerequisites

- Node.js with a version that supports the project's dependencies
- A Gemini API key if you want to use the AI assistant
- OAuth application credentials if using the configured Google/Microsoft authentication flows

### Setup

```bash
git clone https://github.com/veddd01/fifa-prediction.git
cd fifa-prediction
npm install
```

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_client_id
MSAL_CLIENT_ID=your_microsoft_client_id
JWT_SECRET=replace_with_a_long_random_secret
```

Never commit `.env` or real credentials to the repository.

## Usage

Start the server:

```bash
npm start
```

The application is served on the port defined by `PORT`, or `3000` by default.

For development, the repository currently uses the same Node.js server command:

```bash
npm run dev
```

### API endpoints

- `GET /api/health` — backend health/configuration status
- `POST /api/chat` — send a message to the Gemini-powered assistant
- `POST /api/register` — create a local user account
- `POST /api/login` — authenticate a local user
- `GET /api/config` — return non-secret frontend configuration values

## Security Notes

- `.env` is excluded through `.gitignore`.
- The Gemini API key is kept server-side.
- Chat requests are rate-limited.
- Passwords are hashed with bcrypt before storage.
- JWT signing should use a strong `JWT_SECRET` supplied through the environment.

The application is a project/demo implementation and should receive additional security hardening before production use, including stricter CORS policy, production secret management, stronger authentication/session controls, and more comprehensive validation and testing.

## Screenshots / Demo

The repository contains the implemented frontend and a `DESIGN.md` document. No external live-demo URL is assumed here so the documentation stays accurate to the repository.

## Future Improvements

- Add automated backend/API tests
- Improve production authentication and session management
- Add stronger input validation and security headers
- Separate frontend assets and backend code into clearer directories
- Add deployment documentation and CI checks

## Author

**Vedant** — [GitHub](https://github.com/veddd01)
