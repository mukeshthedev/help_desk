import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Send, AlertCircle, Search, Clock } from 'lucide-react';
import { complaintsAPI } from '../utils/api';

const CATEGORIES = ['WiFi Not Working', 'Lab System Issues', 'Portal Login Errors', 'Email Access Problems', 'Software Installation', 'Printer Issues', 'Projector/AV Problems', 'Other'];
const DEPARTMENTS = ['CSE', 'ECE', 'Mechanical', 'Civil', 'MBA', 'BCA', 'SA', 'BCOM', 'MBBS', 'BE', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

const statusConfig = {
  'Open':        { color: '#6366f1', bg: 'rgba(99,102,241,0.12)',  icon: AlertCircle,  desc: 'Received and awaiting assignment.' },
  'In Progress': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: Search,       desc: 'Our team is actively working on it.' },
  'Resolved':    { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  icon: CheckCircle,  desc: 'Issue resolved! Let us know if it persists.' },
  'Closed':      { color: '#64748b', bg: 'rgba(100,116,139,0.12)', icon: CheckCircle,  desc: 'Ticket has been closed.' }
};

const priorityConfig = {
  'Low':      { color: '#10b981' },
  'Medium':   { color: '#3b82f6' },
  'High':     { color: '#f59e0b' },
  'Critical': { color: '#ef4444' }
};

const steps = ['Open', 'In Progress', 'Resolved', 'Closed'];

