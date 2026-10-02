import { getTranslations } from 'next-intl/server';

import { fmt, pct } from './stats-helpers';

import type { ModeStats } from '@/lib/stats-queries';
import { MODE_META } from '@/types/game-mode';

interface Props {
  modeStats: ModeStats[];
}

export default async function StatsModeBreakdown({ modeStats }: Props) {
  const t = await getTranslations('statsPage');
  const tCommon = await getTranslations('common');
  const tGameModes = await getTranslations('gameModes');

  return (
    <div className="bg-surface-container-low border border-primary/10 rounded-3xl p-5 space-y-1">
      <h2 className="text-base font-semibold text-on-surface mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[18px]">
          stacked_bar_chart
        </span>
        {t('perModeBreakdown')}
      </h2>

      {modeStats.map((m) => {
        const modeMeta = MODE_META[m.gameMode];
        const meta = modeMeta ?? {
          icon: 'sports_esports',
          iconCls: 'text-on-surface-variant',
          bgCls: 'bg-surface-container',
        };
        const copy = modeMeta
          ? {
              label: tGameModes(modeMeta.labelKey),
              desc: tGameModes(modeMeta.descKey),
            }
          : {
              label: m.gameMode,
              desc: '',
            };
        return (
          <div key={m.gameMode} className="py-4 border-b border-outline-variant/30 last:border-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.bgCls}`}
                >
                  <span className={`material-symbols-outlined text-[18px] ${meta.iconCls}`}>
                    {meta.icon}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">{copy.label}</p>
                  <p className="text-xs text-on-surface-variant">{copy.desc}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-on-surface">
                  {t('plays', { count: fmt(m.total) })}
                </p>
                <p className="text-xs text-on-surface-variant">
                  {pct(m.correct, m.total)} {tCommon('accuracy')}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {m.ranked > 0 && (
                <div className="flex items-center gap-1.5 bg-primary/8 border border-primary/15 rounded-xl px-3 py-1.5">
                  <span className="material-symbols-outlined text-primary text-[13px]">
                    emoji_events
                  </span>
                  <span className="text-xs text-on-surface">
                    <span className="font-semibold">{fmt(m.ranked)}</span> {tCommon('ranked')}
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    · {pct(m.rankedCorrect, m.ranked)}
                  </span>
                </div>
              )}
              {m.casual > 0 && (
                <div className="flex items-center gap-1.5 bg-surface-container border border-outline-variant rounded-xl px-3 py-1.5">
                  <span className="material-symbols-outlined text-on-surface-variant text-[13px]">
                    person_play
                  </span>
                  <span className="text-xs text-on-surface">
                    <span className="font-semibold">{fmt(m.casual)}</span> {tCommon('casual')}
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    · {pct(m.casualCorrect, m.casual)}
                  </span>
                </div>
              )}
              {m.practice > 0 && (
                <div className="flex items-center gap-1.5 bg-surface-container border border-outline-variant rounded-xl px-3 py-1.5">
                  <span className="material-symbols-outlined text-on-surface-variant text-[13px]">
                    school
                  </span>
                  <span className="text-xs text-on-surface">
                    <span className="font-semibold">{fmt(m.practice)}</span> {tCommon('practice')}
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    · {pct(m.practiceCorrect, m.practice)}
                  </span>
                </div>
              )}
              {m.total === 0 && (
                <span className="text-xs text-on-surface-variant italic">{t('noGamesYet')}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
