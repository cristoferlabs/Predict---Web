# Deployment Guide — Predict WC 2026

## 1. Push to GitHub

```bash
cd predict-web
git init
git add .
git commit -m "feat: initial Next.js web app"
git remote add origin https://github.com/cristoferlabs/Predict---Web.git
git branch -M main
git push -u origin main
```

## 2. Deploy on Vercel (free)

1. Go to https://vercel.com → New Project
2. Import from GitHub: `cristoferlabs/Predict---Web`
3. Framework: Next.js (auto-detected)
4. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` → your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → your Supabase anon key
   - `NEXT_PUBLIC_POWERBI_EMBED_URL` → your Power BI embed URL (optional)
5. Click Deploy → Done. Auto-deploys on every push.

## 3. Get Supabase credentials

1. Go to supabase.com → your project
2. Settings → API
3. Copy "Project URL" and "anon public" key

## 4. Setup Power BI (optional)

1. Open Power BI Desktop
2. Get Data → PostgreSQL Database
   - Server: db.[ref].supabase.co:5432
   - Database: postgres
   - Table: predicciones
3. Build your visuals
4. File → Publish → select workspace
5. In app.powerbi.com: open report → File → Embed report → Website or portal
6. Copy the iframe src URL
7. Paste in Vercel env var: `NEXT_PUBLIC_POWERBI_EMBED_URL`

## 5. Update n8n to save structured data to Supabase

Make sure the "Guardar Supabase" node in your n8n workflow inserts these columns:
- partido, fecha, hora, ronda, grupo
- equipo1, equipo2
- prob_equipo1, prob_empate, prob_equipo2
- resultado_predicho, confianza
- prob_over25, prob_btts
- lambda1, lambda2, elo1, elo2
- cuota1, cuota_empate, cuota2 (optional)
- corners_avg, amarillas_avg, tiros_avg (optional)
- top5_apuestas (JSON array, optional)
