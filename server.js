// ============================================================
// Futora Backend Proxy Server
// Keeps the Gemini API key on the server — never sent to browser
// ============================================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be configured in the environment before starting Futora.');
}

// ---- Middleware ----
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Serve all static files (HTML, CSS, JS, images) from the project root
app.use(express.static(path.join(__dirname)));

// ---- Rate Limiting ----
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { reply: 'Woah there! You are asking too many questions too fast. Please wait a minute and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ---- Gemini Proxy Endpoint ----
app.post('/api/chat', chatLimiter, async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not configured on the server. Add it to .env'
    });
  }

  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "message" field' });
  }

  const systemPrompt =
    'You are Futora AI, an expert World Cup 2026 football intelligence assistant. ' +
    'You have deep knowledge of football tactics, player statistics, match predictions, ' +
    'tournament history, and advanced analytics like xG, PPDA, and pass networks. ' +
    "You're enthusiastic but data-driven. Keep responses concise (2-3 sentences max). " +
    'Use football terminology naturally.';

  const contents = (history || []).map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));
  contents.push({ role: 'user', parts: [{ text: message }] });

  try {
    const geminiUrl =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const apiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
      }),
    });

    if (!apiRes.ok) {
      const errBody = await apiRes.text();
      console.error('Gemini API error:', apiRes.status, errBody);
      return res.status(apiRes.status).json({
        error: 'Gemini API request failed',
        details: errBody,
      });
    }

    const data = await apiRes.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Sorry, I could not generate a response.';

    return res.json({ reply });
  } catch (err) {
    console.error('Server error calling Gemini:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ---- Health check ----
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// ---- Public Config endpoint ----
app.get('/api/config', (_req, res) => {
  res.json({
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    MSAL_CLIENT_ID: process.env.MSAL_CLIENT_ID || 'YOUR_MSAL_CLIENT_ID'
  });
});

// ---- Database & Auth Setup ----
const db = new sqlite3.Database(path.join(__dirname, 'users.db'), (err) => {
  if (err) console.error('Failed to open database:', err);
  else {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const hash = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', [name, email, hash], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Email already registered' });
        }
        return res.status(500).json({ error: 'Database error' });
      }
      
      const token = jwt.sign({ id: this.lastID, name, email }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, user: { name, email } });
    });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { name: user.name, email: user.email } });
  });
});

// ---- SPA fallback — serve index.html for any unmatched route ----
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ---- Start ----
app.listen(PORT, () => {
  console.log(`\n  ⚽ Futora server running at  http://localhost:${PORT}`);
  console.log(`  📡 Gemini proxy endpoint     POST /api/chat`);
  console.log(`  🔑 API key configured        ${GEMINI_API_KEY ? 'YES' : 'NO — add GEMINI_API_KEY to .env'}\n`);
});
