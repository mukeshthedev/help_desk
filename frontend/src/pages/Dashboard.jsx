import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { AlertCircle, CheckCircle2, Clock, Loader2, TrendingUp, Activity, Plus, ArrowRight, Zap } from 'lucide-react';
import { statsAPI } from '../utils/api';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#84cc16'];
const PRIORITY_COLORS = { Low: '#10b981', Medium: '#3b82f6', High: '#f59e0b', Critical: '#ef4444' };

function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle, ${color}20, transparent 70%)`, borderRadius: '0 0 0 100%' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>{label}</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{value ?? '—'}</div>
          {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>{sub}</div>}
        </div>
        <div style={{ width: 44, height: 44, background: `${color}20`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsAPI.getDashboard()
      .then(res => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
      <div className="spinner" />
      <p style={{ color: 'var(--text-muted)' }}>Loading dashboard...</p>
    </div>
  );

  const s = stats?.summary || {};
  const top5 = stats?.top5Issues || [];
  const catData = stats?.categoryBreakdown || [];
  const priorityData = stats?.priorityBreakdown || [];
  const deptData = stats?.departmentBreakdown || [];

  return (
    <div className="fade-in">
      <style>{`
        @media (max-width: 768px) {
          .dash-header { flex-direction: column !important; gap: 1rem !important; align-items: flex-start !important; }
          .dash-header .btn { width: 100% !important; justify-content: center !important; }
          .stat-grid { grid-template-columns: 1fr 1fr !important; gap: 0.75rem !important; }
          .top5-grid { grid-template-columns: 1fr !important; }
          .top5-card { grid-column: span 1 !important; }
          .charts-grid { grid-template-columns: 1fr !important; }
          .page-title { font-size: 1.4rem !important; }
        }
        @media (max-width: 480px) {
          .stat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Header */}
      <div className="dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of all helpdesk complaints and activity</p>
        </div>
        <Link to="/submit" className="btn btn-primary">
          <Plus size={16} />New Complaint
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard label="Total Tickets" value={s.total}      icon={Activity}     color="#6366f1" sub="All time" />
        <StatCard label="Open"          value={s.open}       icon={AlertCircle}  color="#f59e0b" sub="Needs attention" />
        <StatCard label="In Progress"   value={s.inProgress} icon={Loader2}      color="#3b82f6" sub="Being worked on" />
        <StatCard label="Resolved"      value={s.resolved}   icon={CheckCircle2} color="#10b981" sub={s.resolutionRate ? `${s.resolutionRate}% resolution rate` : null} />
      </div>

      {/* Top 5 + Priority Split */}
      <div className="top5-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>

        {/* Top 5 Issues */}
        <div className="card top5-card" style={{ gridColumn: 'span 2' }}>
          <div className="section-title"><Zap size={16} color="var(--accent)" />Top 5 Recurring Issues</div>
          {top5.length === 0
            ? <div className="empty-state">No data yet. Submit some complaints first.</div>
            : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {top5.map((item, i) => {
                  const pct = s.total > 0 ? Math.round((item.count / s.total) * 100) : 0;
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.25rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ display: 'inline-flex', width: 22, height: 22, borderRadius: 6, background: `${COLORS[i]}20`, color: COLORS[i], alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>
                            #{i + 1}
                          </span>
                          <span style={{ wordBreak: 'break-word' }}>{item._id}</span>
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS[i], whiteSpace: 'nowrap' }}>
                          {item.count} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({pct}%)</span>
                        </span>
                      </div>
                      <div style={{ height: 6, background: 'var(--surface-2)', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${COLORS[i]}, ${COLORS[i]}99)`, borderRadius: 999 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          }
          <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
            <Link to="/complaints" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              View All Complaints <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Priority Split */}
        <div className="card">
          <div className="section-title"><TrendingUp size={16} color="var(--accent)" />Priority Split</div>
          {priorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={priorityData} dataKey="count" nameKey="_id"
                  cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3}
                >
                  {priorityData.map((entry, i) => (
                    <Cell key={i} fill={PRIORITY_COLORS[entry._id] || COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Legend formatter={(value) => (
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{value}</span>
                )} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '2rem' }}>No data yet</div>
          )}
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

        {/* Issues by Category */}
        <div className="card">
          <div className="section-title">Issues by Category</div>
          {catData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={catData} margin={{ left: -20 }}>
                <XAxis
                  dataKey="_id"
                  tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                  angle={-30} textAnchor="end" height={55}
                  interval={0}
                />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '2rem' }}>No data yet</div>
          )}
        </div>

        {/* Issues by Department */}
        <div className="card">
          <div className="section-title"><Clock size={16} color="var(--accent)" />Issues by Department</div>
          {deptData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deptData} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis
                  dataKey="_id" type="category"
                  tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                  width={70}
                />
                <Tooltip contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {deptData.map((_, i) => <Cell key={i} fill={COLORS[(i + 3) % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '2rem' }}>No data yet</div>
          )}
        </div>
      </div>
    </div>
  );
}