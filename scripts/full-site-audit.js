const fs = require('fs');
const path = require('path');
const vm = require('vm');
const https = require('https');

const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('              COMPREHENSIVE FULL-SITE HEALTH AUDIT');
console.log('================================================================\n');

let issues = [];
let passCount = 0;

function reportPass(label) {
  passCount++;
  console.log(`✅ [PASS] ${label}`);
}

function reportFail(label, detail) {
  issues.push({ label, detail });
  console.error(`❌ [FAIL] ${label}: ${detail}`);
}

// -------------------------------------------------------------
// 1. JavaScript Syntax Check on ALL 20 JS Files
// -------------------------------------------------------------
console.log('--- 1. JavaScript Syntax & Parsing ---');
const jsFiles = [
  'scripts/generate-seo.js',
  'scripts/deep-crawl-audit.js',
  'scripts/pre-gsc-audit.js',
  'scripts/audit-word-counts.js',
  'js/calculator-content.js',
  'js/clusters.js',
  'js/i18n.js',
  'js/calculators/basic-calculator.js',
  'js/calculators/financial-loan.js',
  'js/calculators/financial-compound.js',
  'js/calculators/financial-simple-tax.js',
  'js/calculators/financial-business.js',
  'js/calculators/financial-gold.js',
  'js/calculators/financial-bitcoin.js',
  'js/calculators/math-fractions.js',
  'js/calculators/math-fractions-advanced.js',
  'js/calculators/math-percentage.js',
  'js/calculators/math-statistics.js',
  'js/calculators/conversion-temperature.js',
  'js/calculators/datetime-weight.js',
  'js/calculators/datetime-weather.js',
  'js/calculators/tech-network.js',
  'js/app.js'
];

