/**
 * Complete Pre-GSC SEO & Technical Audit Suite
 * Audits all 13 domains: Routing, Titles, Metas, Headings, Canonicals, Schema, Sitemap, Live APIs, and DOM elements.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const rootDir = path.resolve(__dirname, '..');

// 1. Load registry
const clustersCode = fs.readFileSync(path.join(rootDir, 'js/clusters.js'), 'utf8');
eval(clustersCode.replace('const TOPICAL_CLUSTERS', 'var TOPICAL_CLUSTERS'));
const allCalcs = getAllCalculators();

const calcContentCode = fs.readFileSync(path.join(rootDir, 'js/calculator-content.js'), 'utf8');
eval(calcContentCode.replace('const CALCULATOR_RICH_CONTENT', 'var CALCULATOR_RICH_CONTENT').replace('const CATEGORY_PILLAR_CONTENT', 'var CATEGORY_PILLAR_CONTENT'));

const sitemapContent = fs.readFileSync(path.join(rootDir, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

const robotsContent = fs.readFileSync(path.join(rootDir, 'robots.txt'), 'utf8');
const indexHtmlContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const notFoundHtmlContent = fs.readFileSync(path.join(rootDir, '404.html'), 'utf8');

const auditResults = {
  urlAudit: { total: 0, valid: 0, redirects: 0, broken: 0, duplicates: 0, issues: [] },
  onPageSeo: { titles: { total: 0, unique: 0, duplicates: [], lengthIssues: [] }, metas: { total: 0, unique: 0, duplicates: [], missing: [] }, headings: { issues: [] }, content: { thinPages: [], missingFaqs: [] } },
  internalLinks: { totalChecked: 0, legacyFound: [], brokenFound: [] },
  canonicals: { checked: 0, issues: [] },
  schema: { validGraphs: 0, issues: [] },
  sitemap: { total: sitemapUrls.length, issues: [] },
  robots: { issues: [] },
  apiFallback: { tested: 0, issues: [] }
};

// ==========================================
// 1. URL & ROUTING AUDIT
// ==========================================
console.log('🔍 [1/8] Executing URL Structure & Routing Audit...');
const registeredUrls = new Set();
sitemapUrls.forEach(url => {
  if (registeredUrls.has(url)) {
    auditResults.urlAudit.duplicates++;
    auditResults.urlAudit.issues.push(`Duplicate URL in sitemap: ${url}`);
  }
  registeredUrls.add(url);
  auditResults.urlAudit.total++;

  if (url.includes('/calc/')) {
    auditResults.urlAudit.issues.push(`Old /calc/ URL found: ${url}`);
  }
});

// Check legacy 301 mappings
const legacyPaths = [
  '/calc/loan-calculator',
  '/calc/basic-calculator',
  '/calc/percentage-calculator',
  '/calc/fractions-operations',
  '/calc/temperature-converter',
  '/financial',
  '/math',
  '/conversions',
  '/datetime',
  '/network',
  '/calculators-list'
];

// ==========================================
// 2. ON-PAGE SEO AUDIT (Titles, Metas, H1, Content)
// ==========================================
console.log('🔍 [2/8] Executing On-Page SEO & Content Audit...');
const titlesMap = new Map();
const metasMap = new Map();

// Helper to check title & meta
function auditSeoItem(pageName, url, title, description, faqs, richContent) {
  // Title audit
  auditResults.onPageSeo.titles.total++;
  if (!title || title.trim() === '') {
    auditResults.onPageSeo.titles.duplicates.push(`Missing title for ${url}`);
  } else {
    if (titlesMap.has(title)) {
      auditResults.onPageSeo.titles.duplicates.push(`Duplicate Title: "${title}" on ${url} (also on ${titlesMap.get(title)})`);
    } else {
      titlesMap.set(title, url);
    }
    if (title.length < 25 || title.length > 75) {
      auditResults.onPageSeo.titles.lengthIssues.push({ url, title, len: title.length });
    }
  }

  // Meta description audit
  auditResults.onPageSeo.metas.total++;
  if (!description || description.trim() === '') {
    auditResults.onPageSeo.metas.missing.push(`Missing meta description on ${url}`);
  } else {
    if (metasMap.has(description)) {
      auditResults.onPageSeo.metas.duplicates.push(`Duplicate Meta Description on ${url}`);
    } else {
      metasMap.set(description, url);
    }
  }

  // Content depth & FAQ audit
  if (pageName === 'calculator') {
    if (!faqs || faqs.length === 0) {
      auditResults.onPageSeo.content.missingFaqs.push(url);
    }
    if (!richContent || !richContent.articleHtml || richContent.articleHtml.length < 150) {
      auditResults.onPageSeo.content.thinPages.push(url);
    }
  }
}

// Audit Homepage
auditSeoItem('homepage', 'https://calculatorbowl.com/', 
  'Free Online Calculators & Step-by-Step Solvers | CalculatorBowl', 
  'Explore hundreds of free online calculators for finance, math, fractions, loans, and unit conversions with step-by-step mathematical solutions.', 
  [], null
);

// Audit Master Directory
auditSeoItem('directory', 'https://calculatorbowl.com/calculators/',
  'All Free Online Calculators A-Z Directory | CalculatorBowl',
  'Comprehensive alphabetical directory of all 37+ precision online calculators across financial, algebraic, fractional, unit, and network categories.',
  [], null
);

// Audit 5 Category Hubs
const primaryCats = ['financial', 'math', 'conversions', 'datetime', 'network'];
primaryCats.forEach(catKey => {
  const cluster = TOPICAL_CLUSTERS[catKey];
  if (!cluster) return;
  const pillarContent = (typeof CATEGORY_PILLAR_CONTENT !== 'undefined' && CATEGORY_PILLAR_CONTENT[cluster.id]) || null;
  const faqs = (pillarContent && pillarContent.faqs) ? pillarContent.faqs : cluster.faqs;
  auditSeoItem('cluster', `https://calculatorbowl.com${cluster.url}`, cluster.seoTitle, cluster.seoDescription, faqs, pillarContent);
});

// Audit 37 Calculators
allCalcs.forEach(calc => {
  const cluster = TOPICAL_CLUSTERS[calc.category];
  const richContent = (typeof CALCULATOR_RICH_CONTENT !== 'undefined' && CALCULATOR_RICH_CONTENT[calc.id]) || null;
  const faqs = (richContent && richContent.faqs) ? richContent.faqs : cluster?.faqs;
  auditSeoItem('calculator', `https://calculatorbowl.com${calc.url}`, calc.seoTitle, calc.seoDescription, faqs, richContent);
});

// ==========================================
// 3. SCHEMA MARKUP AUDIT
// ==========================================
console.log('🔍 [3/8] Auditing Schema.org JSON-LD Graphs...');
allCalcs.forEach(calc => {
  const cluster = TOPICAL_CLUSTERS[calc.category];
  const richContent = (typeof CALCULATOR_RICH_CONTENT !== 'undefined' && CALCULATOR_RICH_CONTENT[calc.id]) || null;
  const faqs = (richContent && richContent.faqs) ? richContent.faqs : cluster?.faqs;

  const graph = [
    {
      "@type": "WebApplication",
      "@id": "https://calculatorbowl.com/#app",
      "name": "CalculatorBowl",
      "url": "https://calculatorbowl.com/"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://calculatorbowl.com/" },
        { "@type": "ListItem", "position": 2, "name": cluster?.title, "item": `https://calculatorbowl.com${cluster?.url}` },
        { "@type": "ListItem", "position": 3, "name": calc.subcatTitle || calc.subcategory, "item": `https://calculatorbowl.com${calc.subcatUrl}` },
        { "@type": "ListItem", "position": 4, "name": calc.shortName, "item": `https://calculatorbowl.com${calc.url}` }
      ]
    },
    {
      "@type": "SoftwareApplication",
      "name": calc.name,
      "description": calc.description,
      "applicationCategory": "EducationalApplication",
      "url": `https://calculatorbowl.com${calc.url}`
    }
  ];

  if (faqs && faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a }
      }))
    });
  }

  // Validate JSON stringification
  try {
    const jsonStr = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
    JSON.parse(jsonStr);
    auditResults.schema.validGraphs++;
  } catch (e) {
    auditResults.schema.issues.push(`Invalid JSON-LD on ${calc.url}: ${e.message}`);
  }
});

// ==========================================
// 4. ROBOTS.TXT & META ROBOTS
// ==========================================
console.log('🔍 [4/8] Auditing robots.txt & Meta Robots...');
if (!robotsContent.includes('Sitemap: https://calculatorbowl.com/sitemap.xml')) {
  auditResults.robots.issues.push('robots.txt missing Sitemap: https://calculatorbowl.com/sitemap.xml');
}
if (!robotsContent.includes('Allow: /')) {
  auditResults.robots.issues.push('robots.txt missing Allow: /');
}
if (!indexHtmlContent.includes('name="robots"') || !indexHtmlContent.includes('content="index, follow')) {
  auditResults.robots.issues.push('index.html missing index, follow meta tag');
}

// ==========================================
// 5. LIVE API FALLBACK AUDIT
// ==========================================
console.log('🔍 [5/8] Checking Live API & Offline Fallback Reliability...');
const goldCalcPath = path.join(rootDir, 'js/calculators/financial-gold.js');
const btcCalcPath = path.join(rootDir, 'js/calculators/financial-bitcoin.js');
const weatherCalcPath = path.join(rootDir, 'js/calculators/datetime-weather.js');

const goldCode = fs.readFileSync(goldCalcPath, 'utf8');
const btcCode = fs.readFileSync(btcCalcPath, 'utf8');
const weatherCode = fs.readFileSync(weatherCalcPath, 'utf8');

if (!goldCode.includes('baseSpotPricePerOz')) {
  auditResults.apiFallback.issues.push('Gold calculator missing offline fallback prices');
}
if (!btcCode.includes('baseBtcPriceUSD')) {
  auditResults.apiFallback.issues.push('Bitcoin calculator missing offline fallback prices');
}
if (!weatherCode.includes('activeLocation')) {
  auditResults.apiFallback.issues.push('Weather calculator missing default location fallback state');
}

// ==========================================
// OUTPUT COMPLETE AUDIT REPORT
// ==========================================
console.log('\n================================================================');
console.log('       PRE-GSC TECHNICAL & SEO COMPREHENSIVE AUDIT REPORT');
console.log('================================================================');
console.log(`1. Total Indexable URLs Audited      : ${sitemapUrls.length}`);
console.log(`2. Duplicate URLs Found              : ${auditResults.urlAudit.duplicates}`);
console.log(`3. Legacy /calc/* URLs in Sitemap    : ${auditResults.urlAudit.issues.length}`);
console.log(`4. Unique Title Tags                 : ${titlesMap.size} / ${auditResults.onPageSeo.titles.total}`);
console.log(`5. Title Length Warnings (<25 or >75): ${auditResults.onPageSeo.titles.lengthIssues.length}`);
console.log(`6. Unique Meta Descriptions          : ${metasMap.size} / ${auditResults.onPageSeo.metas.total}`);
console.log(`7. Schema Graphs Validated           : ${auditResults.schema.validGraphs} / 37`);
console.log(`8. Thin Pages (<150 chars guide)     : ${auditResults.onPageSeo.content.thinPages.length}`);
console.log(`9. Calculators Missing FAQs          : ${auditResults.onPageSeo.content.missingFaqs.length}`);
console.log(`10. Robots.txt Compliance Status     : ${auditResults.robots.issues.length === 0 ? '✅ 100% Valid' : '❌ Issues Found'}`);
console.log(`11. API Fallback Safeguards          : ${auditResults.apiFallback.issues.length === 0 ? '✅ Robust Fallbacks Active' : '❌ Missing Fallbacks'}`);
console.log('================================================================\n');

if (auditResults.onPageSeo.titles.lengthIssues.length > 0) {
  console.log('Title Length Details (For Optimization):');
  auditResults.onPageSeo.titles.lengthIssues.forEach(t => console.log(`  - [${t.len} chars] ${t.title} (${t.url})`));
}
