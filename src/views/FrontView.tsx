import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PoseCamera, { type Landmark } from '../components/PoseCamera';
import { useScan } from '../useScan';
import { useSession } from '../useSession';
import {
  shoulderAngle,
  hipLeanRatio,
  headLeanRatio,
  shouldWarnLean,
  checkFraming,
  framingMessage,
  areLandmarksVisible,
  type FramingIssue,
} from '../metrics';

type Metrics = { shoulder: number; hipLean: number; headLean: number };

const FRAMES_NEEDED = 30;
// How long a solo user must stay correctly framed before capture starts
const AUTO_DELAY_SECONDS = 5;

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export default function FrontView() {
  const navigate = useNavigate();
  const { setFront } = useScan();
  const { assistance } = useSession();
  const solo = assistance === 'solo';

  const [live, setLive] = useState<Metrics | null>(null);
  const [captured, setCaptured] = useState<Metrics | null>(null);
  const [collecting, setCollecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [leanWarning, setLeanWarning] = useState(false);
  const [dismissedWarning, setDismissedWarning] = useState(false);
  const [interrupted, setInterrupted] = useState(false);
  const [framing, setFraming] = useState<FramingIssue>('ok');
  const [countdown, setCountdown] = useState<number | null>(null);

  const samples = useRef<Metrics[]>([]);
  // When the solo countdown began. A ref so updating it doesn't re-render.
  const countdownStart = useRef<number | null>(null);
  // Read inside the frame callback, where state would be stale
  const collectingRef = useRef(false);
  const capturedRef = useRef(false);

  useEffect(() => {
    collectingRef.current = collecting;
  }, [collecting]);

  function beginCollecting() {
    samples.current = [];
    setProgress(0);
    setCaptured(null);
    setDismissedWarning(false);
    setInterrupted(false);
    countdownStart.current = null;
    setCountdown(null);
    setCollecting(true);
  }

  function handleLandmarks(lm: Landmark[]) {
    const issue = checkFraming(lm);
    setFraming(issue);

    const m: Metrics = {
      shoulder: shoulderAngle(lm),
      hipLean: hipLeanRatio(lm),
      headLean: headLeanRatio(lm),
    };
    setLive(m);
    setLeanWarning(shouldWarnLean(lm));

    // Landmarks that aren't genuinely visible are estimates, so a reading built
    // on them would be meaningless. Cancel rather than record garbage.
    if (collectingRef.current && !areLandmarksVisible(lm)) {
      samples.current = [];
      setProgress(0);
      setCollecting(false);
      setInterrupted(true);
      return;
    }

    // ---- Solo mode: run a countdown, then start collecting automatically ----
    if (solo && !collectingRef.current && !capturedRef.current) {
      if (issue === 'ok') {
        if (countdownStart.current === null) countdownStart.current = Date.now();
        const elapsed = (Date.now() - countdownStart.current) / 1000;
        const left = AUTO_DELAY_SECONDS - elapsed;
        if (left <= 0) {
          beginCollecting();
        } else {
          setCountdown(left);
        }
      } else {
        // Framing broke — restart the countdown from the top
        countdownStart.current = null;
        setCountdown(null);
      }
    }

    if (collectingRef.current) {
      samples.current.push(m);
      setProgress(samples.current.length);

      if (samples.current.length >= FRAMES_NEEDED) {
        const all = samples.current;
        setCaptured({
          shoulder: median(all.map((s) => s.shoulder)),
          hipLean: median(all.map((s) => s.hipLean)),
          headLean: median(all.map((s) => s.headLean)),
        });
        capturedRef.current = true;
        setCollecting(false);
        samples.current = [];
      }
    }
  }

  function handleNoPerson() {
    setLive(null);
    setLeanWarning(false);
    setFraming('ok');
    countdownStart.current = null;
    setCountdown(null);
    if (collectingRef.current) {
      samples.current = [];
      setProgress(0);
      setCollecting(false);
      setInterrupted(true);
    }
  }

  function retake() {
    capturedRef.current = false;
    beginCollecting();
  }

  function goNext() {
    if (captured) {
      setFront(captured);
      navigate('/test/back');
    }
  }

  const canCapture = live !== null && framing === 'ok' && !collecting;

  return (
    <div style={page}>
      <h1 style={title}>Front View</h1>
      <p style={subtitle}>Face the camera and stand naturally.</p>

      <div style={{ position: 'relative' }}>
        <PoseCamera onLandmarks={handleLandmarks} onNoPerson={handleNoPerson} />

        {/* Large translucent countdown, readable from across the room */}
        {countdown !== null && !captured && (
          <div style={countdownOverlay}>{Math.ceil(countdown)}</div>
        )}

        {/* Collecting indicator, also visible at a distance */}
        {collecting && (
          <div style={countdownOverlay}>
            {Math.round((progress / FRAMES_NEEDED) * 100)}%
          </div>
        )}
      </div>

      <div style={statusStrip}>
        {live === null ? (
          <span style={{ color: '#8a978c' }}>No person detected</span>
        ) : (
          <>
            <Stat label="Shoulder" value={`${live.shoulder.toFixed(1)}°`} />
            <Stat label="Hip lean" value={live.hipLean.toFixed(2)} />
            <Stat label="Head lean" value={live.headLean.toFixed(2)} />
          </>
        )}
      </div>

      {framing !== 'ok' && live !== null && (
        <div style={framingCard}>
          <b>{framingMessage(framing)}</b>
          <p style={{ margin: '6px 0 0', fontSize: 13.5, lineHeight: 1.6 }}>
            Your whole body needs to be visible for accurate measurements.
          </p>
        </div>
      )}

      {interrupted && (
        <div style={interruptCard}>
          <b>Capture stopped</b>
          <p style={{ margin: '6px 0 0', fontSize: 13.5, lineHeight: 1.6 }}>
            You moved out of frame before the scan finished. Get back into
            position and it will start again.
          </p>
        </div>
      )}

      {leanWarning && !dismissedWarning && (
        <div style={warningCard}>
          <b>You appear to be leaning.</b>
          <p style={{ margin: '8px 0 12px', fontSize: 13.5, lineHeight: 1.6 }}>
            If this is just how you're standing, try to straighten up. If it's
            your natural posture, that's fine — continue.
          </p>
          <button onClick={() => setDismissedWarning(true)} style={smallButton}>
            Continue anyway
          </button>
        </div>
      )}

      {captured ? (
        <div style={capturedCard}>
          <b style={{ color: '#14301f' }}>Captured</b>
          <div style={{ marginTop: 8, fontSize: 14, color: '#5a6b5e' }}>
            Shoulder {captured.shoulder.toFixed(1)}° · Hip lean{' '}
            {captured.hipLean.toFixed(2)} · Head lean {captured.headLean.toFixed(2)}
          </div>
          <button onClick={goNext} style={primaryButton}>
            Next: Back View →
          </button>
          <button onClick={retake} style={textButton}>
            Retake
          </button>
        </div>
      ) : solo ? (
        <div style={soloCard}>
          {collecting
            ? 'Hold still — measuring…'
            : countdown !== null
              ? 'Get into position and hold still'
              : 'Step into frame to begin automatically'}
        </div>
      ) : (
        <button
          onClick={beginCollecting}
          disabled={!canCapture}
          style={{ ...primaryButton, marginTop: 20, opacity: canCapture ? 1 : 0.5 }}
        >
          {collecting ? `Hold still… ${progress}/${FRAMES_NEEDED}` : 'Capture'}
        </button>
      )}

      <StepDots step={1} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 11, color: '#8a978c' }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#14301f' }}>{value}</div>
    </div>
  );
}

