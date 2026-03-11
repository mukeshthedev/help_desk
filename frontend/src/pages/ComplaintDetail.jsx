import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Mail, CheckCircle,
  Clock, AlertCircle, User, Tag, FileText, Lock
} from 'lucide-react';
import { complaintsAPI, emailAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const statusClass = {
  'Open': 'badge-open', 'In Progress': 'badge-inprogress',
  'Resolved': 'badge-resolved', 'Closed': 'badge-closed'
};
const priorityClass = {
  'Low': 'badge-low', 'Medium': 'badge-medium',
  'High': 'badge-high', 'Critical': 'badge-critical'
};

export default function ComplaintDetail() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [emailPreview, setEmailPreview] = useState(null);
  const [edits, setEdits] = useState({});

  useEffect(() => {
    complaintsAPI.getById(ticketId)
      .then(res => {
        setComplaint(res.data.data);
        setEdits({
          status: res.data.data.status,
          priority: res.data.data.priority,
          assignedTo: res.data.data.assignedTo || '',
          resolutionNotes: res.data.data.resolutionNotes || ''
        });
      })
      .catch(() => navigate('/complaints'))
      .finally(() => setLoading(false));
  }, [ticketId, navigate]);

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    if (!isAdmin) { showToast('Admin access required', 'error'); return; }
    setSaving(true);
    try {
      const res = await complaintsAPI.update(complaint._id, edits);
      setComplaint(res.data.data);
      showToast('Ticket updated successfully', 'success');
    } catch (e) {
      showToast('Failed to update ticket', 'error');
    } finally {
      setSaving(false);
    }
  };

  const loadEmailPreview = async (type) => {
    try {
      const res = await emailAPI.getTemplate(type, ticketId);
      setEmailPreview({ ...res.data.data, type });
    } catch (e) {
      showToast('Failed to load template', 'error');
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
      <div className="spinner" />
    </div>
  );

  const c = complaint;

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <button className="btn btn-outline" style={{ marginBottom: '0.75rem' }}
            onClick={() => navigate('/complaints')}>
            <ArrowLeft size={15} />Back
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="mono" style={{ color: 'var(--accent-light)' }}>{c.ticketId}</span>
            <span className={`badge ${statusClass[c.status]}`}>{c.status}</span>
            <span className={`badge ${priorityClass[c.priority]}`}>{c.priority}</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{c.issueSummary}</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            <Save size={15} />{saving ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Student Info */}
          <div className="card">
            <div className="section-title" style={{ marginBottom: '1rem' }}>
              <User size={15} color="var(--accent)" />Student Information
            </div>
            <div className="grid-2">
              {[['Name', c.studentName], ['Student ID', c.studentId], ['Email', c.studentEmail], ['Department', c.department]].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.2rem' }}>{label}</div>
                  <div style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Issue Details */}
          <div className="card">
            <div className="section-title" style={{ marginBottom: '1rem' }}>
              <Tag size={15} color="var(--accent)" />Issue Details
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
              {[['Category', c.issueCategory], ['Location', c.location || 'N/A']].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.2rem' }}>{label}</div>
                  <div style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{value}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem' }}>
              {c.issueDescription}
            </div>
          </div>

          {/* Ticket Management — Admin Only */}
          {isAdmin ? (
            <div className="card">
              <div className="section-title" style={{ marginBottom: '1rem' }}>
                <FileText size={15} color="var(--accent)" />Ticket Management
              </div>
              <div className="grid-2" style={{ marginBottom: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Status</label>
                  <select className="form-select" value={edits.status}
                    onChange={e => setEdits(ed => ({ ...ed, status: e.target.value }))}>
                    {['Open', 'In Progress', 'Resolved', 'Closed'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Priority</label>
                  <select className="form-select" value={edits.priority}
                    onChange={e => setEdits(ed => ({ ...ed, priority: e.target.value }))}>
                    {['Low', 'Medium', 'High', 'Critical'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Assigned To</label>
                <input className="form-input" placeholder="Staff name or team"
                  value={edits.assignedTo}
                  onChange={e => setEdits(ed => ({ ...ed, assignedTo: e.target.value }))} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Resolution Notes</label>
                <textarea className="form-textarea" rows={4}
                  placeholder="Steps taken to resolve..."
                  value={edits.resolutionNotes}
                  onChange={e => setEdits(ed => ({ ...ed, resolutionNotes: e.target.value }))} />
              </div>
            </div>
          ) : (
            <div className="card" style={{
              textAlign: 'center', padding: '2.5rem',
              border: '1px dashed var(--border-hover)',
              animation: 'fadeIn 0.4s ease'
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(100,116,139,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <Lock size={24} color="var(--text-muted)" />
              </div>
              <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>
                Admin Access Required
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                Only admins can update ticket status, assign staff, and add resolution notes.
              </p>
              <a href="/admin/login" className="btn btn-primary" style={{ display: 'inline-flex' }}>
                <Lock size={14} /> Login as Admin
              </a>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Timeline */}
          <div className="card">
            <div className="section-title" style={{ marginBottom: '1rem' }}>
              <Clock size={15} color="var(--accent)" />Timeline
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { icon: AlertCircle, color: 'var(--accent)', label: 'Ticket Created', time: c.createdAt },
                { icon: Clock, color: 'var(--warning)', label: 'Last Updated', time: c.updatedAt },
                ...(c.resolvedAt ? [{ icon: CheckCircle, color: 'var(--success)', label: 'Resolved', time: c.resolvedAt }] : [])
              ].map(({ icon: Icon, color, label, time }) => (
                <div key={label} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: `${color}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, color
                  }}>
                    <Icon size={14} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(time).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Email Templates — Admin Only */}
          {isAdmin && (
            <div className="card">
              <div className="section-title" style={{ marginBottom: '1rem' }}>
                <Mail size={15} color="var(--accent)" />Email Templates
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { type: 'acknowledgment', label: 'Send Acknowledgment' },
                  { type: 'inProgress', label: 'In Progress Update' },
                  { type: 'resolved', label: 'Resolution Email' },
                  { type: 'followUp', label: 'Follow-Up Email' }
                ].map(({ type, label }) => (
                  <button key={type} className="btn btn-outline"
                    style={{ justifyContent: 'flex-start' }}
                    onClick={() => loadEmailPreview(type)}>
                    <Mail size={14} />{label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Email Preview Modal */}
      {emailPreview && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 999, padding: '1rem',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div className="card" style={{ maxWidth: 640, width: '100%', maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3>Email Preview</h3>
              <button className="btn btn-outline" style={{ padding: '0.3rem 0.6rem' }}
                onClick={() => setEmailPreview(null)}>✕</button>
            </div>
            <div style={{ background: 'var(--surface-2)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Subject: </span>
              <span style={{ fontWeight: 600 }}>{emailPreview.subject}</span>
            </div>
            <pre style={{
              fontFamily: 'Outfit, sans-serif', fontSize: '0.85rem',
              color: 'var(--text-secondary)', lineHeight: 1.8,
              whiteSpace: 'pre-wrap', background: 'var(--surface-2)',
              borderRadius: 8, padding: '1rem'
            }}>
              {emailPreview.body}
            </pre>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setEmailPreview(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => {
                navigator.clipboard.writeText(`Subject: ${emailPreview.subject}\n\n${emailPreview.body}`);
                showToast('Copied!', 'success');
                setEmailPreview(null);
              }}>
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}