import { createContext, useState, type ReactNode } from 'react';

export type ScanData = Record<string, number>;

export type ScanState = {
  front: ScanData | null;
  back: ScanData | null;
  side: ScanData | null;
  rotation: ScanData | null;
  setFront: (d: ScanData) => void;
  setBack: (d: ScanData) => void;
  setSide: (d: ScanData) => void;
  setRotation: (d: ScanData) => void;
  reset: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const ScanContext = createContext<ScanState | null>(null);

export function ScanProvider({ children }: { children: ReactNode }) {
  const [front, setFront] = useState<ScanData | null>(null);
  const [back, setBack] = useState<ScanData | null>(null);
  const [side, setSide] = useState<ScanData | null>(null);
  const [rotation, setRotation] = useState<ScanData | null>(null);

  function reset() {
    setFront(null);
    setBack(null);
    setSide(null);
    setRotation(null);
  }

  return (
    <ScanContext.Provider
      value={{ front, back, side, rotation, setFront, setBack, setSide, setRotation, reset }}
    >
      {children}
    </ScanContext.Provider>
  );
}