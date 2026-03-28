import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, Clock, AlertCircle, Loader2, XCircle, GraduationCap, Shield } from 'lucide-react';
import { complaintsAPI } from '../utils/api';
import { useTheme } from '../context/ThemeContext';

const statusConfig = {
  'Open':        { color: '#6366f1', bg: 'rgba(99,102,241,0.12)',  icon: AlertCircle,  desc: 'Your complaint has been received and is awaiting assignment.' },
  'In Progress': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: Loader2,      desc: 'Our technical team is actively working on your issue.' },
  'Resolved':    { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  icon: CheckCircle2, desc: 'Your issue has been resolved. Please verify and let us know if it persists.' },
  'Closed':      { color: '#64748b', bg: 'rgba(100,116,139,0.12)', icon: XCircle,      desc: 'This ticket has been closed.' }
};

const priorityConfig = {
  'Low':      { color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
  'Medium':   { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)'  },
  'High':     { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
  'Critical': { color: '#ef4444', bg: 'rgba(239,68,68,0.1)'   }
};

const steps = ['Open', 'In Progress', 'Resolved', 'Closed'];

function ProgressStepper({ status }) {
  const currentIndex = steps.indexOf(status);
  return (
    <div style={{ padding: '0.5rem 0 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: 20, left: 20, right: 20,
          height: 3, background: 'var(--surface-3)', borderRadius: 2, zIndex: 0
        }} />
        <div style={{
          position: 'absolute', top: 20, left: 20,
          height: 3,
          width: currentIndex === 0 ? 0 : `calc(${(currentIndex / (steps.length - 1)) * 100}% - 40px)`,
          background: `linear-gradient(90deg, var(--accent), ${statusConfig[status]?.color})`,
          borderRadius: 2, zIndex: 1,
          transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)'
        }} />
        {steps.map((step, i) => {
          const done = i <= currentIndex;
          const cfg = statusConfig[step];
          const Icon = cfg.icon;
          return (
            <div key={step} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '0.6rem',
              position: 'relative', zIndex: 2
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: done ? cfg.color : 'var(--surface-2)',
                border: `3px solid ${done ? cfg.color : 'var(--surface-3)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.5s ease',
                boxShadow: done ? `0 0 18px ${cfg.color}55` : 'none'
              }}>
                <Icon size={14} color={done ? 'white' : 'var(--text-muted)'} />
              </div>
              <span style={{
                fontSize: '0.62rem',
                fontWeight: done ? 700 : 400,
                color: done ? cfg.color : 'var(--text-muted)',
                whiteSpace: 'nowrap', letterSpacing: '0.02em',
                textAlign: 'center'
              }}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TrackComplaint({ defaultTicketId = '' }) {
  const { isDark, toggleTheme } = useTheme();
  const [ticketId, setTicketId] = useState(defaultTicketId);
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (defaultTicketId) handleTrack(defaultTicketId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultTicketId]);

  const handleTrack = async (id) => {
    const searchId = (id || ticketId).trim().toUpperCase();
    setError('');
    setComplaint(null);
    if (!searchId) { setError('Please enter your Ticket ID.'); return; }
    setLoading(true);
    try {
      const res = await complaintsAPI.getById(searchId);
      setComplaint(res.data.data);
    } catch {
      setError('Ticket not found. Please check your Ticket ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const sCfg = statusConfig[complaint?.status] || {};
  const pCfg = priorityConfig[complaint?.priority] || {};
  const StatusIcon = sCfg.icon;

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--primary)',
      fontFamily: 'Outfit, sans-serif', position: 'relative', overflow: 'hidden'
    }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .track-input:focus { outline:none; border-color: var(--accent) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
        .track-btn:hover:not(:disabled) { transform: translateY(-1px); opacity: 0.92; }
        .back-btn:hover { color: var(--accent) !important; border-color: var(--accent) !important; }

        @media (max-width: 600px) {
          .navbar-title { display: none; }
          .blob-1 { width: 250px !important; height: 250px !important; }
          .blob-2 { width: 200px !important; height: 200px !important; }
          .track-search-row { flex-direction: column !important; }
          .track-search-row button { width: 100% !important; padding: 0.875rem !important; justify-content: center; }
          .status-banner { flex-direction: column !important; text-align: center; align-items: center !important; }
          .status-banner-text { text-align: center; }
          .status-badges { justify-content: center !important; }
          .back-btn-wrap { position: static !important; padding: 1rem 1rem 0 !important; }
          .main-heading { font-size: 1.5rem !important; }
          .main-pad { padding: 1.5rem 1rem !important; }
          .card-pad { padding: 1.25rem !important; }
        }
      `}</style>

      {/* Background blobs */}
      <div className="blob-1" style={{ position: 'absolute', top: '-15%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.09),transparent 70%)', animation: 'float 7s ease-in-out infinite', pointerEvents: 'none' }} />
      <div className="blob-2" style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.07),transparent 70%)', animation: 'float 9s ease-in-out infinite reverse', pointerEvents: 'none' }} />

      {/* Navbar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border)',
        background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,var(--accent),#8b5cf6)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <GraduationCap size={18} color="white" />
          </div>
          <div className="navbar-title">
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>College Helpdesk</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Complaint Tracker</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={toggleTheme} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.4rem 0.75rem', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {isDark ? '☀️' : '🌙'}
            <span style={{ display: 'none' }} className="theme-label">{isDark ? 'Light' : 'Dark'}</span>
          </button>
          <a href="/admin/login" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 8, padding: '0.4rem 0.75rem', fontSize: '0.78rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Shield size={13} /> <span>Admin</span>
          </a>
        </div>
      </div>

      {/* Back Button */}
      <div className="back-btn-wrap" style={{ position: 'fixed', top: '5rem', left: '1.5rem', zIndex: 20 }}>
        <a href="/submit" className="back-btn" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'var(--surface)', border: '1px solid var(--border)',
          color: 'var(--text-secondary)', fontSize: '0.82rem', textDecoration: 'none',
          fontWeight: 600, borderRadius: 10, padding: '0.5rem 1rem',
          boxShadow: 'var(--shadow)', transition: 'all 0.2s ease'
        }}>
          ← Back
        </a>
      </div>

      {/* Main */}
      <div className="main-pad" style={{ maxWidth: 640, margin: '0 auto', padding: '3rem 1rem', animation: 'fadeInUp 0.5s ease' }}>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg,var(--accent),#8b5cf6)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 0 32px rgba(99,102,241,0.3)' }}>
            <Search size={26} color="white" />
          </div>
          <h1 className="main-heading" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            Track Your Complaint
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Enter your Ticket ID to see the current status
          </p>
        </div>

        {/* Search Card */}
        <div className="card-pad" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.75rem', marginBottom: '1.5rem', boxShadow: 'var(--shadow)' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.5rem' }}>
            Ticket ID
          </label>
          <div className="track-search-row" style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              className="track-input"
              value={ticketId}
              onChange={e => setTicketId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleTrack()}
              placeholder="e.g. TKT-202603-0001"
              style={{
                flex: 1, padding: '0.875rem 1rem',
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: 10, color: 'var(--text-primary)',
                fontFamily: 'Space Mono,monospace', fontSize: '0.85rem',
                letterSpacing: '0.05em', transition: 'all 0.2s ease',
                width: '100%'
              }}
            />
            <button
              className="track-btn"
              onClick={() => handleTrack()}
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg,var(--accent),#8b5cf6)',
                color: 'white', border: 'none', borderRadius: 10,
                padding: '0 1.5rem', fontSize: '0.9rem', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                transition: 'all 0.2s ease', whiteSpace: 'nowrap'
              }}
            >
              {loading
                ? <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                : <><Search size={16} /> Track</>
              }
            </button>
          </div>

          {error && (
            <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', animation: 'fadeInUp 0.3s ease' }}>
              <AlertCircle size={15} />{error}
            </div>
          )}
        </div>

        {/* Result */}
        {complaint && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeInUp 0.4s ease' }}>

            {/* Status Banner */}
            <div className="status-banner card-pad" style={{
              background: sCfg.bg,
              border: `1px solid ${sCfg.color}45`,
              borderRadius: 16, padding: '1.5rem',
              display: 'flex', alignItems: 'center', gap: '1.25rem'
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: `${sCfg.color}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, boxShadow: `0 0 20px ${sCfg.color}40`
              }}>
                {StatusIcon && <StatusIcon size={24} color={sCfg.color} />}
              </div>
              <div className="status-banner-text" style={{ flex: 1 }}>
                <div className="status-badges" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Space Mono,monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {complaint.ticketId}
                  </span>
                  <span style={{ background: sCfg.bg, color: sCfg.color, border: `1px solid ${sCfg.color}50`, borderRadius: 999, padding: '0.2rem 0.7rem', fontSize: '0.72rem', fontWeight: 700 }}>
                    {complaint.status}
                  </span>
                  <span style={{ background: pCfg.bg, color: pCfg.color, borderRadius: 999, padding: '0.2rem 0.7rem', fontSize: '0.72rem', fontWeight: 600 }}>
                    {complaint.priority} Priority
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.55 }}>
                  {sCfg.desc}
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="card-pad" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem 1.75rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                Complaint Progress
              </div>
              <ProgressStepper status={complaint.status} />
            </div>

            {/* Timeline */}
            <div className="card-pad" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem 1.75rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
                Timeline
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {[
                  { icon: AlertCircle, color: 'var(--accent)',   label: 'Complaint Submitted', time: complaint.createdAt },
                  { icon: Clock,       color: 'var(--warning)',  label: 'Last Updated',        time: complaint.updatedAt },
                  ...(complaint.resolvedAt ? [{ icon: CheckCircle2, color: 'var(--success)', label: 'Issue Resolved', time: complaint.resolvedAt }] : [])
                ].map(({ icon: Icon, color, label, time }, i, arr) => (
                  <div key={label} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                        <Icon size={14} />
                      </div>
                      {i < arr.length - 1 && (
                        <div style={{ width: 2, height: 28, background: 'var(--border)', margin: '2px 0' }} />
                      )}
                    </div>
                    <div style={{ paddingTop: '0.4rem' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                        {new Date(time).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Help note */}
            <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>📧</span>
              <span>Need help? Email us at <a href="mailto:support@college.edu" style={{ color: 'var(--accent-light)', fontWeight: 600 }}>support@college.edu</a> with your Ticket ID.</span>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}