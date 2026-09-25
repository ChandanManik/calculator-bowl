/**
 * ============================================================================
 * PRE-DEPLOY SEO GATE — run this BEFORE every `wrangler deploy`
 * ============================================================================
 * Usage:  node scripts/pre-deploy-seo-gate.js
 * Exit 0  = safe to deploy
 * Exit 1  = BLOCKER found, do not deploy
 *
 * Checks (per calculator + site-wide):
 *   1. ON-PAGE SEO   — seoTitle/seoDescription presence, length, uniqueness
 *   2. SLUG / URL    — pattern, slug=id, lowercase-hyphen, trailing slash
 *   3. TECHNICAL SEO — rich content, FAQs, JSON-LD graph, render path, robots
 *   4. SITEMAP       — all calculator URLs present, unique, no legacy, lastmod
 *   5. LLMS.TXT      — all calculator URLs listed + pillar count line in sync
 * ============================================================================
 */
const fs = require('fs');
const path = require('path');
const rootDir = path.resolve(__dirname, '..');

// ---- load registries ----
eval(fs.readFileSync(path.join(rootDir, 'js/clusters.js'), 'utf8').replace('const TOPICAL_CLUSTERS', 'var TOPICAL_CLUSTERS'));
eval(fs.readFileSync(path.join(rootDir, 'js/calculator-content.js'), 'utf8')
  .replace('const CALCULATOR_RICH_CONTENT', 'var CALCULATOR_RICH_CONTENT')
  .replace('const CATEGORY_PILLAR_CONTENT', 'var CATEGORY_PILLAR_CONTENT'));

const sitemap = fs.readFileSync(path.join(rootDir, 'sitemap.xml'), 'utf8');
const llms = fs.readFileSync(path.join(rootDir, 'llms.txt'), 'utf8');
const robots = fs.readFileSync(path.join(rootDir, 'robots.txt'), 'utf8');
const appJs = fs.readFileSync(path.join(rootDir, 'js/app.js'), 'utf8');

const PILLARS = ['financial', 'math', 'conversions', 'datetime', 'network', 'health'];
const sitemapLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

let pass = 0;
let fail = 0;
const failures = [];
// Known pre-existing content debt (thin article / <3 h3 / 2 FAQs) from pages
// already live before this gate existed. Reported as warnings, never blocking.
// Any calculator NOT in this set that fails content-depth checks = BLOCKER.
// When a legacy page is expanded, remove its id here to lock in the improvement.
const LEGACY_CONTENT_DEBT = new Set([
  'simple-interest', 'auto-loan', 'sales-tax', 'tip-calculator', 'retirement-calculator',
  'roi-calculator', 'present-value', 'inflation-calculator', 'rule-of-72', 'break-even-calculator',
  'basic-calculator', 'percentage-calculator', 'fractions-operations', 'fraction-to-decimal',
  'decimal-to-fraction', 'mixed-number-calc', 'fraction-simplifier', 'gcf-lcm-calculator',
  'prime-factorization', 'ratio-calculator', 'quadratic-formula', 'mean-median-mode',
  'standard-deviation', 'scientific-notation', 'exponent-calculator', 'temperature-converter',
  'length-converter', 'weight-converter', 'age-calculator', 'time-calculator'
]);
const legacyWarnings = [];
// Content-depth check: blocker for new/calculated pages, warning for legacy debt
function contentCheck(id, label, cond, extra) {
  if (cond) { pass++; return; }
  if (LEGACY_CONTENT_DEBT.has(id)) {
    legacyWarnings.push(`[${id}] ${label}${extra !== undefined ? '  → ' + extra : ''}`);
  } else {
    fail++;
    failures.push(`[${id}] ${label}${extra !== undefined ? '  → ' + extra : ''}`);
  }
}
function check(scope, label, cond, extra) {
  if (cond) { pass++; }
  else { fail++; failures.push(`[${scope}] ${label}${extra !== undefined ? '  → ' + extra : ''}`); }
}
function section(title) { console.log(`\n=== ${title} ===`); }

