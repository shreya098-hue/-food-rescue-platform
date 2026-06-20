import { useState, useEffect } from "react";
import Map from "../Map";
import Btn from "../components/Btn";
import Input from "../components/Input";
import Toast from "../components/Toast";
import { C, s } from "../components/styles";

const API = "http://localhost:3002";

export default function DonorDashboard() {
  const [tab, setTab] = useState("post");
  const [title, setTitle] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("portions");
  const [expires_at, setExpiresAt] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [listings, setListings] = useState([]);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [locLoading, setLocLoading] = useState(false);
  const [myListings, setMyListings] = useState([]);

 useEffect(() => { 
  fetchListings(); 
  fetchMyListings();
}, []);

  const fetchListings = async () => {
    const res = await fetch(API + "/listings");
    const data = await res.json();
    setListings(data);
  };

  const fetchMyListings = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(API + '/listings/mine', {
    headers: { authorization: token }
  });
  const data = await res.json();
  setMyListings(Array.isArray(data) ? data : []);
};

  const searchAddress = async () => {
    if (!address) return;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
    );
    const data = await res.json();
    if (data[0]) {
      setLatitude(data[0].lat);
      setLongitude(data[0].lon);
      setMsg({
        text: `📍 Mila: ${data[0].display_name.slice(0, 50)}...`,
        type: "success",
      });
    } else {
      setMsg({ text: "Address nahi mila", type: "error" });
    }
  };

  const getLocation = () => {
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lon);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        );
        const d = await res.json();
        setAddress(
          d.display_name?.split(",").slice(0, 3).join(", ") ||
            "Current location",
        );
        setLocLoading(false);
        setMsg({ text: "Location mil gayi!", type: "success" });
      },
      () => {
        setLocLoading(false);
        setMsg({ text: "Location nahi mili", type: "error" });
      },
    );
  };

  const handlePost = async () => {
    if (!title || !quantity || !expires_at) {
      setMsg({ text: "Sab fields bharo pehle", type: "error" });
      return;
    }
    const token = localStorage.getItem("token");
    const res = await fetch(API + "/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json", authorization: token },
      body: JSON.stringify({
        title,
        quantity,
        unit,
        expires_at,
        address,
        latitude,
        longitude,
      }),
    });
    const data = await res.json();
    if (data.listing) {
      setMsg({ text: "Listing post ho gayi!", type: "success" });
      setTitle("");
      setQuantity("");
      setExpiresAt("");
      setAddress("");
      setLatitude("");
      setLongitude("");
      fetchListings();
      fetchMyListings();
      setTab("listings");
    } else {
      setMsg({ text: data.error, type: "error" });
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/listings/${id}`, {
      method: "DELETE",
      headers: { authorization: token },
    });
    const data = await res.json();
    if (data.message) {
      setMsg({ text: "Listing delete ho gayi!", type: "success" });
      fetchListings();
    }
  };

 const tabBtn = (id, label) => (
  <button onClick={() => setTab(id)} style={{
    padding: '9px 18px', borderRadius: '10px', border: 'none',
    fontWeight: '600', fontSize: '13px', cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    background: tab === id
      ? 'linear-gradient(135deg, #4ade80, #22c55e)'
      : 'transparent',
    color: tab === id ? '#0f172a' : 'rgba(255,255,255,0.5)',
    boxShadow: tab === id ? '0 4px 16px rgba(74,222,128,0.3)' : 'none',
    transition: 'all .25s cubic-bezier(0.16, 1, 0.3, 1)',
    transform: tab === id ? 'scale(1.02)' : 'scale(1)',
  }}>{label}</button>
);

  return (
    <div>
      <div
        style={{
          ...s.card,
          borderRadius: "12px",
          padding: "8px",
          display: "flex",
          gap: "4px",
          marginBottom: "20px",
        }}
      >
        {tabBtn("post", "🍱 Donate Karo")}
        {tabBtn("listings", `📋 Listings (${listings.length})`)}
        {tabBtn("mine", `MY Listings (${myListings.length})`)}
        {tabBtn("map", "🗺️ Map")}
      </div>

      {tab === "post" && (
        <div style={s.card}>
          <h2
            style={{
              fontWeight: "700",
              fontSize: "18px",
              marginBottom: "20px",
              color: C.green,
            }}
          >
            🍱 Khana Donate Karo
          </h2>
          <Input
            placeholder="Kya donate kar rahe ho? (e.g. Dal Chawal)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <Input
              type="number"
              placeholder="Quantity (e.g. 20)"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <select
              style={{ ...s.input, marginBottom: 0 }}
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <option>portions</option>
              <option>kg</option>
              <option>items</option>
              <option>boxes</option>
            </select>
          </div>
          <div style={{ marginTop: "12px", marginBottom: "12px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                style={{ ...s.input, marginBottom: 0, flex: 1 }}
                placeholder="📍 Address type karo"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <Btn
                bg={C.blue}
                onClick={searchAddress}
                style={{ marginBottom: 0, whiteSpace: "nowrap" }}
              >
                🔍 Search
              </Btn>
            </div>
            <Btn
              bg="#7c3aed"
              onClick={getLocation}
              style={{ marginTop: "8px", fontSize: "13px" }}
            >
              {locLoading ? "⏳ Dhundh raha hai..." : "📡 GPS se location lo"}
            </Btn>
            {latitude && (
              <span
                style={{ fontSize: "12px", color: C.gray, marginLeft: "8px" }}
              >
                ✅ {parseFloat(latitude).toFixed(4)},{" "}
                {parseFloat(longitude).toFixed(4)}
              </span>
            )}
          </div>
          <Input
            type="datetime-local"
            value={expires_at}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
          <Btn
            bg={C.green}
            onClick={handlePost}
            style={{
              width: "100%",
              marginRight: 0,
              padding: "12px",
              fontSize: "15px",
            }}
          >
            🚀 Post karo
          </Btn>
          <Toast msg={msg.text} type={msg.type} />
        </div>
      )}

      {tab === "listings" && (
        <div style={s.card}>
          <h2
            style={{
              fontWeight: "700",
              fontSize: "18px",
              marginBottom: "20px",
              color: C.green,
            }}
          >
            📋 Available Listings
          </h2>
          {listings.length === 0 ? (
            <div
              style={{ textAlign: "center", color: C.gray, padding: "40px 0" }}
            >
              <div style={{ fontSize: "40px" }}>🍽️</div>
              <p style={{ marginTop: "12px" }}>Abhi koi listing nahi hai</p>
            </div>
          ) : (
            listings.map((l) => (
              <div
                key={l.id}
                style={{
                  ...s.card,
                  marginBottom: "12px",
                  padding: "16px",
                  borderLeft: `4px solid ${C.green}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <h4
                    style={{ fontWeight: "600", fontSize: "16px", margin: 0 }}
                  >
                    {l.title}
                  </h4>
                  <span style={s.badge(C.green2, C.green)}>✅ Available</span>
                </div>
                <p style={{ color: C.gray, fontSize: "13px", margin: "6px 0" }}>
                  📦 {l.quantity} {l.unit} &nbsp;·&nbsp; 📍{" "}
                  {l.address || "Location nahi di"}
                </p>
                <p
                  style={{
                    color: C.gray,
                    fontSize: "13px",
                    margin: "0 0 10px 0",
                  }}
                >
                  ⏰ Expires: {new Date(l.expires_at).toLocaleString("en-IN")}
                </p>
                <Btn
                  bg={C.red}
                  onClick={() => handleDelete(l.id)}
                  style={{ margin: 0, padding: "6px 14px", fontSize: "12px" }}
                >
                  🗑️ Delete
                </Btn>
              </div>
            ))
          )}
          <Toast msg={msg.text} type={msg.type} />
        </div>
      )}
      {tab === 'mine' && (
  <div style={s.card}>
    <h2 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '20px', color: C.green }}>
      📊 Meri Saari Listings
    </h2>
    {myListings.length === 0 ? (
      <div style={{ textAlign: 'center', color: C.gray, padding: '40px 0' }}>
        <div style={{ fontSize: '40px' }}>📭</div>
        <p style={{ marginTop: '12px' }}>Abhi koi listing nahi banai</p>
      </div>
    ) : myListings.map(l => {
      const statusMap = {
        available:  { bg: C.green2,  color: C.green,   label: '✅ Available' },
        claimed:    { bg: '#fef9c3', color: '#ca8a04', label: '📦 Claimed' },
        in_transit: { bg: C.blue2,   color: C.blue,    label: '🚗 In Transit' },
        delivered:  { bg: '#f0fdf4', color: C.green,   label: '🎉 Delivered' },
        expired:    { bg: '#fee2e2', color: C.red,     label: '❌ Expired' },
      };
      const st = statusMap[l.status] || statusMap.available;
      return (
        <div key={l.id} style={{
          ...s.card, marginBottom: '12px', padding: '16px',
          borderLeft: `4px solid ${st.color}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h4 style={{ fontWeight: '600', fontSize: '16px', margin: 0 }}>{l.title}</h4>
            <span style={s.badge(st.bg, st.color)}>{st.label}</span>
          </div>
          <p style={{ color: C.gray, fontSize: '13px', margin: '6px 0' }}>
            📦 {l.quantity} {l.unit} &nbsp;·&nbsp; 📍 {l.address || 'Location nahi di'}
          </p>
          {l.shelter_name && (
            <p style={{ color: C.gray, fontSize: '13px', margin: '4px 0' }}>
              🏠 Claimed by: {l.shelter_name}
            </p>
          )}
          <p style={{ color: C.gray, fontSize: '13px', margin: '4px 0' }}>
            ⏰ Expires: {new Date(l.expires_at).toLocaleString('en-IN')}
          </p>
        </div>
      );
    })}
  </div>
)}

      {tab === "map" && (
        <div style={s.card}>
          <h2
            style={{
              fontWeight: "700",
              fontSize: "18px",
              marginBottom: "16px",
              color: C.green,
            }}
          >
            🗺️ Live Map
          </h2>
          <Map listings={listings} />
        </div>
      )}
    </div>
  );
}
