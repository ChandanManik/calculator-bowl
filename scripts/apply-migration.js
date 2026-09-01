const fs = require('fs');
const path = require('path');
const { URL_MAP, CATEGORY_MAP } = require('./migrate-to-new-urls.js');

const rootDir = path.resolve(__dirname, '..');

function upgradeLinksInContent(code) {
  let updated = code;
  // Replace /calc/[oldId]
  for (const [oldId, meta] of Object.entries(URL_MAP)) {
    const newUrl = `/calculators/${meta.category}/${meta.subcategory}/${meta.slug}/`;
    updated = updated.split(`/calc/${oldId}`).join(newUrl);
  }

  // Replace category pillar links
  const catReplacements = [
    { from: '/financial', to: '/calculators/finance/' },
    { from: '/math', to: '/calculators/math/' },
    { from: '/conversions', to: '/calculators/conversion/' },
    { from: '/datetime', to: '/calculators/date-time/' },
    { from: '/network', to: '/calculators/tech-network/' }
  ];

  for (const r of catReplacements) {
    updated = updated.split(`"${r.from}"`).join(`"${r.to}"`);
    updated = updated.split(`'${r.from}'`).join(`'${r.to}'`);
    updated = updated.split(`href="${r.from}"`).join(`href="${r.to}"`);
    updated = updated.split(`href='${r.from}'`).join(`href='${r.to}'`);
    updated = updated.split(`\`${r.from}\``).join(`\`${r.to}\``);
  }

  return updated;
}

// 1. Update js/calculator-content.js
const calcContentPath = path.join(rootDir, 'js/calculator-content.js');
let calcContent = fs.readFileSync(calcContentPath, 'utf8');
calcContent = upgradeLinksInContent(calcContent);
fs.writeFileSync(calcContentPath, calcContent, 'utf8');
console.log('✅ js/calculator-content.js links updated!');

// 2. Update individual calculator files
const calcsDir = path.join(rootDir, 'js/calculators');
const calcFiles = fs.readdirSync(calcsDir);
for (const file of calcFiles) {
  if (file.endsWith('.js')) {
    const filePath = path.join(calcsDir, file);
    let code = fs.readFileSync(filePath, 'utf8');
    code = upgradeLinksInContent(code);
    fs.writeFileSync(filePath, code, 'utf8');
  }
}
console.log('✅ js/calculators/*.js links updated!');
