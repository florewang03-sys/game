# La Roue d'Or 237
Projet complet de jeu de Roue avec paiement Orange Money et panneau secret.
1. npm install
2. npm run dev
3. Déploiement Vercel : importer le projet, framework Vite, cliquer sur Deploy.

## 🗄️ Base de données (obligatoire sur Vercel)

Sur Vercel, les données sont stockées dans **Upstash Redis** (une seule copie partagée).

1. Vercel → votre projet → **Storage** → **Create Database** → **Upstash** → **Redis** → plan **Free** → **Connect to Project**.
2. Vérifiez dans **Settings → Environment Variables** que des variables `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` (ou `KV_REST_API_URL` / `KV_REST_API_TOKEN`) sont apparues.
3. Faites un **Redeploy**.

Variables facultatives : `ADMIN_PIN` (code admin, défaut 2026), `SHOT_TTL_DAYS` (durée de conservation des captures, défaut 30), `MIN_WITHDRAW` (plancher serveur d'un retrait, défaut 100).

En local (`npm run dev`), aucune base n'est nécessaire : les données sont dans le dossier `data/`.