export function StepDots({ step }: { step: number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 20,
      }}
    >
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          style={{
            width: 9,
            height: 9,
            borderRadius: 5,
            background: n === step ? '#14301f' : '#c9d4ca',
          }}
        />
      ))}
      <span style={{ marginLeft: 8, fontSize: 14, color: '#8a978c' }}>
        Step {step} of 3
      </span>
    </div>
  );
}

// ---- shared styles ----
const page: React.CSSProperties = {
  padding: '16px 24px 32px',
  maxWidth: 520,
  margin: '0 auto',
  textAlign: 'center',
  background: '#eef5ee',
  minHeight: '100vh',
};

const title: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 800,
  color: '#14301f',
  margin: '8px 0 8px',
};

const subtitle: React.CSSProperties = {
  fontSize: 15,
  color: '#4a5a4f',
  lineHeight: 1.5,
  margin: '0 0 20px',
};

// Big and translucent so it reads from across the room without hiding the body
const countdownOverlay: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 120,
  fontWeight: 800,
  color: 'rgba(255,255,255,0.55)',
  textShadow: '0 2px 20px rgba(0,0,0,0.35)',
  pointerEvents: 'none',
};

const statusStrip: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  background: '#eff4ef',
  borderRadius: 16,
  padding: '12px 8px',
  marginTop: 16,
  minHeight: 46,
};

const soloCard: React.CSSProperties = {
  background: '#eff4ef',
  borderRadius: 16,
  padding: '16px 18px',
  marginTop: 20,
  fontSize: 15,
  color: '#5a6b5e',
};

const framingCard: React.CSSProperties = {
  background: '#e8f0fb',
  border: '1px solid #b9d2f0',
  borderRadius: 16,
  padding: 18,
  marginTop: 16,
  textAlign: 'left',
  color: '#1f4a7a',
};

const warningCard: React.CSSProperties = {
  background: '#fdf6e3',
  border: '1px solid #e8d9a8',
  borderRadius: 16,
  padding: 18,
  marginTop: 16,
  textAlign: 'left',
  color: '#6b5a1e',
};

const interruptCard: React.CSSProperties = {
  background: '#fdeaea',
  border: '1px solid #f0c4c4',
  borderRadius: 16,
  padding: 18,
  marginTop: 16,
  textAlign: 'left',
  color: '#8a2f2f',
};

const capturedCard: React.CSSProperties = {
  background: '#dff0df',
  borderRadius: 18,
  padding: 20,
  marginTop: 20,
};

const primaryButton: React.CSSProperties = {
  display: 'block',
  width: '100%',
  marginTop: 14,
  padding: '17px 0',
  fontSize: 18,
  fontWeight: 700,
  color: '#14301f',
  background: '#bfe8bf',
  border: 'none',
  borderRadius: 32,
  font: 'inherit',
  cursor: 'pointer',
};

const smallButton: React.CSSProperties = {
  padding: '9px 20px',
  fontSize: 13,
  borderRadius: 20,
  border: '1px solid #c9b978',
  background: 'white',
  color: '#6b5a1e',
  font: 'inherit',
  cursor: 'pointer',
};

const textButton: React.CSSProperties = {
  display: 'block',
  margin: '10px auto 0',
  background: 'none',
  border: 'none',
  fontSize: 14,
  color: '#5a6b5e',
  textDecoration: 'underline',
  font: 'inherit',
  cursor: 'pointer',
};