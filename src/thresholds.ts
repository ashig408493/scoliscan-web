// Every screening and positioning number in one place, each tagged with how
// much evidence supports it, so no one mistakes a guess for a clinical cutoff.
//
//   validated   = published clinical threshold
//   derived     = calculated from published data, but not itself published
//   provisional = a starting guess; tune against real full-body captures

export type ThresholdStatus = 'validated' | 'derived' | 'provisional';

type Threshold = { value: number; status: ThresholdStatus; note: string };

// ---- SCREENING: what a valid reading means ----
export const SCREENING = {
  // Trunk rotation (scoliometer): the primary measurement
  atrRefer: {
    value: 7,
    status: 'validated',
    note: 'Standard referral cutoff: ~83% sensitivity, ~87% specificity for Cobb > 10°',
  },
  atrReferHighBmi: {
    value: 5,
    status: 'validated',
    note: 'Recommended cutoff at BMI ≥ 85th percentile, where body mass hides the curve',
  },
  atrRecheck: {
    value: 5,
    status: 'validated',
    note: 'Lower end of the 5–7° referral range; used here as the recheck band',
  },

  // Supporting camera signs: yes/no flags that can only nudge the outcome
  shoulderTiltDeg: {
    value: 5,
    status: 'derived',
    note: 'About healthy mean + 2 SD (Penha et al.: 1.9° ± 1.4°). Unreliable until camera tilt is corrected.',
  },
  headLeanRatio: {
    value: 0.2,
    status: 'provisional',
    note: 'Head offset from the feet, as a fraction of shoulder width',
  },
  plumbOffsetRatio: {
    value: 0.07,
    status: 'derived',
    note: 'The clinical 2 cm coronal-imbalance line (X-ray, C7 to sacrum), converted assuming ~30 cm shoulder width. Marks imbalance, not scoliosis itself.',
  },
    armGapAsymmetry: {
    value: 0.2,
    status: 'provisional',
    note: 'Relative left/right difference; weak proxy for waist asymmetry',
  },
} satisfies Record<string, Threshold>;

// ---- POSITIONING: whether a reading is valid at all ----
// Not wired in yet: metrics.ts and SideView still hold their own copies.
export const POSITIONING = {
  visibility: { value: 0.6, status: 'provisional', note: 'MediaPipe landmark visibility score' },
  leanWarning: { value: 0.2, status: 'provisional', note: 'Soft warning only, never blocks' },
  facingMargin: { value: 0.05, status: 'provisional', note: 'Nose depth vs shoulder depth' },
  hipBendTarget: { value: 90, status: 'validated', note: "Adam's test: bend at the hips to ~90°" },
  hipBendTolerance: { value: 25, status: 'provisional', note: 'Allowed deviation from 90°' },
  kneeStraightMin: { value: 150, status: 'provisional', note: 'Knees should be straight' },
} satisfies Record<string, Threshold>;