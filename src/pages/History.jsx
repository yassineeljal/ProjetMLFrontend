import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const STORAGE_KEY = "series_history";

function History() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      setItems(Array.isArray(arr) ? arr : []);
    } catch {
      setItems([]);
    }
  }, []);

  const onRemove = (ts) => {
    const next = items.filter((it) => it.ts !== ts);
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const onClear = () => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const base = [...items].sort((a, b) => b.ts - a.ts);
    if (!term) return base;
    return base.filter((it) =>
      (it.title || "").toLowerCase().includes(term) ||
      (it.gender || "").toLowerCase().includes(term) ||
      String(it.nbEpisodes ?? "").includes(term) ||
      (it.note || "").toLowerCase().includes(term)
    );
  }, [items, q]);

  return (
    <div className="container py-4 page" style={{ maxWidth: 1100 }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="page-title m-0">Historique</h1>
        <div className="d-flex gap-2">
          <input
            className="form-control"
            placeholder="Filtrer (titre, genre, note, épisodes)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ width: 320 }}
          />
          <button
            className="btn btn-outline-danger"
            onClick={onClear}
            disabled={items.length === 0}
          >
            Tout effacer
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-muted border rounded p-4">
          Aucun élément dans l’historique.
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map((it) => (
            <div className="col-12 col-md-6 col-lg-4" key={it.ts}>
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title mb-2">{it.title || "Sans titre"}</h5>
                  <div className="small text-muted mb-2">
                    {new Date(it.ts).toLocaleString()}
                  </div>
                  <ul className="list-unstyled mb-3">
                    <li><strong>Genre:</strong> {it.gender || "—"}</li>
                    <li><strong>Épisodes:</strong> {it.nbEpisodes ?? "—"}</li>
                    <li><strong>Note:</strong> {it.note || "—"}</li>
                    <li><strong>ID:</strong> {it.id ?? "—"}</li>
                  </ul>
                  <div className="mt-auto d-flex gap-2">
                    <Link
                      to={`/Search?q=${encodeURIComponent(it.title || "")}`}
                      className="btn btn-primary flex-fill"
                    >
                      Rechercher à nouveau
                    </Link>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => onRemove(it.ts)}
                      title="Retirer de l'historique"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
