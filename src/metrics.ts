//Define a point, just an x and y coordinate
type Point = { x: number; y: number };

//Angle of the line p1 -> p2 relative to horizontal (0 = level)
export function lineAngle(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

// One raw landmark from the pose library: has x, y, z (0-1 fractions) and a confidence
export type Landmark = { x: number; y: number; z: number; visibility?: number };


// Pull one landmark out of the list and return it as a Point.
// Coordinates arrive already aspect-ratio corrected by PoseCamera: x and y
// are both in units of the frame's height, so angles and distances are true.
// (x can therefore exceed 1 on a wide frame; nothing here assumes it can't.)
export function getPoint(landmarks: Landmark[], index: number): Point {
  const lm = landmarks[index];
  return { x: lm.x, y: lm.y };
}

//Angle in degrees at point b, formed by the lines b->a and b->c
//e.g. angleAtPoint(shoulder, hip, knee) = how bent the hip joint is
export function angleAtPoint(a: Point, b: Point, c: Point): number {
  //Vectors from the joint (b) out to a and c
  const ba = { x: a.x - b.x, y: a.y - b.y };
  const bc = { x: c.x - b.x, y: c.y - b.y };

  //Dot product of the two vectors
  const dot = ba.x * bc.x + ba.y * bc.y;

  //Length of each vector
  const magBa = Math.hypot(ba.x, ba.y);
  const magBc = Math.hypot(bc.x, bc.y);

  //Guard against divide-by-zero if points overlap
  if (magBa === 0 || magBc === 0) {
    return 0;
  }

  //cos(angle) = dot / (magBa * magBc), clamped to [-1, 1] for safety
  let cosAngle = dot / (magBa * magBc);
  cosAngle = Math.max(-1, Math.min(1, cosAngle));

  //Convert cosine back to an angle in degrees
  return (Math.acos(cosAngle) * 180) / Math.PI;
}

//MediaPipe pose landmark indices (33-point model)
const NOSE = 0;
const LEFT_EAR = 7;
const RIGHT_EAR = 8;
const LEFT_SHOULDER = 11;
const RIGHT_SHOULDER = 12;
const LEFT_ELBOW = 13;
const RIGHT_ELBOW = 14;
const LEFT_HIP = 23;
const RIGHT_HIP = 24;
const LEFT_KNEE = 25;
const LEFT_ANKLE = 27;
const RIGHT_ANKLE = 28;

// ---- SHARED HELPERS ----

// Horizontal midpoint (average x) of two landmarks
function midX(landmarks: Landmark[], indexA: number, indexB: number): number {
  return (landmarks[indexA].x + landmarks[indexB].x) / 2;
}

// Shoulder width, used to normalize. The `|| 1e-6` avoids divide-by-zero.
function shoulderWidth(landmarks: Landmark[]): number {
  return Math.abs(landmarks[RIGHT_SHOULDER].x - landmarks[LEFT_SHOULDER].x) || 1e-6;
}

// Straight-line distance between two Points (Python's math.dist equivalent)
function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// Normalize an angle to the range -90..+90.
// A line's tilt is the same whether measured left-to-right or right-to-left,
// so 179° and -179° both mean "1° off level" — this collapses them to that.
function normalizeTilt(angle: number): number {
  if (angle > 90) return angle - 180;
  if (angle < -90) return angle + 180;
  return angle;
}

// ---- FRONT VIEW METRICS ----

//Shoulder tilt angle in degrees (0 = level)
export function shoulderAngle(landmarks: Landmark[]): number {
  const lShoulder = getPoint(landmarks, LEFT_SHOULDER);
  const rShoulder = getPoint(landmarks, RIGHT_SHOULDER);
  return normalizeTilt(lineAngle(lShoulder, rShoulder));
}

//True if the person is facing the camera (nose clearly in front of shoulders)
//Uses depth (z): smaller z = closer to camera
export function isFacingCamera(landmarks: Landmark[]): boolean {
  const noseZ = landmarks[NOSE].z;
  const shoulderZ = (landmarks[LEFT_SHOULDER].z + landmarks[RIGHT_SHOULDER].z) / 2;
  return noseZ < shoulderZ - 0.05;
}

// ---- LEAN DETECTION (soft warning only, never a hard gate) ----
// These return the lean RATIO (a number), so the same function can both
// drive the warning AND be recorded as a metric.

// LOWER-body lean: is the pelvis off-center over the feet?
// Catches whole-body (plank-style) leaning. Least entangled with scoliosis,
// so this is the "safer" positioning signal.
export function hipLeanRatio(landmarks: Landmark[]): number {
  const hipMid = midX(landmarks, LEFT_HIP, RIGHT_HIP);
  const ankleMid = midX(landmarks, LEFT_ANKLE, RIGHT_ANKLE);
  return Math.abs(hipMid - ankleMid) / shoulderWidth(landmarks);
}

// UPPER-body lean: is the head off-center over the feet?
// More sensitive to scoliosis itself (head-off-center is a scoliosis SIGN),
// which is why we only ever WARN on it and always allow Continue.
export function headLeanRatio(landmarks: Landmark[]): number {
  const earMid = midX(landmarks, LEFT_EAR, RIGHT_EAR);
  const ankleMid = midX(landmarks, LEFT_ANKLE, RIGHT_ANKLE);
  return Math.abs(earMid - ankleMid) / shoulderWidth(landmarks);
}

// Generous threshold — tune on-device.
const LEAN_WARN_THRESHOLD = 0.20;

// Combined OR check: warn if EITHER the upper or lower body is clearly leaning.
// SOFT warning only — the UI must always offer a "Continue" button so a person
// whose lean is structural (scoliosis) is never locked out.
export function shouldWarnLean(landmarks: Landmark[]): boolean {
  return (
    hipLeanRatio(landmarks) > LEAN_WARN_THRESHOLD ||
    headLeanRatio(landmarks) > LEAN_WARN_THRESHOLD
  );
}

// ---- BACK VIEW METRICS ----

// PLUMB OFFSET: the clinical "plumb line" test.
// We use the EAR midpoint (not shoulder midpoint) for the top reference,
// because scoliosis CAUSES uneven shoulders — using shoulders would let the
// very condition we're screening for corrupt the measurement.
export function plumbOffset(landmarks: Landmark[]): number {
  const earMid = midX(landmarks, LEFT_EAR, RIGHT_EAR);
  const hipMid = midX(landmarks, LEFT_HIP, RIGHT_HIP);
  return Math.abs(earMid - hipMid) / shoulderWidth(landmarks);
}

// ARM-TO-HIP GAP (flank/waist "window"):
// In scoliosis the trunk shifts laterally, making this gap larger on one side.
// We store BOTH sides raw rather than just their difference, so we know which
// side is larger — that tells us which way the trunk is shifted.
// Uses the ELBOW (not wrist) because wrists jitter far more.
export function leftArmHipRatio(landmarks: Landmark[]): number {
  const elbow = getPoint(landmarks, LEFT_ELBOW);
  const hip = getPoint(landmarks, LEFT_HIP);
  return distance(elbow, hip) / shoulderWidth(landmarks);
}

export function rightArmHipRatio(landmarks: Landmark[]): number {
  const elbow = getPoint(landmarks, RIGHT_ELBOW);
  const hip = getPoint(landmarks, RIGHT_HIP);
  return distance(elbow, hip) / shoulderWidth(landmarks);
}

// HIP TILT: RECORDED, never gated on — uneven hips are themselves a scoliosis
// sign, so blocking on them would exclude the people we're screening for.
export function hipAngle(landmarks: Landmark[]): number {
  const lHip = getPoint(landmarks, LEFT_HIP);
  const rHip = getPoint(landmarks, RIGHT_HIP);
  return normalizeTilt(lineAngle(lHip, rHip));
}

// ---- SIDE VIEW METRICS (Adam's forward bend posture check) ----
// Unlike the asymmetry metrics, these ARE safe to gate on: how far you bend
// and whether your knees are straight are things the user controls.
// NOTE: assumes the person's LEFT side faces the camera.

// How folded the torso is at the hip. ~180 = standing, ~90 = properly bent.
export function hipBend(landmarks: Landmark[]): number {
  const shoulder = getPoint(landmarks, LEFT_SHOULDER);
  const hip = getPoint(landmarks, LEFT_HIP);
  const knee = getPoint(landmarks, LEFT_KNEE);
  return angleAtPoint(shoulder, hip, knee);
}

// How straight the leg is. ~180 = straight, lower = bent knee.
export function kneeAngle(landmarks: Landmark[]): number {
  const hip = getPoint(landmarks, LEFT_HIP);
  const knee = getPoint(landmarks, LEFT_KNEE);
  const ankle = getPoint(landmarks, LEFT_ANKLE);
  return angleAtPoint(hip, knee, ankle);
}

// ---- LANDMARK VISIBILITY ----
// MediaPipe ESTIMATES landmarks it can't see rather than omitting them, so a
// landmark always has coordinates — but its `visibility` score tells you
// whether those coordinates are observed or guessed. Every metric built on a
// guessed landmark is meaningless, so we check before trusting a reading.
//
// This is the one gate that's safe to enforce strictly: whether the camera can
// SEE you has nothing to do with body shape, so it can't exclude anyone with
// scoliosis the way an asymmetry check would.

const VISIBILITY_THRESHOLD = 0.6;

// The landmarks every measurement depends on
const REQUIRED = [
  LEFT_EAR,
  RIGHT_EAR,
  LEFT_SHOULDER,
  RIGHT_SHOULDER,
  LEFT_HIP,
  RIGHT_HIP,
  LEFT_ANKLE,
  RIGHT_ANKLE,
];

function isVisible(landmarks: Landmark[], index: number): boolean {
  return (landmarks[index].visibility ?? 0) > VISIBILITY_THRESHOLD;
}

export function areLandmarksVisible(landmarks: Landmark[]): boolean {
  return REQUIRED.every((i) => isVisible(landmarks, i));
}

// What's missing, so the UI can say something specific rather than
// "not everything is visible".
export type FramingIssue =
  | 'ok'
  | 'head-missing'
  | 'feet-missing'
  | 'torso-missing'
  | 'too-close';

export function checkFraming(landmarks: Landmark[]): FramingIssue {
  const headOk = isVisible(landmarks, LEFT_EAR) && isVisible(landmarks, RIGHT_EAR);
  const torsoOk =
    isVisible(landmarks, LEFT_SHOULDER) &&
    isVisible(landmarks, RIGHT_SHOULDER) &&
    isVisible(landmarks, LEFT_HIP) &&
    isVisible(landmarks, RIGHT_HIP);
  const feetOk =
    isVisible(landmarks, LEFT_ANKLE) && isVisible(landmarks, RIGHT_ANKLE);

  // Both ends missing usually means they're standing too close to the camera
  if (!headOk && !feetOk) return 'too-close';
  if (!feetOk) return 'feet-missing';
  if (!headOk) return 'head-missing';
  if (!torsoOk) return 'torso-missing';
  return 'ok';
}

// Plain-language guidance for each issue — used for both on-screen text and speech
export function framingMessage(issue: FramingIssue): string {
  switch (issue) {
    case 'too-close':
      return 'Step back so your whole body is in frame.';
    case 'feet-missing':
      return 'Step back — your feet need to be visible.';
    case 'head-missing':
      return 'Move down or step back — your head is out of frame.';
    case 'torso-missing':
      return 'Make sure your upper body is clearly visible.';
    default:
      return '';
  }
}