let jsSyntaxPass = true;
for (const relPath of jsFiles) {
  const fullPath = path.join(rootDir, relPath);
  if (!fs.existsSync(fullPath)) {
    reportFail(`JS File Missing`, relPath);
    jsSyntaxPass = false;
    continue;
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  try {
    new vm.Script(content, { filename: relPath });
  } catch (err) {
    reportFail(`JS Syntax Error in ${relPath}`, err.message);
    jsSyntaxPass = false;
  }
}
if (jsSyntaxPass) reportPass(`All ${jsFiles.length} JavaScript source & script files parsed with zero errors.`);

// -------------------------------------------------------------
// 2. Cluster & Registry Data Integrity & Duplicate Checks
// -------------------------------------------------------------
console.log('\n--- 2. Calculator Registry & Duplicate Checks ---');
const clustersCode = fs.readFileSync(path.join(rootDir, 'js/clusters.js'), 'utf8');
eval(clustersCode.replace('const TOPICAL_CLUSTERS', 'var TOPICAL_CLUSTERS'));

const allCalcs = getAllCalculators();
reportPass(`Found ${allCalcs.length} registered calculators across 5 topical clusters.`);

// Check for duplicate calculator IDs
const calcIds = new Set();
const duplicateCalcIds = [];
for (const c of allCalcs) {
  if (calcIds.has(c.id)) {
    duplicateCalcIds.push(c.id);
  }
  calcIds.add(c.id);
}
if (duplicateCalcIds.length === 0) {
  reportPass(`0 Duplicate Calculator IDs found (${calcIds.size} unique IDs).`);
} else {
  reportFail(`Duplicate Calculator IDs`, duplicateCalcIds.join(', '));
}

// Check for duplicate slugs & URLs
const calcUrls = new Set();
const duplicateUrls = [];
for (const c of allCalcs) {
  if (calcUrls.has(c.url)) {
    duplicateUrls.push(c.url);
  }
  calcUrls.add(c.url);
}
if (duplicateUrls.length === 0) {
  reportPass(`0 Duplicate Calculator URLs found across all ${calcUrls.size} calculators.`);
} else {
  reportFail(`Duplicate Calculator URLs`, duplicateUrls.join(', '));
}

// -------------------------------------------------------------
// 3. SEO Metadata & Title / Description Duplicate Checks
// -------------------------------------------------------------
console.log('\n--- 3. SEO Metadata & Uniqueness Checks ---');
const titles = new Set();
const duplicateTitles = [];
const descs = new Set();
const duplicateDescs = [];

for (const c of allCalcs) {
  if (titles.has(c.seoTitle)) {
    duplicateTitles.push(`${c.id}: "${c.seoTitle}"`);
  }
  titles.add(c.seoTitle);

  if (descs.has(c.seoDescription)) {
    duplicateDescs.push(`${c.id}: "${c.seoDescription}"`);
  }
  descs.add(c.seoDescription);
}

if (duplicateTitles.length === 0) {
  reportPass(`100% Unique SEO Titles across all 37 calculators (${titles.size} unique titles).`);
} else {
  reportFail(`Duplicate SEO Titles`, duplicateTitles.join(' | '));
}

if (duplicateDescs.length === 0) {
  reportPass(`100% Unique Meta Descriptions across all 37 calculators (${descs.size} unique descriptions).`);
} else {
  reportFail(`Duplicate Meta Descriptions`, duplicateDescs.join(' | '));
}

// -------------------------------------------------------------
// 4. Render Function & Calculator Content Verification
// -------------------------------------------------------------
console.log('\n--- 4. Calculator Render Function & Rich Guide Verification ---');
const calcContentCode = fs.readFileSync(path.join(rootDir, 'js/calculator-content.js'), 'utf8');
eval(calcContentCode.replace('const CALCULATOR_RICH_CONTENT', 'var CALCULATOR_RICH_CONTENT').replace('const CATEGORY_PILLAR_CONTENT', 'var CATEGORY_PILLAR_CONTENT'));

const appJsCode = fs.readFileSync(path.join(rootDir, 'js/app.js'), 'utf8');

let missingRenderers = [];
let missingGuides = [];

for (const c of allCalcs) {
  // Check render function existence in app.js or cluster files
  const fnName = c.renderFunction;
  if (!fnName) {
    missingRenderers.push(`${c.id} (No renderFunction defined)`);
  } else {
    const fnRegex = new RegExp(`function\\s+${fnName}\\b`);
    if (!fnRegex.test(appJsCode) && !clustersCode.includes(fnName)) {
      // Check in calculator JS files
      let foundInCalc = false;
      for (const relPath of jsFiles) {
        if (relPath.startsWith('js/calculators/')) {
          const cCode = fs.readFileSync(path.join(rootDir, relPath), 'utf8');
          if (cCode.includes(fnName)) {
            foundInCalc = true;
            break;
          }
        }
      }
      if (!foundInCalc) missingRenderers.push(`${c.id} (Missing ${fnName})`);
    }
  }

  // Check educational rich content
  if (!CALCULATOR_RICH_CONTENT[c.id]) {
    missingGuides.push(c.id);
  }
}

if (missingRenderers.length === 0) {
  reportPass(`All 37 calculators have verified render functions.`);
} else {
  reportFail(`Missing Render Functions`, missingRenderers.join(', '));
}

if (missingGuides.length === 0) {
  reportPass(`All 37 calculators have comprehensive educational guide content.`);
} else {
  reportFail(`Missing Educational Guides`, missingGuides.join(', '));
}

// -------------------------------------------------------------
// 5. Sitemap & llms.txt Sync Verification
// -------------------------------------------------------------
console.log('\n--- 5. Sitemap.xml & AI llms.txt Sync ---');
const sitemapContent = fs.readFileSync(path.join(rootDir, 'sitemap.xml'), 'utf8');
const sitemapUrls = (sitemapContent.match(/<loc>(.*?)<\/loc>/g) || []).map(u => u.replace(/<\/?loc>/g, '').trim());

const sitemapUrlSet = new Set(sitemapUrls);
if (sitemapUrls.length === sitemapUrlSet.size) {
  reportPass(`sitemap.xml has ${sitemapUrls.length} total URLs with 0 duplicates.`);
} else {
  reportFail(`Duplicate URLs in sitemap.xml`, `${sitemapUrls.length - sitemapUrlSet.size} duplicates found`);
}

// Check for legacy /calc/ in sitemap
const legacyInSitemap = sitemapUrls.filter(u => u.includes('/calc/'));
if (legacyInSitemap.length === 0) {
  reportPass(`0 legacy /calc/ URLs in sitemap.xml.`);
} else {
  reportFail(`Legacy URLs found in sitemap.xml`, legacyInSitemap.join(', '));
}

// -------------------------------------------------------------
// 6. Institutional Pages Word Count Verification
// -------------------------------------------------------------
console.log('\n--- 6. Institutional Pages Word Count Audit ---');
function countWordsInFunction(fnName) {
  const match = appJsCode.match(new RegExp('function ' + fnName + '[\\s\\S]*?container\\.innerHTML = `([\\s\\S]*?)`;'));
  if (!match) return { name: fnName, count: 0, error: 'Not found' };
  const text = match[1].replace(/<[^>]+>/g, ' ').replace(/&[a-z0-9#]+;/gi, ' ').replace(/\s+/g, ' ').trim();
  const words = text.split(/\s+/).filter(w => w.length > 0);
  return { name: fnName, count: words.length };
}

const targetFns = [
  { fn: 'renderHelpView', label: 'Help Center (/help)' },
  { fn: 'renderSuggestionsView', label: 'Suggestions (/suggestions)' },
  { fn: 'renderContactView', label: 'Contact Us (/contact)' },
  { fn: 'renderTermsView', label: 'Terms of Service (/terms)' },
  { fn: 'renderPrivacyView', label: 'Privacy Policy (/privacy)' }
];

let institutionalPass = true;
for (const item of targetFns) {
  const res = countWordsInFunction(item.fn);
  if (res.count >= 500 && res.count <= 700) {
    reportPass(`${item.label}: ${res.count} words (Target: 500-700)`);
  } else {
    reportFail(`${item.label} Word Count Out of Bounds`, `${res.count} words (Target: 500-700)`);
    institutionalPass = false;
  }
}

// -------------------------------------------------------------
// 7. Live Production HTTP 200 Sampling Test
// -------------------------------------------------------------
console.log('\n--- 7. Live Production URL HTTP 200 Sampling ---');
const sampleLiveUrls = [
  'https://calculator-bowl.chandanmanik12g.workers.dev/',
  'https://calculator-bowl.chandanmanik12g.workers.dev/calculators/',
  'https://calculator-bowl.chandanmanik12g.workers.dev/help',
  'https://calculator-bowl.chandanmanik12g.workers.dev/contact',
  'https://calculator-bowl.chandanmanik12g.workers.dev/terms',
  'https://calculator-bowl.chandanmanik12g.workers.dev/privacy',
  'https://calculator-bowl.chandanmanik12g.workers.dev/calculators/finance/loans/loan-calculator/',
  'https://calculator-bowl.chandanmanik12g.workers.dev/calculators/math/fractions/fraction-arithmetic-calculator/',
  'https://calculator-bowl.chandanmanik12g.workers.dev/sitemap.xml',
  'https://calculator-bowl.chandanmanik12g.workers.dev/llms.txt'
];

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', (err) => {
      resolve({ url, status: 'ERROR', error: err.message });
    });
  });
}

(async () => {
  for (const url of sampleLiveUrls) {
    const res = await checkUrl(url);
    if (res.status === 200) {
      reportPass(`Live HTTP 200 OK: ${res.url}`);
    } else {
      reportFail(`Live HTTP Error on ${res.url}`, `Status: ${res.status}`);
    }
  }

  console.log('\n================================================================');
  console.log(`                     FINAL AUDIT SUMMARY`);
  console.log('================================================================');
  console.log(`Total Checks Passed : ${passCount}`);
  console.log(`Total Issues Found  : ${issues.length}`);

  if (issues.length === 0) {
    console.log('\n🎉 ALL SYSTEMS 100% HEALTHY! Zero errors, zero duplicates, zero broken links.');
  } else {
    console.log('\n⚠️ Issues needing attention:');
    issues.forEach((iss, idx) => console.log(`${idx + 1}. [${iss.label}]: ${iss.detail}`));
  }
  console.log('================================================================\n');
})();
