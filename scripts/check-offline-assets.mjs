import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const publicQuran = path.join(root, 'public', 'quran');
const required = [
  'index.html',
  'renderer/app.js',
  'renderer/style.css',
  'data/quran.json',
  'data/hadith.json',
  'locales/ar.ini',
  'locales/en.ini',
  'translations/en.json',
  'fonts/myfont.ttf',
  'fonts/AmiriQuran.ttf',
  'audio/links.json',
];

let failed = false;
for (const rel of required) {
  const file = path.join(publicQuran, rel);
  if (!fs.existsSync(file)) {
    failed = true;
    console.error(`MISSING ${rel}`);
  } else {
    const size = fs.statSync(file).size;
    if (size === 0) {
      failed = true;
      console.error(`EMPTY ${rel}`);
    } else {
      console.log(`OK ${rel} (${size} bytes)`);
    }
  }
}

const quran = JSON.parse(fs.readFileSync(path.join(publicQuran, 'data/quran.json'), 'utf8'));
const verseCount = Object.values(quran).reduce((sum, rows) => sum + (Array.isArray(rows) ? rows.length : 0), 0);
if (Object.keys(quran).length !== 114 || verseCount !== 6236) {
  failed = true;
  console.error(`QURAN COUNT MISMATCH chapters=${Object.keys(quran).length} verses=${verseCount}`);
} else {
  console.log(`OK Quran 114 chapters / 6236 verses`);
}

for (const language of ['bn', 'en', 'es', 'fr', 'id', 'ru', 'sv', 'tr', 'ur', 'zh']) {
  const file = path.join(publicQuran, 'translations', `${language}.json`);
  if (!fs.existsSync(file)) {
    failed = true;
    console.error(`MISSING translation ${language}`);
    continue;
  }
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const count = Object.values(data).reduce((sum, rows) => sum + (Array.isArray(rows) ? rows.length : 0), 0);
  if (count !== 6236) {
    failed = true;
    console.error(`TRANSLATION COUNT MISMATCH ${language}: ${count}`);
  } else {
    console.log(`OK translation ${language}: 6236 verses`);
  }
}

const external = fs.readFileSync(path.join(publicQuran, 'renderer/app.js'), 'utf8').match(/https?:\/\/[^'"` ]+/g) ?? [];
const allowedRuntimeHosts = [
  'fonts.googleapis.com',
  'api.alquran.cloud',
  'api.aladhan.com',
  'mp3quran.net',
  'cdn.islamic.network',
];
const unexpectedExternal = external.filter((url) => {
  try { return !allowedRuntimeHosts.some((host) => new URL(url).hostname === host || new URL(url).hostname.endsWith(`.${host}`)); }
  catch { return true; }
});
if (unexpectedExternal.length) {
  failed = true;
  console.error('UNEXPECTED EXTERNAL RUNTIME URL(S):', unexpectedExternal);
} else {
  console.log('OK runtime external URLs are limited to documented online fallbacks (Quran, prayer, recitation, fonts)');
}

const reciters = JSON.parse(fs.readFileSync(path.join(publicQuran, 'audio', 'links.json'), 'utf8'));
const reciterCount = Array.isArray(reciters?.reciters) ? reciters.reciters.length : 0;
if (reciterCount < 11) {
  failed = true;
  console.error(`RECITER COUNT TOO LOW: ${reciterCount}`);
} else {
  console.log(`OK reciter catalog: ${reciterCount} configured reciters`);
}

process.exitCode = failed ? 1 : 0;
