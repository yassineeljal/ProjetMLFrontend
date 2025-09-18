import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_HISTORY = "http://127.0.0.1:8888/history";
const USER_ID = "1";

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadHistory() {
    try {
      const r = await axios.get(`${API_HISTORY}/${USER_ID}/history`);
      const arr = Array.isArray(r.data) ? r.data : [];
      setItems(arr);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="container py-4 page" style={{ maxWidth: 1100 }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="page-title m-0">Historique</h1>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-dark" onClick={loadHistory}>Rafraîchir</button>
          <Link to="/Search" className="btn btn-outline-secondary">Recherche</Link>
        </div>
      </div>

      {loading ? (
        <div className="text-muted">Chargement...</div>
      ) : items.length === 0 ? (
        <div className="border rounded p-4 text-muted">Aucun élément d’historique.</div>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th style={{width:100}}>ID</th>
                <th>Titre</th>
                <th>Genre</th>
                <th>Nb épisodes</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={`${it?.id ?? idx}`}>
                  <td>{it?.id}</td>
                  <td>{it?.title}</td>
                  <td>{it?.gender}</td>
                  <td>{it?.nbEpisodes}</td>
                  <td>{it?.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
