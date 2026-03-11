import React, { useState } from 'react';
import { Copy, CheckCheck, Mail, AlertCircle, Clock, CheckCircle2, RefreshCw } from 'lucide-react';

const templates = [
  { type: 'acknowledgment', icon: Mail, color: '#6366f1', label: 'Acknowledgment Email', purpose: 'Sent immediately when a new complaint is received', subject: '[TKT-2024-XXXX] Complaint Received – WiFi Not Working', body: `Dear [Student Name],\n\nThank you for contacting the College Digital Support Team.\n\nTicket ID    : TKT-2024-XXXX\nIssue        : WiFi Not Working\nPriority     : Medium\nSubmitted On : 15 Jan 2024\n\nResponse times:\n• Critical : 2 hours   • High : 4 hours\n• Medium   : 24 hours  • Low  : 48 hours\n\nTrack your complaint at: helpdesk.college.edu\n\nWarm regards,\nDigital Support Team` },
  { type: 'inProgress', icon: Clock, color: '#f59e0b', label: 'In Progress Update', purpose: 'Sent when the team begins working on the issue', subject: '[TKT-2024-XXXX] Update: Your Issue is Being Investigated', body: `Dear [Student Name],\n\nUpdate on your support request:\n\nTicket ID   : TKT-2024-XXXX\nIssue       : WiFi Not Working\nStatus      : In Progress\nAssigned To : Network Support Team\n\nOur team has begun investigating your issue.\n\nThank you for your patience.\n\nWarm regards,\nDigital Support Team` },
  { type: 'resolved', icon: CheckCircle2, color: '#10b981', label: 'Resolution Email', purpose: 'Sent once the issue has been fully resolved', subject: '[TKT-2024-XXXX] Resolved: WiFi Not Working', body: `Dear [Student Name],\n\nYour issue has been resolved.\n\nTicket ID   : TKT-2024-XXXX\nStatus      : ✅ Resolved\nResolved On : 15 Jan 2024\n\nResolution: The Wi-Fi access point was reset and firmware updated.\n\nIf the issue persists, reply within 48 hours to reopen your ticket.\n\nWarm regards,\nDigital Support Team` },
  { type: 'followUp', icon: RefreshCw, color: '#3b82f6', label: 'Follow-Up Email', purpose: 'Sent for tickets pending beyond expected resolution time', subject: '[TKT-2024-XXXX] Follow-Up: WiFi Not Working', body: `Dear [Student Name],\n\nFollow-up on your ticket open for 3 days:\n\nTicket ID  : TKT-2024-XXXX\nIssue      : WiFi Not Working\n\nYour ticket has been escalated to senior technical staff.\n\nExpected Resolution: Within 24 hours\n\nFor urgent concerns:\n📧 priority@college.edu\n📞 +91-XXXXXXXXXX\n\nWarm regards,\nDigital Support Team` }
];

export default function EmailTemplates() {
  const [selected, setSelected] = useState(templates[0]);
  const [copied, setCopied] = useState(false);

  const copyTemplate = () => {
    navigator.clipboard.writeText(`Subject: ${selected.subject}\n\n${selected.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Email Templates</h1>
        <p className="page-subtitle">Pre-written response templates for the Digital Support Team</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {templates.map(t => {
            const Icon = t.icon;
            const active = selected.type === t.type;
            return (
              <button key={t.type} onClick={() => setSelected(t)} style={{ background: active ? `${t.color}15` : 'var(--surface)', border: `1px solid ${active ? t.color + '60' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '1rem', cursor: 'pointer', textAlign: 'left', transition: 'var(--transition)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                  <Icon size={16} color={t.color} />
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{t.label}</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{t.purpose}</p>
              </button>
            );
          })}
          <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 'var(--radius)', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-light)', fontSize: '0.8rem', fontWeight: 600 }}>
              <AlertCircle size={14} />Usage Guide
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Replace <strong style={{ color: 'var(--text-primary)' }}>[Student Name]</strong> and <strong style={{ color: 'var(--text-primary)' }}>TKT-XXXX</strong> with actual values before sending.</p>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                {React.createElement(selected.icon, { size: 16, color: selected.color })}
                <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>{selected.label}</h2>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selected.purpose}</p>
            </div>
            <button className={`btn ${copied ? 'btn-success' : 'btn-primary'}`} onClick={copyTemplate}>
              {copied ? <><CheckCheck size={15} />Copied!</> : <><Copy size={15} />Copy Template</>}
            </button>
          </div>
          <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', marginBottom: '1rem', borderLeft: `3px solid ${selected.color}` }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Subject</span>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem', fontSize: '0.9rem' }}>{selected.subject}</div>
          </div>
          <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.75rem' }}>Email Body</span>
            <pre style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>{selected.body}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}