import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Smartphone,
  Users,
  User,
  Check,
  AlertTriangle,
  ClipboardList,
} from 'lucide-react';
import { useSession } from '../useSession';
import type { FamilyHistory, BackPain } from '../SessionContext';
import {
  hasMotionSensor,
  needsMotionPermission,
  requestMotionPermission,
  requestCameraPermission,
} from '../sensors';
import { loadBmiTable, isBmiAt85thOrAbove, type Sex } from '../bmi';

type Units = 'us' | 'metric';

export default function SetupView() {
  const navigate = useNavigate();
  const { assistance, setAssistance, setTiltAvailable, context, setContext } = useSession();

  const sensorExists = hasMotionSensor();
  const autoGranted = sensorExists && !needsMotionPermission();

  const [cameraGranted, setCameraGranted] = useState(false);
  const [tiltGranted, setTiltGranted] = useState(() => autoGranted);
  const [tiltAsked, setTiltAsked] = useState(() => autoGranted);

  // Body details live only in this screen. They're used once to decide which
  // rotation cutoff applies, then discarded: never saved, never shown back.
  const [age, setAge] = useState('');
  // 'other' means sex isn't used: no growth-chart lookup, standard cutoff.
  const [sex, setSex] = useState<Sex | 'other' | null>(null);
  const [units, setUnits] = useState<Units>('us');
  const [heightA, setHeightA] = useState(''); // cm, or feet
  const [heightB, setHeightB] = useState(''); // inches (US units only)
  const [weight, setWeight] = useState(''); // kg or lb
  const [starting, setStarting] = useState(false);

  async function askCamera() {
    setCameraGranted(await requestCameraPermission());
  }

  async function askTilt() {
    const ok = await requestMotionPermission();
    setTiltGranted(ok);
    setTiltAvailable(ok);
    setTiltAsked(true);
  }

  function heightCm(): number | null {
    const a = parseFloat(heightA);
    if (units === 'metric') return a > 0 ? a : null;
    const inches = (a > 0 ? a : 0) * 12 + (parseFloat(heightB) || 0);
    return inches > 0 ? inches * 2.54 : null;
  }

  function weightKg(): number | null {
    const w = parseFloat(weight);
    if (!(w > 0)) return null;
    return units === 'metric' ? w : w * 0.45359237;
  }

  async function start() {
    setStarting(true);

    let highBmi: boolean | null = null;
    const ageYears = parseInt(age, 10);
    const h = heightCm();
    const w = weightKg();

    // The CDC growth charts only have male and female tables, so the BMI check
    // runs only for those. 'Other' skips it and the standard cutoff is used.
    if ((sex === 'male' || sex === 'female') && Number.isFinite(ageYears) && h && w) {
      try {
        const rows = await loadBmiTable();
        highBmi = isBmiAt85thOrAbove(rows, sex, ageYears, h, w);
      } catch (err) {
        // Missing or unreadable data file: fall back to the standard cutoff
        console.error(err);
        highBmi = null;
      }
    }

    setContext({ ...context, highBmi });
    navigate('/test/front');
  }

  return (
    <div style={page}>
      <h1 style={title}>Before you start</h1>
      <p style={subtitle}>A few quick things so the scan works properly.</p>

      {/* 1. Who's running the test */}
      <div style={card}>
        <h3 style={cardTitle}>Is anyone helping you?</h3>
        <p style={cardBody}>
          This changes how the scan is controlled, and one step (measuring trunk
          rotation) needs a second person.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
          <ChoiceButton
            selected={assistance === 'assisted'}
            onClick={() => setAssistance('assisted')}
            Icon={Users}
            label="Someone's helping"
            detail="They tap capture"
          />
          <ChoiceButton
            selected={assistance === 'solo'}
            onClick={() => setAssistance('solo')}
            Icon={User}
            label="I'm on my own"
            detail="Hands-free timer"
          />
        </div>
      </div>

      {/* 2. About you (optional) */}
      <div style={card}>
        <div style={cardHeader}>
          <div style={iconCircle}>
            <ClipboardList size={20} color="#1c3d2a" />
          </div>
          <h3 style={{ ...cardTitle, margin: 0 }}>About you (optional)</h3>
        </div>
        <p style={cardBody}>
          Body size affects the rotation reading, so this helps the app use the
          right threshold. Your height and weight are only used on this screen.
          They're never saved or shown.
        </p>

        <Label>Age</Label>
        <input
          type="number"
          inputMode="numeric"
          min={8}
          max={19}
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Years"
          style={input}
        />

        <Label>Sex (used for growth charts)</Label>
        <Pills<Sex | 'other'>
          options={[
            { value: 'female', label: 'Female' },
            { value: 'male', label: 'Male' },
            { value: 'other', label: 'Other' },
          ]}
          value={sex}
          onChange={setSex}
        />

        <Label>Units</Label>
        <Pills
          options={[
            { value: 'us', label: 'ft / lb' },
            { value: 'metric', label: 'cm / kg' },
          ]}
          value={units}
          onChange={(u) => {
            setUnits(u);
            setHeightA('');
            setHeightB('');
            setWeight('');
          }}
        />

        <Label>Height</Label>
        {units === 'us' ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="number"
              inputMode="numeric"
              value={heightA}
              onChange={(e) => setHeightA(e.target.value)}
              placeholder="ft"
              style={input}
            />
            <input
              type="number"
              inputMode="numeric"
              value={heightB}
              onChange={(e) => setHeightB(e.target.value)}
              placeholder="in"
              style={input}
            />
          </div>
        ) : (
          <input
            type="number"
            inputMode="numeric"
            value={heightA}
            onChange={(e) => setHeightA(e.target.value)}
            placeholder="cm"
            style={input}
          />
        )}

        <Label>Weight</Label>
        <input
          type="number"
          inputMode="decimal"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder={units === 'us' ? 'lb' : 'kg'}
          style={input}
        />

        <Label>Has a parent, brother, or sister been diagnosed with scoliosis?</Label>
        <Pills<FamilyHistory>
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
            { value: 'unsure', label: 'Not sure' },
          ]}
          value={context.familyHistory}
          onChange={(v) => setContext({ ...context, familyHistory: v })}
        />

        <Label>Do you have back pain?</Label>
        <Pills<BackPain>
          options={[
            { value: 'none', label: 'No' },
            { value: 'some', label: 'Sometimes' },
            { value: 'severe', label: 'Often, or at night' },
          ]}
          value={context.backPain}
          onChange={(v) => setContext({ ...context, backPain: v })}
        />
      </div>

      {/* 3. Camera permission */}
      <div style={card}>
        <div style={cardHeader}>
          <div style={iconCircle}>
            <Camera size={20} color="#1c3d2a" />
          </div>
          <h3 style={{ ...cardTitle, margin: 0 }}>Camera access</h3>
          {cameraGranted && <Check size={20} color="#1c6b3a" />}
        </div>
        <p style={cardBody}>
          Needed to measure your posture. Video is processed on this device and
          never uploaded.
        </p>
        {!cameraGranted && (
          <button onClick={askCamera} style={permissionButton}>
            Allow camera
          </button>
        )}
      </div>

      {/* 4. Motion sensor */}
      <div style={card}>
        <div style={cardHeader}>
          <div style={iconCircle}>
            <Smartphone size={20} color="#1c3d2a" />
          </div>
          <h3 style={{ ...cardTitle, margin: 0 }}>Tilt sensor</h3>
          {tiltGranted && <Check size={20} color="#1c6b3a" />}
        </div>

        {!sensorExists ? (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <AlertTriangle size={18} color="#8a6d1e" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={cardBody}>
              This device doesn't have a tilt sensor, so the trunk rotation step
              will be skipped. That's the measurement clinicians rely on most, so
              for a fuller scan, use a phone or tablet.
            </p>
          </div>
        ) : (
          <>
            <p style={cardBody}>
              Used to measure trunk rotation while you bend forward, the same
              thing a clinician's scoliometer measures.
            </p>
            {!tiltAsked && (
              <button onClick={askTilt} style={permissionButton}>
                Allow motion access
              </button>
            )}
            {tiltAsked && !tiltGranted && (
              <p style={{ ...cardBody, color: '#8a6d1e', marginTop: 8 }}>
                Motion access was declined, so the rotation step will be skipped.
                You can re-enable it in your browser settings.
              </p>
            )}
          </>
        )}
      </div>

      <button
        onClick={start}
        disabled={!cameraGranted || starting}
        style={{ ...primaryButton, opacity: cameraGranted && !starting ? 1 : 0.5 }}
      >
        {starting ? 'Starting…' : 'Start scan →'}
      </button>
      {!cameraGranted && (
        <p style={{ ...cardBody, textAlign: 'center', marginTop: 10 }}>
          Camera access is required to continue.
        </p>
      )}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 13.5, fontWeight: 600, color: '#14301f', margin: '16px 0 8px' }}>
      {children}
    </div>
  );
}

