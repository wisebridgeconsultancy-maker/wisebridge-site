# Wisebridge Consultancy — site

Plain HTML/CSS/JS + one Vercel serverless function. No framework, nothing to build.

## Deploy (first time)

1. Push this folder to a new GitHub repo.
2. Go to vercel.com → New Project → import that repo. Framework preset: "Other" (it'll auto-detect the `api/` folder as functions). Click Deploy.
3. Site is live on a `*.vercel.app` URL immediately. Buy the real domain later and attach it in Vercel → Settings → Domains — no code changes needed.

## Wiring the form to Neon Postgres (free tier)

1. Go to neon.tech → create a free project.
2. In the Neon SQL editor, run:
   ```sql
   CREATE TABLE leads (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     mobile TEXT NOT NULL,
     country TEXT NOT NULL,
     intake TEXT NOT NULL,
     message TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT now()
   );
   ```
3. Copy the "Pooled connection" connection string from your Neon dashboard.
4. In Vercel → your project → Settings → Environment Variables, add:
   - Key: `DATABASE_URL`
   - Value: the Neon connection string
5. Redeploy (Vercel → Deployments → ⋯ → Redeploy) so the function picks up the env var.

Until `DATABASE_URL` is set, the form will show a friendly error and point people to WhatsApp instead — it won't silently fail.

## Checking submissions

Neon dashboard → Tables → `leads`, or run `SELECT * FROM leads ORDER BY created_at DESC;` in the SQL editor. If you want them emailed too, ping me and I'll add a Resend/SMTP step to `api/submit.js`.

## What's placeholder and needs a real swap later

- Footer address: currently says "Address coming soon" — replace the text inside the element with `data-address-slot` in `index.html` once you have it.
- Hero visual is an illustrated boarding pass, not a photo — deliberate choice (see chat), but if you later get a good photo of an actual mentor/student, that can replace it as a v2 section.
