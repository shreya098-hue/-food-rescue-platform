import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import DonorDashboard from "./pages/DonorDashboard";
import ShelterDashboard from "./pages/ShelterDashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import ReportPage from "./pages/ReportPage";
import Btn from "./components/Btn";
import { C, s } from "./components/styles";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const role = localStorage.getItem("role");
  const [showReport, setShowReport] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
  };

  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />;

  return (
   <div style={{
  ...s.page,
  background: 'linear-gradient(-45deg, #0f172a, #1e3a5f, #064e3b, #1a1a2e)',
  backgroundSize: '400% 400%',
  animation: 'bgMove 10s ease infinite',
}}>
<style>{`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  @keyframes fadeIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:none; } }
  @keyframes bgMove { 
    0% { background-position: 0% 50%; } 
    50% { background-position: 100% 50%; } 
    100% { background-position: 0% 50%; } 
  }
  * { box-sizing: border-box; }
  input::placeholder { color: rgba(255,255,255,0.4) !important; }
  input:focus { 
    border-color: rgba(74,222,128,0.6) !important; 
    background: rgba(255,255,255,0.12) !important;
    box-shadow: 0 0 0 3px rgba(74,222,128,0.1) !important;
  }
  select { color: white !important; }
  select option { background: #1e293b !important; color: white !important; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-thumb { background: rgba(74,222,128,0.4); border-radius: 10px; }
`}</style>

      <div style={s.nav}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "24px" }}>🥗</span>
          <span style={{ color: "#fff", fontWeight: "700", fontSize: "18px" }}>
            Food Rescue
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ color: "#dcfce7", fontSize: "13px" }}>
            {role === "donor"
              ? "🍱 Donor"
              : role === "shelter"
                ? "🏠 Shelter"
                : "🚗 Volunteer"}
          </span>
          <Btn
            bg="#7c3aed"
            onClick={() => setShowReport(!showReport)}
            style={{ margin: 0, padding: "7px 16px", fontSize: "13px" }}
          >
            📊 Report
          </Btn>
          <Btn
            bg={C.red}
            onClick={handleLogout}
            style={{ margin: 0, padding: "7px 16px", fontSize: "13px" }}
          >
            Logout
          </Btn>
        </div>
      </div>

      <div
        style={{ maxWidth: "720px", margin: "28px auto", padding: "0 16px" }}
      >
        {showReport ? (
          <ReportPage />
        ) : (
          <>
            {role === "donor" && <DonorDashboard />}
            {role === "shelter" && <ShelterDashboard />}
            {role === "volunteer" && <VolunteerDashboard />}
          </>
        )}
      </div>
    </div>
  );
}
