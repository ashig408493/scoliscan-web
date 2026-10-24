import type { ScanData } from './ScanContext';

// One completed scan session, saved to the device
export type SavedScan = {
  id: string;
  date: string; // ISO timestamp
  front: ScanData | null;
  back: ScanData | null;
  side: ScanData | null;
  // Optional so scans saved before these existed stay valid
  rotation?: ScanData | null;
  // Questionnaire answers as yes/no flags only (1 or 0). Height and weight
  // are never stored.
  context?: ScanData | null;
};

const STORAGE_KEY = 'scoliscan.scans';

// Read every saved scan. Returns [] if nothing stored or the data is corrupt.
export function loadScans(): SavedScan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Corrupt data shouldn't crash the app — just start fresh
    return [];
  }
}

// Append a new scan and persist. Returns the saved record.
export function saveScan(scan: Omit<SavedScan, 'id' | 'date'>): SavedScan {
  const record: SavedScan = {
    ...scan,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };
  const all = loadScans();
  all.push(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return record;
}

// Remove everything — for the "delete all scans" option in Settings
export function clearScans(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// ---- SCAN SCHEDULING ----
// The frequency setting doesn't send notifications — it only decides when the
// app shows a "due for a scan" prompt on the Test tab.

const FREQ_KEY = 'scoliscan.frequency';

export type Frequency = 'Weekly' | 'Bi-weekly' | 'Monthly';

export function getFrequency(): Frequency {
  return (localStorage.getItem(FREQ_KEY) as Frequency) || 'Monthly';
}

export function setFrequency(f: Frequency): void {
  localStorage.setItem(FREQ_KEY, f);
}

function intervalDays(f: Frequency): number {
  return f === 'Weekly' ? 7 : f === 'Bi-weekly' ? 14 : 30;
}

// When the next scan is due, or null if there's no history to count from
export function nextScanDue(): Date | null {
  const scans = loadScans();
  if (scans.length === 0) return null;
  const last = new Date(scans[scans.length - 1].date);
  last.setDate(last.getDate() + intervalDays(getFrequency()));
  return last;
}

// Whether that date has passed
export function isScanDue(): boolean {
  const due = nextScanDue();
  return due !== null && Date.now() >= due.getTime();
}

export function formatShortDate(d: Date): string {
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}