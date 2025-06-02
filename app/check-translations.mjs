import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultLang = "en.json"

const localesDir = path.join(__dirname, 'src', 'locales');
const defaultLangFile = path.join(localesDir, defaultLang);

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function compareTranslations(base, other) {
  const missing = [];
  const extra = [];

  for (const key in base) {
    if (!(key in other)) missing.push(key);
  }

  for (const key in other) {
    if (!(key in base)) extra.push(key);
  }

  return { missing, extra };
}

function getLastModified(filePath) {
  const stats = fs.statSync(filePath);
  return stats.mtime.toISOString();
}

function main() {
  const base = loadJson(defaultLangFile);
  console.log(`Comparing to ${defaultLang}`)

let hasIssues = false;

  fs.readdirSync(localesDir).forEach(file => {
    if (file.endsWith('.json') && file !== 'en.json') {
      const filePath = path.join(localesDir, file);
      const lang = loadJson(filePath);
      const { missing, extra } = compareTranslations(base, lang);
      const modified = getLastModified(filePath);

      console.log(`\n📁 ${file}`);
      console.log(`   Last Modified: ${modified}`);
      if (missing.length) console.log(`   ❌ Missing Keys: ${missing.join(', ')}`);
      if (extra.length) console.log(`   ⚠️ Extra Keys: ${extra.join(', ')}`);
      if (!missing.length && !extra.length) console.log(`   ✅ All keys match.`);

if (missing.length || extra.length) hasIssues = true;

    }
  });

if (hasIssues) process.exit(1);

}

main();
