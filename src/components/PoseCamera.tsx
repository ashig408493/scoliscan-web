import { useEffect, useRef, useState } from 'react';
import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

// The WASM files MUST be the same version as the @mediapipe/tasks-vision
// package in package.json. Loading "@latest" broke detection when MediaPipe
// released a newer version, so the version is pinned here. If you ever update
// the package, update this number to match.
const MEDIAPIPE_VERSION = '1.0.1';
const WASM_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`;
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';

export type Landmark = { x: number; y: number; z: number; visibility?: number };

type Props = {
  onLandmarks: (landmarks: Landmark[]) => void;
  onNoPerson?: () => void;
  facingMode?: 'user' | 'environment';
};

export default function PoseCamera({
  onLandmarks,
  onNoPerson,
  facingMode = 'user',
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState('Loading model…');

  const onLandmarksRef = useRef(onLandmarks);
  const onNoPersonRef = useRef(onNoPerson);

  useEffect(() => {
    onLandmarksRef.current = onLandmarks;
    onNoPersonRef.current = onNoPerson;
  });

  useEffect(() => {
    let landmarker: PoseLandmarker | null = null;
    let stream: MediaStream | null = null;
    let running = true;

    async function setup() {
      const vision = await FilesetResolver.forVisionTasks(WASM_URL);

      // Try the GPU first (faster). Some browsers and devices can't run it,
      // so fall back to the CPU instead of failing.
      const options = (delegate: 'GPU' | 'CPU') => ({
        baseOptions: { modelAssetPath: MODEL_URL, delegate },
        runningMode: 'VIDEO' as const,
        numPoses: 1,
      });
      let usingGpu = true;
      try {
        landmarker = await PoseLandmarker.createFromOptions(vision, options('GPU'));
      } catch (err) {
        console.warn('[ScoliScan] GPU pose detection unavailable, using CPU', err);
        landmarker = await PoseLandmarker.createFromOptions(vision, options('CPU'));
        usingGpu = false;
      }
      console.info('[ScoliScan] Pose detection running on', usingGpu ? 'GPU' : 'CPU');

      // On some computers the GPU version loads fine but never finds anyone.
      // If it sees nobody for about 4 seconds straight, switch to the CPU
      // version once. (If the room really is empty, the CPU also sees nobody.)
      const EMPTY_FRAMES_BEFORE_SWITCH = 120;
      let emptyFrames = 0;
      let switching = false;
      async function switchToCpu() {
        switching = true;
        try {
          const cpu = await PoseLandmarker.createFromOptions(vision, options('CPU'));
          if (!running) {
            cpu.close();
            return;
          }
          landmarker?.close();
          landmarker = cpu;
          usingGpu = false;
          console.info('[ScoliScan] GPU found no person for a while, switched to CPU');
        } catch (err) {
          console.error('[ScoliScan] Could not switch to CPU', err);
        } finally {
          switching = false;
        }
      }

      setStatus('Starting camera…');

      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => {
          videoRef.current!.onloadeddata = resolve;
        });
        await videoRef.current.play();
      }

      setStatus('');

      let lastVideoTime = -1;
      function detect() {
        const video = videoRef.current;
        if (!running || !video) return;

        // Only run on a new, ready video frame
        if (landmarker && !switching && video.readyState >= 2 && video.currentTime !== lastVideoTime) {
          lastVideoTime = video.currentTime;
          try {
            const result = landmarker.detectForVideo(video, performance.now());
            handleResult(video, result.landmarks);
          } catch (err) {
            // One bad frame shouldn't stop detection for good
            console.error('[ScoliScan] Pose detection error', err);
          }
        }
        requestAnimationFrame(detect);
      }

      function handleResult(video: HTMLVideoElement, landmarks: Landmark[][] | undefined) {
        if (landmarks && landmarks.length > 0) {
          emptyFrames = 0;
          // ---- Aspect-ratio correction ----
          // MediaPipe gives x as a fraction of the frame's WIDTH and y as a
          // fraction of its HEIGHT. On a non-square frame (e.g. 640×480) those
          // units differ, which stretches every angle. Rescaling x by
          // width/height puts x and y in the same units (fractions of the
          // height). z uses roughly the same scale as x, so it gets the same
          // treatment. Every metric downstream then works in true proportions.
          const aspect =
            video.videoWidth > 0 && video.videoHeight > 0
              ? video.videoWidth / video.videoHeight
              : 1;

          const corrected: Landmark[] = landmarks[0].map((p) => ({
            ...p,
            x: p.x * aspect,
            z: p.z * aspect,
          }));

          onLandmarksRef.current(corrected);
        } else {
          emptyFrames++;
          if (usingGpu && !switching && emptyFrames >= EMPTY_FRAMES_BEFORE_SWITCH) {
            emptyFrames = 0;
            void switchToCpu();
          }
          onNoPersonRef.current?.();
        }
      }
      detect();
    }

    setup().catch((err) => setStatus('Error: ' + err.message));

    return () => {
      running = false;
      stream?.getTracks().forEach((t) => t.stop());
      landmarker?.close();
    };
  }, [facingMode]);

  return (
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
        playsInline
        muted
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
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

      {status && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4a5a4f',
            fontSize: 15,
          }}
        >
          {status}
        </div>
      )}
    </div>
  );
}