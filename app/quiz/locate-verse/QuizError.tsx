export default function QuizError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <span className="text-sm text-error">Failed to load question.</span>
      <button onClick={onRetry} className="text-sm text-primary underline underline-offset-2">
        Try again
      </button>
    </div>
  );
}
