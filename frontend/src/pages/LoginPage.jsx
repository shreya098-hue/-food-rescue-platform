import { useState } from "react";
import Btn from "../components/Btn";
import Input from "../components/Input";
import Toast from "../components/Toast";
import { C } from "../components/styles";

const API = "http://localhost:3002";

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("login"); // 'login' ya 'register'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("donor");
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const res = await fetch(API + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      onLogin();
    } else {
      setMsg({ text: data.error || "Login failed", type: "error" });
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setMsg({ text: "Sab fields bharo", type: "error" });
      return;
    }
    setLoading(true);
    const res = await fetch(API + "/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.user) {
      setMsg({ text: "Account ban gaya! Ab login karo", type: "success" });
      setMode("login");
      setName("");
    } else {
      setMsg({ text: data.error || "Register failed", type: "error" });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #bbf7d0 0%, #86efac 50%, #4ade80 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          background: C.white,
          borderRadius: "24px",
          padding: "40px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "48px", marginBottom: "8px" }}>🥗</div>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: "700",
              color: C.green,
              margin: 0,
            }}
          >
            Food Rescue
          </h1>
          <p style={{ color: C.gray, marginTop: "6px", fontSize: "14px" }}>
            Surplus food ko zaroorat tak pahunchao
          </p>
        </div>

        {/* Tab switcher */}
        <div
          style={{
            display: "flex",
            background: "#f3f4f6",
            borderRadius: "10px",
            padding: "4px",
            marginBottom: "24px",
          }}
        >
          {["login", "register"].map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setMsg({ text: "", type: "" });
              }}
              style={{
                flex: 1,
                padding: "8px",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                background: mode === m ? C.white : "transparent",
                color: mode === m ? C.green : C.gray,
                boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                transition: "all .2s",
              }}
            >
              {m === "login" ? "🔑 Login" : "✨ Register"}
            </button>
          ))}
        </div>

        {/* Register fields */}
        {mode === "register" && (
          <>
            <Input
              placeholder="👤 Apna naam"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {/* Role selector */}
            <div style={{ marginBottom: "12px" }}>
              <p
                style={{
                  fontSize: "13px",
                  color: C.gray,
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Main kaun hoon?
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                {[
                  { val: "donor", emoji: "🍱", label: "Donor" },
                  { val: "shelter", emoji: "🏠", label: "Shelter" },
                  { val: "volunteer", emoji: "🚗", label: "Volunteer" },
                ].map((r) => (
                  <button
                    key={r.val}
                    onClick={() => setRole(r.val)}
                    style={{
                      flex: 1,
                      padding: "10px 6px",
                      border: `2px solid ${role === r.val ? C.green : C.border}`,
                      borderRadius: "10px",
                      background: role === r.val ? C.green2 : C.white,
                      color: role === r.val ? C.green : C.gray,
                      fontWeight: "600",
                      fontSize: "13px",
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                      transition: "all .2s",
                    }}
                  >
                    <div style={{ fontSize: "20px", marginBottom: "4px" }}>
                      {r.emoji}
                    </div>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Common fields */}
        <Input
          type="email"
          placeholder="📧 Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            (mode === "login" ? handleLogin() : handleRegister())
          }
        />
        <Input
          type="password"
          placeholder="🔒 Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            (mode === "login" ? handleLogin() : handleRegister())
          }
        />

        <Btn
          bg={C.green}
          onClick={mode === "login" ? handleLogin : handleRegister}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "15px",
            marginRight: 0,
          }}
        >
          {loading
            ? "⏳ Loading..."
            : mode === "login"
              ? "Login karo →"
              : "Account banao →"}
        </Btn>

        <Toast msg={msg.text} type={msg.type} />
      </div>
    </div>
  );
}
