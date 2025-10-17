import React, { useEffect, useMemo, useState, useContext } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const API_BASE = `http://${window.location.hostname}:8888`;
const api = axios.create({ baseURL: API_BASE });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const API_SERIES = "/series";
const API_SERIES_ADD = "/series/addSerie";
const API_HISTORY = "/history";

const GENRES = ["Drama", "Anime", "Sci-Fi", "Comedy", "Historical", "Mystery", "Fantasy"];

export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [titleQuery, setTitleQuery] = useState("");
  const [genreQuery, setGenreQuery] = useState("");
  const [minEpQuery, setMinEpQuery] = useState("");
  const [allSeries, setAllSeries] = useState([]);
  const [selection, setSelection] = useState(null);
  const [title, setTitle] = useState("");
  const [gender, setGender] = useState("");
  const [nbEpisodes, setNbEpisodes] = useState("");
  const [note, setNote] = useState("");

  async function fetchAll() {
    try {
      const res = await api.get(API_SERIES);
      setAllSeries(Array.isArray(res.data) ? res.data : []);
    } catch {
      setAllSeries([]);
    }
  }

  async function pushHistory(serieId) {
    if (!serieId || !user?.id || !user?.token) return;
    try {
      await api.post(`${API_HISTORY}/${user.id}/history/${serieId}`);
    } catch {}
  }

  async function onCreer() {
    const obj = {
      title: title.trim(),
      gender: gender.trim(),
      nbEpisodes: Number(nbEpisodes),
      note: note.trim(),
    };
    if (obj.title === "" || obj.gender === "" || Number.isNaN(obj.nbEpisodes)) {
      alert("Remplis Titre, Genre et Nb épisodes.");
      return;
    }
    if (!user?.token) {
      alert("Connecte-toi pour ajouter une série.");
      navigate("/Login");
      return;
    }
    try {
      await api.post(API_SERIES_ADD, obj);
      alert("Nouvelle série créée !");
      setTitle(""); setGender(""); setNbEpisodes(""); setNote("");
      fetchAll();
    } catch {
      alert("Erreur lors de la création de la série.");
    }
  }

  async function onChoisir(serie) {
    setSelection(serie);
    await pushHistory(serie.id);
  }

  function resetFilters() {
    setTitleQuery("");
    setGenreQuery("");
    setMinEpQuery("");
    setSelection(null);
  }

  const filteredSeries = useMemo(() => {
    const t = titleQuery.trim().toLowerCase();
    const g = genreQuery.trim().toLowerCase();
    const minEp = minEpQuery !== "" ? Number(minEpQuery) : null;
    return allSeries.filter((s) => {
      const titleOk = t === "" ? true : (s?.title || "").toLowerCase().includes(t);
      const genreVal = (s?.gender ?? s?.genre ?? "").toLowerCase();
      const genreOk = g === "" ? true : genreVal === g;
      const epOk = minEp === null ? true : (s?.nbEpisodes ?? 0) >= minEp;
      return titleOk && genreOk && epOk;
    });
  }, [allSeries, titleQuery, genreQuery, minEpQuery]);

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setTitleQuery(params.get("q") || "");
  }, [location.search]);

  const darkStyle = {
    background: "linear-gradient(180deg, #0f0a1f 0%, #0c081a 100%)",
    color: "#ece7ff",
    minHeight: "100vh",
    padding: 20,
  };
  const card = {
    background: "#191135",
    border: "1px solid #3a2b68",
    borderRadius: 12,
    padding: 16,
    color: "#ece7ff",
  };
  const input = {
    background: "#15102b",
    color: "#ece7ff",
    border: "1px solid #3a2b68",
    borderRadius: 8,
    padding: "8px 10px",
  };
  const button = {
    background: "#7c4dff",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "8px 14px",
    cursor: "pointer",
  };

  return (
    <div style={darkStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h1 style={{ color: "#a07bff" }}>Recherche & Séries</h1>
        <Link to="/History" style={{ ...button, background: "#3a2b68" }}>
          Voir l’historique
        </Link>
      </div>

      <div style={{ ...card, marginBottom: 20 }}>
        <h3 style={{ color: "#a07bff" }}>Filtres</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <div>
            <label>Titre</label><br/>
            <input style={input} value={titleQuery} onChange={(e)=>setTitleQuery(e.target.value)} placeholder="Naru..." />
          </div>
          <div>
            <label>Genre</label><br/>
            <select style={input} value={genreQuery} onChange={(e)=>setGenreQuery(e.target.value)}>
              <option value="">-- Tous --</option>
              {GENRES.map((g)=><option key={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label>Nb épisodes min</label><br/>
            <input type="number" style={input} value={minEpQuery} onChange={(e)=>setMinEpQuery(e.target.value)} />
          </div>
          <button style={button} onClick={resetFilters}>Réinitialiser</button>
        </div>
      </div>

      <div style={{ ...card, marginBottom: 20 }}>
        <h3 style={{ color: "#a07bff" }}>Ajouter une série</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <input style={input} placeholder="Titre" value={title} onChange={(e)=>setTitle(e.target.value)} />
          <select style={input} value={gender} onChange={(e)=>setGender(e.target.value)}>
            <option value="">-- Genre --</option>
            {GENRES.map((g)=><option key={g}>{g}</option>)}
          </select>
          <input style={input} type="number" placeholder="Nb épisodes" value={nbEpisodes} onChange={(e)=>setNbEpisodes(e.target.value)} />
          <input style={input} placeholder="Note" value={note} onChange={(e)=>setNote(e.target.value)} />
          <button style={button} onClick={onCreer} disabled={!user?.token}>
            Ajouter
          </button>
        </div>
      </div>

      <div style={{ ...card }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#1a1340", color: "#a07bff" }}>
              <th style={{ padding: 8 }}>ID</th>
              <th style={{ padding: 8 }}>Titre</th>
              <th style={{ padding: 8 }}>Genre</th>
              <th style={{ padding: 8 }}>Nb épisodes</th>
              <th style={{ padding: 8 }}>Note</th>
            </tr>
          </thead>
          <tbody>
            {filteredSeries.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: "center", padding: 16, color: "#bcb3e8" }}>Aucun résultat</td></tr>
            ) : (
              filteredSeries.map((s) => (
                <tr key={s.id}
                    onClick={()=>onChoisir(s)}
                    style={{
                      background: selection?.id===s.id ? "#3a2b68" : "transparent",
                      cursor: "pointer",
                    }}>
                  <td style={{ padding: 8 }}>{s.id}</td>
                  <td style={{ padding: 8 }}>{s.title}</td>
                  <td style={{ padding: 8 }}>{s.gender ?? s.genre}</td>
                  <td style={{ padding: 8 }}>{s.nbEpisodes}</td>
                  <td style={{ padding: 8 }}>{s.note}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
