import React from 'react';
import { Target, Clock, CheckCircle2, AlertTriangle, Wifi, Monitor, Key, Shield, BookOpen, TrendingUp } from 'lucide-react';

const issues = [
  { rank: 1, icon: Wifi, color: '#ef4444', title: 'WiFi Not Working', timeline: '1–2 months', rootCauses: ['Overloaded access points in high-density areas', 'Outdated router firmware', 'Poor coverage in lab buildings'], solutions: ['Deploy additional Wi-Fi access points in labs', 'Schedule monthly firmware updates', 'Implement bandwidth management with QoS', 'Set up a dedicated student Wi-Fi network'] },
  { rank: 2, icon: Monitor, color: '#f59e0b', title: 'Lab System Issues', timeline: '2–3 months', rootCauses: ['Aging hardware (5+ years old)', 'Software conflicts from multiple installations', 'No regular maintenance schedule'], solutions: ['Establish monthly lab maintenance windows', 'Create standardized disk images for each lab', 'Replace systems older than 5 years on rolling basis', 'Set up remote monitoring for proactive detection'] },
  { rank: 3, icon: Key, color: '#6366f1', title: 'Portal Login Errors', timeline: '1–2 months', rootCauses: ['Session timeouts too short', 'Password policy confusing students', 'Server downtime during peak exam periods'], solutions: ['Implement Single Sign-On (SSO) across all portals', 'Add self-service password reset functionality', 'Scale server capacity before exam seasons', 'Create a student-friendly password guide'] },
  { rank: 4, icon: Shield, color: '#3b82f6', title: 'Email Access Problems', timeline: '2–4 weeks', rootCauses: ['Spam filters blocking legitimate emails', 'Quota limits not communicated', 'Mobile configuration issues'], solutions: ['Increase student mailbox quota to 10GB', 'Publish email setup guides for all devices', 'Configure whitelist for college domain emails', 'Send proactive alerts before quota exceeded'] },
  { rank: 5, icon: BookOpen, color: '#10b981', title: 'Software Installation', timeline: '2–3 months', rootCauses: ['No centralized software distribution system', 'Students lack admin rights', 'License management unclear'], solutions: ['Deploy a software distribution portal', 'Create pre-approved software request workflow', 'Maintain public list of licensed software', 'Train lab staff for common installation requests'] }
];

const processSteps = [
  { step: 1, icon: AlertTriangle, color: '#f59e0b', title: 'Issue Reported', desc: 'Student submits complaint via portal. System auto-generates a Ticket ID and sends acknowledgment email.' },
  { step: 2, icon: Clock, color: '#6366f1', title: 'Triage & Assignment', desc: 'Support staff reviews ticket within 1 hour, assigns priority, and routes to the appropriate technical team.' },
  { step: 3, icon: Monitor, color: '#3b82f6', title: 'Investigation', desc: 'Technician investigates root cause, updates status to In Progress, and communicates ETR to the student.' },
  { step: 4, icon: CheckCircle2, color: '#10b981', title: 'Resolution & Closure', desc: 'Issue is fixed, resolution notes added, student notified by email, ticket marked Resolved.' }
];

const slaTable = [
  { priority: 'Critical', firstResponse: '30 minutes', resolution: '2 hours', example: 'Complete network outage, exam portal down' },
  { priority: 'High', firstResponse: '1 hour', resolution: '4 hours', example: 'Lab fully non-functional, mass login failures' },
  { priority: 'Medium', firstResponse: '4 hours', resolution: '24 hours', example: 'WiFi spotty, single workstation issue' },
  { priority: 'Low', firstResponse: '24 hours', resolution: '48 hours', example: 'Printer jam, minor software glitch' }
];

export default function ImprovementPlan() {
  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Improvement Plan</h1>
        <p className="page-subtitle">Structured action plan to resolve top recurring issues</p>
      </div>

      <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 'var(--radius-lg)', padding: '1.5rem 2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ width: 56, height: 56, background: 'rgba(99,102,241,0.2)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <TrendingUp size={24} color="var(--accent-light)" />
        </div>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.3rem' }}>College Digital Support Team — Semester Action Plan</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>Identifies the <strong style={{ color: 'var(--accent-light)' }}>top 5 recurring IT issues</strong>, their root causes, and actionable solutions with timelines.</p>
        </div>
      </div>

      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Target size={18} color="var(--accent)" />Top 5 Recurring Issues & Action Plan
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
        {issues.map(issue => {
          const Icon = issue.icon;
          return (
            <div key={issue.rank} className="card" style={{ borderLeft: `4px solid ${issue.color}` }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: `${issue.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: issue.color }}>
                  <Icon size={20} />
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', background: `${issue.color}20`, color: issue.color, padding: '0.2rem 0.5rem', borderRadius: 6 }}>#{issue.rank}</span>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>{issue.title}</h3>
                  <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={12} />{issue.timeline}</span>
                </div>
              </div>
              <div className="grid-2">
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Root Causes</div>
                  <ul style={{ paddingLeft: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.8 }}>
                    {issue.rootCauses.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Action Steps</div>
                  <ul style={{ paddingLeft: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.8 }}>
                    {issue.solutions.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <CheckCircle2 size={18} color="var(--accent)" />Complaint Tracking Process
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {processSteps.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.step} className="card" style={{ textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${s.color}20`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}><Icon size={20} /></div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: s.color, marginBottom: '0.3rem' }}>STEP {s.step}</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>{s.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          );
        })}
      </div>

      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Clock size={18} color="var(--accent)" />Service Level Agreement (SLA)
      </h2>
      <div className="table-wrapper">
        <table>
          <thead><tr><th>Priority</th><th>First Response</th><th>Resolution Target</th><th>Example Scenarios</th></tr></thead>
          <tbody>
            {slaTable.map(row => (
              <tr key={row.priority}>
                <td><span className={`badge badge-${row.priority.toLowerCase()}`}>{row.priority}</span></td>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{row.firstResponse}</td>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{row.resolution}</td>
                <td style={{ fontSize: '0.82rem' }}>{row.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}