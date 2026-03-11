import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) setIsDark(saved === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty('--primary', '#0f172a');
      root.style.setProperty('--surface', '#1e293b');
      root.style.setProperty('--surface-2', '#334155');
      root.style.setProperty('--surface-3', '#475569');
      root.style.setProperty('--text-primary', '#f1f5f9');
      root.style.setProperty('--text-secondary', '#94a3b8');
      root.style.setProperty('--text-muted', '#64748b');
      root.style.setProperty('--border', 'rgba(148,163,184,0.1)');
      root.style.setProperty('--border-hover', 'rgba(148,163,184,0.25)');
      root.style.setProperty('--shadow', '0 4px 24px rgba(0,0,0,0.3)');
    } else {
      root.style.setProperty('--primary', '#f8fafc');
      root.style.setProperty('--surface', '#ffffff');
      root.style.setProperty('--surface-2', '#f1f5f9');
      root.style.setProperty('--surface-3', '#e2e8f0');
      root.style.setProperty('--text-primary', '#0f172a');
      root.style.setProperty('--text-secondary', '#475569');
      root.style.setProperty('--text-muted', '#94a3b8');
      root.style.setProperty('--border', 'rgba(15,23,42,0.08)');
      root.style.setProperty('--border-hover', 'rgba(15,23,42,0.15)');
      root.style.setProperty('--shadow', '0 4px 24px rgba(0,0,0,0.08)');
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}