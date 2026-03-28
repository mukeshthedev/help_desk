import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Trash2, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { complaintsAPI } from '../utils/api';

const statusClass = { 'Open': 'badge-open', 'In Progress': 'badge-inprogress', 'Resolved': 'badge-resolved', 'Closed': 'badge-closed' };
const priorityClass = { 'Low': 'badge-low', 'Medium': 'badge-medium', 'High': 'badge-high', 'Critical': 'badge-critical' };

export default function ComplaintsList() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', category: '', priority: '', search: '' });
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, page, limit: 10 };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const res = await complaintsAPI.getAll(params);
      setComplaints(res.data.data);
      setPagination(res.data.pagination);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filters, page]);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const handleDelete = async (id) => {
    try { await complaintsAPI.delete(id); setDeleteId(null); fetchComplaints(); }
    catch (e) { console.error(e); }
  };

  const setFilter = (k, v) => { setFilters(f => ({ ...f, [k]: v })); setPage(1); };
  const hasFilters = filters.search || filters.status || filters.category || filters.priority;

  return (
    <div className="fade-in">
      <style>{`
        @media (max-width: 768px) {
          .list-header { flex-direction: column !important; gap: 0.75rem !important; }
          .list-header .btn { width: 100% !important; justify-content: center !important; }
          .filter-row { flex-direction: column !important; }
          .filter-selects { display: none; }
          .filter-selects.open { display: flex !important; flex-direction: column !important; gap: 0.5rem !important; }
          .desktop-table { display: none !important; }
          .mobile-cards { display: flex !important; }
          .pagination-row { flex-direction: column !important; gap: 0.75rem !important; align-items: center !important; }
        }
        @media (min-width: 769px) {
          .mobile-cards { display: none !important; }
          .filter-toggle-btn { display: none !important; }
          .filter-selects { display: flex !important; flex-wrap: wrap !important; gap: 0.75rem !important; }
        }
        .mobile-card-item {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }
        .mobile-card-item:hover { border-color: var(--accent); }
      `}</style>

      {/* Header */}
      <div className="list-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">All Complaints</h1>
          <p className="page-subtitle">{pagination.total} total tickets</p>
        </div>
        <Link to="/submit" className="btn btn-primary"><Plus size={15} />New Ticket</Link>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="filter-row" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>

          {/* Search — always visible */}
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="form-input"
              placeholder="Search tickets..."
              style={{ paddingLeft: '2.5rem' }}
              value={filters.search}
              onChange={e => setFilter('search', e.target.value)}
            />
          </div>

          {/* Filter toggle - mobile only */}
          <button
            className="filter-toggle-btn btn btn-outline"
            onClick={() => setShowFilters(f => !f)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Filter size={14} />
            Filters {hasFilters ? '●' : ''}
          </button>

          {/* Filter selects */}
          <div className={`filter-selects ${showFilters ? 'open' : ''}`}>
            <select className="form-select" style={{ minWidth: 140 }} value={filters.status} onChange={e => setFilter('status', e.target.value)}>
              <option value="">All Status</option>
              {['Open', 'In Progress', 'Resolved', 'Closed'].map(s => <option key={s}>{s}</option>)}
            </select>
            <select className="form-select" style={{ minWidth: 160 }} value={filters.category} onChange={e => setFilter('category', e.target.value)}>
              <option value="">All Categories</option>
              {['WiFi Not Working', 'Lab System Issues', 'Portal Login Errors', 'Email Access Problems', 'Software Installation', 'Printer Issues', 'Projector/AV Problems', 'Other'].map(c => <option key={c}>{c}</option>)}
            </select>
            <select className="form-select" style={{ minWidth: 130 }} value={filters.priority} onChange={e => setFilter('priority', e.target.value)}>
              <option value="">All Priority</option>
              {['Low', 'Medium', 'High', 'Critical'].map(p => <option key={p}>{p}</option>)}
            </select>
            {hasFilters && (
              <button className="btn btn-outline" onClick={() => { setFilters({ status: '', category: '', priority: '', search: '' }); setShowFilters(false); }}>
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Desktop Table ── */}
      <div className="desktop-table table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Student</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}><div className="spinner" style={{ margin: '0 auto' }} /></td></tr>
            ) : complaints.length === 0 ? (
              <tr><td colSpan={7}><div className="empty-state"><Filter size={32} /><p>No complaints found</p></div></td></tr>
            ) : complaints.map(c => (
              <tr key={c._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/complaints/${c.ticketId}`)}>
                <td><span className="mono" style={{ color: 'var(--accent-light)' }}>{c.ticketId}</span></td>
                <td>
                  <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{c.studentName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.department}</div>
                </td>
                <td style={{ fontSize: '0.85rem' }}>{c.issueCategory}</td>
                <td><span className={`badge ${priorityClass[c.priority]}`}>{c.priority}</span></td>
                <td><span className={`badge ${statusClass[c.status]}`}>{c.status}</span></td>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td onClick={e => e.stopPropagation()}>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button className="btn btn-outline" style={{ padding: '0.4rem 0.6rem' }} onClick={() => navigate(`/complaints/${c.ticketId}`)}><Eye size={14} /></button>
                    <button className="btn btn-danger" style={{ padding: '0.4rem 0.6rem' }} onClick={() => setDeleteId(c._id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="mobile-cards" style={{ flexDirection: 'column', gap: '0.75rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="spinner" style={{ margin: '0 auto' }} />
          </div>
        ) : complaints.length === 0 ? (
          <div className="empty-state"><Filter size={32} /><p>No complaints found</p></div>
        ) : complaints.map(c => (
          <div
            key={c._id}
            className="mobile-card-item"
            onClick={() => navigate(`/complaints/${c.ticketId}`)}
          >
            {/* Top row — ticket ID + badges */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span className="mono" style={{ color: 'var(--accent-light)', fontSize: '0.8rem' }}>
                {c.ticketId}
              </span>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span className={`badge ${priorityClass[c.priority]}`}>{c.priority}</span>
                <span className={`badge ${statusClass[c.status]}`}>{c.status}</span>
              </div>
            </div>

            {/* Student name + dept */}
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{c.studentName}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{c.department} · {c.issueCategory}</div>
            </div>

            {/* Bottom row — date + actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <div style={{ display: 'flex', gap: '0.4rem' }} onClick={e => e.stopPropagation()}>
                <button className="btn btn-outline" style={{ padding: '0.4rem 0.6rem' }} onClick={() => navigate(`/complaints/${c.ticketId}`)}>
                  <Eye size={14} />
                </button>
                <button className="btn btn-danger" style={{ padding: '0.4rem 0.6rem' }} onClick={() => setDeleteId(c._id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Page {pagination.page} of {pagination.pages}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft size={15} />
            </button>
            <button className="btn btn-outline" onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: 400, width: '100%' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Delete Complaint?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}