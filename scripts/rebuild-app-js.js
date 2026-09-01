const fs = require('fs');
const path = require('path');
const { URL_MAP, CATEGORY_MAP } = require('./migrate-to-new-urls.js');

const rootDir = path.resolve(__dirname, '..');
const appJsPath = path.join(rootDir, 'js/app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// Replace legacy URLs throughout app.js
for (const [oldId, meta] of Object.entries(URL_MAP)) {
  const newUrl = `/calculators/${meta.category}/${meta.subcategory}/${meta.slug}/`;
  appJs = appJs.split(`/calc/${oldId}`).join(newUrl);
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
  appJs = appJs.split(`"${r.from}"`).join(`"${r.to}"`);
  appJs = appJs.split(`'${r.from}'`).join(`'${r.to}'`);
  appJs = appJs.split(`href="${r.from}"`).join(`href="${r.to}"`);
  appJs = appJs.split(`href='${r.from}'`).join(`href='${r.to}'`);
  appJs = appJs.split(`\`${r.from}\``).join(`\`${r.to}\``);
}

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✅ js/app.js initial replacement completed.');
