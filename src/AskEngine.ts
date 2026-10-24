// On-device question answering for the Learn tab.
//
// This is not a chatbot and nothing is sent anywhere. Every section of every
// article is indexed when the app loads. A question is matched against those
// sections with BM25, the ranking formula most search engines started from,
// and the best-matching section is shown as the answer, with a link to the
// article it came from. If nothing matches well enough, it says so instead of
// guessing.

import { articles, type Article, type Section } from './learnContent';

export type Passage = {
  article: Article;
  section: Section;
};

export type Answer =
  | { kind: 'found'; best: Passage; related: Passage[]; notes: string[] }
  | { kind: 'none'; notes: string[] };

// ---- Text processing ----

const STOPWORDS = new Set(
  (
    'a an and are as at be been but by can could did do does doing for from had has have how i if ' +
    'in into is it its me my of on or should so than that the their them then there these they ' +
    'this to too us was we were what when where which while who why will with would you your ' +
    'about any get got just more most much some such very really also am im ive dont doesnt cant ' +
    'tell know want need thing things way like best still actually ever okay ok hi hello hey please thanks thank'
  ).split(' '),
);

// Light stemming so "braces", "bracing" and "brace" all match
function stem(word: string): string {
  let w = word;
  if (w.length > 5 && w.endsWith('ies')) w = w.slice(0, -3) + 'y';
  else if (w.length > 5 && w.endsWith('ing')) w = w.slice(0, -3);
  else if (w.length > 4 && w.endsWith('ed')) w = w.slice(0, -2);
  else if (w.length > 4 && w.endsWith('es')) w = w.slice(0, -2);
  else if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) w = w.slice(0, -1);
  if (w.length > 4 && w.endsWith('e')) w = w.slice(0, -1);
  return w;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/x-rays?/g, 'xray')
    .replace(/['’]/g, '')
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w))
    .map(stem);
}

// Everyday words people type, mapped to the words the articles use.
// Keys and values are stemmed forms.
const SYNONYMS: Record<string, string[]> = {
  surgery: ['fusion', 'operation', 'surgical'],
  operation: ['surgery', 'fusion'],
  brac: ['orthosis'],
  hurt: ['pain'],
  ach: ['pain'],
  painful: ['pain'],
  curv: ['curvatur'],
  crook: ['curv'],
  bent: ['curv'],
  cause: ['caus'],
  genetic: ['gene', 'family', 'inherit'],
  hereditary: ['family', 'gene', 'inherit'],
  inherit: ['family', 'gene'],
  parent: ['family'],
  mom: ['family', 'parent'],
  dad: ['family', 'parent'],
  sister: ['family', 'sibling'],
  brother: ['family', 'sibling'],
  workout: ['exercis'],
  stretch: ['exercis'],
  yoga: ['exercis'],
  sport: ['athlet'],
  play: ['sport'],
  soccer: ['sport'],
  football: ['sport'],
  basketball: ['sport'],
  volleyball: ['sport'],
  swim: ['sport', 'swimm'],
  dance: ['sport', 'danc'],
  gymnastic: ['sport'],
  run: ['sport'],
  pregnant: ['pregnancy'],
  baby: ['pregnancy', 'child'],
  kid: ['child'],
  girl: ['girl', 'female'],
  boy: ['boy', 'male'],
  breath: ['lung'],
  breathing: ['lung'],
  heart: ['lung'],
  scan: ['screen'],
  test: ['screen'],
  check: ['screen'],
  cure: ['treat'],
  fault: ['caus', 'blam'],
  blame: ['caus', 'fault'],
  angl: ['cobb'],
  measur: ['cobb', 'xray'],
  fix: ['treat'],
  worse: ['progress'],
  grow: ['growth'],
  height: ['growth'],
  backpack: ['backpack'],
  posture: ['postur'],
  hunchback: ['kyphosi'],
  hunch: ['kyphosi'],
};

function expand(tokens: string[]): string[] {
  const out = new Set(tokens);
  for (const t of tokens) for (const s of SYNONYMS[t] ?? []) out.add(stem(s));
  return [...out];
}

// ---- Index ----

type Doc = {
  passage: Passage;
  isIntro: boolean;
  tf: Map<string, number>; // words in the whole passage
  heading: Set<string>; // words in the section question and article title
  length: number;
};

function addDoc(docs: Doc[], article: Article, section: Section, isIntro = false) {
  const headingTokens = [...tokenize(section.question), ...tokenize(article.title)];
  const tokens = [
    ...headingTokens,
    ...tokenize(
      [...section.paragraphs, ...(section.bullets ?? []), ...(section.closing ?? [])].join(' '),
    ),
  ];
  const tf = new Map<string, number>();
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
  docs.push({ passage: { article, section }, isIntro, tf, heading: new Set(headingTokens), length: tokens.length });
}

function buildIndex() {
  const docs: Doc[] = [];
  for (const article of articles) {
    if (article.intro.some((p) => p.startsWith('WRITE:'))) continue; // unwritten placeholder
    // The article's intro is indexed as its own passage, headed by the title,
    // so broad questions ("what is kyphosis?") get the overview.
    addDoc(docs, article, { question: article.title, paragraphs: article.intro }, true);
    for (const section of article.sections) addDoc(docs, article, section);
  }

  const df = new Map<string, number>();
  for (const d of docs) for (const t of d.tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);
  const avgLength = docs.reduce((n, d) => n + d.length, 0) / Math.max(docs.length, 1);

  return { docs, df, avgLength };
}

