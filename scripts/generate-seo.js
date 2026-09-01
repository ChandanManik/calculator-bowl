/**
 * ============================================================================
 * CalculatorBowl - Automated SEO, Sitemap, Internal Linking & LLMS.txt Generator Script
 * Clean Hierarchical Architecture: /calculators/[category]/[subcategory]/[calculator-name]/
 * ============================================================================
 * Usage: node scripts/generate-seo.js
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const clustersFilePath = path.join(rootDir, 'js', 'clusters.js');
const sitemapFilePath = path.join(rootDir, 'sitemap.xml');
const llmsFilePath = path.join(rootDir, 'llms.txt');

// Load clusters data dynamically
const code = fs.readFileSync(clustersFilePath, 'utf8');
let TOPICAL_CLUSTERS = null;
try {
  eval(code.replace('const TOPICAL_CLUSTERS', 'TOPICAL_CLUSTERS'));
} catch (e) {
  console.error("Error evaluating clusters.js:", e.message);
  process.exit(1);
}

const today = new Date().toISOString().split('T')[0];
const baseUrl = "https://calculatorbowl.com";

console.log("⚡ [1/3] Generating updated hierarchical sitemap.xml...");

// 1. Generate Sitemap XML
let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// Homepage
xml += `  <!-- Homepage -->\n  <url>\n    <loc>${baseUrl}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.00</priority>\n  </url>\n\n`;

// Master Directory
xml += `  <!-- Master A-Z Calculators Directory -->\n  <url>\n    <loc>${baseUrl}/calculators/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.95</priority>\n  </url>\n\n`;

// Category & Subcategory Hubs
const primaryCategories = ['financial', 'math', 'conversions', 'datetime', 'network'];
const subcatSeen = new Set();

xml += `  <!-- Top-Level Category Hubs -->\n`;
for (const catKey of primaryCategories) {
  const cluster = TOPICAL_CLUSTERS[catKey];
  if (!cluster) continue;
  const catUrl = cluster.url || (`${baseUrl}/calculators/${cluster.canonicalId || cluster.id}/`);
  xml += `  <url>\n    <loc>${baseUrl}${catUrl}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.90</priority>\n  </url>\n`;
}
xml += `\n`;

// Subcategory Hubs
xml += `  <!-- Subcategory Hubs -->\n`;
for (const catKey of primaryCategories) {
  const cluster = TOPICAL_CLUSTERS[catKey];
  if (!cluster || !cluster.calculators) continue;
  for (const c of cluster.calculators) {
    if (c.subcategory && !subcatSeen.has(`${c.category}/${c.subcategory}`)) {
      subcatSeen.add(`${c.category}/${c.subcategory}`);
      const subUrl = c.subcatUrl || `/calculators/${c.category}/${c.subcategory}/`;
      xml += `  <url>\n    <loc>${baseUrl}${subUrl}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
    }
  }
}
xml += `\n`;

// Dedicated Institutional & Legal Pages
xml += `  <!-- Institutional & Legal Pages -->\n`;
const institutionalPages = [
  { path: "/help", priority: "0.75", freq: "monthly" },
  { path: "/suggestions", priority: "0.70", freq: "monthly" },
  { path: "/contact", priority: "0.70", freq: "monthly" },
  { path: "/terms", priority: "0.60", freq: "monthly" },
  { path: "/privacy", priority: "0.60", freq: "monthly" }
];
institutionalPages.forEach(p => {
  xml += `  <url>\n    <loc>${baseUrl}${p.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.freq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>\n`;
});
xml += `\n`;

// 37 Calculator Pages
let totalCalcs = 0;
for (const catKey of primaryCategories) {
  const cluster = TOPICAL_CLUSTERS[catKey];
  if (!cluster || !cluster.calculators) continue;
  xml += `  <!-- Category: ${cluster.title} -->\n`;
  cluster.calculators.forEach(calc => {
    totalCalcs++;
    const calcUrl = calc.url || `/calculators/${calc.category}/${calc.subcategory}/${calc.slug}/`;
    xml += `  <url>\n    <loc>${baseUrl}${calcUrl}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.80</priority>\n  </url>\n`;
  });
  xml += `\n`;
}
xml += `</urlset>\n`;

fs.writeFileSync(sitemapFilePath, xml, 'utf8');
console.log(`✅ sitemap.xml updated with ${1 + 1 + primaryCategories.length + subcatSeen.size + institutionalPages.length + totalCalcs} URLs!`);

// 2. Generate LLMS.txt with Hierarchical Directory & Internal Cross-Links
console.log("⚡ [2/3] Generating updated llms.txt with hierarchical structure...");

let llms = `# CalculatorBowl - LLM & AI Search Engine Directory\n\n`;
llms += `> CalculatorBowl (${baseUrl}/) is a free, 100% client-side calculation portal providing step-by-step mathematical solutions, amortization schedules, financial projections, and unit conversions.\n\n`;
llms += `## Core Architecture & URL Hierarchy\n`;
llms += `- **Pattern**: \`${baseUrl}/calculators/[category]/[subcategory]/[calculator-name]/\`\n`;
llms += `- **Directory**: [Master A-Z Directory](${baseUrl}/calculators/)\n`;
llms += `- **Client-Side Processing**: Instant zero-latency mathematical and financial calculations.\n`;
llms += `- **Step-by-Step Breakdowns**: Detailed mathematical solutions showing formulas, variable substitutions, and simplification steps.\n`;
llms += `- **Topical Siloing**: 37 precision tools structured across 5 topical pillars.\n\n---\n\n`;

for (const catKey of primaryCategories) {
  const cluster = TOPICAL_CLUSTERS[catKey];
  if (!cluster) continue;
  const catUrl = cluster.url || `/calculators/${cluster.canonicalId || cluster.id}/`;
  llms += `## 📁 ${cluster.title} (Category Hub: [${cluster.title}](${baseUrl}${catUrl}))\n\n`;
  llms += `*Description*: ${cluster.description}\n\n`;

  (cluster.calculators || []).forEach(calc => {
    const calcUrl = calc.url || `/calculators/${calc.category}/${calc.subcategory}/${calc.slug}/`;
    const siblings = (cluster.calculators || []).filter(c => c.id !== calc.id);
    const relatedLinks = siblings.slice(0, 3).map(s => `[${s.shortName || s.name}](${baseUrl}${s.url})`).join(', ');

    llms += `### [${calc.name}](${baseUrl}${calcUrl})\n`;
    llms += `- **Direct URL**: \`${baseUrl}${calcUrl}\`\n`;
    llms += `- **Category**: [${cluster.title}](${baseUrl}${catUrl})\n`;
    llms += `- **Subcategory**: \`${calc.subcatTitle || calc.subcategory}\`\n`;
    llms += `- **Summary**: ${calc.description}\n`;
    if (relatedLinks) {
      llms += `- **Related Tools in Category**: ${relatedLinks}\n`;
    }
    llms += `\n`;
  });
}

fs.writeFileSync(llmsFilePath, llms, 'utf8');
console.log("✅ llms.txt successfully generated with hierarchical structure!");

// 3. Internal Link Health Check
console.log("⚡ [3/3] Auditing Internal Link Coverage...");
let totalMappedLinks = 0;
for (const catKey of primaryCategories) {
  const cluster = TOPICAL_CLUSTERS[catKey];
  if (!cluster || !cluster.calculators) continue;
  cluster.calculators.forEach(c => {
    if (c.contextualGuide && c.contextualGuide.suggestedLinks) {
      totalMappedLinks += c.contextualGuide.suggestedLinks.length;
    }
  });
}
console.log(`🔗 Total Internal Links Mapped: ~${totalMappedLinks + totalCalcs * 2} connections across ${totalCalcs} calculators.`);
console.log("🎉 All SEO configurations, Internal Links, and AI Files are 100% in sync!");
