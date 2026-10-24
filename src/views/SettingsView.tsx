import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  ShieldCheck,
  Database,
  Info,
  HelpCircle,
  ChevronRight,
  Trash2,
  X,
} from 'lucide-react';
import { loadScans, clearScans } from '../storage';

type Frequency = 'Weekly' | 'Bi-weekly' | 'Monthly';
const FREQ_KEY = 'scoliscan.frequency';

export default function SettingsView() {
  const navigate = useNavigate();
  const [frequency, setFrequency] = useState<Frequency>(
    () => (localStorage.getItem(FREQ_KEY) as Frequency) || 'Monthly'
  );
  const [scanCount, setScanCount] = useState(() => loadScans().length);
  const [showGuide, setShowGuide] = useState(false);

  function chooseFrequency(f: Frequency) {
    setFrequency(f);
    localStorage.setItem(FREQ_KEY, f);
  }

  function handleClear() {
    if (confirm('Delete all saved scans? This cannot be undone.')) {
      clearScans();
      setScanCount(0);
    }
  }

  return (
    <div style={{ padding: '8px 20px 24px', maxWidth: 520, margin: '0 auto' }}>
      {/* Privacy */}
      <div style={darkCard}>
        <ShieldCheck size={22} color="white" strokeWidth={2} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 16 }}>
            Everything stays on this device
          </div>
          <p style={{ margin: '6px 0 0', fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>
            Your camera feed is never uploaded and your measurements are stored
            only in this browser — never on a server.
          </p>
        </div>
      </div>

      {/* Scan frequency */}
      <div style={card}>
        <div style={cardHeader}>
          <div style={iconCircle}>
            <Calendar size={20} color="#1c3d2a" strokeWidth={2} />
          </div>
          <h3 style={cardTitle}>Change examination consistency</h3>
        </div>
        <p style={cardBody}>
          Adjust how often posture scans are recommended, to keep monitoring
          regular enough to notice changes.
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          {(['Weekly', 'Bi-weekly', 'Monthly'] as Frequency[]).map((f) => (
            <button
              key={f}
              onClick={() => chooseFrequency(f)}
              style={{
                flex: 1,
                padding: '12px 0',
                borderRadius: 24,
                border: `1.5px solid ${frequency === f ? '#1c3d2a' : '#d3ded4'}`,
                background: frequency === f ? 'white' : 'transparent',
                color: frequency === f ? '#1c3d2a' : '#8a978c',
                fontWeight: 600,
                fontSize: 14,
                font: 'inherit',
                cursor: 'pointer',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <button onClick={() => setShowGuide(true)} style={infoLink}>
          <Info size={15} />
          <span>Which should I choose?</span>
        </button>
      </div>

      {/* Data management */}
      <div style={card}>
        <div style={cardHeader}>
          <div style={iconCircle}>
            <Database size={20} color="#1c3d2a" strokeWidth={2} />
          </div>
          <h3 style={cardTitle}>Your data</h3>
        </div>
        <p style={cardBody}>
          {scanCount === 0
            ? 'No scans saved yet. Completed scans appear in Progress.'
            : `${scanCount} scan${scanCount === 1 ? '' : 's'} saved on this device.`}
        </p>

        <button onClick={() => navigate('/progress')} style={rowButton}>
          <span>View scan history</span>
          <ChevronRight size={18} color="#8a978c" />
        </button>

        {scanCount > 0 && (
          <button onClick={handleClear} style={{ ...rowButton, color: '#c0392b' }}>
            <span>Delete all scans</span>
            <Trash2 size={17} color="#c0392b" />
          </button>
        )}
      </div>

      {/* About */}
      <div style={card}>
        <div style={cardHeader}>
          <div style={iconCircle}>
            <Info size={20} color="#1c3d2a" strokeWidth={2} />
          </div>
          <h3 style={cardTitle}>About ScoliScan</h3>
        </div>
        <p style={cardBody}>
          ScoliScan is a screening aid, not a diagnostic tool. It measures
          posture from a single camera and cannot confirm or rule out scoliosis.
          Only a clinician can assess spinal health.
        </p>
      </div>

      <button style={footerLink}>
        <HelpCircle size={19} color="#5a6b5e" />
        <span>Help &amp; Support</span>
      </button>

      {/* Frequency guidance overlay */}
      {showGuide && (
        <div style={overlay} onClick={() => setShowGuide(false)}>
          <div style={sheet} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowGuide(false)} style={closeButton}>
              <X size={20} color="#5a6b5e" />
            </button>

            <h2 style={{ margin: '0 0 6px', fontSize: 22, color: '#14301f' }}>
              Choosing a scan frequency
            </h2>
            <p style={{ ...cardBody, marginBottom: 18 }}>
              Posture changes slowly, so scanning too often mostly captures
              day-to-day variation rather than real change. These are general
              suggestions, not medical guidance.
            </p>

            <GuideRow
              title="Weekly"
              body="Useful for short periods when you want a close look — for example while trying a new chair, backpack, or exercise routine. Expect readings to fluctuate."
            />
            <GuideRow
              title="Bi-weekly"
              body="A middle ground. Frequent enough to build a trend line quickly without every small wobble showing up as a change."
            />
            <GuideRow
              title="Monthly"
              body="A reasonable default for most people. Growth-related changes take months to appear, so monthly scans usually capture them without noise."
            />

            <p
              style={{
                fontSize: 12,
                fontStyle: 'italic',
                color: '#8a978c',
                lineHeight: 1.6,
                marginTop: 18,
              }}
            >
              Teenagers going through a growth spurt may benefit from checking
              more often, since spinal curves can change faster during growth.
              If you have any concerns, speak to a doctor rather than relying on
              scan frequency.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function GuideRow({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontWeight: 700, color: '#14301f', fontSize: 15 }}>{title}</div>
      <p style={{ ...cardBody, marginTop: 4 }}>{body}</p>
    </div>
  );
}

// ---- shared styles ----

const darkCard: React.CSSProperties = {
  display: 'flex',
  gap: 14,
  alignItems: 'flex-start',
  background: '#14301f',
  color: 'white',
  borderRadius: 18,
  padding: 20,
  margin: '8px 0 16px',
};

const card: React.CSSProperties = {
  background: '#eff4ef',
  borderRadius: 18,
  padding: 20,
  margin: '16px 0',
};

const cardHeader: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  marginBottom: 10,
};

const iconCircle: React.CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 21,
  background: '#dde8de',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const cardTitle: React.CSSProperties = {
  margin: 0,
  color: '#14301f',
  fontSize: 17,
  fontWeight: 600,
};

const cardBody: React.CSSProperties = {
  margin: 0,
  fontSize: 13.5,
  color: '#5a6b5e',
  lineHeight: 1.65,
};

const rowButton: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  background: 'white',
  border: 'none',
  borderRadius: 12,
  padding: '14px 16px',
  marginTop: 10,
  fontSize: 15,
  color: '#14301f',
  font: 'inherit',
  cursor: 'pointer',
};

const infoLink: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  background: 'none',
  border: 'none',
  padding: '12px 0 0',
  fontSize: 13.5,
  color: '#2f6b45',
  font: 'inherit',
  cursor: 'pointer',
  textDecoration: 'underline',
};

const footerLink: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  background: 'none',
  border: 'none',
  padding: '14px 4px',
  fontSize: 15,
  color: '#5a6b5e',
  font: 'inherit',
  cursor: 'pointer',
  marginTop: 8,
};

const overlay: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.35)',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  zIndex: 100,
};

const sheet: React.CSSProperties = {
  background: 'white',
  borderRadius: '24px 24px 0 0',
  padding: '28px 24px 40px',
  width: '100%',
  maxWidth: 520,
  maxHeight: '80vh',
  overflowY: 'auto',
  position: 'relative',
};

const closeButton: React.CSSProperties = {
  position: 'absolute',
  top: 16,
  right: 16,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 4,
};