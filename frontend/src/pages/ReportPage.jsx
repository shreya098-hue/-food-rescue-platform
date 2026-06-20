import { useState, useEffect } from 'react';
import { C, s } from '../components/styles';

const API = 'http://localhost:3002';

export default function ReportPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    const res = await fetch(API + '/listings/stats');
    const data = await res.json();
    setStats(data);
  };

  if (!stats) return (
    <div style={{ textAlign: 'center', padding: '60px', color: C.gray }}>
      ⏳ Loading...
    </div>
  );

  const statCards = [
    { emoji: '🍱', label: 'Total Donations', value: stats.total, color: C.green },
    { emoji: '✅', label: 'Available', value: stats.available, color: C.green },
    { emoji: '📦', label: 'Claimed', value: stats.claimed, color: '#ca8a04' },
    { emoji: '🚗', label: 'In Transit', value: stats.in_transit, color: C.blue },
    { emoji: '🎉', label: 'Delivered', value: stats.delivered, color: '#7c3aed' },
    { emoji: '❌', label: 'Expired', value: stats.expired, color: C.red },
  ];

  return (
    <div>
      <div style={s.card}>
        <h2 style={{ fontWeight: '700', fontSize: '20px', color: C.green, marginBottom: '8px' }}>
          📊 Platform Report
        </h2>
        <p style={{ color: C.gray, fontSize: '14px', margin: 0 }}>
          Food Rescue platform ka overall performance
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        {statCards.map(sc => (
          <div key={sc.label} style={{
            background: C.white,
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
            border: `1px solid ${C.border}`,
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{sc.emoji}</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: sc.color }}>
              {sc.value}
            </div>
            <div style={{ fontSize: '12px', color: C.gray, marginTop: '4px' }}>
              {sc.label}
            </div>
          </div>
        ))}
      </div>

      {/* Success rate */}
      <div style={s.card}>
        <h3 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '16px', color: C.green }}>
          🎯 Success Rate
        </h3>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '14px', color: C.gray }}>Delivered / Total</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: C.green }}>
              {stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0}%
            </span>
          </div>
          <div style={{ background: '#e5e7eb', borderRadius: '10px', height: '10px' }}>
            <div style={{
              background: C.green,
              borderRadius: '10px',
              height: '10px',
              width: `${stats.total > 0 ? (stats.delivered / stats.total) * 100 : 0}%`,
              transition: 'width 1s ease',
            }} />
          </div>
        </div>
        <p style={{ fontSize: '13px', color: C.gray, margin: 0 }}>
          {stats.delivered} donations successfully delivered out of {stats.total} total
        </p>
      </div>
    </div>
  );
}