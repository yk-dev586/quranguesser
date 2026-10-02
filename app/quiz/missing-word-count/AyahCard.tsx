import type { Question, VerseWord } from './types';

interface AyahCardProps {
  question: Question | null;
  loading: boolean;
  error: boolean;
  submitted: boolean;
  isCorrect: boolean;
  verseKey: string | null;
  hiddenWords: VerseWord[] | null;
  loadedPages: Set<number>;
  onRetry: () => void;
}

function WordSpan({
  word,
  loadedPages,
  highlight,
}: {
  word: VerseWord;
  loadedPages: Set<number>;
  highlight?: 'correct' | 'incorrect' | null;
}) {
  const highlightClass =
    highlight === 'correct'
      ? 'text-green-700 bg-green-400/10 rounded px-0.5'
      : highlight === 'incorrect'
        ? 'text-red-700 bg-red-400/10 rounded px-0.5'
        : '';

  const inner =
    word.char_type_name === 'end' ||
    word.page_number == null ||
    !loadedPages.has(word.page_number) ||
    !word.code_v2 ? (
      <span style={{ fontFamily: "UthmanicHafs, 'Traditional Arabic', serif" }}>
        {word.text_qpc_hafs}
      </span>
    ) : (
      <span
        style={{ fontFamily: `p${word.page_number}-v2` }}
        dangerouslySetInnerHTML={{ __html: word.code_v2 }}
      />
    );

  return <span className={highlightClass}>{inner} </span>;
}

export default function AyahCard({
  question,
  loading,
  error,
  submitted,
  isCorrect,
  verseKey,
  hiddenWords,
  loadedPages,
  onRetry,
}: AyahCardProps) {
  // Build display data for the submitted view by splitting segments at verse-end
  const submittedDisplay: {
    primaryWords: { word: VerseWord; wasHidden: boolean }[];
    infoWords: VerseWord[];
  } | null =
    submitted && hiddenWords && question
      ? (() => {
          const veIdx = question.segments.findIndex((s) => s.type === 'verse-end');
          const primarySegs = veIdx >= 0 ? question.segments.slice(0, veIdx) : question.segments;
          const afterSegs = veIdx >= 0 ? question.segments.slice(veIdx + 1) : [];

          const primaryVisible = primarySegs
            .filter((s): s is { type: 'words'; words: VerseWord[] } => s.type === 'words')
            .flatMap((s) => s.words.map((w) => ({ word: w, wasHidden: false as const })));

          const infoWords = afterSegs
            .filter((s): s is { type: 'words'; words: VerseWord[] } => s.type === 'words')
            .flatMap((s) => s.words);

          const primaryWords = [
            ...primaryVisible,
            ...hiddenWords.map((w) => ({ word: w, wasHidden: true as const })),
          ].sort((a, b) => a.word.id - b.word.id);

          return { primaryWords, infoWords };
        })()
      : null;

  return (
    <div className="w-full bg-surface-container/60 backdrop-blur-xl border border-surface-bright rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col items-center justify-center min-h-50">
      <div className="absolute top-[-50%] right-[-20%] w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

      {loading && (
        <div className="flex items-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
          <span className="text-sm">Loading ayah…</span>
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center gap-3">
          <span className="text-sm text-error">Failed to load verse.</span>
          <button onClick={onRetry} className="text-sm text-primary underline underline-offset-2">
            Try again
          </button>
        </div>
      )}

      {!loading && !error && question && !submitted && (
        <p lang="ar" dir="rtl" className="quran-text text-on-surface relative z-10 text-center">
          {question.segments.map((seg, segIdx) => {
            if (seg.type === 'words') {
              return seg.words.map((word, wordIdx) => (
                <WordSpan key={`${segIdx}-${wordIdx}`} word={word} loadedPages={loadedPages} />
              ));
            }
            if (seg.type === 'verse-end') {
              return (
                <span
                  key={`ve-${segIdx}`}
                  className="mx-1 text-on-surface-variant/40 select-none"
                  aria-hidden="true"
                >
                  ۝
                </span>
              );
            }
            return null;
          })}
        </p>
      )}

      {!loading && !error && submitted && submittedDisplay && (
        <div className="flex flex-col items-center gap-3 w-full relative z-10">
          <p lang="ar" dir="rtl" className="quran-text text-on-surface text-center">
            {submittedDisplay.primaryWords.map((entry, idx) => (
              <WordSpan
                key={idx}
                word={entry.word}
                loadedPages={loadedPages}
                highlight={entry.wasHidden ? (isCorrect ? 'correct' : 'incorrect') : null}
              />
            ))}
            <span className="mx-1 text-on-surface-variant/40 select-none" aria-hidden="true">
              ۝
            </span>
            {submittedDisplay.infoWords.map((word, idx) => (
              <WordSpan key={`info-${idx}`} word={word} loadedPages={loadedPages} />
            ))}
          </p>
          {verseKey && (
            <span className="text-xs text-on-surface-variant/50 font-mono">{verseKey}</span>
          )}
        </div>
      )}
    </div>
  );
}
