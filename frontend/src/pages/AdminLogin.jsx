import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, GraduationCap, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!form.username || !form.password) {
      setError('Please enter username and password');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      if (res.data.success) {
        login(res.data.data.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .student-btn:hover {
          filter: brightness(1.15);
          transform: translateY(-1px);
        }
      `}</style>

      {/* Background blobs */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.1), transparent 70%)',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />

      <div style={{
        width: '100%', maxWidth: 420,
        animation: 'fadeInUp 0.5s ease',
        position: 'relative', zIndex: 1
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 72, height: 72,
            background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
            borderRadius: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 0 40px rgba(99,102,241,0.35)'
          }}>
            <GraduationCap size={36} color="white" />
          </div>
          <h1 style={{
            fontSize: '1.6rem', fontWeight: 800,
            color: 'var(--text-primary)', marginBottom: '0.25rem'
          }}>
            Admin Portal
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            College Digital Support Team
          </p>
        </div>

        {/* Login Card */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{
            fontSize: '1.1rem', fontWeight: 700,
            marginBottom: '1.5rem', color: 'var(--text-primary)'
          }}>
            Sign in to continue
          </h2>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              color: 'var(--danger)',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              marginBottom: '1.25rem', fontSize: '0.875rem',
              animation: 'fadeInUp 0.3s ease'
            }}>
              <AlertCircle size={16} />{error}
            </div>
          )}

          {/* Username */}
          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{
                position: 'absolute', left: '0.875rem',
                top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                className="form-input"
                placeholder="Enter admin username"
                style={{ paddingLeft: '2.75rem' }}
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{
                position: 'absolute', left: '0.875rem',
                top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                className="form-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter admin password"
                style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
              <button onClick={() => setShowPassword(!showPassword)} style={{
                position: 'absolute', right: '0.875rem',
                top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                cursor: 'pointer', color: 'var(--text-muted)', padding: 0
              }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            className="btn btn-primary"
            style={{
              width: '100%', justifyContent: 'center',
              padding: '0.875rem', fontSize: '1rem', marginTop: '0.5rem'
            }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <div style={{
                width: 18, height: 18,
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: 'white', borderRadius: '50%',
                animation: 'spin 0.7s linear infinite'
              }} />
            ) : (
              <><Lock size={16} />Sign In as Admin</>
            )}
          </button>
        </div>

        {/* Student buttons — visible and clear */}
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
          <a href="/submit"
            className="student-btn"
            style={{
              flex: 1, textAlign: 'center',
              padding: '0.875rem',
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--accent-light)',
              fontSize: '0.875rem', fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '0.4rem'
            }}>
            ✏️ Submit Complaint
          </a>
          <a href="/track"
            className="student-btn"
            style={{
              flex: 1, textAlign: 'center',
              padding: '0.875rem',
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--success)',
              fontSize: '0.875rem', fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '0.4rem'
            }}>
            🔍 Track Complaint
          </a>
        </div>

      </div>
    </div>
  );
}