// ── Inline Tracker ──────────────────────────────────────────────────────────
function InlineTracker({ ticketId }) {
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  useEffect(() => {
    complaintsAPI.getById(ticketId)
      .then(res => setComplaint(res.data.data))
      .catch(() => setError('Could not load ticket data.'))
      .finally(() => setLoading(false));
  }, [ticketId]);

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div className="spinner" style={{ margin: '0 auto' }} />
    </div>
  );

  if (error) return (
    <div style={{ padding: '1.5rem', color: 'var(--danger)', fontSize: '0.875rem', textAlign: 'center' }}>
      {error}
    </div>
  );

  if (!complaint) return null;

  const sCfg = statusConfig[complaint.status] || {};
  const pCfg = priorityConfig[complaint.priority] || {};
  const currentIndex = steps.indexOf(complaint.status);
  const SIcon = sCfg.icon;

  return (
    <div style={{ padding: '1.25rem', background: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Status row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: sCfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 16px ${sCfg.color}40` }}>
          {SIcon && <SIcon size={20} color={sCfg.color} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
            <span style={{ background: sCfg.bg, color: sCfg.color, border: `1px solid ${sCfg.color}50`, borderRadius: 999, padding: '0.2rem 0.6rem', fontSize: '0.7rem', fontWeight: 700 }}>
              {complaint.status}
            </span>
            <span style={{ background: `${pCfg.color}18`, color: pCfg.color, borderRadius: 999, padding: '0.2rem 0.6rem', fontSize: '0.7rem', fontWeight: 600 }}>
              {complaint.priority} Priority
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5, margin: 0 }}>{sCfg.desc}</p>
        </div>
      </div>

      {/* Progress stepper */}
      <div>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
          Progress
        </div>
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 16, left: 16, right: 16, height: 3, background: 'var(--surface-3)', borderRadius: 2 }} />
          <div style={{
            position: 'absolute', top: 16, left: 16, height: 3,
            width: currentIndex === 0 ? 0 : `calc(${(currentIndex / (steps.length - 1)) * 100}% - 32px)`,
            background: `linear-gradient(90deg, var(--accent), ${sCfg.color})`,
            borderRadius: 2, transition: 'width 0.8s ease', zIndex: 1
          }} />
          {steps.map((step, i) => {
            const done = i <= currentIndex;
            const cfg  = statusConfig[step];
            return (
              <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', position: 'relative', zIndex: 2 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: done ? cfg.color : 'var(--surface-2)',
                  border: `2px solid ${done ? cfg.color : 'var(--surface-3)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: done ? `0 0 12px ${cfg.color}50` : 'none',
                  transition: 'all 0.4s ease'
                }}>
                  {done
                    ? <CheckCircle size={13} color="white" />
                    : <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--surface-3)' }} />
                  }
                </div>
                <span style={{ fontSize: '0.6rem', fontWeight: done ? 700 : 400, color: done ? cfg.color : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>
          Timeline
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { icon: AlertCircle, color: 'var(--accent)',   label: 'Submitted',    time: complaint.createdAt },
            { icon: Clock,       color: 'var(--warning)',  label: 'Last Updated', time: complaint.updatedAt },
            ...(complaint.resolvedAt ? [{ icon: CheckCircle, color: 'var(--success)', label: 'Resolved', time: complaint.resolvedAt }] : [])
          ].map(({ icon: Icon, color, label, time }, i, arr) => (
            <div key={label} style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                  <Icon size={12} />
                </div>
                {i < arr.length - 1 && <div style={{ width: 2, height: 22, background: 'var(--border)', margin: '2px 0' }} />}
              </div>
              <div style={{ paddingTop: '0.3rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                  {new Date(time).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function SubmitComplaint() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    studentName: '', studentEmail: '', studentId: '',
    department: '', issueCategory: '', issueSummary: '',
    issueDescription: '', priority: 'Medium', location: ''
  });
  const [loading, setLoading]         = useState(false);
  const [success, setSuccess]         = useState(null);
  const [showTracker, setShowTracker] = useState(false);
  const [error, setError]             = useState('');
  const [otherDept, setOtherDept]     = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setError('');
    const required = ['studentName', 'studentEmail', 'studentId', 'department', 'issueCategory', 'issueSummary', 'issueDescription'];
    if (required.some(k => !form[k])) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await complaintsAPI.create(form);
      setSuccess(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success Screen ────────────────────────────────────────────────────────
  if (success) return (
    <div className="fade-in" style={{ maxWidth: 680, margin: '0 auto' }}>
      <style>{`
        @keyframes popIn {
          0%   { transform: scale(0.6); opacity: 0; }
          70%  { transform: scale(1.08); }
          100% { transform: scale(1);   opacity: 1; }
        }
        @media (max-width: 768px) {
          .success-grid { grid-template-columns: 1fr 1fr !important; gap: 0.75rem !important; }
          .success-btns { flex-direction: column !important; }
          .success-btns button { width: 100% !important; justify-content: center !important; }
        }
      `}</style>

      {/* Tick + heading */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{
          width: 72, height: 72,
          background: 'rgba(16,185,129,0.12)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1rem',
          animation: 'popIn 0.5s cubic-bezier(0.4,0,0.2,1)'
        }}>
          <CheckCircle size={38} color="var(--success)" />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
          Complaint Submitted!
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Our team will get back to you shortly.
        </p>
      </div>

      {/* Ticket info */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '1.25rem' }}>
        <div className="success-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[
            ['Ticket ID',  success.ticketId,     true ],
            ['Status',     success.status,        false],
            ['Category',   success.issueCategory, false],
            ['Priority',   success.priority,      false]
          ].map(([label, value, mono]) => (
            <div key={label}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase', fontWeight: 700 }}>
                {label}
              </div>
              <div className={mono ? 'mono' : ''} style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: mono ? '0.9rem' : '0.875rem', wordBreak: 'break-all' }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="success-btns" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" onClick={() => setShowTracker(t => !t)}>
          <Search size={15} />
          {showTracker ? 'Hide Tracker' : 'Track My Complaint'}
        </button>
        <button className="btn btn-outline" onClick={() => { setSuccess(null); setShowTracker(false); setOtherDept(false); }}>
          Submit Another
        </button>
      </div>

      {/* Inline tracker */}
      {showTracker && (
        <div style={{ border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ background: 'var(--surface-2)', padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Search size={15} color="var(--accent)" />
            <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
              Live Complaint Tracker
            </span>
            <span style={{ marginLeft: 'auto', fontFamily: 'Space Mono,monospace', fontSize: '0.72rem', color: 'var(--accent-light)' }}>
              {success.ticketId}
            </span>
          </div>
          <InlineTracker ticketId={success.ticketId} />
        </div>
      )}
    </div>
  );

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div className="fade-in" style={{ maxWidth: 720, margin: '0 auto' }}>
      <style>{`
        @media (max-width: 768px) {
          .form-grid-2 { grid-template-columns: 1fr !important; }
          .form-actions { flex-direction: column-reverse !important; }
          .form-actions button { width: 100% !important; justify-content: center !important; }
          .page-title-resp { font-size: 1.3rem !important; }
        }
      `}</style>

      <div className="page-header">
        <h1 className="page-title page-title-resp">Submit a Complaint</h1>
        <p className="page-subtitle">Report your IT issue and our team will assist you promptly</p>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 'var(--radius-sm)', padding: '0.875rem 1rem',
          color: 'var(--danger)', display: 'flex', alignItems: 'center',
          gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem'
        }}>
          <AlertCircle size={16} />{error}
        </div>
      )}

      <div className="card">

        {/* ── Student Information ── */}
        <div className="section-title" style={{ marginBottom: '1.25rem' }}>Student Information</div>

        <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              className="form-input"
              placeholder="Enter your full name"
              value={form.studentName}
              onChange={e => set('studentName', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Student ID *</label>
            <input
              className="form-input"
              placeholder="e.g. 2021CS001"
              value={form.studentId}
              onChange={e => set('studentId', e.target.value)}
            />
          </div>
        </div>

        <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              className="form-input"
              type="email"
              placeholder="student@college.edu"
              value={form.studentEmail}
              onChange={e => set('studentEmail', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Department *</label>
            <select
              className="form-select"
              value={otherDept ? 'Other' : form.department}
              onChange={e => {
                if (e.target.value === 'Other') {
                  setOtherDept(true);
                  set('department', '');
                } else {
                  setOtherDept(false);
                  set('department', e.target.value);
                }
              }}
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.filter(d => d !== 'Other').map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
              <option value="Other">Other</option>
            </select>
            {otherDept && (
              <input
                className="form-input"
                style={{ marginTop: '0.6rem' }}
                placeholder="Type your department name..."
                value={form.department}
                onChange={e => set('department', e.target.value)}
                autoFocus
              />
            )}
          </div>
        </div>

        <div className="divider" />

        {/* ── Issue Details ── */}
        <div className="section-title" style={{ marginBottom: '1.25rem' }}>Issue Details</div>

        <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Issue Category *</label>
            <select
              className="form-select"
              value={form.issueCategory}
              onChange={e => set('issueCategory', e.target.value)}
            >
              <option value="">Select Category</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              className="form-select"
              value={form.priority}
              onChange={e => set('priority', e.target.value)}
            >
              {PRIORITIES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Issue Summary *</label>
          <input
            className="form-input"
            placeholder="Brief one-line summary"
            value={form.issueSummary}
            onChange={e => set('issueSummary', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Detailed Description *</label>
          <textarea
            className="form-textarea"
            rows={5}
            placeholder="Describe the issue in detail..."
            value={form.issueDescription}
            onChange={e => set('issueDescription', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Location (Optional)</label>
          <input
            className="form-input"
            placeholder="e.g. Lab 3, Block B"
            value={form.location}
            onChange={e => set('location', e.target.value)}
          />
        </div>

        <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button className="btn btn-outline" onClick={() => navigate('/')}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : <><Send size={15} /> Submit Complaint</>}
          </button>
        </div>
      </div>
    </div>
  );
}