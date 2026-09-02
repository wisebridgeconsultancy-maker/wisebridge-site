import { neon } from '@neondatabase/serverless';

// GET /api/db-check
// Returns a simple connectivity check and a list of tables in the public schema.

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set — cannot check DB.');
    return res.status(500).json({ error: 'Server not configured' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // Simple ping
    await sql`SELECT 1`;

    // List tables in the public schema so you can verify the leads table exists
    const rows = await sql`
      SELECT tablename
      FROM pg_catalog.pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;

    const tables = Array.isArray(rows) ? rows.map(r => r.tablename) : rows;

    return res.status(200).json({ ok: true, tables });
  } catch (err) {
    console.error('DB check failed:', err);
    return res.status(500).json({ error: 'DB connection failed', detail: String(err) });
  }
}
