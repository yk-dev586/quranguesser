import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const qcfRoot = path.join(root, 'public', 'quran', 'qcf');
const pagesRoot = path.join(qcfRoot, 'layout', 'pages');
const fontsRoot = path.join(qcfRoot, 'woff2');
const layoutBase = 'https://raw.githubusercontent.com/zonetecde/mushaf-layout/main/mushaf';
const fontBase = 'https://verses.quran.foundation/fonts/quran/hafs/v2/woff2';

const wantFonts = process.argv.includes('--fonts');
const allPages = Array.from({ length: 604 }, (_, i) => i + 1);

await fs.mkdir(pagesRoot, { recursive: true });
await fs.mkdir(fontsRoot, { recursive: true });

async function fetchBytes(url) {
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return new Uint8Array(await response.arrayBuffer());
}

const verseMap = {};
let layoutSuccess = 0;

for (const page of allPages) {
  const name = `page-${String(page).padStart(3, '0')}.json`;
  const target = path.join(pagesRoot, name);
  if (!process.argv.includes('--force')) {
    try {
      const stat = await fs.stat(target);
      if (stat.size > 100) {
        // Existing page files are reused; this makes re-running the script cheap.
        const parsed = JSON.parse(await fs.readFile(target, 'utf8'));
        addToVerseMap(parsed);
        layoutSuccess++;
        continue;
      }
    } catch {}
  }
  try {
    const bytes = await fetchBytes(`${layoutBase}/${name}`);
    await fs.writeFile(target, bytes);
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    addToVerseMap(parsed);
    layoutSuccess++;
    console.log(`layout ${page}/604`);
  } catch (error) {
    console.error(`layout ${page}/604 failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function addToVerseMap(pageJson) {
  const page = Number(pageJson?.page);
  if (!Number.isInteger(page)) return;
  for (const line of Array.isArray(pageJson?.lines) ? pageJson.lines : []) {
    const lineNumber = Number(line?.line);
    if (!Number.isInteger(lineNumber)) continue;
    for (const word of Array.isArray(line?.words) ? line.words : []) {
      const location = String(word?.location ?? '');
      const [chapter, verse, position] = location.split(':').map(Number);
      if (![chapter, verse, position].every(Number.isInteger)) continue;
      const key = `${chapter}:${verse}`;
      const current = verseMap[key] ?? { page, lines: [] };
      current.page = page;
      let span = current.lines.find((item) => item.line === lineNumber);
      if (!span) {
        span = { line: lineNumber, word_start: position, word_end: position };
        current.lines.push(span);
      } else {
        span.word_start = Math.min(span.word_start, position);
        span.word_end = Math.max(span.word_end, position);
      }
      current.lines.sort((a, b) => a.line - b.line);
      verseMap[key] = current;
    }
  }
}

await fs.writeFile(
  path.join(qcfRoot, 'layout', 'verse-map.json'),
  JSON.stringify({ generatedBy: 'hydrate-qcf-assets.mjs', verses: verseMap }, null, 0),
);

let fontSuccess = 0;
if (wantFonts) {
  console.log('Downloading QCF V2 fonts. If the server requires an authorized account, the script will report that and continue.');
  for (const page of allPages) {
    const name = `p${page}.woff2`;
    const target = path.join(fontsRoot, name);
    try {
      if (!process.argv.includes('--force')) {
        const stat = await fs.stat(target).catch(() => null);
        if (stat?.size > 1000) {
          fontSuccess++;
          continue;
        }
      }
      const bytes = await fetchBytes(`${fontBase}/${name}`);
      await fs.writeFile(target, bytes);
      fontSuccess++;
      console.log(`font ${page}/604`);
    } catch (error) {
      console.error(`font ${page}/604 failed: ${error instanceof Error ? error.message : String(error)}`);
      break;
    }
  }
}

const manifest = {
  generatedAt: new Date().toISOString(),
  layoutPages: layoutSuccess,
  totalPages: 604,
  qcfV2Fonts: fontSuccess,
  fontDownloadRequested: wantFonts,
  exactLocateQuizReady: layoutSuccess === 604,
  qcfFontsReady: fontSuccess === 604,
};
await fs.writeFile(path.join(qcfRoot, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

console.log(JSON.stringify(manifest, null, 2));
