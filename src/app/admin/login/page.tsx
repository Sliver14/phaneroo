'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconLock, IconMail, IconLoader2 } from '@tabler/icons-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="success-page" style={{ minHeight: '100vh', padding: '20px' }}>
      <div className="success-inner" style={{ maxWidth: '400px' }}>
        <div className="event-header" style={{ paddingBottom: '20px' }}>
          <div className="eyebrow">
            <IconLock size={14} /> ADMIN ACCESS
          </div>
          <h1>ADMIN <span>PORTAL</span></h1>
        </div>

        <form onSubmit={handleSubmit} className="form-card" style={{ textAlign: 'left' }}>
          {error && (
            <div style={{ color: '#ff4444', marginBottom: '20px', fontSize: '14px', textAlign: 'center', background: 'rgba(255,0,0,0.1)', padding: '10px' }}>
              {error}
            </div>
          )}

          <div className="field-group">
            <label htmlFor="email">
              <IconMail size={16} /> EMAIL ADDRESS
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@phaneroo.com"
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="password">
              <IconLock size={16} /> PASSWORD
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <IconLoader2 className="animate-spin" /> : 'SECURE LOGIN'}
          </button>
        </form>

        <div className="footer">
          PHANEROO PORT HARCOURT © 2026
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
