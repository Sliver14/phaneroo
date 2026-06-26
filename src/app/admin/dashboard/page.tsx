'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  IconUsers, 
  IconDownload, 
  IconLogout, 
  IconSearch, 
  IconCalendar, 
  IconMail, 
  IconBrandWhatsapp, 
  IconBus,
  IconLoader2,
  IconSend
} from '@tabler/icons-react';

interface User {
  id: number;
  full_name: string;
  email: string;
  whatsapp: string;
  attendance: string;
  bus: string;
  bus_address: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingBulk, setSendingBulk] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

const handleSendReminder = async () => {
    if (!confirm('Send "Meeting Starts Today" reminder to ALL registered users?')) return;
    
    setSendingBulk(true);
    try {
      const res = await fetch('/api/admin/send-reminder', { 
        method: 'POST' 
      });
      const data = await res.json();
      
      if (data.success) {
        alert(`✅ Reminder sent!\nSuccessful: ${data.stats.successful}\nFailed: ${data.stats.failed}`);
      } else {
        alert(data.error || 'Failed to send reminders');
      }
    } catch (err) {
      alert('An error occurred.');
    } finally {
      setSendingBulk(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.whatsapp.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container" style={{ minHeight: '100vh', background: 'var(--black)', color: 'var(--white)', padding: '20px' }}>
      {/* Header */}
      <div className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="eyebrow" style={{ margin: 0 }}>
            <IconUsers size={14} /> ADMIN DASHBOARD
          </div>
          <h1 style={{ fontSize: '24px', margin: 0 }}>REGISTRATIONS</h1>
        </div>
        
        <div className="admin-actions">
          <button 
            onClick={handleSendReminder}
            className="share-btn" 
            disabled={sendingBulk}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: 'rgba(245,197,24,0.15)', 
              borderColor: '#FFC630',
              color: '#FFC630'
            }}
          >
            {sendingBulk ? <IconLoader2 className="animate-spin" size={18} /> : <IconSend size={18} />} 
            SEND REMINDER
          </button>
          <a 
            href="/api/admin/export" 
            className="share-btn" 
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <IconDownload size={18} /> EXCEL
          </a>
          <button 
            onClick={handleLogout}
            className="share-btn" 
            style={{ color: '#ff4444', borderColor: 'rgba(255,0,0,0.2)' }}
          >
            <IconLogout size={18} /> LOGOUT
          </button>
        </div>
      </div>

      <main style={{ maxWidth: '1200px', margin: '40px auto' }}>
        {/* Stats */}
        <div className="stats-grid">
          <div className="form-card" style={{ padding: '20px' }}>
            <div className="detail-card" style={{ margin: 0, padding: 0, border: 'none', background: 'transparent' }}>
              <div className="card-title">TOTAL REGISTERED</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--gold)' }}>{users.length}</div>
            </div>
          </div>
          <div className="form-card" style={{ padding: '20px' }}>
            <div className="detail-card" style={{ margin: 0, padding: 0, border: 'none', background: 'transparent' }}>
              <div className="card-title">BUS REQUESTS</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--white)' }}>
                {users.filter(u => u.bus === 'yes').length}
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="field-group search-box" style={{ maxWidth: '400px', marginBottom: '30px' }}>
          <label><IconSearch size={16} /> SEARCH USERS</label>
          <input 
            type="text" 
            placeholder="Search by name, email or whatsapp..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="form-card" style={{ padding: '0', overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <IconLoader2 className="animate-spin" size={40} color="var(--gold)" />
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: '#111', borderBottom: '2px solid var(--gray-border)' }}>
                  <th style={thStyle}>NAME</th>
                  <th style={thStyle}>CONTACT</th>
                  <th style={thStyle}>ATTENDANCE</th>
                  <th style={thStyle}>BUS</th>
                  <th style={thStyle}>DATE</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #1a1a1a', transition: 'background 0.2s' }} className="table-row">
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 700, color: 'var(--white)' }}>{user.full_name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: #{user.id}</div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px' }}>
                        <IconMail size={14} color="var(--gold-dark)" /> {user.email}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', marginTop: '4px' }}>
                        <IconBrandWhatsapp size={14} color="#25D366" /> {user.whatsapp}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ 
                        fontSize: '11px', 
                        padding: '3px 8px', 
                        background: user.attendance === 'first-time' ? 'rgba(255,198,48,0.1)' : 'rgba(255,255,255,0.05)',
                        color: user.attendance === 'first-time' ? 'var(--gold)' : '#aaa',
                        border: '1px solid',
                        borderColor: user.attendance === 'first-time' ? 'rgba(255,198,48,0.3)' : 'rgba(255,255,255,0.1)',
                        textTransform: 'uppercase',
                        fontWeight: 700
                      }}>
                        {user.attendance}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {user.bus === 'yes' ? (
                        <div>
                          <div style={{ color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', fontWeight: 600 }}>
                            <IconBus size={14} /> YES
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '200px', whiteSpace: 'normal', marginTop: '4px' }}>
                            {user.bus_address}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: '#444' }}>NO</span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <IconCalendar size={14} /> {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No registrations found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      <div className="footer">
        PHANEROO PORT HARCOURT MANAGEMENT SYSTEM © 2026
      </div>

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
        .table-row:hover { background: #161616; }
        th { font-family: var(--font-bebas-neue), cursive; letter-spacing: 1px; }

        .admin-header {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          border-bottom: 1px solid var(--gray-border);
          flex-wrap: wrap;
          gap: 20px;
        }

        .admin-actions {
          display: flex;
          gap: 10px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          marginBottom: 30px;
        }

        @media (max-width: 600px) {
          .admin-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .admin-actions {
            width: 100%;
          }
          .admin-actions > * {
            flex: 1;
            justify-content: center;
          }
          .search-box {
            max-width: 100% !important;
          }
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: '15px 20px',
  fontSize: '14px',
  color: 'var(--gold)',
  fontWeight: 400
};

const tdStyle: React.CSSProperties = {
  padding: '15px 20px',
  verticalAlign: 'top'
};
