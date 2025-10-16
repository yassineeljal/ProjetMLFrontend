import React, { useState, useContext } from "react";
import "../css/Form.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const API_AUTH = "http://localhost:8888/auth";

export default function Login() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!name.trim() || !password) return;
    setLoading(true);
    setErr("");
    try {
      const url = mode === "login" ? `${API_AUTH}/login` : `${API_AUTH}/register`;
      const r = await axios.post(url, { name: name.trim(), password });
      const u = r.data;
      if (u && u.id) {
        setUser(u);
        navigate("/");
      } else {
        setErr("Échec d'authentification.");
      }
    } catch {
      setErr("Échec d'authentification.");
    }
    setLoading(false);
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-tabs">
          <button className={mode==="login"?"tab active":"tab"} onClick={()=>setMode("login")}>Se connecter</button>
          <button className={mode==="register"?"tab active":"tab"} onClick={()=>setMode("register")}>Créer un compte</button>
        </div>
        <form onSubmit={submit} className="auth-form">
          <label className="fld">
            <span>Nom</span>
            <input value={name} onChange={(e)=>setName(e.target.value)} required placeholder="Ex: Arda" />
          </label>
          <label className="fld">
            <span>Mot de passe</span>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required placeholder="••••••••" />
          </label>
          {err && <div className="alert-warn">{err}</div>}
          <button type="submit" className="auth-btn" disabled={loading}>{loading ? "..." : (mode==="login"?"Entrer":"Créer")}</button>
        </form>
      </div>
    </div>
  );
}
