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
