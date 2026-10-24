import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX } from 'lucide-react';
import PoseCamera, { type Landmark } from '../components/PoseCamera';
import { useScan } from '../useScan';
import { useSession } from '../useSession';
import { StepDots } from './FrontView';
import { speak, stopSpeaking, isSpeechSupported } from '../speech';
import {
  plumbOffset,
  hipAngle,
  shoulderAngle,
  leftArmHipRatio,
  rightArmHipRatio,
  isFacingCamera,
  checkFraming,
  framingMessage,
  areLandmarksVisible,
  type FramingIssue,
} from '../metrics';

type Metrics = {
  plumb: number;
  shoulder: number;
  hip: number;
  leftArm: number;
  rightArm: number;
};

const FRAMES_NEEDED = 30;
// Longer than the front view — the user has to turn around and settle first,
// and they can't see the screen to know how long they have.
const AUTO_DELAY_SECONDS = 8;

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export default function BackView() {
  const navigate = useNavigate();
  const { setBack } = useScan();
  const { assistance } = useSession();
  const solo = assistance === 'solo';

  const [live, setLive] = useState<Metrics | null>(null);
  const [captured, setCaptured] = useState<Metrics | null>(null);
  const [collecting, setCollecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [facingWarning, setFacingWarning] = useState(false);
  const [dismissedFacing, setDismissedFacing] = useState(false);
  const [interrupted, setInterrupted] = useState(false);
  const [framing, setFraming] = useState<FramingIssue>('ok');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [voiceOn, setVoiceOn] = useState(true);

  const samples = useRef<Metrics[]>([]);
  const countdownStart = useRef<number | null>(null);
  const collectingRef = useRef(false);
  const capturedRef = useRef(false);

  useEffect(() => {
    collectingRef.current = collecting;
  }, [collecting]);

  useEffect(() => stopSpeaking, []);
  
  function beginCollecting() {
    samples.current = [];
    setProgress(0);
    setCaptured(null);
    setDismissedFacing(false);
    setInterrupted(false);
    countdownStart.current = null;
    setCountdown(null);
    setCollecting(true);
    // The one spoken cue — the user is facing away and can't see the screen
    if (voiceOn) speak('Capturing now. Hold still.');
  }

  function handleLandmarks(lm: Landmark[]) {
    const issue = checkFraming(lm);
    setFraming(issue);

    const facing = isFacingCamera(lm);
    setFacingWarning(facing);

    const m: Metrics = {
      plumb: plumbOffset(lm),
      shoulder: shoulderAngle(lm),
      hip: hipAngle(lm),
      leftArm: leftArmHipRatio(lm),
      rightArm: rightArmHipRatio(lm),
    };
    setLive(m);

    // Guidance speech, most important issue first. Suppressed while collecting
    // so it can't talk over the capture cue.
    if (voiceOn && !collectingRef.current && !capturedRef.current) {
      if (issue !== 'ok') {
        speak(framingMessage(issue));
      } else if (facing) {
        speak('Please turn around so your back faces the camera.');
      }
    }

    // Landmarks that aren't genuinely visible are estimates, so a reading built
    // on them would be meaningless. Cancel rather than record garbage.
    if (collectingRef.current && !areLandmarksVisible(lm)) {
      samples.current = [];
      setProgress(0);
      setCollecting(false);
      setInterrupted(true);
      if (voiceOn) speak('Capture stopped. Step back into view.');
      return;
    }

    // ---- Solo mode: wait for good framing, then capture automatically ----
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
          plumb: median(all.map((s) => s.plumb)),
          shoulder: median(all.map((s) => s.shoulder)),
          hip: median(all.map((s) => s.hip)),
          leftArm: median(all.map((s) => s.leftArm)),
          rightArm: median(all.map((s) => s.rightArm)),
        });
        capturedRef.current = true;
        setCollecting(false);
        samples.current = [];
        if (voiceOn) speak('Done. You can turn around.');
      }
    }
  }

  function handleNoPerson() {
    setLive(null);
    setFacingWarning(false);
    setFraming('ok');
    countdownStart.current = null;
    setCountdown(null);
    if (voiceOn && !capturedRef.current) speak('Step back into view.');
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
      setBack(captured);
      navigate('/test/side');
    }
  }

  function toggleVoice() {
    if (voiceOn) stopSpeaking();
    setVoiceOn(!voiceOn);
  }

  const canCapture = live !== null && framing === 'ok' && !collecting;

  return (
    <div style={page}>
      <div style={headerRow}>
        <h1 style={title}>Back View</h1>
        {isSpeechSupported() && (
          <button onClick={toggleVoice} style={voiceButton} aria-label="Toggle voice guidance">
            {voiceOn ? <Volume2 size={20} color="#14301f" /> : <VolumeX size={20} color="#8a978c" />}
          </button>
        )}
      </div>
      <p style={subtitle}>Turn around so your back faces the camera.</p>

      <div style={{ position: 'relative' }}>
        <PoseCamera onLandmarks={handleLandmarks} onNoPerson={handleNoPerson} />

        {countdown !== null && !captured && (
          <div style={countdownOverlay}>{Math.ceil(countdown)}</div>
        )}

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
            <Stat label="Plumb" value={live.plumb.toFixed(2)} />
            <Stat label="Shoulder" value={`${live.shoulder.toFixed(1)}°`} />
            <Stat label="Hip" value={`${live.hip.toFixed(1)}°`} />
            <Stat
              label="Arm L/R"
              value={`${live.leftArm.toFixed(2)}/${live.rightArm.toFixed(2)}`}
            />
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

      {facingWarning && !dismissedFacing && (
        <div style={warningCard}>
          <b>You appear to be facing the camera.</b>
          <p style={{ margin: '8px 0 12px', fontSize: 13.5, lineHeight: 1.6 }}>
            This measurement needs your back to the camera. Please turn around.
          </p>
          <button onClick={() => setDismissedFacing(true)} style={smallButton}>
            Continue anyway
          </button>
        </div>
      )}

      {captured ? (
        <div style={capturedCard}>
          <b style={{ color: '#14301f' }}>Captured</b>
          <div style={{ marginTop: 8, fontSize: 14, color: '#5a6b5e' }}>
            Plumb {captured.plumb.toFixed(2)} · Shoulder{' '}
            {captured.shoulder.toFixed(1)}° · Hip {captured.hip.toFixed(1)}°
          </div>
          <button onClick={goNext} style={primaryButton}>
            Next: Forward Bend →
          </button>
          <button onClick={retake} style={textButton}>
            Retake
          </button>
        </div>
      ) : solo ? (
        <div style={soloCard}>
          {collecting
            ? 'Measuring — hold still'
            : countdown !== null
              ? `Capturing in ${Math.ceil(countdown)}s — turn around and hold still`
              : 'Turn your back to the camera to begin'}
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

      <StepDots step={2} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 11, color: '#8a978c' }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#14301f' }}>{value}</div>
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

const headerRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
};

const title: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 800,
  color: '#14301f',
  margin: '8px 0 8px',
};

const voiceButton: React.CSSProperties = {
  position: 'absolute',
  right: 0,
  background: 'white',
  border: 'none',
  borderRadius: 20,
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

const subtitle: React.CSSProperties = {
  fontSize: 15,
  color: '#4a5a4f',
  lineHeight: 1.5,
  margin: '0 0 20px',
};

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