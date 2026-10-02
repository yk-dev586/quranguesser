import type { ChoiceOption } from './types';

interface ChoicesGridProps {
  choices: ChoiceOption[];
  selected: number | null;
  submitted: boolean;
  correctIndex: number | null;
  loadedPages: Set<number>;
  onSelect: (index: number) => void;
}

export default function ChoicesGrid({
  choices,
  selected,
  submitted,
  correctIndex,
  loadedPages,
  onSelect,
}: ChoicesGridProps) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      {choices.map((choice, i) => {
        const isSelected = selected === i;
        const isCorrect = correctIndex === i;
        const isWrong = submitted && isSelected && !isCorrect;

        let borderClass = 'border-transparent hover:border-surface-bright';
        let bgClass = 'hover:bg-surface-container-high';
        if (!submitted && isSelected) {
          borderClass = 'border-primary-container';
          bgClass = 'bg-primary-container/10';
        } else if (submitted && isCorrect) {
          borderClass = 'border-green-500';
          bgClass = 'bg-green-500/10';
        } else if (isWrong) {
          borderClass = 'border-rose-500';
          bgClass = 'bg-rose-500/10';
        }

        return (
          <button
            key={i}
            onClick={() => !submitted && onSelect(i)}
            disabled={submitted}
            aria-pressed={!submitted ? isSelected : undefined}
            aria-label={`Choice ${i + 1}`}
            className={`w-full bg-surface-container border-2 ${borderClass} ${bgClass} rounded-xl p-5 text-right transition-all duration-200 flex flex-col justify-center min-h-25 disabled:cursor-default`}
          >
            <p
              lang="ar"
              dir="rtl"
              className="quran-text text-on-background w-full"
              style={{ fontSize: '1.6rem', lineHeight: '2.8rem' }}
            >
              {choice.words.map((word, wi) => {
                if (word.char_type_name === 'end') {
                  return null;
                }
                return (
                  <span key={word.id || wi}>
                    {word.page_number == null ||
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
                    )}{' '}
                  </span>
                );
              })}
            </p>
          </button>
        );
      })}
    </div>
  );
}
