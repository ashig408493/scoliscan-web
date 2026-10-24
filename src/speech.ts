// Wrapper over browser speech synthesis, designed to be called from a
// per-frame loop without producing overlapping or stuttering output.

let lastSpoken = '';
let lastSpokenAt = 0;

// Don't repeat the SAME message more often than this
const REPEAT_COOLDOWN_MS = 6000;
// Don't start ANY new message sooner than this after the last one
const MIN_GAP_MS = 1500;

export function speak(message: string): void {
  if (!('speechSynthesis' in window) || !message) return;

  // Never cut off a sentence that's still being spoken — interrupting on every
  // frame is what produces the "s-s-s-step back" stutter.
  if (window.speechSynthesis.speaking || window.speechSynthesis.pending) return;

  const now = Date.now();

  // Rate-limit everything, so rapidly alternating messages can't machine-gun
  if (now - lastSpokenAt < MIN_GAP_MS) return;

  // And rate-limit repeats of the same message much more aggressively
  if (message === lastSpoken && now - lastSpokenAt < REPEAT_COOLDOWN_MS) return;

  lastSpoken = message;
  lastSpokenAt = now;

  const utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = 1.0;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  lastSpoken = '';
  lastSpokenAt = 0;
}

export function isSpeechSupported(): boolean {
  return 'speechSynthesis' in window;
}