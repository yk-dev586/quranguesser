import type { DayBucket } from '@/lib/stats-queries';

interface Props {
  last30Days: DayBucket[];
  maxDayTotal: number;
}

export default function StatsActivityChart({ last30Days, maxDayTotal }: Props) {
  const maxHeight = 100; // px
  const maxTotal = Math.max(...last30Days.map((day) => day.total), 0);
  return (
    <div className="bg-surface-container-low border border-primary/10 rounded-3xl p-5">
      <h2 className="text-base font-semibold text-on-surface mb-5 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[18px]">bar_chart</span>
        Activity — Last 30 Days
      </h2>

      <div className="flex items-end gap-0.75 h-24">
        {last30Days.map((day) => {
          const heightPct = maxDayTotal > 0 ? (day.total / maxDayTotal) * 100 : 0;
          const accuracyPct = day.total > 0 ? (day.correct / day.total) * 100 : 0;
          const shortDate = day.date.slice(5);
          return (
            <div
              key={day.date}
              className="flex-1 flex flex-col justify-end group relative"
              title={`${shortDate}: ${day.total} games, ${Math.round(accuracyPct)}% accuracy`}
            >
              <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
                <div className="bg-on-surface text-surface text-[10px] font-medium px-2 py-1 rounded-lg whitespace-nowrap shadow-md">
                  {shortDate}
                  <br />
                  {day.total} games · {Math.round(accuracyPct)}% acc
                </div>
                <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-on-surface" />
              </div>

              {day.total === 0 ? (
                <div
                  className="w-full rounded-sm bg-surface-container-high"
                  style={{ height: 3 }}
                />
              ) : (
                <div
                  className="w-full rounded-sm overflow-hidden flex flex-col-reverse bg-primary/90 hover:bg-primary transition-colors"
                  style={{ height: `${Math.max((heightPct / maxTotal) * maxHeight, 4)}px` }}
                >
                  <div
                    className="w-full rounded-sm bg-green-400/70 hover:bg-green-500 transition-colors shrink-0"
                    style={{ height: `${accuracyPct}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-end gap-0.75 mt-1.5">
        {last30Days.map((day, i) => (
          <div key={day.date} className="flex-1 text-center">
            {i % 7 === 0 ? (
              <span className="text-[9px] text-on-surface-variant">{day.date.slice(5)}</span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
