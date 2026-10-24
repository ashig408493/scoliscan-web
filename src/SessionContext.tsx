import { createContext, useState, type ReactNode } from 'react';

export type Assistance = 'solo' | 'assisted';
export type FamilyHistory = 'yes' | 'no' | 'unsure';
export type BackPain = 'none' | 'some' | 'severe';

// Answers from the setup questionnaire. Height and weight are deliberately
// NOT stored: only whether the higher-BMI cutoff applies.
export type ScreeningContext = {
  highBmi: boolean | null; // null = not provided
  familyHistory: FamilyHistory | null;
  backPain: BackPain | null;
};

export type SessionState = {
  assistance: Assistance;
  setAssistance: (a: Assistance) => void;
  tiltAvailable: boolean;
  setTiltAvailable: (b: boolean) => void;
  context: ScreeningContext;
  setContext: (c: ScreeningContext) => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [assistance, setAssistance] = useState<Assistance>('assisted');

  // Platforms that don't gate motion behind a permission prompt (Android,
  // desktop) are available straight away. iOS requires an explicit request,
  // so it starts false until the user grants it in Setup.
  const [tiltAvailable, setTiltAvailable] = useState(() => {
    if (typeof DeviceOrientationEvent === 'undefined') return false;
    const D = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<string>;
    };
    return typeof D.requestPermission !== 'function';
  });

  const [context, setContext] = useState<ScreeningContext>({
    highBmi: null,
    familyHistory: null,
    backPain: null,
  });

  return (
    <SessionContext.Provider
      value={{ assistance, setAssistance, tiltAvailable, setTiltAvailable, context, setContext }}
    >
      {children}
    </SessionContext.Provider>
  );
}