// ---- collect every calculator ----
const allCalcs = [];
for (const key of PILLARS) {
  const cluster = TOPICAL_CLUSTERS[key];
  if (!cluster || !cluster.calculators) continue;
  cluster.calculators.forEach(c => allCalcs.push({ ...c, pillar: key }));
}

const titles = allCalcs.map(c => c.seoTitle);
const descs = allCalcs.map(c => c.seoDescription);
const urls = allCalcs.map(c => c.url);

// ==========================================================================
section('1. ON-PAGE SEO');
for (const c of allCalcs) {
  const t = c.seoTitle || '';
  const d = c.seoDescription || '';
  check(c.id, 'seoTitle present', t.length > 0);
  check(c.id, 'seoTitle 25-75 chars', t.length >= 25 && t.length <= 75, `${t.length} chars: "${t}"`);
  check(c.id, 'seoTitle unique', titles.filter(x => x === t).length === 1);
  check(c.id, 'seoDescription present', d.length > 0);
  check(c.id, 'seoDescription 50-165 chars', d.length >= 50 && d.length <= 165, `${d.length} chars`);
  check(c.id, 'seoDescription unique', descs.filter(x => x === d).length === 1);
  check(c.id, 'cluster seoTitle present', !!(TOPICAL_CLUSTERS[c.pillar] || {}).seoTitle);
}

// ==========================================================================
section('2. SLUG / URL');
for (const c of allCalcs) {
  check(c.id, 'url matches /calculators/{cat}/{subcat}/{slug}/',
    /^\/calculators\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+\/$/.test(c.url), c.url);
  check(c.id, 'url unique site-wide', urls.filter(u => u === c.url).length === 1, c.url);
  check(c.id, 'slug matches url tail', c.url.endsWith(`/${c.slug}/`), `${c.slug}`);
  check(c.id, 'slug lowercase-hyphenated', /^[a-z0-9]+(-[a-z0-9]+)*$/.test(c.slug || ''), c.slug);
  check(c.id, 'subcatUrl + categoryUrl consistent',
    c.url.startsWith(c.subcatUrl) && c.subcatUrl.startsWith(c.categoryUrl), `${c.subcatUrl} | ${c.categoryUrl}`);
}

