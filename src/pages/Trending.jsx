import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_TRENDING = "http://127.0.0.1:8888/series/trending";
 
export default function Trending() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
 
  async function loadTrending() {
    setLoading(true);
    setErr("");
    try {
      const r = await axios.get(API_TRENDING, { params: { limit } });
      setItems(Array.isArray(r.data) ? r.data : []);
    } catch (e) {
      setItems([]);
      setErr("Impossible de récupérer les tendances.");
    } finally {
      setLoading(false);
    }
  }
 
  useEffect(() => {
    loadTrending();
  }, [limit]);
 
  return (
    <div className="container py-4 page" style={{ maxWidth: 1100 }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="page-title m-0">Tendances</h1>
        <div className="d-flex gap-2">
         
          <button className="btn btn-outline-dark" onClick={loadTrending}>
            Rafraîchir
          </button>
          <Link to="/Search" className="btn btn-outline-secondary">
            Recherche
          </Link>
        </div>
      </div>
 
      <p className="text-muted" style={{ marginTop: -8 }}>Classement basé sur les 7 derniers jours</p>
 
      {err && <div className="alert alert-warning">{err}</div>}
 
      {loading ? (
        <div className="text-muted">Chargement...</div>
      ) : items.length === 0 ? (
        <div className="border rounded p-4 text-muted">Aucune série tendance pour le moment.</div>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th style={{ width: 80 }}>#</th>
                <th style={{ minWidth: 220 }}>Titre</th>
                <th>Genre</th>
                <th>Nb épisodes</th>
                <th>Vues 7j</th>
                <th>Note</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={it.id ?? idx}>
                  <td><b>{idx + 1}</b></td>
                  <td>{it.title}</td>
                  <td>{it.genre}</td>
                  <td>{it.nbEpisodes}</td>
                  <td>{it.recentViews}</td>
                  <td>{Number.isFinite(it.averageNote) ? it.averageNote.toFixed(1) : it.averageNote}</td>
                  <td>{Number.isFinite(it.score) ? it.score.toFixed(1) : it.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}