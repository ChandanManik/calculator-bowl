const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// Load clusters
const clustersCode = fs.readFileSync(path.join(rootDir, 'js', 'clusters.js'), 'utf8');
let TOPICAL_CLUSTERS = null;
eval(clustersCode.replace('const TOPICAL_CLUSTERS', 'TOPICAL_CLUSTERS'));

// Load all calculator files to extract defined functions
const calcFiles = fs.readdirSync(path.join(rootDir, 'js', 'calculators'))
  .filter(f => f.endsWith('.js'));

const functionNames = new Set();

for (const f of calcFiles) {
  const content = fs.readFileSync(path.join(rootDir, 'js', 'calculators', f), 'utf8');
  const matches = content.matchAll(/function\s+([a-zA-Z0-9_$]+)\s*\(/g);
  for (const m of matches) {
    functionNames.add(m[1]);
  }
}

// Check app.js functions
const appCode = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');
const appMatches = appCode.matchAll(/function\s+([a-zA-Z0-9_$]+)\s*\(/g);
for (const m of appMatches) {
  functionNames.add(m[1]);
}

console.log(`\n🔍 Checking all 37 Calculators in TOPICAL_CLUSTERS:`);

const allCalcIds = new Set();
let issuesFound = 0;

for (const [clusterKey, cluster] of Object.entries(TOPICAL_CLUSTERS)) {
  for (const calc of cluster.calculators) {
    allCalcIds.add(calc.id);
  }
}

for (const [clusterKey, cluster] of Object.entries(TOPICAL_CLUSTERS)) {
  console.log(`\n📂 Cluster: ${cluster.title} (${cluster.calculators.length} calcs)`);
  for (const calc of cluster.calculators) {
    const fnName = calc.renderFunction;
    const hasFn = functionNames.has(fnName);
    
    if (!hasFn) {
      console.warn(`  ⚠️ Calc [${calc.id}]: renderFunction "${fnName}" not found in scanned files!`);
      issuesFound++;
    } else {
      console.log(`  ✅ Calc [${calc.id}]: "${calc.name}" -> ${fnName}()`);
    }

    // Check suggested links
    if (calc.contextualGuide && calc.contextualGuide.suggestedLinks) {
      for (const link of calc.contextualGuide.suggestedLinks) {
        if (!allCalcIds.has(link.id)) {
          console.warn(`    ⚠️ Broken internal link target: "${link.id}" in calc "${calc.id}"`);
          issuesFound++;
        }
      }
    }
  }
}

console.log(`\n========================================`);
console.log(`Total Calculators Audited: ${allCalcIds.size}`);
console.log(`Total Issues / Broken Targets: ${issuesFound}`);
console.log(`========================================\n`);
