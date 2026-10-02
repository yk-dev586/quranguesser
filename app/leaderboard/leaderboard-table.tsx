'use client';

import Image from 'next/image';

import type { LeaderboardEntry } from './leaderboard-types';

export function getPercentileTier(rank: number, totalUsers: number) {
  if (totalUsers === 0) {
    return {
      label: 'Unranked',
      chipCls: 'bg-surface-container text-on-surface-variant border border-outline-variant',
    };
  }
  const pct = Math.ceil((rank / totalUsers) * 100);
  if (pct <= 10) {
    return { label: `Top ${pct}%`, chipCls: 'bg-primary/10 text-primary border border-primary/20' };
  }
  if (pct <= 30) {
    return {
      label: `Top ${pct}%`,
      chipCls: 'bg-secondary-container/20 text-secondary border border-secondary-container',
    };
  }
  return {
    label: `Top ${pct}%`,
    chipCls: 'bg-surface-container text-on-surface-variant border border-outline-variant',
  };
}

// ── Player ELO table ──────────────────────────────────────────────────────────

interface TableProps {
  paged: LeaderboardEntry[];
  currentUserId?: string;
  totalEloUsers: number;
}

export function LeaderboardTable({ paged, currentUserId, totalEloUsers }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-primary/10 bg-surface-container-lowest/20">
            <th
              scope="col"
              className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest"
            >
              #
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest"
            >
              Player
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest"
            >
              Player ELO
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest"
            >
              Tier
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-center"
            >
              MWC Win%
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-center"
            >
              Games
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-primary/5">
          {paged.map((entry) => {
            const tier = getPercentileTier(entry.rank, totalEloUsers);
            const isMe = entry.userId === currentUserId;
            const rankCls =
              entry.rank === 1
                ? 'text-yellow-400'
                : entry.rank <= 3
                  ? 'text-primary'
                  : 'text-on-surface-variant';

            return (
              <tr
                key={entry.userId}
                aria-current={isMe ? 'true' : undefined}
                className={`transition-colors ${isMe ? 'bg-primary/5' : 'hover:bg-primary/2'}`}
              >
                <td className={`px-6 py-5 text-sm font-medium tabular-nums ${rankCls}`}>
                  {String(entry.rank).padStart(2, '0')}
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container border border-outline-variant shrink-0">
                      {entry.image ? (
                        <Image
                          src={entry.image}
                          alt={entry.name}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-on-surface-variant text-[16px]">
                            person
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-on-surface">
                      {entry.name}
                      {isMe && (
                        <span className="ml-1.5 text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full align-middle">
                          you
                        </span>
                      )}
                    </span>
                    <div className="flex gap-2 mt-0.5 flex-wrap">
                      {entry.gamesPlayed > 0 && (
                        <span className="text-[10px] text-on-surface-variant">
                          MWC&nbsp;{entry.gamesPlayed}
                        </span>
                      )}
                      {entry.lvGames > 0 && (
                        <span className="text-[10px] text-on-surface-variant">
                          ·&nbsp;LV&nbsp;{entry.lvGames}
                        </span>
                      )}
                      {entry.nvGames > 0 && (
                        <span className="text-[10px] text-on-surface-variant">
                          ·&nbsp;NV&nbsp;{entry.nvGames}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-bold text-on-surface">
                    {entry.elo.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full ${tier.chipCls}`}
                  >
                    {tier.label}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm font-semibold text-on-surface text-center tabular-nums">
                  {entry.gamesPlayed > 0
                    ? `${Math.round((entry.mwcCorrect / entry.gamesPlayed) * 100)}%`
                    : '—'}
                </td>
                <td className="px-6 py-5 text-sm text-on-surface-variant text-center tabular-nums">
                  {entry.gamesPlayed + entry.lvGames + entry.nvGames}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
