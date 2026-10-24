import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { loadScans, clearScans, type SavedScan } from '../storage';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

// One card in the zigzag timeline
function ScanCard({
  scan,
  side,
  isLatest,
}: {
  scan: SavedScan;
  side: 'left' | 'right';
  isLatest: boolean;
}) {
  const summary: string[] = [];
  if (scan.front) summary.push(`Shoulder ${scan.front.shoulder.toFixed(1)}°`);
  if (scan.back) summary.push(`Plumb ${scan.back.plumb.toFixed(2)}`);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: side === 'left' ? 'flex-start' : 'flex-end',
        marginBottom: 14,
      }}
    >
      <div
        style={{
          width: '82%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '14px 16px',
          borderRadius: 16,
          background: isLatest ? '#1c3d2a' : 'white',
          color: isLatest ? 'white' : '#1c3d2a',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        <div>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 2 }}>
            {formatDate(scan.date)}
          </div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>
            {summary.length ? summary.join(' · ') : 'Scan complete'}
          </div>
          {isLatest && (
            <span
              style={{
                display: 'inline-block',
                marginTop: 8,
                fontSize: 11,
                background: '#2f5a41',
                padding: '3px 10px',
                borderRadius: 10,
              }}
            >
              Latest Scan
            </span>
          )}
        </div>

        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isLatest ? '#2f5a41' : '#d8ecd8',
            color: isLatest ? 'white' : '#1c3d2a',
          }}
        >
          <Check size={15} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
}

export default function ProgressView() {
  const navigate = useNavigate();
  const [scans, setScans] = useState<SavedScan[]>(() => loadScans());

  // Work out when the next scan is due, based on the Settings frequency
  const nextScanDate = (() => {
    if (scans.length === 0) return '';
    const freq = localStorage.getItem('scoliscan.frequency') || 'Monthly';
    const days = freq === 'Weekly' ? 7 : freq === 'Bi-weekly' ? 14 : 30;
    const last = new Date(scans[scans.length - 1].date);
    last.setDate(last.getDate() + days);
    return `${last.getMonth() + 1}/${last.getDate()}/${last.getFullYear()}`;
  })();

  function handleClear() {
    if (confirm('Delete all saved scans? This cannot be undone.')) {
      clearScans();
      setScans([]);
    }
  }

  return (
    <div style={{ padding: '8px 20px 24px', maxWidth: 520, margin: '0 auto' }}>
      <h1
        style={{
          fontSize: 34,
          fontWeight: 800,
          color: '#14301f',
          margin: 0,
          textAlign: 'center',
        }}
      >
        Your Progress
      </h1>
      <p
        style={{
          textAlign: 'center',
          color: '#5a6b5e',
          fontSize: 15,
          lineHeight: 1.5,
          margin: '10px 0 28px',
        }}
      >
        Tracking your spinal health journey over time. Each scan helps you notice
        changes early.
      </p>

      {scans.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#8a978c', marginTop: 40 }}>
          No scans yet. Complete a test to see your history here.
        </p>
      ) : (
        // Oldest at top, newest at bottom — alternating sides
        scans.map((scan, i) => (
          <ScanCard
            key={scan.id}
            scan={scan}
            side={i % 2 === 0 ? 'left' : 'right'}
            isLatest={i === scans.length - 1}
          />
        ))
      )}

      <h2
        style={{
          fontSize: 26,
          fontWeight: 800,
          color: '#14301f',
          marginTop: 40,
          marginBottom: 10,
        }}
      >
        Consistency is Key
      </h2>
      <p style={{ color: '#5a6b5e', fontSize: 14, lineHeight: 1.65 }}>
        Your spine changes as you grow. Regular scans make it easier to notice
        subtle shifts over time — no single scan tells you much on its own.
      </p>

      {/* Next-scan card. When there's no history, it's a button to start one. */}
      {scans.length === 0 ? (
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
            background: '#eaf3ea',
            border: 'none',
            borderRadius: 16,
            padding: 20,
            margin: '20px 0',
            cursor: 'pointer',
            font: 'inherit',
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, color: '#14301f' }}>
            Take your first scan →
          </div>
          <p
            style={{
              margin: '8px 0 0',
              fontSize: 13,
              color: '#5a6b5e',
              lineHeight: 1.6,
            }}
          >
            Your first scan sets a baseline. Later scans are compared against it
            to show how your posture changes.
          </p>
        </button>
      ) : (
        <div
          style={{
            background: '#eaf3ea',
            borderRadius: 16,
            padding: 20,
            margin: '20px 0',
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, color: '#14301f' }}>
            Next scan due {nextScanDate}
          </div>
          <p
            style={{
              margin: '8px 0 0',
              fontSize: 13,
              color: '#5a6b5e',
              lineHeight: 1.6,
            }}
          >
            Based on your chosen scan frequency.
          </p>
        </div>
      )}

      <p
        style={{
          fontStyle: 'italic',
          fontSize: 12,
          color: '#8a978c',
          lineHeight: 1.6,
        }}
      >
        You can change how often scans are recommended in Settings.
      </p>

      {scans.length > 0 && (
        <button
          onClick={handleClear}
          style={{
            display: 'block',
            margin: '28px auto 0',
            padding: '10px 24px',
            fontSize: 13,
            background: 'none',
            border: '1px solid #c0392b',
            color: '#c0392b',
            borderRadius: 20,
          }}
        >
          Delete all scans
        </button>
      )}
    </div>
  );
}