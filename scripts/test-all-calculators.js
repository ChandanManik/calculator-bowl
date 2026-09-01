const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');

console.log('=== STEP 1: Checking JS Syntax for All Files ===');
const jsFiles = [
  'scripts/generate-seo.js',
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

let syntaxErrors = 0;
for (const relPath of jsFiles) {
  const fullPath = path.join(rootDir, relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ File not found: ${relPath}`);
    syntaxErrors++;
    continue;
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  try {
    new vm.Script(content, { filename: relPath });
    console.log(`✅ OK: ${relPath}`);
  } catch (err) {
    console.error(`❌ Syntax Error in ${relPath}:`, err.message);
    syntaxErrors++;
  }
}

console.log(`\n=== STEP 2: Running generate-seo.js test ===`);
try {
  require('./generate-seo.js');
} catch (e) {
  console.error(`❌ generate-seo.js failed:`, e);
}

console.log(`\n=== STEP 3: Verifying Clusters & Calculator Content ===`);
// Setup a mock browser window / DOM context
const sandbox = {
  window: {},
  document: {
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    createElement: (tag) => ({ style: {}, setAttribute: () => {}, appendChild: () => {} })
  },
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  location: { hash: '#/' },
  navigator: { language: 'en-US', userAgent: 'node-test' }
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;

const context = vm.createContext(sandbox);

// Load files in order as in index.html
const loadOrder = [
  'js/calculator-content.js',
  'js/clusters.js',
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
  'js/i18n.js'
];

for (const relPath of loadOrder) {
  const fullPath = path.join(rootDir, relPath);
  const code = fs.readFileSync(fullPath, 'utf8');
  try {
    vm.runInContext(code, context, { filename: relPath });
  } catch (err) {
    console.error(`❌ Runtime error loading ${relPath}:`, err.message);
  }
}

const clusters = sandbox.TOPICAL_CLUSTERS || {};
const contentData = sandbox.CALCULATOR_CONTENT || {};
console.log(`Found ${Object.keys(clusters).length} clusters.`);

let missingCalculators = [];
let totalCalculators = 0;

for (const [clusterKey, cluster] of Object.entries(clusters)) {
  console.log(`\nCluster: [${cluster.id}] ${cluster.title} (${cluster.calculators.length} calcs)`);
  for (const calc of cluster.calculators) {
    totalCalculators++;
    // Check if calc has content in calculator-content.js or a specialized renderer
    const hasContent = !!contentData[calc.id];
    // Check if there is an init or render function
    const hasSpecialRenderer = typeof sandbox[calc.id] === 'function' || 
      typeof sandbox[`render_${calc.id.replace(/-/g, '_')}`] === 'function';
    
    // Check if clusters have required properties
    if (!calc.id || !calc.name || !calc.description) {
      console.error(`❌ Calc missing metadata:`, calc);
    }
  }
}
console.log(`\nTotal verified calculators: ${totalCalculators}`);
