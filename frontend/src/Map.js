import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Map ko automatically listings pe center karo
function AutoCenter({ listings }) {
  const map = useMap();
  useEffect(() => {
    const valid = listings.filter(l => l.latitude && l.longitude);
    if (valid.length === 1) {
      map.setView([parseFloat(valid[0].latitude), parseFloat(valid[0].longitude)], 14);
    } else if (valid.length > 1) {
      const bounds = valid.map(l => [parseFloat(l.latitude), parseFloat(l.longitude)]);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [listings, map]);
  return null;
}

function Map({ listings }) {
  const valid = listings.filter(l => l.latitude && l.longitude);

  return (
    <div>
      {valid.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '20px',
          color: '#6b7280', fontSize: '14px',
          background: '#f9fafb', borderRadius: '10px',
          marginBottom: '12px'
        }}>
          ⚠️ Koi listing nahi hai location ke saath — pehle GPS ya Search use karo
        </div>
      )}
      <MapContainer
        center={[28.6139, 77.2090]}
        zoom={11}
        style={{ height: '400px', borderRadius: '12px' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <AutoCenter listings={valid} />
        {valid.map(l => (
          <Marker key={l.id} position={[parseFloat(l.latitude), parseFloat(l.longitude)]}>
            <Popup>
              <strong>{l.title}</strong><br />
              📦 {l.quantity} {l.unit}<br />
              📍 {l.address || 'Address nahi'}<br />
              ⏰ {new Date(l.expires_at).toLocaleString('en-IN')}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;