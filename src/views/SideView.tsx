import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, CheckCircle2 } from 'lucide-react';
import PoseCamera, { type Landmark } from '../components/PoseCamera';
import { useScan } from '../useScan';
import { StepDots } from './FrontView';
import { speak, stopSpeaking, isSpeechSupported } from '../speech';
import {
  hipBend,
  kneeAngle,
  checkFraming,
  framingMessage,
  type FramingIssue,
} from '../metrics';

// What counts as correctly bent. Tune against real posture.
const HIP_BEND_TARGET = 90;
const HIP_BEND_TOLERANCE = 25;
const KNEE_STRAIGHT_MIN = 150;

// How long the posture must be held before we lock it in
const HOLD_SECONDS = 3;

export default function SideView() {
  const navigate = useNavigate();
  const { setSide } = useScan();

  const [bend, setBend] = useState<number | null>(null);
  const [knee, setKnee] = useState<number | null>(null);
  const [framing, setFraming] = useState<FramingIssue>('ok');
  const [remaining, setRemaining] = useState<number | null>(null);
  const [lockedIn, setLockedIn] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);

  // Timestamp when the correct posture was first reached. A ref, not state,
  // so updating it doesn't re-render on every frame.
  const holdStart = useRef<number | null>(null);
  // The latch has to be readable inside the frame callback without a stale closure
  const lockedRef = useRef(false);

  useEffect(() => stopSpeaking, []);

  function handleLandmarks(lm: Landmark[]) {
    const issue = checkFraming(lm);
    setFraming(issue);

    const b = hipBend(lm);
    const k = kneeAngle(lm);
    setBend(b);
    setKnee(k);

    // Once locked in, stop evaluating. A wobble after the position has been
    // proven shouldn't send the person back to the start.
    if (lockedRef.current) return;

    const goodBend = Math.abs(b - HIP_BEND_TARGET) <= HIP_BEND_TOLERANCE;
    const kneesStraight = k >= KNEE_STRAIGHT_MIN;

    if (issue !== 'ok') {
      holdStart.current = null;
      setRemaining(null);
      if (voiceOn) speak(framingMessage(issue));
      return;
    }

    if (!goodBend) {
      holdStart.current = null;
      setRemaining(null);
      if (voiceOn) {
        speak(
          b > HIP_BEND_TARGET
            ? 'Bend forward further.'
            : 'You are bent too far. Come up slightly.'
        );
      }
      return;
    }

    if (!kneesStraight) {
      holdStart.current = null;
      setRemaining(null);
      if (voiceOn) speak('Straighten your knees.');
      return;
    }

    // Posture is correct — start or continue the hold timer
    if (holdStart.current === null) {
      holdStart.current = Date.now();
      if (voiceOn) speak('Good. Hold this position.');
    }

    const elapsed = (Date.now() - holdStart.current) / 1000;
    if (elapsed >= HOLD_SECONDS) {
      lockedRef.current = true;
      setLockedIn(true);
      setRemaining(null);
      setSide({ hipBend: b, kneeAngle: k });
      if (voiceOn) speak('Position confirmed. You can stand up.');
    } else {
      setRemaining(HOLD_SECONDS - elapsed);
    }
  }

  function handleNoPerson() {
    setBend(null);
    setKnee(null);
    if (!lockedRef.current) {
      holdStart.current = null;
      setRemaining(null);
      if (voiceOn) speak('Step back into view.');
    }
  }

  function restart() {
    lockedRef.current = false;
    setLockedIn(false);
    holdStart.current = null;
    setRemaining(null);
  }

  function toggleVoice() {
    if (voiceOn) stopSpeaking();
    setVoiceOn(!voiceOn);
  }

  return (
    <div style={page}>
      <div style={headerRow}>
        <h1 style={title}>Forward Bend</h1>
        {isSpeechSupported() && (
          <button onClick={toggleVoice} style={voiceButton} aria-label="Toggle voice guidance">
            {voiceOn ? <Volume2 size={20} color="#14301f" /> : <VolumeX size={20} color="#8a978c" />}
          </button>
        )}
      </div>
      <p style={subtitle}>
        Stand with your <b>left side</b> to the camera, then bend forward at the
        waist with your knees straight and arms hanging down.
      </p>

      <PoseCamera onLandmarks={handleLandmarks} onNoPerson={handleNoPerson} />

      <div style={statusStrip}>
        {bend === null ? (
          <span style={{ color: '#8a978c' }}>No person detected</span>
        ) : (
          <>
            <Stat label="Hip bend" value={`${bend.toFixed(0)}°`} target="~90°" />
            <Stat label="Knees" value={`${knee!.toFixed(0)}°`} target="straight" />
          </>
        )}
      </div>

      {lockedIn ? (
        <div style={confirmedCard}>
          <CheckCircle2 size={28} color="#1c6b3a" style={{ flexShrink: 0 }} />
          <div style={{ textAlign: 'left', flex: 1 }}>
            <b style={{ color: '#14301f', fontSize: 16 }}>Position confirmed</b>
            <p
              style={{
                margin: '4px 0 0',
                fontSize: 13.5,
                color: '#5a6b5e',
                lineHeight: 1.6,
              }}
            >
              You can stand up while your helper calibrates the phone. You'll
              then bend forward the same way for the rotation reading.
            </p>
          </div>
        </div>
      ) : (
        <div style={guidanceCard}>
          {framing !== 'ok' && bend !== null ? (
            <b>{framingMessage(framing)}</b>
          ) : remaining !== null ? (
            <b style={{ fontSize: 18 }}>Hold still… {remaining.toFixed(1)}s</b>
          ) : bend === null ? (
            <span style={{ color: '#8a978c' }}>Waiting for you to step into frame…</span>
          ) : (
            <b>Bend forward with straight knees</b>
          )}
        </div>
      )}

      {lockedIn && (
        <>
          <button onClick={() => navigate('/test/scoliometer')} style={primaryButton}>
            Continue →
          </button>
          <button onClick={restart} style={textButton}>
            Reposition
          </button>
        </>
      )}

      <StepDots step={3} />
    </div>
  );
}

function Stat({
  label,
  value,
  target,
}: {
  label: string;
  value: string;
  target: string;
}) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 11, color: '#8a978c' }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#14301f' }}>{value}</div>
      <div style={{ fontSize: 10, color: '#a9b5aa' }}>{target}</div>
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
  fontSize: 14.5,
  color: '#4a5a4f',
  lineHeight: 1.55,
  margin: '0 0 20px',
};

const statusStrip: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  background: '#eff4ef',
  borderRadius: 16,
  padding: '12px 8px',
  marginTop: 16,
  minHeight: 56,
};

const guidanceCard: React.CSSProperties = {
  background: '#e8f0fb',
  border: '1px solid #b9d2f0',
  borderRadius: 16,
  padding: 18,
  marginTop: 16,
  color: '#1f4a7a',
  minHeight: 24,
};

const confirmedCard: React.CSSProperties = {
  display: 'flex',
  gap: 14,
  alignItems: 'flex-start',
  background: '#dff0df',
  borderRadius: 18,
  padding: 20,
  marginTop: 16,
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