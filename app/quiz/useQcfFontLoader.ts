 'use client';

import { useEffect, useState } from 'react';

const LOCAL_BASE = '/quran/qcf/woff2';
const globalLoadedFonts = new Set<string>();

export function useQcfFontLoader(pageNumbers: number[]): Set<number> {
  const pageKey = [...new Set(pageNumbers)].sort((a, b) => a - b).join(',');
  const [loadedPages, setLoadedPages] = useState<Set<number>>(
    () => new Set(pageNumbers.filter((p) => globalLoadedFonts.has(`p${p}-v2`))),
  );

  useEffect(() => {
    if (!pageKey) return;
    const pages = pageKey.split(',').map(Number);
    pages.forEach(async (page) => {
      const fontName = `p${page}-v2`;
      if (globalLoadedFonts.has(fontName)) {
        setLoadedPages((prev) => {
          if (prev.has(page)) return prev;
          const next = new Set(prev);
          next.add(page);
          return next;
        });
        return;
      }
      try {
        const fontFace = new FontFace(fontName, `url('${LOCAL_BASE}/p${page}.woff2')`);
        fontFace.display = 'block';
        await fontFace.load();
        document.fonts.add(fontFace);
        globalLoadedFonts.add(fontName);
        setLoadedPages((prev) => {
          const next = new Set(prev);
          next.add(page);
          return next;
        });
      } catch {
        // Local QCF is optional until hydrated. VerseCard will use its local
        // Unicode Quran font instead of retrying a remote CDN.
      }
    });
  }, [pageKey]);

  return loadedPages;
}
