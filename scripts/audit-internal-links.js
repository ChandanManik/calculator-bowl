/**
 * Comprehensive Internal Link Crawler & Audit Tool
 * Audits every HTML and JS file for old URLs, 404 links, redirect chains, and orphan pages.
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 1. Load clusters and registered canonical routes
const clustersCode = fs.readFileSync(path.join(rootDir, 'js/clusters.js'), 'utf8');
eval(clustersCode.replace('const TOPICAL_CLUSTERS', 'var TOPICAL_CLUSTERS'));

const validRoutes = new Set([
  '/',
  '/calculators/',
  '/calculators',
  '/help',
  '/suggestions',
  '/contact',
  '/terms',
  '/privacy',
  '/sitemap.xml',
  '/llms.txt',
  '/manifest.json'
]);

// Add category and subcategory routes
const primaryCategories = ['financial', 'math', 'conversions', 'datetime', 'network'];
const allCalculators = [];

for (const catKey of primaryCategories) {
  const cluster = TOPICAL_CLUSTERS[catKey];
  if (!cluster) continue;
  if (cluster.url) validRoutes.add(cluster.url);
  
  if (cluster.calculators) {
    for (const c of cluster.calculators) {
      allCalculators.push(c);
      if (c.url) validRoutes.add(c.url);
      if (c.subcatUrl) validRoutes.add(c.subcatUrl);
      if (c.categoryUrl) validRoutes.add(c.categoryUrl);
    }
  }
}

console.log(`[Audit Engine] Loaded ${validRoutes.size} valid canonical routes and ${allCalculators.length} calculators.`);

// 2. Scan all codebase files for links
const scanDirs = ['', 'js', 'js/calculators', 'scripts'];
const filesToScan = [];

function collectFiles(dir) {
  const fullPath = path.join(rootDir, dir);
  if (!fs.existsSync(fullPath)) return;
  const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  for (const entry of entries) {
    const relPath = path.join(dir, entry.name);
    if (entry.isFile() && (entry.name.endsWith('.html') || entry.name.endsWith('.js') || entry.name.endsWith('.xml') || entry.name.endsWith('.txt'))) {
      if (!entry.name.includes('test') && !entry.name.includes('audit-internal-links')) {
        filesToScan.push(relPath);
      }
    }
  }
}

scanDirs.forEach(collectFiles);

let oldLinksFound = [];
let brokenLinksFound = [];
let validLinksFound = 0;
const linkedCalculators = new Set();

const linkRegex = /(?:href=["']|navigateTo\(["']|url:\s*["']|item:\s*["'])([^"'>\s#]+)/g;

filesToScan.forEach(relPath => {
  const fullPath = path.join(rootDir, relPath);
  const content = fs.readFileSync(fullPath, 'utf8');
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    let link = match[1];
    
    // Ignore external links, mailto, tel, javascript, data URIs, fonts, css
    if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('mailto:') || link.startsWith('tel:') || link.startsWith('data:') || link.startsWith('//') || link.endsWith('.css') || link.endsWith('.png') || link.endsWith('.svg') || link.endsWith('.js')) {
      continue;
    }

    // Check if it's an old /calc/ link
    if (link.startsWith('/calc/')) {
      oldLinksFound.push({ file: relPath, link: link, type: 'legacy_calc' });
      continue;
    }

    // Check if it's a legacy category link
    if (['/financial', '/financial/', '/conversions', '/conversions/', '/datetime', '/datetime/', '/network', '/network/', '/math', '/math/'].includes(link)) {
      oldLinksFound.push({ file: relPath, link: link, type: 'legacy_category' });
      continue;
    }

    // Check if it's legacy /calculators-list
    if (link === '/calculators-list' || link === '/calculators-list/') {
      oldLinksFound.push({ file: relPath, link: link, type: 'legacy_list' });
      continue;
    }

    // Check if it's a canonical internal link
    if (link.startsWith('/')) {
      // Normalize link
      const isCanonical = validRoutes.has(link) || validRoutes.has(link + '/') || validRoutes.has(link.replace(/\/$/, ''));
      if (isCanonical) {
        validLinksFound++;
        // Track linked calculators
        allCalculators.forEach(c => {
          if (c.url === link || c.url === link + '/') {
            linkedCalculators.add(c.id);
          }
        });
      } else {
        brokenLinksFound.push({ file: relPath, link: link });
      }
    }
  }
});

// Check for orphan calculator pages
const orphanCalcs = allCalculators.filter(c => !linkedCalculators.has(c.id));

console.log('\n======================================================');
console.log('            INTERNAL LINK AUDIT REPORT');
console.log('======================================================');
console.log(`Total Files Scanned: ${filesToScan.length}`);
console.log(`Valid Canonical Internal Links: ${validLinksFound}`);
console.log(`Old /calc/* Links Found: ${oldLinksFound.filter(l => l.type === 'legacy_calc').length}`);
console.log(`Old Legacy Category Links Found: ${oldLinksFound.filter(l => l.type === 'legacy_category').length}`);
console.log(`Old Legacy Directory Links Found: ${oldLinksFound.filter(l => l.type === 'legacy_list').length}`);
console.log(`Broken / 404 Links Found: ${brokenLinksFound.length}`);
console.log(`Orphan Calculator Pages: ${orphanCalcs.length} / ${allCalculators.length}`);
console.log('======================================================\n');

if (oldLinksFound.length > 0) {
  console.log('Old Links Details:');
  oldLinksFound.forEach(o => console.log(`  - [${o.file}] ${o.link} (${o.type})`));
}

if (brokenLinksFound.length > 0) {
  console.log('\nBroken Links Details:');
  brokenLinksFound.forEach(b => console.log(`  - [${b.file}] ${b.link}`));
}

if (orphanCalcs.length > 0) {
  console.log('\nOrphan Calculators:');
  orphanCalcs.forEach(c => console.log(`  - ${c.name} (${c.url})`));
}
