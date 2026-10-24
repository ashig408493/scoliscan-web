import { NavLink, Outlet } from 'react-router-dom';
import { Video, TrendingUp, BookOpen, Settings, Sprout, CircleUser } from 'lucide-react';

const tabs = [
  { path: '/', label: 'Test', Icon: Video },
  { path: '/progress', label: 'Progress', Icon: TrendingUp },
  { path: '/learn', label: 'Learn', Icon: BookOpen },
  { path: '/settings', label: 'Settings', Icon: Settings },
];

export default function TabLayout() {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: 84, background: '#eef5ee' }}>
      {/* App header — shows on every tab */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          background: '#f7faf7',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sprout size={22} color="#14301f" strokeWidth={2.2} />
          <span style={{ fontSize: 20, fontWeight: 700, color: '#14301f' }}>
            ScoliScan
          </span>
        </div>
        <CircleUser size={26} color="#14301f" strokeWidth={1.6} />
      </header>

      {/* Tinted content area */}
      <div style={{ background: '#eef5ee', minHeight: 'calc(100vh - 156px)' }}>
        <Outlet />
      </div>

      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          background: '#f7faf7',
          borderTop: '1px solid #e4ebe4',
          height: 72,
          padding: '0 8px',
        }}
      >
        {tabs.map(({ path, label, Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            style={{ flex: 1, textDecoration: 'none' }}
          >
            {({ isActive }) => (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  padding: '8px 0',
                  borderRadius: 20,
                  background: isActive ? '#cfe8cf' : 'transparent',
                  color: isActive ? '#1c3d2a' : '#8a978c',
                }}
              >
                <Icon size={20} strokeWidth={2} />
                <span style={{ fontSize: 11, fontWeight: isActive ? 600 : 400 }}>
                  {label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}