# Project Context & Deployment Memory

## Repository Information
- **GitHub Repository**: `https://github.com/ChandanManik/calculator-bowl.git`
- **Main Branch**: `main`
- **Owner**: `ChandanManik`

## Cloudflare Deployment Credentials & Configuration
- **Cloudflare Account ID**: `9a0cd6f7ccf377d5a8e03cda0ef4cb0d`
- **Account Name**: `Chandanmanik12g@gmail.com's Account`
- **Cloudflare Project Name**: `calculator-bowl`
- **API Token**: Stored locally in `.env` (`CLOUDFLARE_API_TOKEN`)
- **Live Worker URL**: `https://calculator-bowl.chandanmanik12g.workers.dev`
- **Custom Domain**: `https://calculatorbowl.com`

## Deployment Guidelines for AI Agents
1. Whenever the user requests to deploy or update the repository:
   - Run `git add .`, commit changes, and run `git push origin main`.
   - Run `npm run deploy` (or `node scripts/deploy.js`), which automatically loads `.env` and deploys via Wrangler without prompting the user.
