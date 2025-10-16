import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_SERIES = "http://127.0.0.1:8888/series";

export default function Search() {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("Tous");
  const [episodesMin, setEpisodesMin] = useState(10);
  const [items, setItems] = useState([]);
  const [addTitle, setAddTitle] = useState("");
  const [addGenre, setAddGenre] = useState("");
  const [addEpisodes, setAddEpisodes] = useState("");
  const [addNote, setAddNote] = useState("");
  const [err, setErr] = useState("");

  async function fetchSeries() {
    try {
      const r = await axios.get(API_SERIES);
      setItems(Array.isArray(r.data) ? r.data : []);
      setErr("");
    } catch {
      setItems([]);
      setErr("Erreur de chargement des séries");
    }
  }

  async function addSerie(e) {
    e.preventDefault();
    try {
      await axios.post(API_SERIES, {
        title: addTitle,
        genre: addGenre,
        nbEpisodes: addEpisodes,
        note: addNote
      });
      setAddTitle("");
      setAddGenre("");
      setAddEpisodes("");
      setAddNote("");
      fetchSeries();
    } catch {
      setErr("Erreur d’ajout de la série");
    }
  }

  function resetFilters() {
    setTitle("");
    setGenre("Tous");
    setEpisodesMin(10);
  }

  useEffect(() => {
    fetchSeries();
  }, []);

  return (
    <div className="page-wrap">
      <div className="page-head">
        <h1 className="page-h1">Recherche & Séries</h1>
        <div className="head-actions">
          <Link to="/History" className="btn-ghost">Historique</Link>
        </div>
      </div>

      <div className="card-grid">
        <div className="card-block">
          <h3 className="block-title">Filtrer</h3>
          <div className="form-grid">
            <div className="fld">
              <span>Titre</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Naruto" />
            </div>
            <div className="fld">
              <span>Genre</span>
              <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                <option value="Tous">Tous</option>
                <option value="Action">Action</option>
                <option value="Comédie">Comédie</option>
                <option value="Drame">Drame</option>
              </select>
            </div>
            <div className="fld">
              <span>Nb épisodes min</span>
              <input type="number" value={episodesMin} onChange={(e) => setEpisodesMin(e.target.value)} />
            </div>
            <div className="fld">
              <span>&nbsp;</span>
              <button className="btn-ghost" onClick={resetFilters}>Réinitialiser</button>
            </div>
          </div>
        </div>

        <div className="card-block">
          <h3 className="block-title">Ajouter une série</h3>
          <form onSubmit={addSerie} className="form-grid">
            <div className="fld">
              <span>Titre</span>
              <input value={addTitle} onChange={(e) => setAddTitle(e.target.value)} />
            </div>
            <div className="fld">
              <span>Genre</span>
              <select value={addGenre} onChange={(e) => setAddGenre(e.target.value)}>
                <option value="">Choisir</option>
                <option value="Action">Action</option>
                <option value="Comédie">Comédie</option>
                <option value="Drame">Drame</option>
              </select>
            </div>
            <div className="fld">
              <span>Nb épisodes</span>
              <input type="number" value={addEpisodes} onChange={(e) => setAddEpisodes(e.target.value)} />
            </div>
            <div className="fld">
              <span>Note</span>
              <input value={addNote} onChange={(e) => setAddNote(e.target.value)} />
            </div>
            <div className="fld">
              <span>&nbsp;</span>
              <button type="submit" className="btn-primary">Ajouter</button>
            </div>
          </form>
        </div>
      </div>

      {err && <div className="alert-warn">{err}</div>}

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
            {items.length === 0 ? (
              <tr><td colSpan="5" className="empty">Aucun résultat</td></tr>
            ) : (
              items.map((it) => (
                <tr key={it.id}>
                  <td>{it.id}</td>
                  <td>{it.title}</td>
                  <td>{it.genre}</td>
                  <td>{it.nbEpisodes}</td>
                  <td>{it.note}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
