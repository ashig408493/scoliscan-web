import { useNavigate } from 'react-router-dom';
import { Stethoscope, RefreshCw, CheckCircle2, Info, HeartPulse, AlertTriangle } from 'lucide-react';
import { useScan } from '../useScan';
import { useSession } from '../useSession';
import { saveScan } from '../storage';
import { classifyScan, type Outcome } from '../classify';
import type { ScanData } from '../ScanContext';

// What each outcome says. Every message is an action, never a diagnosis.
type OutcomeStyle = { title: string; body: string; Icon: typeof Info; bg: string; fg: string };

const OUTCOME_TEXT: Record<Outcome, OutcomeStyle> = {
  clinician: {
    title: 'We recommend seeing a clinician',
    body: "Your results reached the level where doctors usually order an X-ray. This doesn't mean you have scoliosis. Only a clinician can tell, and many people referred turn out to be fine.",
    Icon: Stethoscope,
    bg: '#fdeee0',
    fg: '#7a3e12',
  },
  recheck: {
    title: 'Scan again in a few months',
    body: "Some findings are borderline. They're worth checking again, and sooner if you notice any change in how your back or shoulders look.",
    Icon: RefreshCw,
    bg: '#fdf6e3',
    fg: '#6b5a1e',
  },
  clear: {
    title: 'No signs found',
    body: "Nothing in this scan met a screening threshold. This doesn't rule out scoliosis. If you notice changes, scan again or talk to a doctor.",
    Icon: CheckCircle2,
    bg: '#dff0df',
    fg: '#1c4a2c',
  },
  limited: {
    title: 'Limited scan',
    body: "The camera didn't pick up clear signs, but trunk rotation (the main screening test) wasn't measured, so this scan can't give a full picture.",
    Icon: Info,
    bg: '#e8f0fb',
    fg: '#1f4a7a',
  },
};

// Shown instead of the normal "recheck" message when trunk rotation wasn't
// measured (solo mode, or no motion sensor) but enough signs were found.
// Without rotation the app can't recommend a clinician on its own, so it asks
// the user to finish the test with a helper or get checked to be safe.
const RECHECK_NO_ROTATION: OutcomeStyle = {
  title: 'Serious signs detected',
  body: 'Please try to do a scan on this app with a helper to check your trunk rotation, or go to a certified professional if you would like to be safer.',
  Icon: AlertTriangle,
  bg: '#fdeee0',
  fg: '#7a3e12',
};

// Format a stored value, which may be null in older or partial scans
function fmt(n: unknown, digits = 3, unit = ''): string {
  return typeof n === 'number' && Number.isFinite(n) ? n.toFixed(digits) + unit : '—';
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 0',
        borderBottom: '1px solid #e0e6e0',
      }}
    >
      <span style={{ color: '#5a6b5e', fontSize: 14 }}>{label}</span>
      <b style={{ color: '#14301f', fontSize: 14 }}>{value}</b>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#eff4ef',
        borderRadius: 18,
        padding: 20,
        margin: '16px 0',
        textAlign: 'left',
      }}
    >
      <h3 style={{ margin: '0 0 6px', color: '#14301f', fontSize: 17 }}>{title}</h3>
      {children}
    </div>
  );
}

