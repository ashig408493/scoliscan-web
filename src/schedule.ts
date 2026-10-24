import { loadScans } from './storage';

export type Frequency = 'Weekly' | 'Bi-weekly' | 'Monthly';

export const FREQ_KEY = 'scoliscan.frequency';

const DAYS: Record<Frequency, number> = {
  Weekly: 7,
  'Bi-weekly': 14,
  Monthly: 30,
};

export function getFrequency(): Frequency {
  return (localStorage.getItem(FREQ_KEY) as Frequency) || 'Monthly';
}

export function setFrequency(f: Frequency): void {
  localStorage.setItem(FREQ_KEY, f);
}

// When the next scan is due, based on the last scan and chosen interval.
// Returns null if there are no scans yet.
export function getNextDueDate(): Date | null {
  const scans = loadScans();
  if (scans.length === 0) return null;

  const last = new Date(scans[scans.length - 1].date);
  last.setDate(last.getDate() + DAYS[getFrequency()]);
  return last;
}

export function isScanDue(): boolean {
  const due = getNextDueDate();
  return due !== null && due <= new Date();
}

// How many days overdue (negative means still upcoming)
export function daysOverdue(): number {
  const due = getNextDueDate();
  if (!due) return 0;
  const ms = Date.now() - due.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function formatDate(d: Date): string {
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}