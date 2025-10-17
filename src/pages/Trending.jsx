import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, endpoints } from "../api";

export default function Trending() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function loadTrending() {
    setLoading(true);
    setErr("");
    try {
      const r = await api.get(endpoints.series.trending);
      setItems(Array.isArray(r.data) ? r.data : []);
    } catch (e) {
      setItems([]);
      setErr("Impossible de récupérer les tendances.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTrending(); }, []);

  return (
    <div className="page-wrap">
      <div className="page-head">
        <h1 className="page-h1">Tendances</h1>
        <div className="head-actions">
          <button className="btn-ghost" onClick={loadTrending}>Rafraîchir</button>
          <Link to="/Search" className="btn-ghost">Recherche</Link>
        </div>
      </div>

      <p className="page-sub">Classement basé sur les 7 derniers jours</p>
      {err && <div className="alert-warn">{err}</div>}

      {loading ? (
        <div className="empty">Chargement...</div>
      ) : items.length === 0 ? (
        <div className="table-card"><div className="empty">Aucune série tendance pour le moment.</div></div>
      ) : (
        <div className="table-card">
          <table className="nice-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Titre</th>
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
