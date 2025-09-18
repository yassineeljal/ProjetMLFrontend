import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

const API_SERIES = "http://127.0.0.1:8888/series";
const API_HISTORY = "http://127.0.0.1:8888/history";
const USER_ID = "1";

async function pushHistory(serieId) {
  if (!serieId) return;
  await axios.post(`${API_HISTORY}/${USER_ID}/history/${encodeURIComponent(serieId)}`);
}

export default function Search() {
  const location = useLocation();

  const [titleQuery, setTitleQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [minEpFilter, setMinEpFilter] = useState("");

  const [series, setSeries] = useState([]);
  const [selection, setSelection] = useState(null);

  const modeTitle = useMemo(() => titleQuery.trim() !== "", [titleQuery]);
  const modeFilters = useMemo(
    () => genreFilter.trim() !== "" || (minEpFilter !== "" && !Number.isNaN(Number(minEpFilter))),
    [genreFilter, minEpFilter]
  );
  const disableFilters = modeTitle;
  const disableTitle = modeFilters;

  async function runSearch() {
    try {
      if (modeTitle && !modeFilters) {
        const res = await axios.get(`${API_SERIES}/search/title`, { params: { title: titleQuery.trim() } });
        setSeries(Array.isArray(res.data) ? res.data : []);
        return;
      }
      if (!modeTitle && modeFilters) {
        const params = new URLSearchParams();
        if (genreFilter.trim() !== "") params.set("genre", genreFilter.trim());
        if (minEpFilter !== "" && !Number.isNaN(Number(minEpFilter))) params.set("minEpisodes", String(Number(minEpFilter)));
        const res = await axios.get(`${API_SERIES}/search?${params.toString()}`);
        setSeries(Array.isArray(res.data) ? res.data : []);
        return;
      }
      const res = await axios.get(API_SERIES);
      setSeries(Array.isArray(res.data) ? res.data : []);
    } catch {
      setSeries([]);
    }
  }

  function onChangeTitle(e) {
    const v = e.target.value;
    setTitleQuery(v);
    if (v.trim() !== "") setSelection(null);
  }
  function onChangeGenre(e) {
    const v = e.target.value;
    setGenreFilter(v);
    if (v.trim() !== "") setSelection(null);
  }
  function onChangeMinEp(e) {
    const v = e.target.value;
    setMinEpFilter(v);
    if (v !== "") setSelection(null);
  }

  async function onChoisir(serie) {
    setSelection(serie);
    try { await pushHistory(serie.id); } catch {}
  }

  function resetAll() {
    setTitleQuery("");
    setGenreFilter("");
    setMinEpFilter("");
    setSelection(null);
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setTitleQuery(q);
  }, [location.search]);

  useEffect(() => {
    runSearch();
  }, [titleQuery, genreFilter, minEpFilter]);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h1>Recherche</h1>
        <div className="d-flex gap-2">
          <Link to="/History" className="btn btn-outline-secondary">Voir l’historique</Link>
        </div>
      </div>

      <div className="border rounded p-3 mb-3">
        <div className="mb-2 fw-bold">Mode Titre</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <input
            value={titleQuery}
            onChange={onChangeTitle}
            placeholder="Tape un titre (active le mode Titre)"
            style={{ padding: 8, width: 340, maxWidth: "100%" }}
            disabled={disableTitle}
          />
          <button className="btn btn-outline-dark" onClick={resetAll}>Réinitialiser</button>
        </div>
      </div>

      <div className="border rounded p-3 mb-3">
        <div className="mb-2 fw-bold">Mode Filtres</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, marginBottom: 4 }}>Genre</div>
            <input
              className="form-control"
              value={genreFilter}
              onChange={onChangeGenre}
              placeholder="ex: Drama"
              style={{ minWidth: 200 }}
              disabled={disableFilters}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, marginBottom: 4 }}>Nb épisodes minimum</div>
            <input
              type="number"
              className="form-control"
              value={minEpFilter}
              onChange={onChangeMinEp}
              placeholder="ex: 10"
              style={{ minWidth: 160 }}
              disabled={disableFilters}
            />
          </div>
          <button className="btn btn-outline-dark" onClick={resetAll}>Réinitialiser</button>
        </div>
      </div>

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
            {series.length === 0 ? (
              <tr><td colSpan="5" className="text-center text-muted">Aucun résultat</td></tr>
            ) : (
              series.map((s) => {
                const selected = selection && selection.id === s.id;
                return (
                  <tr
                    key={s.id}
                    onClick={() => onChoisir(s)}
                    style={{ cursor: "pointer", background: selected ? "#eef" : "transparent" }}
                    title="Clique pour sélectionner"
                  >
                    <td>{s.id}</td>
                    <td>{s.title}</td>
                    <td>{s.gender}</td>
                    <td>{s.nbEpisodes}</td>
                    <td>{s.note}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
