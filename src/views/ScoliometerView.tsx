import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useScan } from '../useScan';
import { useSession } from '../useSession';
import {
  hasMotionSensor,
  needsMotionPermission,
  requestMotionPermission,
} from '../sensors';

// Order of the measurement: two calibration readings, then two back readings
type Step = 'zero1' | 'zero2' | 'upper' | 'lower' | 'done';

// A reading only counts once the phone has stayed within this range for this
// long. These are positioning settings, not screening thresholds.
const STEADY_MS = 2000;
const STEADY_RANGE_DEG = 0.5;

type Sample = { t: number; v: number };

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

const STEP_TEXT: Record<Step, { title: string; body: string }> = {
  zero1: {
    title: 'Calibrate: position 1',
    body: 'Place the phone flat on a table or the floor, screen up. Tap Measure, then keep your hands off it.',
  },
  zero2: {
    title: 'Calibrate: position 2',
    body: 'Turn the phone end-for-end in the same spot, so the top now points the other way. Tap Measure. This cancels out any slope in the table and any error in the sensor.',
  },
  upper: {
    title: 'Upper back',
    body: 'With the person bent forward as before, lay the phone across their upper back at its highest point: screen up, long edge side to side, centered over the spine. Tap Measure, and hold the ends lightly without pressing down.',
  },
  lower: {
    title: 'Lower back',
    body: 'Now lay the phone the same way across the lower back, at about waist level. Tap Measure and hold it lightly.',
  },
  done: {
    title: 'Measurement complete',
    body: 'The person can stand up.',
  },
};

export default function ScoliometerView() {
  const navigate = useNavigate();
  const { setRotation } = useScan();
  const { assistance } = useSession();

  const sensorExists = hasMotionSensor();

  const [motionReady, setMotionReady] = useState(
    () => sensorExists && !needsMotionPermission()
  );
  const [helperConfirmed, setHelperConfirmed] = useState(assistance !== 'solo');

  const [raw, setRaw] = useState<number | null>(null);
  const [step, setStep] = useState<Step>('zero1');
  const [measuring, setMeasuring] = useState(false);
  const [zeroA, setZeroA] = useState<number | null>(null);
  const [offset, setOffset] = useState<number | null>(null);
  const [upper, setUpper] = useState<number | null>(null);
  const [lower, setLower] = useState<number | null>(null);

  // Recent readings, used to detect when the phone is being held still
  const history = useRef<Sample[]>([]);
  const measuringRef = useRef(false);
  // Called with the median once a steady reading is captured. Kept in a ref so
  // the sensor listener always sees the latest step without re-subscribing.
  const onSteadyRef = useRef<(value: number) => void>(() => {});

  useEffect(() => {
    onSteadyRef.current = (value: number) => {
      setMeasuring(false);
      if (step === 'zero1') {
        setZeroA(value);
        setStep('zero2');
      } else if (step === 'zero2') {
        // Averaging the two orientations leaves only the sensor's own error
        setOffset(((zeroA ?? value) + value) / 2);
        setStep('upper');
      } else if (step === 'upper') {
        setUpper(value - (offset ?? 0));
        setStep('lower');
      } else if (step === 'lower') {
        setLower(value - (offset ?? 0));
        setStep('done');
      }
    };
  });

  useEffect(() => {
    if (!motionReady) return;

    function handle(e: DeviceOrientationEvent) {
      if (e.beta === null) return;
      const now = performance.now();
      setRaw(e.beta);

      const h = history.current;
      h.push({ t: now, v: e.beta });
      while (h.length > 0 && now - h[0].t > STEADY_MS) h.shift();

      if (!measuringRef.current) return;
      // Wait until the window covers (almost) the full steady period
      if (h.length < 5 || now - h[0].t < STEADY_MS * 0.9) return;

      const values = h.map((s) => s.v);
      if (Math.max(...values) - Math.min(...values) > STEADY_RANGE_DEG) return;

      measuringRef.current = false;
      onSteadyRef.current(median(values));
    }

    window.addEventListener('deviceorientation', handle);
    return () => window.removeEventListener('deviceorientation', handle);
  }, [motionReady]);

  function startMeasuring() {
    // Forget earlier readings so the tap and repositioning never count
    history.current = [];
    measuringRef.current = true;
    setMeasuring(true);
  }

  async function enableMotion() {
    setMotionReady(await requestMotionPermission());
  }

  function remeasureBack() {
    measuringRef.current = false;
    setMeasuring(false);
    setUpper(null);
    setLower(null);
    setStep('upper');
  }

  function finish() {
    if (upper !== null && lower !== null) {
      setRotation({ upper, lower });
    }
    navigate('/test/results');
  }

  const corrected = raw !== null && offset !== null ? raw - offset : null;

  // ---- Screens where measuring isn't possible ----

  if (!sensorExists) {
    return (
      <Blocked
        title="No tilt sensor"
        body="This device can't measure trunk rotation. Your results will note that this step was skipped."
        onSkip={() => navigate('/test/results')}
      />
    );
  }

  if (!helperConfirmed) {
    return (
      <div style={page}>
        <h1 style={title}>Trunk Rotation</h1>
        <div style={noticeCard}>
          <AlertTriangle size={22} color="#8a6d1e" style={{ flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, textAlign: 'left' }}>
            This step needs a second person to place the phone on your back while
            you bend forward. It's the most important measurement in the scan, so
            it's worth getting help if you can.
          </p>
        </div>
        <button onClick={() => setHelperConfirmed(true)} style={primaryButton}>
          Someone can help now
        </button>
        <button onClick={() => navigate('/test/results')} style={textButton}>
          Skip this step
        </button>
      </div>
    );
  }

  if (!motionReady) {
    return (
      <div style={page}>
        <h1 style={title}>Trunk Rotation</h1>
        <p style={subtitle}>This step uses your phone's tilt sensor.</p>
        <button onClick={enableMotion} style={primaryButton}>
          Allow motion access
        </button>
        <button onClick={() => navigate('/test/results')} style={textButton}>
          Skip this step
        </button>
      </div>
    );
  }

  // ---- Measuring ----

  const text = STEP_TEXT[step];

  return (
    <div style={page}>
      <h1 style={title}>Trunk Rotation</h1>

      <div style={readout}>
        <Smartphone size={22} color="#5a6b5e" />
        <div style={{ fontSize: 56, fontWeight: 800, color: '#14301f', lineHeight: 1.1 }}>
          {corrected !== null
            ? `${Math.abs(corrected).toFixed(1)}°`
            : raw !== null
              ? `${raw.toFixed(1)}°`
              : '—'}
        </div>
        <div style={{ fontSize: 12, color: '#8a978c' }}>
          {offset === null ? 'Uncalibrated reading' : 'Tilt across the back'}
        </div>
      </div>

      <div style={stepCard}>
        <b style={{ fontSize: 17, color: '#14301f' }}>{text.title}</b>
        <p style={{ margin: '8px 0 0', fontSize: 14, color: '#5a6b5e', lineHeight: 1.6 }}>
          {text.body}
        </p>
      </div>

      {step !== 'done' ? (
        <button
          onClick={startMeasuring}
          disabled={measuring}
          style={{ ...primaryButton, opacity: measuring ? 0.6 : 1 }}
        >
          {measuring ? 'Hold still…' : 'Measure'}
        </button>
      ) : (
        <>
          <div style={resultCard}>
            <CheckCircle2 size={24} color="#1c6b3a" style={{ flexShrink: 0 }} />
            <div style={{ textAlign: 'left', fontSize: 15, color: '#14301f' }}>
              <div>Upper back: <b>{Math.abs(upper ?? 0).toFixed(1)}°</b></div>
              <div>Lower back: <b>{Math.abs(lower ?? 0).toFixed(1)}°</b></div>
            </div>
          </div>
          <button onClick={finish} style={primaryButton}>
            See results →
          </button>
          <button onClick={remeasureBack} style={textButton}>
            Measure the back again
          </button>
        </>
      )}

      {step === 'lower' && upper !== null && (
        <p style={{ fontSize: 13, color: '#8a978c', marginTop: 12 }}>
          Upper back recorded: {Math.abs(upper).toFixed(1)}°
        </p>
      )}
    </div>
  );
}

