// BMI-for-age percentile, using the official CDC growth-chart data.
//
// Teen BMI is judged relative to other kids of the same age and sex, so it
// needs the CDC's L, M, S parameters for each month of age. The data file is
// loaded from /public/bmi-age-2022.csv (downloaded from the CDC website).
//
// CDC method:  z = ((BMI / M)^L - 1) / (L * S),  percentile = Φ(z)

export type Sex = 'male' | 'female';

type LmsRow = { sex: number; ageMonths: number; L: number; M: number; S: number };

// z-score of the 85th percentile of a standard normal distribution
const Z_85TH = 1.0364;

let table: LmsRow[] | null = null;
let loading: Promise<LmsRow[]> | null = null;

export function loadBmiTable(): Promise<LmsRow[]> {
  if (table) return Promise.resolve(table);
  if (!loading) {
    loading = fetch('/bmi-age-2022.csv')
      .then((res) => {
        if (!res.ok) throw new Error('BMI reference file is missing from /public');
        return res.text();
      })
      .then(parseCsv)
      .then((rows) => (table = rows));
  }
  return loading;
}

function parseCsv(text: string): LmsRow[] {
  const clean = (s: string) => s.trim().replace(/"/g, '');
  const lines = text.trim().split(/\r?\n/);
  const header = lines[0].split(',').map((h) => clean(h).toLowerCase());

  // Find columns by name so the exact column order doesn't matter
  const iSex = header.indexOf('sex');
  const iAge = header.findIndex((h) => h === 'agemos' || h === 'age');
  const iL = header.indexOf('l');
  const iM = header.indexOf('m');
  const iS = header.indexOf('s');

  if ([iSex, iAge, iL, iM, iS].some((i) => i < 0)) {
    throw new Error('Unexpected BMI file format: ' + lines[0]);
  }

  return lines
    .slice(1)
    .map((line) => {
      const c = line.split(',').map(clean);
      return {
        sex: Number(c[iSex]),
        ageMonths: Number(c[iAge]),
        L: Number(c[iL]),
        M: Number(c[iM]),
        S: Number(c[iS]),
      };
    })
    .filter((r) => [r.sex, r.ageMonths, r.L, r.M, r.S].every(Number.isFinite));
}

// True if BMI is at or above the 85th percentile for age and sex.
// Returns null if the inputs are outside what the charts cover or look wrong.
export function isBmiAt85thOrAbove(
  rows: LmsRow[],
  sex: Sex,
  ageYears: number,
  heightCm: number,
  weightKg: number
): boolean | null {
  const bmi = weightKg / (heightCm / 100) ** 2;
  // Guard against unit mix-ups (e.g. weight typed in the wrong unit)
  if (!Number.isFinite(bmi) || bmi < 10 || bmi > 70) return null;

  // Only whole years are asked, so use the middle of that year
  const ageMonths = ageYears * 12 + 6;
  const sexCode = sex === 'male' ? 1 : 2; // CDC coding: 1 = male, 2 = female

  let best: LmsRow | null = null;
  for (const r of rows) {
    if (r.sex !== sexCode) continue;
    if (!best || Math.abs(r.ageMonths - ageMonths) < Math.abs(best.ageMonths - ageMonths)) {
      best = r;
    }
  }
  // Outside the chart's age range (2–20 years)
  if (!best || Math.abs(best.ageMonths - ageMonths) > 1) return null;

  const { L, M, S } = best;
  const z = L !== 0 ? (Math.pow(bmi / M, L) - 1) / (L * S) : Math.log(bmi / M) / S;

  // The z-score rises with BMI, so this comparison also holds above the 95th
  // percentile, where the CDC reports percentiles with a different method.
  return z >= Z_85TH;
}