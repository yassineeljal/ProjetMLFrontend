import React, { useState, useContext } from "react";
import "../css/Form.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const API_BASE = "http://localhost:8888"; 
const API_AUTH = `${API_BASE}/auth`;
export default function Login() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [mode, setMode] = useState("register");

  async function submit(e) {
    e.preventDefault();
    if (!name.trim() || !password) return;
    setLoading(true);
    setErr("");

    try {
      if (mode === "register") {
        await axios.post(`${API_AUTH}/register`, {
          username: name.trim(),
          password,
        });
        const lr = await axios.post(`${API_AUTH}/login`, {
          username: name.trim(),
          password,
        });
        const { id, username, token } = lr.data || {};
        if (id && token) {
          setUser({ id, username, token });
          navigate("/");
        } else {
          setErr("Connexion impossible après l'inscription.");
        }
      } else {
        const r = await axios.post(`${API_AUTH}/login`, {
          username: name.trim(),
          password,
        });
        const { id, username, token } = r.data || {};
        if (id && token) {
          setUser({ id, username, token });
          navigate("/");
        } else {
          setErr("Identifiants invalides.");
        }
      }
    } catch (e2) {
      setErr("Échec d'authentification.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-tabs">

          <button
            className={mode === "register" ? "tab active" : "tab"}
            onClick={() => setMode("register")}
            type="button"
          >
            Créer un compte
          </button>

                    <button
            className={mode === "login" ? "tab active" : "tab"}
            onClick={() => setMode("login")}
            type="button"
          >
            Se connecter
          </button>
        </div>

        <form onSubmit={submit} className="auth-form">
          <label className="fld">
            <span>Nom d'utilisateur</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ex: Arda"
            />
          </label>

          <label className="fld">
            <span>Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </label>

          {err && <div className="alert-warn">{err}</div>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "..." : mode === "login" ? "Entrer" : "Créer"}
          </button>
        </form>
      </div>
    </div>
  );
}
