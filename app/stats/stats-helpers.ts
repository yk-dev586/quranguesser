export function pct(correct: number, total: number): string {
  if (total === 0) {
    return '—';
  }
  return `${Math.round((correct / total) * 100)}%`;
}

export function fmt(n: number): string {
  return n.toLocaleString();
}
