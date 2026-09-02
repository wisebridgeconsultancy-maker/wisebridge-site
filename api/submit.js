// Vercel serverless function — POST /api/submit
// Writes a lead into Neon Postgres. Requires env var DATABASE_URL
// (get this from your Neon project's connection string, "Pooled connection").
//
// One-time setup in Neon's SQL editor:
//
// CREATE TABLE leads (
//   id SERIAL PRIMARY KEY,
//   name TEXT NOT NULL,
//   mobile TEXT NOT NULL,
//   country TEXT NOT NULL,
//   intake TEXT NOT NULL,
//   message TEXT NOT NULL,
//   created_at TIMESTAMPTZ DEFAULT now()
// );

import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, mobile, country, intake, message } = req.body || {};

  if (!name || !mobile || !country || !intake || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Very light validation / cleanup
  const clean = {
    name: String(name).slice(0, 200),
    mobile: String(mobile).slice(0, 30),
    country: String(country).slice(0, 100),
    intake: String(intake).slice(0, 100),
    message: String(message).slice(0, 2000),
  };

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set — cannot save lead.');
    return res.status(500).json({ error: 'Server not configured' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`
      INSERT INTO leads (name, mobile, country, intake, message)
      VALUES (${clean.name}, ${clean.mobile}, ${clean.country}, ${clean.intake}, ${clean.message})
    `;
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('DB insert failed:', err);
    return res.status(500).json({ error: 'Could not save your details' });
  }
}
