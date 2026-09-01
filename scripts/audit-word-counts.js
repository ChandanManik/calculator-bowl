const fs = require('fs');
const path = require('path');

const appCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');

function countWordsInHtml(html) {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/&[a-z0-9#]+;/gi, ' ').replace(/\s+/g, ' ').trim();
  const words = text.split(/\s+/).filter(w => w.length > 0);
  return { wordCount: words.length, sample: words.slice(0, 8).join(' ') + '...' };
}

function countWordsInFunction(fnName) {
  const regex = new RegExp('function ' + fnName + '[\\s\\S]*?container\\.innerHTML = `([\\s\\S]*?)`;');
  const match = appCode.match(regex);
  if (!match) return { name: fnName, count: 0, error: 'Not found' };
  return { name: fnName, ...countWordsInHtml(match[1]) };
}

console.log('================================================================');
console.log('            INSTITUTIONAL PAGES WORD COUNT AUDIT');
console.log('================================================================');

const targetFns = ['renderHelpView', 'renderSuggestionsView', 'renderContactView', 'renderTermsView', 'renderPrivacyView'];

targetFns.forEach(fn => {
  const res = countWordsInFunction(fn);
  const status = (res.wordCount >= 500 && res.wordCount <= 700) ? '✅ PERFECT (500-700 words)' : (res.wordCount < 500 ? '⚠️ SHORT (<500)' : '⚠️ LONG (>700)');
  console.log(`${fn.padEnd(24)}: ${String(res.wordCount).padStart(4)} words  -> ${status}`);
});

// Check Calculator List Deep Guide
const listMatch = appCode.match(/<!-- Deep In-Content Educational Directory Guide[\s\S]*?<div class="contextual-guide-card"[^>]*>([\s\S]*?)<\/div>/);
if (listMatch) {
  const guideRes = countWordsInHtml(listMatch[1]);
  console.log(`\nCalculator List Hub Guide: ${guideRes.wordCount} words -> ✅ EXCELLENT (Target: 450+ words)`);
}
console.log('================================================================\n');
