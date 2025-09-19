import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_RECO = "http://127.0.0.1:8888/recommendation";
const API_HISTORY = "http://127.0.0.1:8888/history";
const USER_ID = "1";

async function pushHistory(serieId) {
  if (!serieId) return;
  await axios.post(`${API_HISTORY}/${USER_ID}/history/${encodeURIComponent(serieId)}`);
}

export default function Recommendations() {
  const [reco, setReco] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selection, setSelection] = useState(null);
  const [error, setError] = useState("");

  async function loadRecommendations() {
    setLoading(true);
    setError("");
    try {
      const r = await axios.get(`${API_RECO}/${USER_ID}/recommendations`);
      const arr = Array.isArray(r.data) ? r.data : [];
      setReco(arr);
    } catch (e) {
      console.error(e);
      setReco([]);
      setError("Impossible de récupérer les recommandations.");
    } finally {
      setLoading(false);
    }
  }

  async function onSelectSerie(serie) {
    setSelection(serie);
    try {
      await pushHistory(serie.id);
    } catch (e) {
      console.error("Erreur en ajoutant à l'historique:", e);
    }
  }

  useEffect(() => {
    loadRecommendations();
  }, []);

  return (
    <div className="container py-4" style={{ maxWidth: 1100 }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="page-title m-0">Recommandations</h1>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-dark" onClick={loadRecommendations}>
            Rafraîchir
          </button>
          <Link to="/Search" className="btn btn-outline-secondary">Recherche</Link>
          <Link to="/History" className="btn btn-outline-primary">Historique</Link>
        </div>
      </div>

      {error && <div className="alert alert-warning">{error}</div>}

      {loading ? (
        <div className="text-muted">Chargement...</div>
      ) : reco.length === 0 ? (
        <div className="border rounded p-4 text-muted">Aucune recommandation pour le moment.</div>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th style={{ width: 100 }}>ID</th>
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
                  <tr
                    key={s.id}
                    onClick={() => onSelectSerie(s)}
                    style={{ cursor: "pointer", background: selected ? "#eef" : "transparent" }}
                    title="Clique pour marquer comme visualisée (historique)"
                  >
                    <td>{s.id}</td>
                    <td>{s.title}</td>
                    <td>{s.gender}</td>
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
