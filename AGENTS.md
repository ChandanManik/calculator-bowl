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
- The gate checks all 6 layers: **(1) On-Page SEO** (title/description presence, length, uniqueness), **(2) Slug/URL** (pattern, slug=id, trailing slash, uniqueness), **(3) Technical SEO** (rich content, article depth, FAQs, JSON-LD, canonical, robots, app render path), **(4) Sitemap** (all calculator URLs present, unique, no legacy, lastmod), **(5) llms.txt** (all URLs listed, pillar count in sync), **(6) UI Scroll Hygiene** (every `scrollIntoView` in `js/calculators/` must be click-gated — see §5).
- **Exit code 0 = deploy allowed. Exit code 1 = BLOCKER, fix first.**
- Known pre-existing content debt (thin articles / 2-FAQ pages) is listed in `LEGACY_CONTENT_DEBT` inside the gate as non-blocking warnings — new calculators must pass 100%.
- Full workflow: `npm run test` (syntax + renderers + regenerates sitemap/llms) → `npm run gate` → deploy → verify live.
- If a legacy page gets expanded, remove its id from `LEGACY_CONTENT_DEBT` so the gate locks in the improvement.

## 5. UI Behavior Rules (New Calculators — scroll incident 2026-09)
- **Incident**: calculators ended `calculate()` with `resultDiv.scrollIntoView(...)`, but `calculate` was also bound to `input`/`change` live-recalc → typing or changing a select smooth-scrolled the page down (reported on Data Size Converter). Page load jumped too.
- **Rule**: `scrollIntoView` must NEVER fire from `input`/`change` events or the initial load call. Only an explicit Calculate-button click may scroll to results.
- **Required pattern** in every new calculator:
  ```js
  function calculate(ev) {           // 1. accept the event
    // ...render result...
    if (ev && ev.type === "click")   // 2. guard the scroll
      resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  btnCalc.addEventListener("click", calculate);        // ev.type = "click" → scrolls
  input.addEventListener("input", calculate);          // ev.type = "input" → no scroll
  calculate();                                          // load: ev undefined → no scroll
  ```
- Live auto-recalc itself is a feature — keep it; only the scroll must be click-gated. Intentional exception: scroll inside an explicit `addEventListener("click", () => { ... })` block (e.g., bitcoin/gold pill → tab jump).
- Enforced automatically: gate **layer 6** blocks deploy on any unguarded `scrollIntoView` in `js/calculators/*.js` (do not weaken the check).

## 6. Edge Canonical Worker (worker.js — GSC canonical incident 2026-09-26)
- **Incident**: GSC flagged `/terms` + `/calculators/finance/interest/` as "Alternate page with proper canonical tag" — `index.html` ships a static canonical pointing at the homepage, and crawlers reading raw HTML saw it. Two extra bugs: `js/app.js` subcat canonical used `cluster.id` (`financial`/`conversions`/`datetime`/`network`) instead of `cluster.canonicalId` (`finance`/`conversion`/`date-time`/`tech-network`), and a forced trailing slash broke no-slash static pages.
- **Fix layers (keep all three consistent with sitemap form)**:
  1. `worker.js` — rewrites the canonical at the edge for HTML responses whose path is in `sitemap.xml`; unknown paths deliberately keep the homepage canonical (suppresses soft-404 URLs); fails open (any error → asset re-served unmodified).
  2. `js/app.js` `updateSEO()` — render-time canonical: `/calculators/...` paths get a trailing slash, static pages (`/terms`, `/privacy`, …) get NO trailing slash; cluster URLs use `canonicalId`.
  3. Sitemap (`scripts/generate-seo.js`) is the single source of truth for canonical form.
- **CRITICAL**: wrangler config (`wrangler.jsonc` AND `wrangler.toml`) must keep `"binding": "ASSETS"` inside `assets`. Without it `env` is empty → every SPA route returns 503 (live incident 2026-09-26, rolled back in minutes). Symptom → emergency: remove `main` from both configs and deploy (assets-only restores the site), then re-add `main = "worker.js"` WITH the binding.
- Worker responses: body is read exactly once (`res.text()`), every path returns a NEW Response — never return a consumed `res`.
- Verify after deploys: raw canonicals via `WebClient` (no JS) must equal the sitemap form for `/`, `/terms`, hub/subcat/calc pages, and stay `https://calculatorbowl.com/` for unknown paths.

## 7. New Content Checklist (SEO hygiene — add every calculator/page/article, post-incident 2026-09-26)
New content likhar shomoy ei checklist mene nao — GSC "alternate page"/duplicate class issue barbena:

1. **Canonical form (sitemap = source of truth, 3 jagai match korte hobe)**:
   - `/calculators/...` path → **always trailing slash** (`/calculators/finance/loans/x-calculator/`); static utility pages (`/terms`, `/privacy`, `/help`, `/suggestions`, `/contact`) → **never trailing slash**.
   - Registry `url` / `subcatUrl` / cluster `url` already correct form-e thakte hobe (gate layer 2 enforces) — tai notun page add korle URL ta direct sitemap-form-e likho.
   - Cluster URL build korle shobshomoy `cluster.canonicalId` use koro, `cluster.id` NO: `financial`→`finance`, `conversions`→`conversion`, `datetime`→`date-time`, `network`→`tech-network`.
   - **Inline/contextual links** (calculator-content.js article, clusters.js `contextualGuide.html`, footer/nav) must use the EXACT sitemap URL — legacy/short form link = notun alternate-page duplicate create korbe. Verify: link ta `sitemap.xml`-e acheki (slash form milche).
   - Edge worker (`worker.js`) notun routes automatically cover kore — sitemap regenerate holei (test script kore) worker-e onno change lagbe NA.
2. **Quote/escape hygiene (recurrent bug class — 3 bar hoyeche)**:
   - `calculator-content.js` FAQ strings double-quoted — tar bhitore raw `"` DORBONA; curly quotes (“ ”) or `&quot;` use koro.
   - `clusters.js` edit korle scan koro: `Select-String -Pattern '\w\\"[ ]*:'` → stray-escape (`"html\":` mangling) hole fix.
   - Commit-er age: `node --check` on every changed `.js` (test script o kore — exit 0 required).
3. **Gate nevoba (non-negotiable)**: rich content + ≥4 FAQs (layer 3), sitemap/llms sync (4/5), scroll click-gate (6) — `node scripts/pre-deploy-seo-gate.js` exit 0 charhe deploy NA.
4. **Post-deploy verify (new URL gulor jonyo)**: raw canonical (`WebClient` = no-JS) === sitemap form, page HTTP 200, sitemap count +N, llms count +N. Worker deploy hole extra: `/`, `/terms`, ekta hub, ekta calc page + junk path probe (see §6).
