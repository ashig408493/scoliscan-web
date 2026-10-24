import { useContext } from 'react';
import { ScanContext } from './ScanContext';

// Hook so screens can read/write scan data without prop-drilling
export function useScan() {
  const ctx = useContext(ScanContext);
  if (!ctx) throw new Error('useScan must be used inside ScanProvider');
  return ctx;
}