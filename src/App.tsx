import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ScanProvider } from './ScanContext';
import { SessionProvider } from './SessionContext';
import TabLayout from './components/TabLayout';
import TestHome from './views/TestHome';
import SetupView from './views/SetupView';
import ProgressView from './views/ProgressView';
import LearnView from './views/LearnView';
import SettingsView from './views/SettingsView';
import FrontView from './views/FrontView';
import BackView from './views/BackView';
import SideView from './views/SideView';
import ScoliometerView from './views/ScoliometerView';
import ResultsView from './views/ResultsView';

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <ScanProvider>
          <Routes>
            {/* Screens WITH the bottom tab bar */}
            <Route element={<TabLayout />}>
              <Route path="/" element={<TestHome />} />
              <Route path="/progress" element={<ProgressView />} />
              <Route path="/learn" element={<LearnView />} />
              <Route path="/settings" element={<SettingsView />} />
            </Route>

            {/* Test flow — full screen, NO tab bar */}
            <Route path="/test/setup" element={<SetupView />} />
            <Route path="/test/front" element={<FrontView />} />
            <Route path="/test/back" element={<BackView />} />
            <Route path="/test/side" element={<SideView />} />
            <Route path="/test/scoliometer" element={<ScoliometerView />} />
            <Route path="/test/results" element={<ResultsView />} />
          </Routes>
        </ScanProvider>
      </SessionProvider>
    </BrowserRouter>
  );
}