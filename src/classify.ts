import { SCREENING } from './thresholds';
import type { ScanData } from './ScanContext';

// ---- Types ----

export type Outcome = 'clinician' | 'recheck' | 'clear' | 'limited';

export type Sign = { id: string; label: string };

export type Classification = {
  outcome: Outcome;
  maxRotation: number | null; // highest trunk rotation in degrees, or null if not measured
  signs: Sign[]; // camera signs only (family history is shown separately)
  painFlag: boolean; // shown as its own warning, never changes the outcome
};

export type ClassifyInput = {
  front?: ScanData | null;
  back?: ScanData | null;
  rotation?: ScanData | null;
  highBmi?: boolean;
  familyHistory?: boolean;
  backPain?: boolean;
};

// ---- Helpers ----

// Thresholds may be stored as plain numbers or as { value, basis, note } objects.
// This reads either form.
type Threshold = number | { value: number };
function t(x: Threshold): number {
  return typeof x === 'number' ? x : x.value;
}

function isNum(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n);
}

// Turn a raw line angle (which can read near 0, 180 or -180 for a level line)
// into how far it is from level, in degrees (0 = perfectly level).
function tiltFromLevel(angle: number): number {
  const a = ((angle % 180) + 180) % 180; // 0..180
  return Math.min(a, 180 - a);
}

// ---- Camera signs ----
// Each sign is a yes/no flag. They support the rotation reading but can never
// cause a "see a clinician" result on their own.

function collectSigns(front?: ScanData | null, back?: ScanData | null): Sign[] {
  const signs: Sign[] = [];

  // Shoulder tilt: the larger of the front and back readings
  const tilts = [front?.shoulder, back?.shoulder].filter(isNum).map(tiltFromLevel);
  if (tilts.length > 0 && Math.max(...tilts) >= t(SCREENING.shoulderTiltDeg)) {
    signs.push({ id: 'shoulder', label: 'Uneven shoulders' });
  }

  // Head lean: head off-center over the feet
  if (isNum(front?.headLean) && front.headLean > t(SCREENING.headLeanRatio)) {
    signs.push({ id: 'headLean', label: 'Head off-center over the feet' });
  }

  // Plumb offset: head off-center over the hips (back view)
  if (isNum(back?.plumb) && back.plumb > t(SCREENING.plumbOffsetRatio)) {
    signs.push({ id: 'plumb', label: 'Head off-center over the hips' });
  }

  // Arm gap: difference between the left and right elbow-to-hip gaps,
  // as a fraction of the larger gap
  if (isNum(back?.leftArm) && isNum(back?.rightArm)) {
    const larger = Math.max(back.leftArm, back.rightArm);
    if (larger > 0) {
      const asymmetry = Math.abs(back.leftArm - back.rightArm) / larger;
      if (asymmetry > t(SCREENING.armGapAsymmetry)) {
        signs.push({ id: 'armGap', label: 'Uneven gap between arms and waist' });
      }
    }
  }

  return signs;
}

// ---- Main ----
//
// Rotation measured:
//   at or above the referral cutoff (7°, or 5° with high BMI) -> clinician
//   5° to 6.9° (borderline):
//       family history          -> clinician
//       2 or more camera signs  -> clinician
//       otherwise               -> recheck
//   under 5°:
//       family history counts as one sign
//       3 or more signs         -> recheck
//       otherwise               -> clear
//
// Rotation not measured:
//   family history counts as one sign
//   2 or more signs             -> recheck
//   otherwise                   -> limited
//
// Back pain never changes the outcome. It sets painFlag, which shows a
// separate warning on the results page.

export function classifyScan(input: ClassifyInput): Classification {
  const { front, back, rotation, highBmi = false, familyHistory = false, backPain = false } = input;

  const signs = collectSigns(front, back);
  const painFlag = backPain;

  // Highest rotation reading, ignoring direction
  const readings = [rotation?.upper, rotation?.lower].filter(isNum).map(Math.abs);
  const maxRotation = readings.length > 0 ? Math.max(...readings) : null;

  // Outside the borderline band, family history counts as one sign
  const signsWithHistory = signs.length + (familyHistory ? 1 : 0);

  // No rotation measured
  if (maxRotation === null) {
    const outcome: Outcome = signsWithHistory >= 2 ? 'recheck' : 'limited';
    return { outcome, maxRotation, signs, painFlag };
  }

  const referCutoff = highBmi ? t(SCREENING.atrReferHighBmi) : t(SCREENING.atrRefer);

  // At or above the referral cutoff
  if (maxRotation >= referCutoff) {
    return { outcome: 'clinician', maxRotation, signs, painFlag };
  }

  // Borderline: 5° to just under the referral cutoff
  if (maxRotation >= t(SCREENING.atrRecheck)) {
    const outcome: Outcome = familyHistory || signs.length >= 2 ? 'clinician' : 'recheck';
    return { outcome, maxRotation, signs, painFlag };
  }

  // Under 5°
  const outcome: Outcome = signsWithHistory >= 3 ? 'recheck' : 'clear';
  return { outcome, maxRotation, signs, painFlag };
}