const INDEX = buildIndex();

// BM25 parameters (standard defaults)
const K1 = 1.2;
const B = 0.75;

function idf(term: string): number {
  const n = INDEX.docs.length;
  const d = INDEX.df.get(term) ?? 0;
  return Math.log(1 + (n - d + 0.5) / (d + 0.5));
}

function score(doc: Doc, terms: string[], definition: boolean): number {
  let s = 0;
  for (const t of terms) {
    const f = doc.tf.get(t);
    if (!f) continue;
    s += (idf(t) * (f * (K1 + 1))) / (f + K1 * (1 - B + (B * doc.length) / INDEX.avgLength));
    // A word that appears in the heading counts extra, so a question that
    // matches a section's own question beats a passing mention elsewhere.
    if (doc.heading.has(t)) s += idf(t) * 1.5;
  }
  // "What is X?" questions prefer an article's overview to one of its details
  if (definition && doc.isIntro && s > 0) s *= 1.4;
  return s;
}

// ---- Safety notes ----

const RED_FLAGS =
  /numb|tingl|weak(ness)? in (my|your)? ?legs?|bladder|bowel|pee|fever|can'?t walk|injur|accident|fell|sudden(ly)? (bad|worse|severe)/i;
const PERSONAL =
  /\b(do|does|did|could|might|would) i (have|need|get)\b|\bam i\b|\bmy (curve|back|spine|scan|result|daughter|son|child|kid)\b|\bshould i\b/i;
const DISTRESS = /hate (my|how i)|ugly|kill myself|hurt myself|self.?harm|don'?t want to (live|be here)/i;

function safetyNotes(question: string): string[] {
  const notes: string[] = [];
  if (DISTRESS.test(question)) {
    notes.push(
      "It sounds like this might be weighing on you. Please talk to someone you trust, like a parent, school counselor or doctor. If you're in the US and ever feel unsafe, you can call or text 988 any time.",
    );
  }
  if (RED_FLAGS.test(question)) {
    notes.push(
      'Back pain with numbness or weakness in the legs, changes in bladder or bowel control, a fever, or pain after an injury needs a doctor right away.',
    );
  }
  if (PERSONAL.test(question)) {
    notes.push(
      "I can share general information, but I can't tell what's going on with your own back. A doctor can, so it's worth asking one.",
    );
  }
  return notes;
}

// ---- Main ----

export function ask(question: string): Answer {
  const notes = safetyNotes(question);
  const raw = [...new Set(tokenize(question))];
  if (raw.length === 0) return { kind: 'none', notes };

  // "What is scoliosis?" and similar: every article mentions scoliosis, so
  // answer with the overview from the types article instead of a random match.
  const GENERAL = new Set(['scoliosi', 'mean', 'definition', 'defin', 'condition', 'explain']);
  if (raw.every((t) => GENERAL.has(t)) && raw.includes('scoliosi')) {
    const overview = INDEX.docs.find((d) => d.isIntro && d.passage.article.id === 'types');
    if (overview) return { kind: 'found', best: overview.passage, related: [], notes };
  }

  // Warning signs: always answer with the "which back pain needs a doctor"
  // section, whatever else matched
  if (RED_FLAGS.test(question)) {
    const urgent = INDEX.docs.find(
      (d) => d.passage.article.id === 'back-pain' && /need a doctor/i.test(d.passage.section.question),
    );
    if (urgent) return { kind: 'found', best: urgent.passage, related: [], notes };
  }

  const definition = /^\s*(what('?s| is| are| does)|define|meaning of)\b/i.test(question);
  const terms = expand(raw);
  const ranked = INDEX.docs
    .map((d) => ({ d, s: score(d, terms, definition) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s);

  const top = ranked[0];
  // How many of the question's own words the best match actually contains
  // (counting a synonym as a match). Stops weak, one-word coincidences.
  const covered = top
    ? raw.filter((t) => top.d.tf.has(t) || (SYNONYMS[t] ?? []).some((s) => top.d.tf.has(stem(s)))).length
    : 0;
  const needed = raw.length === 1 ? 1 : Math.ceil(raw.length / 2);

  if (!top || top.s < 2.5 || covered < needed) return { kind: 'none', notes };

  // Up to two more good matches from other articles
  const related: Passage[] = [];
  const seen = new Set([top.d.passage.article.id]);
  for (const r of ranked.slice(1)) {
    if (related.length === 2 || r.s < top.s * 0.55) break;
    if (seen.has(r.d.passage.article.id)) continue;
    seen.add(r.d.passage.article.id);
    related.push(r.d.passage);
  }

  return { kind: 'found', best: top.d.passage, related, notes };
}

export const SUGGESTIONS = [
  'Do braces actually work?',
  'Can a heavy backpack cause scoliosis?',
  'Can I still play sports?',
  'Does scoliosis run in families?',
  'What is recovery from surgery like?',
];