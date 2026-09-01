const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const cssContent = fs.readFileSync(path.join(rootDir, 'css', 'style.css'), 'utf8');

const jsFiles = [
  'js/app.js',
  ...fs.readdirSync(path.join(rootDir, 'js', 'calculators')).map(f => 'js/calculators/' + f)
];

const usedClasses = new Set();
for (const f of jsFiles) {
  const code = fs.readFileSync(path.join(rootDir, f), 'utf8');
  // Match class="..." or class='...' or classList.add(...)
  const matches = code.matchAll(/class=["']([^"']+)["']/g);
  for (const m of matches) {
    m[1].split(/\s+/).forEach(cls => {
      if (cls && !cls.includes('${') && !cls.includes('`')) usedClasses.add(cls);
    });
  }
}

console.log(`Total unique classes in JS: ${usedClasses.size}`);
const missingInCss = [];

for (const cls of usedClasses) {
  // Regex to look for .classname in CSS
  const regex = new RegExp('\\.' + cls.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '(?![a-zA-Z0-9_-])');
  if (!regex.test(cssContent)) {
    missingInCss.push(cls);
  }
}

console.log(`Missing classes in style.css (${missingInCss.length}):`);
console.log(missingInCss.sort().join('\n'));
