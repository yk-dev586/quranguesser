const OPTIONS = [1, 2, 3, 4] as const;
export type Option = (typeof OPTIONS)[number];

interface AnswerGridProps {
  selected: Option | null;
  submitted: boolean;
  correctAnswer: number | null;
  isCorrect: boolean;
  onSelect: (n: Option) => void;
}

export default function AnswerGrid({
  selected,
  submitted,
  correctAnswer,
  isCorrect,
  onSelect,
}: AnswerGridProps) {
  const handleKeyDown = (e: React.KeyboardEvent, num: Option) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!submitted) {
        onSelect(num);
      }
    }
  };

  return (
    <div
      className="grid grid-cols-4 gap-2 w-full"
      role="group"
      aria-label="Choose the number of missing words"
    >
      {OPTIONS.map((num) => {
        const isSelected = selected === num;
        const isAnswer = submitted && num === correctAnswer;
        const isWrongPick = submitted && isSelected && !isCorrect;
        let btnStyle =
          'bg-surface-container-low border-outline-variant text-on-surface hover:border-primary hover:bg-primary-container hover:text-primary';
        if (isAnswer) {
          btnStyle = 'bg-green-50 border-green-500 text-green-700';
        } else if (isWrongPick) {
          btnStyle = 'bg-red-50 border-red-400 text-red-600';
        } else if (isSelected) {
          btnStyle = 'bg-primary-container border-primary text-on-background';
        }
        return (
          <button
            key={num}
            onClick={() => !submitted && onSelect(num)}
            onKeyDown={(e) => handleKeyDown(e, num)}
            disabled={submitted}
            aria-pressed={!submitted ? isSelected : undefined}
            aria-label={`${num} missing word${num !== 1 ? 's' : ''}${isAnswer ? ' (correct answer)' : isWrongPick ? ' (your wrong answer)' : ''}`}
            className={`aspect-square border rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 disabled:cursor-default ${btnStyle}`}
          >
            <span className="text-3xl font-bold">{num}</span>
          </button>
        );
      })}
    </div>
  );
}
