import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

const API_SERIES = "http://127.0.0.1:8888/series";
const API_HISTORY = "http://127.0.0.1:8888/history";
const USER_ID = "1";

async function pushHistory(serieId) {
  if (!serieId) return;
  await axios.post(`${API_HISTORY}/${USER_ID}/history/${encodeURIComponent(serieId)}`);
}

const GENRES = ["Drama", "Anime", "Sci-Fi", "Comedy", "Historical", "Mystery", "Fantasy"];

export default function Search() {
  const location = useLocation();

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
      const res = await axios.get(API_SERIES);
      setAllSeries(Array.isArray(res.data) ? res.data : []);
    } catch {
      setAllSeries([]);
    }
  }

  const filteredSeries = useMemo(() => {
    const t = titleQuery.trim().toLowerCase();
    const g = genreQuery.trim().toLowerCase();
    const minEp =
      minEpQuery !== "" && !Number.isNaN(Number(minEpQuery))
        ? Number(minEpQuery)
        : null;

    return allSeries.filter((s) => {
      const titleOk = t === "" ? true : (s?.title || "").toLowerCase().includes(t);

      const serieGenre = String(s?.gender || "").trim().toLowerCase();
      const genreOk = g === "" ? true : serieGenre === g;

      const epOk = minEp === null ? true : Number(s?.nbEpisodes ?? NaN) >= minEp;

      return titleOk && genreOk && epOk;
    });
  }, [allSeries, titleQuery, genreQuery, minEpQuery]);

  async function onCreer() {
    const obj = {
      title: title.trim(),
      gender: gender.trim(),
      nbEpisodes: Number(nbEpisodes),
      note: note.trim(),
    };
    if (obj.title === "" || obj.gender === "" || Number.isNaN(obj.nbEpisodes)) {
      alert("Remplis Titre, Genre et Nb épisodes (nombre).");
      return;
    }
    try {
      await axios.post(`${API_SERIES}/addSerie`, obj);
      alert("Nouvelle série créée !");
      setTitle("");
      setGender("");
      setNbEpisodes("");
      setNote("");
      await fetchAll();
    } catch {
      alert("Erreur lors de la création de la série.");
    }
  }

  async function onChoisir(serie) {
    setSelection(serie);
    try { await pushHistory(serie.id); } catch {}
  }

  function resetFilters() {
    setTitleQuery("");
    setGenreQuery("");
    setMinEpQuery("");
    setSelection(null);
  }

  useEffect(() => {
    fetchAll();
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setTitleQuery(q);
  }, [location.search]);

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h1>Recherche & Séries</h1>
        <div className="d-flex gap-2">
          <Link to="/History" className="btn btn-outline-secondary">
            Voir l’historique
          </Link>
        </div>
      </div>

      <h5 style={{ marginBottom: 8 }}>Rechercher une série par :</h5>
      <div
        className="border rounded p-3 mb-3"
        style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}
      >
        <div>
          <label style={{ fontSize: 12, padding:8}}>Titre</label>
          <input
            value={titleQuery}
            onChange={(e) => setTitleQuery(e.target.value)}
            placeholder="Naru.."
            style={{ padding: 8, minWidth: 220 }}
          />
        </div>
        <div>
          <label style={{ fontSize: 12, padding:8}}>Genre</label>
          <select
          
            value={genreQuery}
            onChange={(e) => setGenreQuery(e.target.value)}
            style={{ minWidth: 160 }}
          >
            <option value="">-- Choisir --</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, padding:8}}>Nb épisodes minimum</label>
          <input
            type="number"
            value={minEpQuery}
            onChange={(e) => setMinEpQuery(e.target.value)}
            placeholder="ex: 10"
            style={{ padding: 8, width: 140 }}
          />
        </div>
        <button className="btn btn-outline-dark" onClick={resetFilters}>
          Réinitialiser
        </button>
      </div>

      <h5 style={{ marginBottom: 8 }}>Ajouter une série :</h5>
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "flex-end",
          flexWrap: "wrap",
          marginBottom: "12px",
        }}
      >
        <div>
          <label style={{ fontSize: 12 ,padding:8}}>Titre</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ padding: 6, minWidth: 150 }}
          />
        </div>
        <div>
          <label style={{ fontSize: 12 ,padding:8}}>Genre</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            style={{ minWidth: 160 }}
          >
            <option value="">-- Choisir --</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12,padding:8 }}>Nb épisodes</label>
          <input
            type="number"
            value={nbEpisodes}
            onChange={(e) => setNbEpisodes(e.target.value)}
            style={{ padding: 6, width: 110 }}
          />
        </div>
        <div>
          <label style={{ fontSize: 12,padding:8 }}>Note</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ padding: 6, width: 140 }}
          />
        </div>
        <button className="btn btn-success" onClick={onCreer}>
          Ajouter
        </button>
      </div>

      <div
        className="table-responsive"
        style={{ maxHeight: "500px", overflowY: "auto", marginBottom: "2rem" }}
      >
        <table className="table align-middle table-striped">
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
            {filteredSeries.map((s) => {
              const estSelectionnee = selection && selection.id === s.id;
              return (
                <tr
                  key={s.id}
                  onClick={() => onChoisir(s)}
                  style={{
                    cursor: "pointer",
                    background: estSelectionnee ? "#eef" : "transparent",
                  }}
                  title="Clique pour sélectionner"
                >
                  <td>{s.id}</td>
                  <td>{s.title}</td>
                  <td>{s.gender}</td>
                  <td>{s.nbEpisodes}</td>
                  <td>{s.note}</td>
                </tr>
              );
            })}
            {filteredSeries.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Aucun résultat
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
