import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { api, endpoints } from "../api";

export default function History() {
  const { user } = useContext(UserContext);
  const peopleId = user?.id; 
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadHistory() {
    try {
      const r = await api.get(endpoints.history(peopleId));
      const arr = Array.isArray(r.data) ? r.data : [];
      setItems(arr);
    } catch {
      setItems([]);
    } finally { setLoading(false); }
  }

  useEffect(() => { if (peopleId) loadHistory(); }, [peopleId]);

  return (
    <div className="page-wrap">
      <div className="page-head">
        <h1 className="page-h1">Historique</h1>
        <div className="head-actions">
          <button className="btn-ghost" onClick={loadHistory}>Rafraîchir</button>
          <Link to="/Search" className="btn-ghost">Recherche</Link>
        </div>
      </div>
      {loading ? (
        <div className="empty">Chargement…</div>
      ) : items.length === 0 ? (
        <div className="empty">Aucun élément d’historique.</div>
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
              {items.map((it, idx) => (
                <tr key={`${it?.id ?? idx}`}>
                  <td>{it?.id}</td>
                  <td>{it?.title}</td>
                  <td>{it?.genre ?? it?.gender}</td>
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
