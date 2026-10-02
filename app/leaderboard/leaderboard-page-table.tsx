'use client';

import type { PageEloEntry } from './leaderboard-types';

interface PageTableProps {
  paged: PageEloEntry[];
}

export function PageEloTable({ paged }: PageTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-primary/10 bg-surface-container-lowest/20">
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              #
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              Page
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              Juz
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              Chapter
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              Page ELO
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-center">
              Attempts
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-center">
              Correct %
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              Last Updated
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              Practice
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-primary/5">
          {paged.map((entry) => {
            const rankCls =
              entry.rank === 1
                ? 'text-yellow-400'
                : entry.rank <= 3
                  ? 'text-primary'
                  : 'text-on-surface-variant';

            return (
              <tr key={entry.pageNumber} className="transition-colors hover:bg-primary/2">
                <td className={`px-6 py-5 text-sm font-medium tabular-nums ${rankCls}`}>
                  {String(entry.rank).padStart(2, '0')}
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container border border-outline-variant shrink-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant text-[16px]">
                        menu_book
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-on-surface">
                      Page {entry.pageNumber}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-semibold text-on-surface-variant tabular-nums">
                    Juz {entry.juz}
                  </span>
                </td>
                <td className="px-6 py-5 max-w-50">
                  <span className="text-sm text-on-surface-variant leading-snug">
                    {entry.surah}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-bold text-on-surface">
                    {entry.elo.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm text-on-surface-variant text-center tabular-nums">
                  {entry.totalAttempts > 0 ? entry.totalAttempts.toLocaleString() : '—'}
                </td>
                <td className="px-6 py-5 text-sm font-semibold text-on-surface text-center tabular-nums">
                  {entry.totalAttempts > 0
                    ? `${Math.round((entry.correctAttempts / entry.totalAttempts) * 100)}%`
                    : '—'}
                </td>
                <td className="px-6 py-5 text-sm text-on-surface-variant">
                  {new Date(entry.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-5">
                  <div className="flex gap-1 items-center">
                    {(
                      [
                        { mode: 'locate-verse', icon: 'my_location', title: 'Locate Verse' },
                        { mode: 'missing-word-count', icon: 'find_replace', title: 'Word Count' },
                        { mode: 'next-verse', icon: 'format_quote', title: 'Verse Quest' },
                      ] as const
                    ).map(({ mode, icon, title }) => (
                      <a
                        key={mode}
                        href={`/quiz/${mode}?page=${entry.pageNumber}&practice=true`}
                        title={`Practice ${title}`}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary/10 transition-colors"
                      >
                        <span className="material-symbols-outlined text-on-surface-variant text-[16px]">
                          {icon}
                        </span>
                      </a>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