// ==========================================================================
section('3. TECHNICAL SEO');
check('app', 'updateSEO uses calc.seoTitle', appJs.includes('calc.seoTitle'));
check('app', 'canonical = calc.url', appJs.includes('canonicalPath: calc.url'));
check('app', 'FAQ block prefers CALCULATOR_RICH_CONTENT', /CALCULATOR_RICH_CONTENT\[calc\.id\]/.test(appJs));
check('app', 'JSON-LD graph builder exists', appJs.includes('"@type": "FAQPage"') && appJs.includes('"@type": "BreadcrumbList"'));
check('app', 'GA4 SPA pageview tracking', appJs.includes('trackGA4PageView'));
check('robots', 'robots.txt allows all crawlers', /User-agent:\s*\*/i.test(robots) && /Allow:\s*\/\s*$/m.test(robots));
check('robots', 'robots.txt references sitemap', /Sitemap:\s*https:\/\/calculatorbowl\.com\/sitemap\.xml/i.test(robots));
check('robots', 'robots.txt does NOT disallow calculators', !/Disallow:\s*\/calculators\//i.test(robots));

const idx = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
check('index.html', 'canonicalUrl tag present', idx.includes('id="canonicalUrl"'));
check('index.html', 'og + twitter tags present', /og:title/.test(idx) && /twitter:title/.test(idx));
check('index.html', 'GA4 script present', /googletagmanager|gtag/.test(idx));
check('index.html', 'robots meta present', /<meta name="robots"/.test(idx));

for (const c of allCalcs) {
  const rc = CALCULATOR_RICH_CONTENT[c.id];
  contentCheck(c.id, 'rich content exists (article block)', !!rc);
  if (rc) {
    const text = (rc.articleHtml || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    contentCheck(c.id, 'article >= 500 chars', text.length >= 500, `${text.length} chars`);
    contentCheck(c.id, 'article has >= 3 h3 subheadings', (rc.articleHtml.match(/<h3/g) || []).length >= 3);
    contentCheck(c.id, 'infographic diagram present', !!(rc.diagramHtml || rc.infographicHtml));
    contentCheck(c.id, 'FAQ count >= 3', (rc.faqs || []).length >= 3, `${(rc.faqs || []).length}`);
    contentCheck(c.id, 'FAQ q+a non-empty', (rc.faqs || []).every(f => f.q && f.a && f.q.length > 10 && f.a.length > 40));
  }
  check(c.id, 'contextualGuide links to category hub', !!(c.contextualGuide && c.contextualGuide.html && c.contextualGuide.html.includes(c.categoryUrl)));
  const badLinks = ((c.contextualGuide || {}).suggestedLinks || []).filter(l => !allCalcs.find(x => x.id === l.id));
  check(c.id, 'suggestedLinks resolve to real calculators', badLinks.length === 0, badLinks.map(b => b.id).join(','));
}

// ==========================================================================
section('4. SITEMAP');
check('sitemap', `all ${allCalcs.length} calculator URLs present`,
  allCalcs.every(c => sitemapLocs.includes('https://calculatorbowl.com' + c.url)),
  allCalcs.filter(c => !sitemapLocs.includes('https://calculatorbowl.com' + c.url)).map(c => c.id).join(',') || 'ok');
check('sitemap', 'no duplicate <loc>', new Set(sitemapLocs).size === sitemapLocs.length);
check('sitemap', 'all locs on calculatorbowl.com', sitemapLocs.every(u => u.startsWith('https://calculatorbowl.com/')));
check('sitemap', 'no legacy /calc/ urls', !sitemapLocs.some(u => /calculatorbowl\.com\/calc\//.test(u)));
check('sitemap', 'no malformed urls (no spaces/double slash)',
  sitemapLocs.every(u => !/\s/.test(u) && !u.includes('//calculators') && (!u.includes('/calculators/') || u.endsWith('/'))),
  sitemapLocs.filter(u => /\s/.test(u) || u.includes('//calculators') || (u.includes('/calculators/') && !u.endsWith('/'))).join(',') || 'none');
check('sitemap', 'every pillar hub present', PILLARS.every(k => sitemapLocs.includes('https://calculatorbowl.com' + TOPICAL_CLUSTERS[k].url)));
const lastmods = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(m => m[1]);
const today = new Date().toISOString().split('T')[0];
check('sitemap', `lastmod all = today (${today})`, lastmods.every(d => d === today), [...new Set(lastmods)].join(','));

// ==========================================================================
section('5. LLMS.TXT');
check('llms', 'all calculator URLs listed',
  allCalcs.every(c => llms.includes('https://calculatorbowl.com' + c.url)),
  allCalcs.filter(c => !llms.includes('https://calculatorbowl.com' + c.url)).map(c => c.id).join(',') || 'ok');
check('llms', `count line matches registry (${allCalcs.length} precision tools / ${PILLARS.length} pillars)`,
  new RegExp(`${allCalcs.length} precision tools structured across ${PILLARS.length} topical pillars`).test(llms),
  (llms.match(/\d+ precision tools structured across \d+ topical pillars/) || ['missing'])[0]);
check('llms', 'every pillar section header present',
  PILLARS.every(k => llms.includes(TOPICAL_CLUSTERS[k].title)));
check('llms', 'no legacy /calc/ links', !/calculatorbowl\.com\/calc\//.test(llms));

// ==========================================================================
console.log('\n========================================================');
console.log(`PRE-DEPLOY SEO GATE: ${pass} passed, ${fail} failed, ${legacyWarnings.length} legacy warnings`);
console.log('========================================================');
if (legacyWarnings.length > 0) {
  console.log(`\nLEGACY CONTENT DEBT (non-blocking, ${legacyWarnings.length} items on pre-live pages):`);
  [...new Set(legacyWarnings.map(w => w.split(']')[0] + ']'))].forEach(w => console.log('  ⚠ ' + w.replace(/\] \[.*/, ']')));
}
if (fail > 0) {
  console.log('\nBLOCKERS (do not deploy until fixed):');
  failures.forEach(f => console.log('  ✗ ' + f));
  process.exit(1);
}
console.log('\n✅ All SEO layers clean — safe to deploy.');
process.exit(0);
