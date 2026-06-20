import { useState, useEffect } from 'react';
import Btn from '../components/Btn';
import Toast from '../components/Toast';
import { C, s } from '../components/styles';

const API = 'http://localhost:3002';

export default function ShelterDashboard() {
  const [tab, setTab] = useState('available');
  const [listings, setListings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchAvailable();
    fetchMyClaimed();
  }, []);

  const fetchAvailable = async () => {
    const res = await fetch(API + '/listings');
    const data = await res.json();
    setListings(data);
  };

  const fetchMyClaimed = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(API + '/listings/claimed', {
      headers: { authorization: token },
    });
    const data = await res.json();
    setMyListings(data);
  };

  const handleClaim = async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API}/listings/${id}/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authorization: token },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    if (data.message) {
      setMsg({ text: 'Listing claim ho gayi!', type: 'success' });
      fetchAvailable();
      fetchMyClaimed();
      setTab('claimed');
    } else {
      setMsg({ text: data.error, type: 'error' });
    }
  };

  const tabBtn = (id, label) => (
    <button onClick={() => setTab(id)} style={{
      padding: '8px 20px', borderRadius: '8px', border: 'none',
      fontWeight: '600', fontSize: '14px', cursor: 'pointer',
      fontFamily: "'Inter', sans-serif",
      background: tab === id ? C.blue : 'transparent',
      color: tab === id ? '#fff' : C.gray,
      transition: 'all .2s',
    }}>{label}</button>
  );

  return (
    <div>
      <div style={{ ...s.card, borderRadius: '12px', padding: '8px', display: 'flex', gap: '4px', marginBottom: '20px' }}>
        {tabBtn('available', `🍱 Available (${listings.length})`)}
        {tabBtn('claimed', `📦 Meri Claims (${myListings.length})`)}
      </div>

      {tab === 'available' && (
        <div style={s.card}>
          <h2 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '20px', color: C.blue }}>
            🍱 Available Food
          </h2>
          <Toast msg={msg.text} type={msg.type} />
          {listings.length === 0 ? (
            <div style={{ textAlign: 'center', color: C.gray, padding: '40px 0' }}>
              <div style={{ fontSize: '40px' }}>🍽️</div>
              <p style={{ marginTop: '12px' }}>Abhi koi listing available nahi hai</p>
            </div>
          ) : listings.map(l => (
            <div key={l.id} style={{
              ...s.card, marginBottom: '12px', padding: '16px',
              borderLeft: `4px solid ${C.blue}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ fontWeight: '600', fontSize: '16px', margin: 0 }}>{l.title}</h4>
                <span style={s.badge(C.blue2, C.blue)}>✅ Available</span>
              </div>
              <p style={{ color: C.gray, fontSize: '13px', margin: '6px 0' }}>
                📦 {l.quantity} {l.unit} &nbsp;·&nbsp; 📍 {l.address || 'Location nahi di'}
              </p>
              <p style={{ color: C.gray, fontSize: '13px', margin: '0 0 10px 0' }}>
                ⏰ Expires: {new Date(l.expires_at).toLocaleString('en-IN')}
              </p>
              <Btn bg={C.blue} onClick={() => handleClaim(l.id)}
                style={{ margin: 0, padding: '7px 18px', fontSize: '13px' }}>
                🙋 Claim karo
              </Btn>
            </div>
          ))}
        </div>
      )}

      {tab === 'claimed' && (
        <div style={s.card}>
          <h2 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '20px', color: C.blue }}>
            📦 Meri Claimed Listings
          </h2>
          {myListings.length === 0 ? (
            <div style={{ textAlign: 'center', color: C.gray, padding: '40px 0' }}>
              <div style={{ fontSize: '40px' }}>📭</div>
              <p style={{ marginTop: '12px' }}>Abhi koi claim nahi kiya</p>
            </div>
          ) : myListings.map(l => (
            <div key={l.id} style={{
              ...s.card, marginBottom: '12px', padding: '16px',
              borderLeft: '4px solid #f59e0b',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ fontWeight: '600', fontSize: '16px', margin: 0 }}>{l.title}</h4>
                <span style={s.badge('#fef9c3', '#ca8a04')}>📦 Claimed</span>
              </div>
              <p style={{ color: C.gray, fontSize: '13px', margin: '6px 0' }}>
                📦 {l.quantity} {l.unit} &nbsp;·&nbsp; 📍 {l.address || 'Location nahi di'}
              </p>
              <p style={{ color: C.gray, fontSize: '13px', margin: 0 }}>
                ⏰ Expires: {new Date(l.expires_at).toLocaleString('en-IN')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}