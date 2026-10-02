import type { TranslationChoice } from './types';

interface TranslationChoicesGridProps {
  choices: TranslationChoice[];
  selected: number | null;
  submitted: boolean;
  correctIndex: number | null;
  onSelect: (index: number) => void;
}

export default function TranslationChoicesGrid({
  choices,
  selected,
  submitted,
  correctIndex,
  onSelect,
}: TranslationChoicesGridProps) {
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
            className={`w-full bg-surface-container border-2 ${borderClass} ${bgClass} rounded-xl p-5 text-left transition-all duration-200 flex flex-col justify-center min-h-25 disabled:cursor-default`}
          >
            <p className="text-on-background text-sm leading-relaxed">{choice.text}</p>
          </button>
        );
      })}
    </div>
  );
}