function Pills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {options.map((o) => {
        const selected = value === o.value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            style={{
              flex: 1,
              minWidth: 80,
              padding: '10px 12px',
              borderRadius: 20,
              border: `1.5px solid ${selected ? '#1c3d2a' : '#d3ded4'}`,
              background: selected ? 'white' : 'transparent',
              color: selected ? '#14301f' : '#5a6b5e',
              fontWeight: 600,
              fontSize: 13.5,
              font: 'inherit',
              cursor: 'pointer',
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function ChoiceButton({
  selected,
  onClick,
  Icon,
  label,
  detail,
}: {
  selected: boolean;
  onClick: () => void;
  Icon: typeof Users;
  label: string;
  detail: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '16px 10px',
        borderRadius: 16,
        border: `1.5px solid ${selected ? '#1c3d2a' : '#d3ded4'}`,
        background: selected ? 'white' : 'transparent',
        cursor: 'pointer',
        font: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <Icon size={22} color={selected ? '#1c3d2a' : '#8a978c'} />
      <span style={{ fontSize: 13.5, fontWeight: 600, color: selected ? '#14301f' : '#5a6b5e' }}>
        {label}
      </span>
      <span style={{ fontSize: 11, color: '#8a978c' }}>{detail}</span>
    </button>
  );
}

// ---- styles ----
const page: React.CSSProperties = {
  padding: '24px 24px 40px',
  maxWidth: 520,
  margin: '0 auto',
  background: '#eef5ee',
  minHeight: '100vh',
};

const title: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 800,
  color: '#14301f',
  margin: '0 0 8px',
  textAlign: 'center',
};

const subtitle: React.CSSProperties = {
  fontSize: 15,
  color: '#5a6b5e',
  textAlign: 'center',
  margin: '0 0 20px',
};

const card: React.CSSProperties = {
  background: '#eff4ef',
  borderRadius: 18,
  padding: 20,
  margin: '14px 0',
};

const cardHeader: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  marginBottom: 10,
};

const iconCircle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 20,
  background: '#dde8de',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const cardTitle: React.CSSProperties = {
  margin: '0 0 6px',
  color: '#14301f',
  fontSize: 17,
  fontWeight: 600,
  flex: 1,
};

const cardBody: React.CSSProperties = {
  margin: 0,
  fontSize: 13.5,
  color: '#5a6b5e',
  lineHeight: 1.65,
};

const input: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '12px 14px',
  fontSize: 15,
  borderRadius: 12,
  border: '1.5px solid #d3ded4',
  background: 'white',
  color: '#14301f',
  font: 'inherit',
};

const permissionButton: React.CSSProperties = {
  marginTop: 12,
  padding: '12px 24px',
  fontSize: 14,
  fontWeight: 600,
  color: '#14301f',
  background: 'white',
  border: '1.5px solid #1c3d2a',
  borderRadius: 24,
  font: 'inherit',
  cursor: 'pointer',
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