function Blocked({ title: t, body, onSkip }: { title: string; body: string; onSkip: () => void }) {
  return (
    <div style={page}>
      <h1 style={title}>{t}</h1>
      <p style={subtitle}>{body}</p>
      <button onClick={onSkip} style={primaryButton}>
        Continue to results
      </button>
    </div>
  );
}

// ---- styles ----
const page: React.CSSProperties = {
  padding: '24px 24px 40px',
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
  margin: '8px 0 12px',
};

const subtitle: React.CSSProperties = {
  fontSize: 15,
  color: '#4a5a4f',
  lineHeight: 1.5,
  margin: '0 0 20px',
};

const readout: React.CSSProperties = {
  background: 'white',
  borderRadius: 24,
  padding: '24px 16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 6,
  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
};

const stepCard: React.CSSProperties = {
  background: '#eff4ef',
  borderRadius: 18,
  padding: 20,
  marginTop: 16,
  textAlign: 'left',
};

const noticeCard: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  alignItems: 'flex-start',
  background: '#fdf6e3',
  border: '1px solid #e8d9a8',
  borderRadius: 16,
  padding: 18,
  color: '#6b5a1e',
};

const resultCard: React.CSSProperties = {
  display: 'flex',
  gap: 14,
  alignItems: 'center',
  background: '#dff0df',
  borderRadius: 18,
  padding: 20,
  marginTop: 16,
};

const primaryButton: React.CSSProperties = {
  display: 'block',
  width: '100%',
  marginTop: 20,
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

const textButton: React.CSSProperties = {
  display: 'block',
  margin: '12px auto 0',
  background: 'none',
  border: 'none',
  fontSize: 14,
  color: '#5a6b5e',
  textDecoration: 'underline',
  font: 'inherit',
  cursor: 'pointer',
};