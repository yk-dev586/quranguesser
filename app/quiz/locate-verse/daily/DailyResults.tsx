import Link from 'next/link';

import type { Question } from '@/app/quiz/locate-verse/types';

const MAX_SCORE = 5 * 5000;

interface Props {
  date: string;
  totalScore: number;
  scores: number[];
  questions: Question[];
}

export default function DailyResults({ date, totalScore, scores, questions }: Props) {
  const percentage = Math.round((totalScore / MAX_SCORE) * 100);

  const grade =
    percentage >= 90
      ? { label: 'Excellent', color: 'text-green-400' }
      : percentage >= 70
        ? { label: 'Good', color: 'text-primary' }
        : percentage >= 50
          ? { label: 'Fair', color: 'text-amber-400' }
          : { label: 'Keep Practicing', color: 'text-rose-400' };

  return (
    <main className="flex-1 flex flex-col px-5 max-w-3xl mx-auto w-full gap-6 justify-center min-h-screen pt-20 pb-24 md:pb-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
          Daily Challenge · {date}
        </p>
        <h1 className="text-3xl font-bold text-on-surface">Challenge Complete!</h1>
        <p className={`text-lg font-semibold ${grade.color}`}>{grade.label}</p>
      </div>

      {/* Score card */}
      <div className="bg-surface-container/60 backdrop-blur-xl border border-surface-bright rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-center space-y-3">
        <p className="text-sm text-on-surface-variant uppercase tracking-wider">Total Score</p>
        <p className="text-5xl font-bold text-primary">{totalScore.toLocaleString()}</p>
        <p className="text-sm text-on-surface-variant">
          out of {MAX_SCORE.toLocaleString()} points
        </p>
        <div className="w-full bg-surface-container-high rounded-full h-2 mt-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Per-question breakdown */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">
          Breakdown
        </h2>
        {scores.map((score, i) => {
          const pct = Math.round((score / 5000) * 100);
          const ref = questions[i]?.verseReference ?? `Q${i + 1}`;
          return (
            <div
              key={i}
              className="flex items-center gap-4 bg-surface-container-low border border-primary/10 rounded-xl px-5 py-4"
            >
              <span className="text-xs font-bold text-on-surface-variant w-6">Q{i + 1}</span>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant">{ref}</span>
                  <span className="text-sm font-semibold text-on-surface">
                    {score.toLocaleString()} pts
                  </span>
                </div>
                <div className="w-full bg-surface-container-high rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${pct >= 80 ? 'bg-green-400' : pct >= 50 ? 'bg-primary' : pct >= 25 ? 'bg-amber-400' : 'bg-rose-400'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/leaderboard?tab=daily"
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-on-primary text-sm font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-[18px]">leaderboard</span>
          View Leaderboard
        </Link>
        <Link
          href="/quiz"
          className="flex-1 flex items-center justify-center gap-2 bg-surface-container border border-outline-variant text-on-surface text-sm font-semibold py-3 rounded-xl hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">home</span>
          Back to Quiz Hub
        </Link>
      </div>
    </main>
  );
}