export default function ResultsView() {
  const navigate = useNavigate();
  const { front, back, side, rotation, reset } = useScan();
  const { context } = useSession();

  const hasData = Boolean(front || back || side || rotation);

  const result = classifyScan({
    front,
    back,
    rotation,
    highBmi: context.highBmi === true,
    familyHistory: context.familyHistory === 'yes',
    backPain: context.backPain === 'severe',
  });
  const text =
    result.outcome === 'recheck' && result.maxRotation === null
      ? RECHECK_NO_ROTATION
      : OUTCOME_TEXT[result.outcome];
  const OutcomeIcon = text.Icon;

  function startOver() {
    // Save raw measurements only. The outcome is recalculated whenever a scan
    // is displayed, so retuning a threshold updates every past scan too.
    if (hasData) {
      // The questionnaire is saved as yes/no flags only. Height and weight
      // are never stored anywhere.
      const saved: ScanData = {};
      if (context.highBmi !== null) saved.highBmi = context.highBmi ? 1 : 0;
      if (context.familyHistory) saved.familyHistory = context.familyHistory === 'yes' ? 1 : 0;
      if (context.backPain) saved.backPain = context.backPain === 'severe' ? 1 : 0;

      saveScan({ front, back, side, rotation, context: saved });
    }
    reset();
    navigate('/');
  }

  return (
    <div style={page}>
      <h1 style={title}>Your Results</h1>

      {hasData ? (
        <>
          {/* Outcome */}
          <div style={{ ...outcomeCard, background: text.bg, color: text.fg }}>
            <OutcomeIcon size={28} style={{ flexShrink: 0 }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 19, fontWeight: 700 }}>{text.title}</div>
              <p style={{ margin: '6px 0 0', fontSize: 14, lineHeight: 1.6 }}>{text.body}</p>
            </div>
          </div>

          {/* Pain: separate from the scoliosis outcome */}
          {result.painFlag && (
            <div style={{ ...outcomeCard, background: '#fdeaea', color: '#8a2f2f', marginTop: 12 }}>
              <HeartPulse size={26} style={{ flexShrink: 0 }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 17, fontWeight: 700 }}>
                  Please see a doctor about your back pain soon
                </div>
                <p style={{ margin: '6px 0 0', fontSize: 14, lineHeight: 1.6 }}>
                  Back pain that happens often, or wakes you up at night, isn't normal at
                  your age and should be checked, whatever this scan shows. Tell a parent
                  or guardian so they can help you make an appointment.
                </p>
                <p style={{ margin: '8px 0 0', fontSize: 14, lineHeight: 1.6, fontWeight: 700 }}>
                  Get help right away if you also have numbness or weakness in your legs,
                  changes in bladder or bowel control, a fever, or pain after an injury.
                </p>
              </div>
            </div>
          )}

          {/* Why */}
          <Section title="What we found">
            {result.maxRotation !== null ? (
              <Row label="Highest trunk rotation" value={`${result.maxRotation.toFixed(1)}°`} />
            ) : (
              <Row label="Trunk rotation" value="Not measured" />
            )}
            {context.familyHistory === 'yes' && (
              <Row label="Family history" value="Parent or sibling" />
            )}
            {result.signs.length === 0 ? (
              <p style={note}>No visible asymmetry crossed a threshold.</p>
            ) : (
              <ul style={{ margin: '10px 0 0', paddingLeft: 20, color: '#14301f', fontSize: 14 }}>
                {result.signs.map((s) => (
                  <li key={s.id} style={{ marginBottom: 4 }}>{s.label}</li>
                ))}
              </ul>
            )}
            {result.maxRotation !== null && context.highBmi === null && (
              <p style={note}>
                Height and weight weren't provided, so the standard rotation
                threshold was used.
              </p>
            )}
            <p style={note}>
              Trunk rotation is the main screening measurement. The camera findings
              are supporting signs and are less reliable on their own.
            </p>
          </Section>

          {/* Raw measurements */}
          {rotation && (
            <Section title="Trunk Rotation">
              <Row label="Upper back" value={fmt(Math.abs(rotation.upper), 1, '°')} />
              <Row label="Lower back" value={fmt(Math.abs(rotation.lower), 1, '°')} />
            </Section>
          )}

          {front && (
            <Section title="Front View">
              <Row label="Shoulder tilt" value={fmt(front.shoulder, 1, '°')} />
              <Row label="Hip lean" value={fmt(front.hipLean)} />
              <Row label="Head lean" value={fmt(front.headLean)} />
            </Section>
          )}

          {back && (
            <Section title="Back View">
              <Row label="Plumb offset" value={fmt(back.plumb)} />
              <Row label="Shoulder tilt" value={fmt(back.shoulder, 1, '°')} />
              <Row label="Hip tilt" value={fmt(back.hip, 1, '°')} />
              <Row label="Left arm gap" value={fmt(back.leftArm)} />
              <Row label="Right arm gap" value={fmt(back.rightArm)} />
            </Section>
          )}

          {side && (
            <Section title="Forward Bend Position">
              <Row label="Hip bend" value={fmt(side.hipBend, 0, '°')} />
              <Row label="Knee angle" value={fmt(side.kneeAngle, 0, '°')} />
              <p style={note}>
                These confirm you were positioned correctly. They aren't measures of
                spinal curvature.
              </p>
            </Section>
          )}
        </>
      ) : (
        <p style={{ textAlign: 'center', color: '#8a978c', marginTop: 40 }}>
          No measurements recorded yet.
        </p>
      )}

      <p style={{ ...note, margin: '20px 0' }}>
        ScoliScan is a screening aid, not a medical assessment. It cannot confirm or
        rule out scoliosis. If you have any concerns about your back, speak to a doctor.
      </p>

      <button onClick={startOver} style={primaryButton}>
        Save &amp; Finish
      </button>
    </div>
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
  margin: '0 0 16px',
  textAlign: 'center',
};

const outcomeCard: React.CSSProperties = {
  display: 'flex',
  gap: 14,
  alignItems: 'flex-start',
  borderRadius: 18,
  padding: 20,
};

const note: React.CSSProperties = {
  margin: '10px 0 0',
  fontSize: 12.5,
  color: '#8a978c',
  lineHeight: 1.6,
};

const primaryButton: React.CSSProperties = {
  display: 'block',
  width: '100%',
  marginTop: 8,
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