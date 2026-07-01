import { useState, useEffect } from 'react';
import Map from '../Map';
import Btn from '../components/Btn';
import Toast from '../components/Toast';
import { C, s } from '../components/styles';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3002';

export default function VolunteerDashboard() {
  const [tab, setTab] = useState('available');
  const [listings, setListings] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchListings();
    fetchMyDeliveries();
  }, []);

  const fetchListings = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(API + '/listings/volunteer', {
      headers: { authorization: token }
    });
    const data = await res.json();
    setListings(Array.isArray(data) ? data : []);
  };

  const fetchMyDeliveries = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(API + '/listings/mydeliveries', {
      headers: { authorization: token }
    });
    const data = await res.json();
    setMyDeliveries(Array.isArray(data) ? data : []);
  };

  const handlePickup = async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API}/listings/${id}/pickup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authorization: token },
      body: JSON.stringify({})
    });
    const data = await res.json();
    if (data.message) {
      setMsg({ text: 'Delivery accept kar li!', type: 'success' });
      fetchListings();
      fetchMyDeliveries();
      setTab('mydeliveries');
    } else {
      setMsg({ text: data.error, type: 'error' });
    }
  };

  const handleDelivered = async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API}/listings/${id}/delivered`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authorization: token },
      body: JSON.stringify({})
    });
    const data = await res.json();
    if (data.message) {
      setMsg({ text: '🎉 Delivery complete!', type: 'success' });
      fetchMyDeliveries();
    } else {
      setMsg({ text: data.error, type: 'error' });
    }
  };
 const tabBtn = (id, label) => (
  <button onClick={() => setTab(id)} style={{
    padding: '9px 18px', borderRadius: '10px', border: 'none',
    fontWeight: '600', fontSize: '13px', cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
   background: tab === id ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : 'transparent',
color: tab === id ? '#0f172a' : 'rgba(255,255,255,0.5)',
boxShadow: tab === id ? '0 4px 16px rgba(251,191,36,0.3)' : 'none',
    transition: 'all .25s cubic-bezier(0.16, 1, 0.3, 1)',
    transform: tab === id ? 'scale(1.02)' : 'scale(1)',
  }}>{label}</button>
);

  const statusBadge = (status) => {
    if (status === 'claimed')
      return <span style={s.badge('#fef9c3', '#ca8a04')}>📦 Pickup karo</span>;
    if (status === 'in_transit')
      return <span style={s.badge('#dbeafe', '#2563eb')}>🚗 In Transit</span>;
    if (status === 'delivered')
      return <span style={s.badge(C.green2, C.green)}>✅ Delivered</span>;
  };

  return (
    <div>
      {/* Tabs */}
      <div style={{ ...s.card, borderRadius: '12px', padding: '8px', display: 'flex', gap: '4px', marginBottom: '20px' }}>
        {tabBtn('available', `🗺️ Map & Pickups (${listings.length})`)}
        {tabBtn('mydeliveries', `🚗 Meri Deliveries (${myDeliveries.length})`)}
      </div>

      {/* Map + Pickup Tab */}
      {tab === 'available' && (
        <div>
          <div style={s.card}>
            <h2 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '16px', color: '#f59e0b' }}>
              🗺️ Live Delivery Map
            </h2>
            <Map listings={listings} />
          </div>

          <div style={s.card}>
            <h3 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '16px', color: '#f59e0b' }}>
              📦 Pickup ke liye available
            </h3>
            <Toast msg={msg.text} type={msg.type} />
            {listings.length === 0 ? (
              <div style={{ textAlign: 'center', color: C.gray, padding: '30px 0' }}>
                <div style={{ fontSize: '40px' }}>🎉</div>
                <p style={{ marginTop: '12px' }}>Abhi koi delivery pending nahi!</p>
              </div>
            ) : listings.map(l => (
              <div key={l.id} style={{
                ...s.card, marginBottom: '12px', padding: '16px',
                borderLeft: '4px solid #f59e0b',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ fontWeight: '600', fontSize: '16px', margin: 0 }}>{l.title}</h4>
                  {statusBadge(l.status)}
                </div>
                <p style={{ color: C.gray, fontSize: '13px', margin: '6px 0' }}>
                  📦 {l.quantity} {l.unit} &nbsp;·&nbsp; 📍 {l.address || 'Location nahi di'}
                </p>
                <p style={{ color: C.gray, fontSize: '13px', margin: '0 0 10px 0' }}>
                  🏠 Shelter: {l.shelter_name || 'Unknown'}
                </p>
                {l.status === 'claimed' && (
                  <Btn bg="#f59e0b" onClick={() => handlePickup(l.id)}
                    style={{ margin: 0, padding: '7px 18px', fontSize: '13px' }}>
                    🚗 Pickup karo
                  </Btn>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Deliveries Tab */}
      {tab === 'mydeliveries' && (
        <div style={s.card}>
          <h2 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '20px', color: '#f59e0b' }}>
            🚗 Meri Deliveries
          </h2>
          <Toast msg={msg.text} type={msg.type} />
          {myDeliveries.length === 0 ? (
            <div style={{ textAlign: 'center', color: C.gray, padding: '40px 0' }}>
              <div style={{ fontSize: '40px' }}>📭</div>
              <p style={{ marginTop: '12px' }}>Abhi koi delivery nahi li</p>
            </div>
          ) : myDeliveries.map(l => (
            <div key={l.id} style={{
              ...s.card, marginBottom: '12px', padding: '16px',
              borderLeft: `4px solid ${l.status === 'delivered' ? C.green : '#f59e0b'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ fontWeight: '600', fontSize: '16px', margin: 0 }}>{l.title}</h4>
                {statusBadge(l.status)}
              </div>
              <p style={{ color: C.gray, fontSize: '13px', margin: '6px 0' }}>
                📦 {l.quantity} {l.unit} &nbsp;·&nbsp; 📍 {l.address || 'Location nahi di'}
              </p>
              {l.status === 'in_transit' && (
                <Btn bg={C.green} onClick={() => handleDelivered(l.id)}
                  style={{ margin: '10px 0 0 0', padding: '7px 18px', fontSize: '13px' }}>
                  ✅ Delivered mark karo
                </Btn>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}