import { useState } from 'react';
import Toast from '../components/Toast';

const API = 'http://localhost:3002';

function FloatingEmojis() {
  const items = [
    { e: '🍱', x: 8, y: 15, size: 42, dur: 7 },
    { e: '🥗', x: 88, y: 10, size: 36, dur: 9 },
    { e: '🍲', x: 5, y: 70, size: 48, dur: 8 },
    { e: '🥘', x: 92, y: 65, size: 40, dur: 6 },
    { e: '🌮', x: 20, y: 85, size: 38, dur: 10 },
    { e: '🍜', x: 75, y: 80, size: 44, dur: 7 },
    { e: '🥙', x: 50, y: 5, size: 34, dur: 11 },
    { e: '🍛', x: 35, y: 90, size: 40, dur: 8 },
  ];
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {items.map((item, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${item.x}%`,
          top: `${item.y}%`,
          fontSize: `${item.size}px`,
          animation: `floatEmoji ${item.dur}s ease-in-out infinite`,
          animationDelay: `${i * 0.8}s`,
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
        }}>{item.e}</div>
      ))}
    </div>
  );
}

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('donor');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    setTilt({ x, y });
  };

  const handleLogin = async () => {
    setLoading(true);
    const res = await fetch(API + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      onLogin();
    } else {
      setMsg({ text: data.error || 'Login failed', type: 'error' });
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setMsg({ text: 'Sab fields bharo', type: 'error' }); return;
    }
    setLoading(true);
    const res = await fetch(API + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.user) {
      setMsg({ text: 'Account ban gaya! Ab login karo ✅', type: 'success' });
      setMode('login');
      setName('');
    } else {
      setMsg({ text: data.error || 'Register failed', type: 'error' });
    }
  };

  const inputStyle = {
    display: 'block', width: '100%',
    padding: '13px 16px', marginBottom: '12px',
    border: '2px solid rgba(255,255,255,0.2)',
    borderRadius: '12px', fontSize: '14px',
    fontFamily: "'Inter', sans-serif", outline: 'none',
    background: 'rgba(255,255,255,0.1)',
    color: 'white', boxSizing: 'border-box',
    transition: 'all .2s',
    backdropFilter: 'blur(10px)',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes floatEmoji {
          0%, 100% { transform: translateY(0px) rotate(-5deg); opacity: 0.7; }
          50% { transform: translateY(-30px) rotate(5deg); opacity: 1; }
        }
        @keyframes bgMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes logoBounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        input::placeholder { color: rgba(255,255,255,0.6) !important; }
        input:focus {
          border-color: rgba(255,255,255,0.6) !important;
          background: rgba(255,255,255,0.18) !important;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.1) !important;
        }
        .role-card:hover {
          transform: translateY(-6px) scale(1.05) !important;
          box-shadow: 0 16px 32px rgba(0,0,0,0.3) !important;
        }
        .submit-btn:hover {
          transform: translateY(-2px) scale(1.02) !important;
          box-shadow: 0 16px 40px rgba(0,0,0,0.4) !important;
        }
        .tab-btn:hover { opacity: 0.9; }
      `}</style>

      {/* Deep gradient background */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(-45deg, #0f172a, #1e3a5f, #064e3b, #1a1a2e, #16213e)',
        backgroundSize: '400% 400%',
        animation: 'bgMove 10s ease infinite',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Glowing orbs */}
        <div style={{
          position: 'fixed', width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(34,197,94,0.15), transparent)',
          borderRadius: '50%', top: '-100px', left: '-100px',
          animation: 'floatEmoji 8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'fixed', width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.12), transparent)',
          borderRadius: '50%', bottom: '-80px', right: '-80px',
          animation: 'floatEmoji 10s ease-in-out infinite reverse',
        }} />

        <FloatingEmojis />

        {/* 3D Tilt Card */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: '28px',
            padding: '44px',
            width: '100%',
            maxWidth: '420px',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
            animation: 'slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative',
            zIndex: 1,
            transform: `perspective(1000px) rotateX(${-tilt.y}deg) rotateY(${tilt.x}deg)`,
            transition: 'transform 0.1s ease',
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              fontSize: '64px',
              animation: 'logoBounce 3s ease-in-out infinite',
              display: 'inline-block',
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))',
            }}>🥗</div>
            <h1 style={{
              fontSize: '30px', fontWeight: '800', margin: '8px 0 4px',
              background: 'linear-gradient(135deg, #4ade80, #22d3ee, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.5px',
            }}>Food Rescue</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: 0 }}>
              Surplus food ko zaroorat tak pahunchao
            </p>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '14px',
            padding: '4px',
            marginBottom: '24px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            {['login', 'register'].map(m => (
              <button key={m} className="tab-btn"
                onClick={() => { setMode(m); setMsg({ text: '', type: '' }); }}
                style={{
                  flex: 1, padding: '10px',
                  border: 'none', borderRadius: '11px',
                  fontWeight: '700', fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  background: mode === m
                    ? 'linear-gradient(135deg, rgba(34,197,94,0.8), rgba(16,185,129,0.8))'
                    : 'transparent',
                  color: mode === m ? 'white' : 'rgba(255,255,255,0.5)',
                  boxShadow: mode === m ? '0 4px 16px rgba(34,197,94,0.3)' : 'none',
                  transition: 'all .3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}>
                {m === 'login' ? '🔑 Login' : '✨ Register'}
              </button>
            ))}
          </div>

          {/* Register extra fields */}
          {mode === 'register' && (
            <div style={{ animation: 'slideUp 0.3s ease' }}>
              <input placeholder="👤 Apna naam" value={name}
                onChange={e => setName(e.target.value)}
                style={inputStyle} />
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                Main kaun hoon?
              </p>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                {[
                  { val: 'donor', emoji: '🍱', label: 'Donor', color: '#4ade80' },
                  { val: 'shelter', emoji: '🏠', label: 'Shelter', color: '#60a5fa' },
                  { val: 'volunteer', emoji: '🚗', label: 'Volunteer', color: '#f472b6' },
                ].map(r => (
                  <button key={r.val} className="role-card"
                    onClick={() => setRole(r.val)}
                    style={{
                      flex: 1, padding: '12px 6px',
                      border: `2px solid ${role === r.val ? r.color : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: '12px',
                      background: role === r.val
                        ? `rgba(${r.val === 'donor' ? '74,222,128' : r.val === 'shelter' ? '96,165,250' : '244,114,182'},0.15)`
                        : 'rgba(255,255,255,0.05)',
                      color: role === r.val ? r.color : 'rgba(255,255,255,0.5)',
                      fontWeight: '700', fontSize: '12px',
                      cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif",
                      transition: 'all .25s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: role === r.val ? `0 4px 16px rgba(0,0,0,0.3)` : 'none',
                    }}>
                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>{r.emoji}</div>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Email & Password */}
          <input type="email" placeholder="📧 Email address"
            value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleRegister())}
            style={inputStyle} />
          <input type="password" placeholder="🔒 Password"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleRegister())}
            style={{ ...inputStyle, marginBottom: '16px' }} />

          {/* Submit */}
          <button className="submit-btn"
            onClick={mode === 'login' ? handleLogin : handleRegister}
            style={{
              width: '100%', padding: '14px',
              background: loading
                ? 'rgba(34,197,94,0.4)'
                : 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white', border: 'none',
              borderRadius: '12px', fontWeight: '700',
              fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Inter', sans-serif",
              boxShadow: '0 8px 24px rgba(34,197,94,0.3)',
              transition: 'all .25s cubic-bezier(0.16, 1, 0.3, 1)',
              letterSpacing: '0.3px',
            }}>
            {loading ? '⏳ Loading...' : mode === 'login' ? 'Login karo →' : 'Account banao →'}
          </button>

          <Toast msg={msg.text} type={msg.type} />
        </div>
      </div>
    </>
  );
}