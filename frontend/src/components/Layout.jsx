import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Plus, BarChart2,
  Mail, Wifi, GraduationCap, ChevronRight,
  LogOut, Sun, Moon, Shield, Search   // ← add Search here
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', adminOnly: true },
  { path: '/submit', icon: Plus, label: 'Submit Complaint', adminOnly: false },
  { path: '/track', icon: Search, label: 'Track Complaint', adminOnly: false },   // ← ADD THIS LINE
  { path: '/complaints', icon: FileText, label: 'All Complaints', adminOnly: true },
  { path: '/improvement-plan', icon: BarChart2, label: 'Improvement Plan', adminOnly: true },
  { path: '/email-templates', icon: Mail, label: 'Email Templates', adminOnly: true },
];

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: 'var(--primary)',
      transition: 'background 0.3s ease'
    }}>

      {/* Sidebar */}
      <aside style={{
        width: 260, minHeight: '100vh',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, flexShrink: 0,
        transition: 'background 0.3s ease, border-color 0.3s ease'
      }}>

        {/* Logo */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: '0.75rem'
        }}>
          <div style={{
            width: 40, height: 40,
            background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <GraduationCap size={20} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              Helpdesk
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              DIGITAL SUPPORT TEAM
            </div>
          </div>
        </div>

        {/* Admin badge in sidebar */}
        {isAdmin && (
          <div style={{
            margin: '0.75rem',
            padding: '0.6rem 0.75rem',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            <Shield size={14} color="var(--accent-light)" />
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-light)', fontWeight: 600 }}>
              Admin Mode Active
            </span>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.5rem 0.75rem' }}>
          <div style={{
            fontSize: '0.7rem', fontWeight: 600,
            color: 'var(--text-muted)',
            padding: '0.5rem 0.75rem',
            letterSpacing: '0.08em', marginBottom: '0.25rem'
          }}>
            MAIN MENU
          </div>

          {navItems.map(({ path, icon: Icon, label, adminOnly }) => {
            const active = location.pathname === path;
            const locked = adminOnly && !isAdmin;
            return (
              <Link key={path} to={locked ? '/admin/login' : path} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.65rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '0.15rem',
                textDecoration: 'none',
                color: active ? 'var(--accent-light)' : locked ? 'var(--text-muted)' : 'var(--text-secondary)',
                background: active ? 'var(--accent-glow)' : 'transparent',
                border: `1px solid ${active ? 'rgba(99,102,241,0.3)' : 'transparent'}`,
                transition: 'all 0.2s ease',
                fontSize: '0.9rem',
                fontWeight: active ? 600 : 400,
                opacity: locked ? 0.6 : 1
              }}>
                <Icon size={17} />
                <span>{label}</span>
                {locked && (
                  <span style={{
                    marginLeft: 'auto', fontSize: '0.65rem',
                    background: 'rgba(245,158,11,0.12)',
                    color: 'var(--warning)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: 4, fontWeight: 600
                  }}>
                    ADMIN
                  </span>
                )}
                {active && !locked && (
                  <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border)',
          fontSize: '0.75rem', color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Wifi size={12} />
            <span>IT Support System</span>
          </div>
          <div style={{ opacity: 0.6 }}>v2.0.0 · 2024</div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>

        {/* Top bar */}
        <header style={{
          padding: '1rem 2rem',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 10,
          transition: 'background 0.3s ease, border-color 0.3s ease'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            College Digital Support Team
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

            {/* Online indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--success)',
                boxShadow: '0 0 8px var(--success)'
              }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                System Online
              </span>
            </div>

            {/* Theme Toggle */}
            <button onClick={toggleTheme} style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '0.4rem 0.875rem',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              color: 'var(--text-secondary)',
              fontSize: '0.8rem',
              transition: 'all 0.2s ease'
            }}>
              {isDark
                ? <><Sun size={14} /> Light Mode</>
                : <><Moon size={14} /> Dark Mode</>
              }
            </button>

            {/* Admin section */}
            {isAdmin ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  background: 'rgba(99,102,241,0.12)',
                  border: '1px solid rgba(99,102,241,0.25)',
                  borderRadius: 6,
                  padding: '0.35rem 0.875rem',
                  fontSize: '0.78rem', fontWeight: 600,
                  color: 'var(--accent-light)',
                  display: 'flex', alignItems: 'center', gap: '0.4rem'
                }}>
                  <Shield size={13} /> Admin
                </div>
                <button onClick={handleLogout} style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 8,
                  padding: '0.4rem 0.875rem',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  color: 'var(--danger)',
                  fontSize: '0.8rem',
                  transition: 'all 0.2s ease'
                }}>
                  <LogOut size={14} /> Logout
                </button>
              </div>
            ) : (
              <Link to="/admin/login" style={{
                background: 'var(--accent)', color: 'white',
                borderRadius: 8, padding: '0.4rem 0.875rem',
                fontSize: '0.8rem', fontWeight: 600,
                textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}>
                <Shield size={14} /> Admin Login
              </Link>
            )}
          </div>
        </header>

        {/* Page content */}
        <div style={{ padding: '2rem', flex: 1 }} className="fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}