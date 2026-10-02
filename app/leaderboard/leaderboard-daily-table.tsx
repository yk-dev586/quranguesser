'use client';

import Image from 'next/image';

import type { DailyChallengeEntry } from './leaderboard-types';

const MAX_SCORE = 5 * 5000;

interface Props {
  entries: DailyChallengeEntry[];
  currentUserId?: string;
  date: string;
}

export function DailyChallengeTable({ entries, currentUserId, date }: Props) {
  return (
    <div className="overflow-x-auto">
      <div className="px-6 py-3 border-b border-primary/10 bg-surface-container-lowest/30 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[16px]">today</span>
        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">
          {date}
        </span>
        <span className="ml-auto text-xs text-on-surface-variant">
          5 questions · max {MAX_SCORE.toLocaleString()} pts
        </span>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-primary/10 bg-surface-container-lowest/20">
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              #
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              Player
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              Score
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              Accuracy
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
              Completed
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-primary/5">
          {entries.map((entry) => {
            const isMe = entry.userId === currentUserId;
            const rankCls =
              entry.rank === 1
                ? 'text-yellow-400'
                : entry.rank <= 3
                  ? 'text-primary'
                  : 'text-on-surface-variant';
            const accuracy = Math.round((entry.totalScore / MAX_SCORE) * 100);
            const completedAt = new Date(entry.completedAt);
            const timeStr = completedAt.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <tr
                key={entry.userId}
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
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-bold text-on-surface">
                    {entry.totalScore.toLocaleString()}
                  </span>
                  <span className="text-xs text-on-surface-variant ml-1">pts</span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-surface-container-high rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${accuracy >= 80 ? 'bg-green-400' : accuracy >= 50 ? 'bg-primary' : 'bg-amber-400'}`}
                        style={{ width: `${accuracy}%` }}
                      />
                    </div>
                    <span className="text-xs text-on-surface-variant">{accuracy}%</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-on-surface-variant">{timeStr}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
