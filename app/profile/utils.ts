export function dateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

export function computeStreak(attempts: { date: string }[]): number {
  const today = new Date();
  const todayStr = dateStr(today);

  const datesWithActivity = new Set(attempts.map((a) => a.date));
  let streak = 0;
  const cursor = new Date(today);

  if (!datesWithActivity.has(todayStr)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (datesWithActivity.has(dateStr(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function pct(correct: number, total: number): string {
  if (total === 0) {
    return '—';
  }
  return `${Math.round((correct / total) * 100)}%`;
}

export function timeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) {
    return 'Just now';
  }
  if (mins < 60) {
    return `${mins}m ago`;
  }
  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  if (days === 1) {
    return 'Yesterday';
  }
  if (days < 7) {
    return `${days}d ago`;
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
