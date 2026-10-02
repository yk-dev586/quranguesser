import type { VerseWord } from './types';

interface VerseCardProps {
  verseWords: VerseWord[] | null;
  loading: boolean;
  error: boolean;
  verseKey: string | null;
  loadedPages: Set<number>;
  onRetry: () => void;
}

export default function VerseCard({
  verseWords,
  loading,
  error,
  verseKey,
  loadedPages,
  onRetry,
}: VerseCardProps) {
  return (
    <div className="w-full bg-surface-container/60 backdrop-blur-xl border border-surface-bright rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col items-center justify-center min-h-45">
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

      {!loading && !error && verseWords && verseWords.length > 0 && (
        <p lang="ar" dir="rtl" className="quran-text text-on-surface relative z-10 text-center">
          {verseWords.map((word, i) => {
            if (word.char_type_name === 'end') {
              return null;
            }
            return (
              <span key={word.id || i}>
                {word.page_number == null || !loadedPages.has(word.page_number) || !word.code_v2 ? (
                  <span style={{ fontFamily: "UthmanicHafs, 'Traditional Arabic', serif" }}>
                    {word.text_qpc_hafs}
                  </span>
                ) : (
                  <span
                    style={{ fontFamily: `p${word.page_number}-v2` }}
                    // QCF glyph codes are private-use Unicode chars — safe to set via innerHTML
                    dangerouslySetInnerHTML={{ __html: word.code_v2 }}
                  />
                )}{' '}
              </span>
            );
          })}
        </p>
      )}

      {verseKey && (
        <span className="absolute bottom-3 left-4 text-xs text-on-surface-variant/50 font-mono z-10">
          {verseKey}
        </span>
      )}
    </div>
  );
}
