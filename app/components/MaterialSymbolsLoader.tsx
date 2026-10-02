 'use client';

import { useEffect } from 'react';

const ICONS: Record<string, string> = {
  quiz: '❓', leaderboard: '🏆', bar_chart: '▥', person: '●', emoji_events: '🏆',
  workspace_premium: '◇', auto_stories: '📖', format_quote: '❝', my_location: '⌖', pin: '•',
  translate: '文', search: '⌕', close: '×', expand_less: '⌃', expand_more: '⌄', menu: '☰',
  language: '文', dark_mode: '◐', light_mode: '☀', settings: '⚙', arrow_back: '←', arrow_forward: '→',
  check: '✓', info: 'ⓘ', refresh: '↻', shuffle: '⤨', lock: '🔒', play_arrow: '▶', pause: 'Ⅱ',
};

export default function MaterialSymbolsLoader() {
  useEffect(() => {
    const replace = (root: ParentNode = document) => {
      root.querySelectorAll<HTMLElement>('.material-symbols-outlined').forEach((el) => {
        const key = el.textContent?.trim();
        if (!key || el.dataset.localIcon === '1') return;
        const glyph = ICONS[key];
        if (!glyph) return;
        el.textContent = glyph;
        el.dataset.localIcon = '1';
        el.setAttribute('aria-hidden', el.getAttribute('aria-hidden') ?? 'true');
        el.style.fontFamily = 'system-ui, sans-serif';
      });
    };
    replace();
    const observer = new MutationObserver(() => replace());
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);
  return null;
}
