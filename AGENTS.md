# Project Memory & Automated Deployment Rules

## 1. Git Repository
- **Remote**: `https://github.com/ChandanManik/calculator-bowl.git`
- **Branch**: `main`

## 2. Cloudflare Infrastructure
- **Account ID**: `9a0cd6f7ccf377d5a8e03cda0ef4cb0d`
- **Account Name**: `Chandanmanik12g@gmail.com's Account`
- **Project Name**: `calculator-bowl`
- **API Token Location**: Saved in `.env` (`CLOUDFLARE_API_TOKEN`)
- **Live Worker URL**: `https://calculator-bowl.chandanmanik12g.workers.dev`
- **Production Domain**: `https://calculatorbowl.com`

## 3. Automated Instructions for Agents
- Whenever committing code, push to `origin main`.
- When deploying to Cloudflare, always run `npm run deploy` or load credentials from `.env` with `cmd.exe /c npx wrangler deploy`. Never ask the user to re-provide the token or repository info.

## 4. MANDATORY Pre-Deploy SEO Gate
- **Before EVERY deploy** (no exceptions), run: `node scripts/pre-deploy-seo-gate.js`
- The gate checks all 5 layers: **(1) On-Page SEO** (title/description presence, length, uniqueness), **(2) Slug/URL** (pattern, slug=id, trailing slash, uniqueness), **(3) Technical SEO** (rich content, article depth, FAQs, JSON-LD, canonical, robots, app render path), **(4) Sitemap** (all calculator URLs present, unique, no legacy, lastmod), **(5) llms.txt** (all URLs listed, pillar count in sync).
- **Exit code 0 = deploy allowed. Exit code 1 = BLOCKER, fix first.**
- Known pre-existing content debt (thin articles / 2-FAQ pages) is listed in `LEGACY_CONTENT_DEBT` inside the gate as non-blocking warnings — new calculators must pass 100%.
- Full workflow: `npm run test` (syntax + renderers + regenerates sitemap/llms) → `npm run gate` → deploy → verify live.
- If a legacy page gets expanded, remove its id from `LEGACY_CONTENT_DEBT` so the gate locks in the improvement.
