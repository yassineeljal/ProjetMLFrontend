import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { api, endpoints } from "../api";

export default function Recommendations() {
  const { user } = useContext(UserContext);
  const peopleId = user?.id;
  const [reco, setReco] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selection, setSelection] = useState(null);
  const [error, setError] = useState("");

  async function pushHistory(serieId) {
    if (!serieId) return;
    await api.post(endpoints.historyPush(peopleId, serieId));
  }

  async function loadRecommendations() {
    setLoading(true); setError("");
    try {
      const r = await api.get(endpoints.recommendations(peopleId));
      const arr = Array.isArray(r.data) ? r.data : [];
      setReco(arr);
    } catch {
      setReco([]);
      setError("Impossible de récupérer les recommandations.");
    } finally {
      setLoading(false);
    }
  }

  async function onSelectSerie(serie) {
    setSelection(serie);
    try { await pushHistory(serie.id); } catch { 
      
     }
  }

  useEffect(() => { if (peopleId) loadRecommendations(); }, [peopleId]);

  return (
    <div className="page-wrap">
      <div className="page-head">
        <h1 className="page-h1">Recommandations</h1>
        <div className="head-actions">
          <button className="btn-ghost" onClick={loadRecommendations}>Rafraîchir</button>
          <Link to="/Search" className="btn-ghost">Recherche</Link>
          <Link to="/History" className="btn-ghost">Historique</Link>
        </div>
      </div>

      {error && <div className="alert-warn">{error}</div>}

      {loading ? (
        <div className="empty">Chargement…</div>
      ) : reco.length === 0 ? (
        <div className="empty">Aucune recommandation pour le moment.</div>
      ) : (
        <div className="table-card">
          <table className="nice-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Titre</th>
                <th>Genre</th>
                <th>Nb épisodes</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {reco.map((s) => {
                const selected = selection && selection.id === s.id;
                return (
                  <tr key={s.id} onClick={() => onSelectSerie(s)} className={selected ? "row-selected" : ""}>
                    <td>{s.id}</td>
                    <td>{s.title}</td>
                    <td>{s.genre ?? s.gender}</td>
                    <td>{s.nbEpisodes}</td>
                    <td>{s.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
