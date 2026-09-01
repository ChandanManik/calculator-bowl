/**
 * Script to rewrite js/clusters.js with complete URL architecture and helper functions
 */
const fs = require('fs');
const path = require('path');
const { URL_MAP, CATEGORY_MAP } = require('./migrate-to-new-urls.js');

const rootDir = path.resolve(__dirname, '..');
const clustersPath = path.join(rootDir, 'js/clusters.js');

// Read raw file and clean legacy links first
let code = fs.readFileSync(clustersPath, 'utf8');

// Replace /calc/[oldId]
for (const [oldId, meta] of Object.entries(URL_MAP)) {
  const newUrl = `/calculators/${meta.category}/${meta.subcategory}/${meta.slug}/`;
  code = code.split(`/calc/${oldId}`).join(newUrl);
}

// Replace legacy category links
const catReplacements = [
  { from: '/financial', to: '/calculators/finance/' },
  { from: '/math', to: '/calculators/math/' },
  { from: '/conversions', to: '/calculators/conversion/' },
  { from: '/datetime', to: '/calculators/date-time/' },
  { from: '/network', to: '/calculators/tech-network/' }
];

for (const r of catReplacements) {
  code = code.split(`"${r.from}"`).join(`"${r.to}"`);
  code = code.split(`'${r.from}'`).join(`'${r.to}'`);
  code = code.split(`href="${r.from}"`).join(`href="${r.to}"`);
  code = code.split(`href='${r.from}'`).join(`href='${r.to}'`);
  code = code.split(`\`${r.from}\``).join(`\`${r.to}\``);
}

// Evaluate in sandbox
let evalCode = code.replace(/const TOPICAL_CLUSTERS/g, 'var TOPICAL_CLUSTERS');
eval(evalCode);

const clusters = TOPICAL_CLUSTERS;

// Inject taxonomy properties into each calculator
for (const [clusterKey, cluster] of Object.entries(clusters)) {
  const catKey = clusterKey === 'financial' ? 'finance' : 
                 clusterKey === 'conversions' ? 'conversion' :
                 clusterKey === 'datetime' ? 'date-time' :
                 clusterKey === 'network' ? 'tech-network' : clusterKey;

  cluster.canonicalId = catKey;
  cluster.url = `/calculators/${catKey}/`;

  for (const c of cluster.calculators) {
    const meta = URL_MAP[c.id];
    if (meta) {
      c.category = meta.category;
      c.subcategory = meta.subcategory;
      c.subcatTitle = meta.subcatTitle;
      c.slug = meta.slug;
      c.url = `/calculators/${meta.category}/${meta.subcategory}/${meta.slug}/`;
      c.subcatUrl = `/calculators/${meta.category}/${meta.subcategory}/`;
      c.categoryUrl = `/calculators/${meta.category}/`;
    }
  }
}

// Generate the output JS file
const fileHeader = `/**
 * ============================================================================
 * Topical Cluster & Calculator Registry — Scalable Hierarchical Architecture
 * Clean SEO Architecture: /calculators/[category]/[subcategory]/[calculator-name]/
 * 37 Precision Online Calculators Across 5 Topical Categories
 * ============================================================================
 */

const TOPICAL_CLUSTERS = ${JSON.stringify(clusters, null, 2)};

// Aliases for backwards compatibility
TOPICAL_CLUSTERS['finance'] = TOPICAL_CLUSTERS.financial;
TOPICAL_CLUSTERS['conversion'] = TOPICAL_CLUSTERS.conversions;
TOPICAL_CLUSTERS['date-time'] = TOPICAL_CLUSTERS.datetime;
TOPICAL_CLUSTERS['tech-network'] = TOPICAL_CLUSTERS.network;

/**
 * Global Category & URL Metadata Lookup Helpers
 */
const URL_TO_CALC_MAP = {};
const LEGACY_ID_MAP = {};
const SLUG_MAP = {};

// Build instant O(1) fast lookup index
(function buildIndex() {
  for (const clusterKey of ['financial', 'math', 'conversions', 'datetime', 'network']) {
    const cluster = TOPICAL_CLUSTERS[clusterKey];
    if (!cluster || !cluster.calculators) continue;
    for (const c of cluster.calculators) {
      if (c.url) {
        URL_TO_CALC_MAP[c.url.toLowerCase()] = c;
        // Also map without trailing slash
        URL_TO_CALC_MAP[c.url.replace(/\\/+$/, '').toLowerCase()] = c;
      }
      if (c.id) {
        LEGACY_ID_MAP[c.id.toLowerCase()] = c;
      }
      if (c.slug) {
        SLUG_MAP[c.slug.toLowerCase()] = c;
      }
    }
  }
})();

function getAllCalculators() {
  const all = [];
  for (const clusterKey of ['financial', 'math', 'conversions', 'datetime', 'network']) {
    const cluster = TOPICAL_CLUSTERS[clusterKey];
    if (cluster && cluster.calculators) {
      cluster.calculators.forEach(c => {
        all.push({
          ...c,
          clusterId: cluster.id,
          clusterTitle: cluster.title,
          clusterColor: cluster.colorClass,
          categoryUrl: cluster.url || ('/calculators/' + cluster.id + '/')
        });
      });
    }
  }
  return all;
}

function getCalculatorById(idOrSlugOrUrl) {
  if (!idOrSlugOrUrl) return null;
  const key = idOrSlugOrUrl.toLowerCase().trim();
  
  // 1. Direct URL match
  if (URL_TO_CALC_MAP[key]) return URL_TO_CALC_MAP[key];
  if (URL_TO_CALC_MAP['/calculators/' + key + '/']) return URL_TO_CALC_MAP['/calculators/' + key + '/'];
  
  // 2. Slug match
  if (SLUG_MAP[key]) return SLUG_MAP[key];

  // 3. Legacy ID match
  if (LEGACY_ID_MAP[key]) return LEGACY_ID_MAP[key];

  // 4. Fallback search
  const all = getAllCalculators();
  return all.find(c => c.id === key || c.slug === key || (c.url && c.url.includes('/' + key + '/'))) || null;
}

function getCalculatorByPath(category, subcategory, slug) {
  if (!category || !subcategory || !slug) return null;
  const targetUrl = ('/calculators/' + category + '/' + subcategory + '/' + slug + '/').toLowerCase();
  if (URL_TO_CALC_MAP[targetUrl]) return URL_TO_CALC_MAP[targetUrl];
  
  // Try clean lookup
  const all = getAllCalculators();
  return all.find(c => 
    c.category === category && 
    c.subcategory === subcategory && 
    (c.slug === slug || c.id === slug)
  ) || null;
}

function getRelatedCalculators(clusterId, currentId) {
  const cluster = TOPICAL_CLUSTERS[clusterId];
  if (!cluster || !cluster.calculators) return [];
  return cluster.calculators.filter(c => c.id !== currentId && c.slug !== currentId);
}

function getClusterById(clusterId) {
  if (!clusterId) return null;
  const key = clusterId.toLowerCase().trim();
  return TOPICAL_CLUSTERS[key] || null;
}
`;

fs.writeFileSync(clustersPath, fileHeader, 'utf8');
console.log('✅ js/clusters.js successfully rebuilt with complete URL architecture!');
