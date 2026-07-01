import { useState, useEffect } from 'react';
import { C, s } from '../components/styles';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3002';

export default function ReportPage() {
  const [stats, setStats] = useState(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    fetchStats();
    setTimeout(() => setAnimated(true), 300);
  }, []);

  const fetchStats = async () => {
    const res = await fetch(API + '/listings/stats');
    const data = await res.json();
    setStats(data);
  };

  if (!stats) return (
    <div style={{ textAlign: 'center', padding: '60px', color: C.gray }}>
      <div style={{ fontSize: '40px', animation: 'spin 1s linear infinite' }}>⏳</div>
      <p style={{ marginTop: '12px' }}>Loading...</p>
    </div>
  );

  const statCards = [
    { emoji: '🍱', label: 'Total Donations', value: stats.total, color: '#4ade80', glow: 'rgba(74,222,128,0.3)' },
    { emoji: '✅', label: 'Available', value: stats.available, color: '#4ade80', glow: 'rgba(74,222,128,0.3)' },
    { emoji: '📦', label: 'Claimed', value: stats.claimed, color: '#fbbf24', glow: 'rgba(251,191,36,0.3)' },
    { emoji: '🚗', label: 'In Transit', value: stats.in_transit, color: '#60a5fa', glow: 'rgba(96,165,250,0.3)' },
    { emoji: '🎉', label: 'Delivered', value: stats.delivered, color: '#a78bfa', glow: 'rgba(167,139,250,0.3)' },
    { emoji: '❌', label: 'Expired', value: stats.expired, color: '#f87171', glow: 'rgba(248,113,113,0.3)' },
  ];

  const successRate = stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0;

  return (
    <div>
      <style>{`
        @keyframes countUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes progressFill {
          from { width: 0%; }
          to { width: ${successRate}%; }
        }
        @keyframes cardPop {
          from { opacity: 0; transform: scale(0.8) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .stat-card:hover {
          transform: translateY(-8px) scale(1.05) !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4) !important;
        }
      `}</style>

      {/* Header */}
      <div style={s.card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '48px' }}>📊</div>
          <div>
            <h2 style={{
              fontWeight: '800', fontSize: '22px', margin: 0,
              background: 'linear-gradient(135deg, #4ade80, #22d3ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Platform Report</h2>
            <p style={{ color: C.gray, fontSize: '14px', margin: '4px 0 0' }}>
              Food Rescue platform ka overall performance
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '14px',
        marginBottom: '20px'
      }}>
        {statCards.map((sc, i) => (
          <div key={sc.label} className="stat-card" style={{
            background: `rgba(255,255,255,0.05)`,
            backdropFilter: 'blur(16px)',
            borderRadius: '20px',
            padding: '24px 16px',
            textAlign: 'center',
            border: `1px solid ${sc.color}30`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${sc.color}10`,
            animation: `cardPop 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s both`,
            transition: 'all .3s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: 'default',
          }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>{sc.emoji}</div>
            <div style={{
              fontSize: '36px', fontWeight: '800', color: sc.color,
              textShadow: `0 0 20px ${sc.glow}`,
              animation: animated ? `countUp 0.5s ease ${i * 0.08}s both` : 'none',
            }}>
              {sc.value}
            </div>
            <div style={{ fontSize: '12px', color: C.gray, marginTop: '6px', fontWeight: '500' }}>
              {sc.label}
            </div>
          </div>
        ))}
      </div>

      {/* Success Rate */}
      <div style={s.card}>
        <h3 style={{
          fontWeight: '700', fontSize: '16px', marginBottom: '20px',
          background: 'linear-gradient(135deg, #4ade80, #22d3ee)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          🎯 Success Rate
        </h3>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '14px', color: C.gray }}>Delivered / Total</span>
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#4ade80' }}>
              {successRate}%
            </span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '10px', height: '12px', overflow: 'hidden' }}>
            <div style={{
              background: 'linear-gradient(90deg, #4ade80, #22d3ee)',
              borderRadius: '10px',
              height: '12px',
              width: animated ? `${successRate}%` : '0%',
              transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 0 16px rgba(74,222,128,0.5)',
            }} />
          </div>
        </div>

        {/* Mini stats row */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[
            { label: 'Success', value: stats.delivered, color: '#4ade80' },
            { label: 'Pending', value: parseInt(stats.claimed) + parseInt(stats.in_transit), color: '#fbbf24' },
            { label: 'Wasted', value: stats.expired, color: '#f87171' },
          ].map(item => (
            <div key={item.label} style={{
              flex: 1,
              padding: '14px',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '12px',
              border: `1px solid ${item.color}20`,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '22px', fontWeight: '700', color: item.color }}>{item.value}</div>
              <div style={{ fontSize: '12px', color: C.gray, marginTop: '4px' }}>{item.label}</div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: '13px', color: C.gray, margin: '16px 0 0' }}>
          🌍 {stats.delivered} donations successfully delivered out of {stats.total} total listings
        </p>
      </div>
    </div>
  );
}