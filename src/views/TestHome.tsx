import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarClock } from 'lucide-react';
import { isScanDue, loadScans } from '../storage';

export default function TestHome() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [due] = useState(() => isScanDue());
  const [hasScans] = useState(() => loadScans().length > 0);

  // Plain camera preview — no pose detection needed on this screen
  useEffect(() => {
    let stream: MediaStream | null = null;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' } })
      .then((s) => {
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => {
        // Preview is optional here — the setup screen handles permissions
      });

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div
      style={{
        padding: '16px 24px 24px',
        maxWidth: 520,
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      {/* Due prompt — only when the chosen interval has passed */}
      {due && (
        <div style={dueCard}>
          <CalendarClock size={20} color="#14301f" style={{ flexShrink: 0 }} />
          <div style={{ textAlign: 'left' }}>
            <b style={{ color: '#14301f' }}>You're due for a scan</b>
            <div style={{ fontSize: 13, color: '#5a6b5e', marginTop: 2 }}>
              Based on the frequency you chose in Settings.
            </div>
          </div>
        </div>
      )}

      <h1
        style={{
          fontSize: 34,
          fontWeight: 800,
          color: '#14301f',
          margin: '8px 0 10px',
        }}
      >
        Test Calibration
      </h1>
      <p
        style={{
          fontSize: 16,
          color: '#4a5a4f',
          lineHeight: 1.5,
          margin: '0 0 24px',
        }}
      >
        Position your body within the frame and keep steady.
      </p>

      {/* Camera preview with dashed body guide */}
      <div
        style={{
          position: 'relative',
          borderRadius: 24,
          overflow: 'hidden',
          border: '5px solid white',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          aspectRatio: '3 / 4',
          background: '#d4e0d4',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />

        {/* Dashed human silhouette guide */}
        <svg
          viewBox="0 0 100 140"
          preserveAspectRatio="xMidYMid meet"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <g
            fill="none"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            strokeLinecap="round"
          >
            <circle cx="50" cy="24" r="11" />
            <path d="M45 34 L45 39 M55 34 L55 39" />
            <path d="M45 39 Q32 42 30 52 L27 78 Q26 84 30 86 L36 88 L38 108 L40 128 L48 128 L49 92 L51 92 L52 128 L60 128 L62 108 L64 88 L70 86 Q74 84 73 78 L70 52 Q68 42 55 39 Z" />
            <path d="M30 52 L22 80 L20 98" />
            <path d="M70 52 L78 80 L80 98" />
          </g>
        </svg>

        <div
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: 'rgba(255,255,255,0.85)',
            color: '#14301f',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.5,
            padding: '5px 12px',
            borderRadius: 12,
          }}
        >
          LIVE
        </div>
      </div>

      <button
        onClick={() => navigate('/test/setup')}
        style={{
          width: '100%',
          marginTop: 28,
          padding: '20px 0',
          fontSize: 22,
          fontWeight: 700,
          color: '#14301f',
          background: '#bfe8bf',
          border: 'none',
          borderRadius: 36,
          font: 'inherit',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        }}
      >
        {hasScans ? 'Start New Scan' : 'Start Test'}
      </button>

      {/* Step indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginTop: 20,
        }}
      >
        <Dot active />
        <Dot />
        <Dot />
        <span style={{ marginLeft: 8, fontSize: 14, color: '#8a978c' }}>
          Step 1 of 3
        </span>
      </div>
    </div>
  );
}

function Dot({ active = false }: { active?: boolean }) {
  return (
    <span
      style={{
        width: 9,
        height: 9,
        borderRadius: 5,
        background: active ? '#14301f' : '#c9d4ca',
      }}
    />
  );
}

const dueCard: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  alignItems: 'flex-start',
  background: '#dff0df',
  borderRadius: 16,
  padding: 16,
  marginBottom: 8,
};