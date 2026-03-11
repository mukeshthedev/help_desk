import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import ComplaintsList from './pages/ComplaintsList';
import ComplaintDetail from './pages/ComplaintDetail';
import ImprovementPlan from './pages/ImprovementPlan';
import EmailTemplates from './pages/EmailTemplates';
import AdminLogin from './pages/AdminLogin';
import TrackComplaint from './pages/TrackComplaint';
import './index.css';

function AdminRoute({ children }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <div className="spinner" />
    </div>
  );
  return isAdmin ? children : <Navigate to="/admin/login" />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes — no login needed */}
      <Route path="/submit" element={<Layout><SubmitComplaint /></Layout>} />
      <Route path="/track" element={<TrackComplaint />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin only */}
      <Route path="/" element={<AdminRoute><Layout><Dashboard /></Layout></AdminRoute>} />
      <Route path="/complaints" element={<AdminRoute><Layout><ComplaintsList /></Layout></AdminRoute>} />
      <Route path="/complaints/:ticketId" element={<AdminRoute><Layout><ComplaintDetail /></Layout></AdminRoute>} />
      <Route path="/improvement-plan" element={<AdminRoute><Layout><ImprovementPlan /></Layout></AdminRoute>} />
      <Route path="/email-templates" element={<AdminRoute><Layout><EmailTemplates /></Layout></AdminRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;