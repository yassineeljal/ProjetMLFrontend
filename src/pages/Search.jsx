import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

const API = "http://127.0.0.1:8888/series";
const STORAGE_KEY = "series_history";
const MAX_HISTORY = 200;
const PLAYLIST_KEY = "my_playlist";

function addToLocalPlaylist(serie) {
  try {
    const raw = localStorage.getItem(PLAYLIST_KEY);
    const pl = raw ? JSON.parse(raw) : { name: "Ma playlist", items: [] };
    const items = Array.isArray(pl.items) ? pl.items.slice() : [];
    const exists = items.some((it) => it.id === serie.id);
    const newItem = {
      id: serie.id ?? crypto.randomUUID?.() ?? Date.now(),
      title: serie.title ?? "",
      gender: serie.gender ?? "",
      nbEpisodes: Number(serie.nbEpisodes ?? 0),
      note: serie.note ?? ""
    };
    const nextItems = exists ? items.map((it) => (it.id === newItem.id ? newItem : it)) : [...items, newItem];
    localStorage.setItem(PLAYLIST_KEY, JSON.stringify({ name: pl.name || "Ma playlist", items: nextItems }));
  } catch {}
}

export default function App() {
  const location = useLocation();

  const [texte, setTexte] = useState("");
  const [series, setSeries] = useState([]);
  const [selection, setSelection] = useState(null);
  const [montrerFormulaire, setMontrerFormulaire] = useState(false);

  const [title, setTitle] = useState("");
  const [gender, setGender] = useState("");
  const [nbEpisodes, setNbEpisodes] = useState("");
  const [note, setNote] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [filterGenre, setFilterGenre] = useState("");
  const [filterMinEp, setFilterMinEp] = useState("");

  function saveHistory(serie, action = "select") {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      const item = {
        id: serie.id ?? null,
        title: serie.title ?? "",
        gender: serie.gender ?? "",
        nbEpisodes: Number(serie.nbEpisodes ?? 0),
        note: serie.note ?? "",
        action,
        ts: Date.now()
      };
      const last = arr[arr.length - 1];
      const isDup = last && last.id === item.id && last.action === item.action;
      const next = isDup ? arr : [...arr, item].slice(-MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }

  async function chercher(titreTape) {
    try {
      const res = await axios.get(API);
      const data = Array.isArray(res.data) ? res.data : [];
      const t = titreTape.trim().toLowerCase();
      let resultat = t === "" ? [] : data.filter((s) => (s.title || "").toLowerCase().includes(t));

      const g = filterGenre.trim().toLowerCase();
      const minEp = filterMinEp === "" ? 0 : Number(filterMinEp);
      if (g) resultat = resultat.filter((s) => (s.gender || "").toLowerCase().includes(g));
      if (!Number.isNaN(minEp) && minEp > 0) resultat = resultat.filter((s) => Number(s.nbEpisodes || 0) >= minEp);

      setSeries(resultat);
    } catch {
      setSeries([]);
    }
  }

  function onChangeRecherche(event) {
    const v = event.target.value;
    setTexte(v);
    if (v.trim() === "") {
      setSeries([]);
      setSelection(null);
      setMontrerFormulaire(false);
      return;
    }
    chercher(v);
  }

  function onChoisir(serie) {
    setSelection(serie);
    setMontrerFormulaire(true);
    setTitle(serie.title ?? "");
    setGender(serie.gender ?? "");
    setNbEpisodes(serie.nbEpisodes ?? "");
    setNote(serie.note ?? "");
    saveHistory(serie, "select");
  }

  async function onAjouter() {
    if (!selection) return;
    const objet = {
      id: selection.id,
      title: (title || selection.title || "").toString().trim(),
      gender: (gender || selection.gender || "").toString().trim(),
      nbEpisodes: Number(nbEpisodes || selection.nbEpisodes || 0),
      note: (note || selection.note || "").toString().trim()
    };
    if (objet.title === "" || objet.gender === "" || Number.isNaN(objet.nbEpisodes)) {
      alert("Remplis les champs obligatoires");
      return;
    }
    try {
      try { await axios.post("http://127.0.0.1:8888/addSerieToPlaylist", objet); } catch {}
      addToLocalPlaylist(objet);
      saveHistory(objet, "playlist_add");
      alert("Série ajoutée à la playlist !");
      setMontrerFormulaire(false);
    } catch {
      alert("Erreur pendant l'ajout");
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    if (q && q !== texte) {
      setTexte(q);
      chercher(q);
    }
  }, [location.search]);

  useEffect(() => {
    if (texte.trim() !== "") chercher(texte);
  }, [filterGenre, filterMinEp]);

  const lignes = series.map((s) => {
    const estSelectionnee = selection && selection.id === s.id;
    return (
      <tr
        key={s.id}
        onClick={() => onChoisir(s)}
        style={{ cursor: "pointer", background: estSelectionnee ? "#eef" : "transparent" }}
        title="Clique pour sélectionner"
      >
        <td>{s.id}</td>
        <td>{s.title}</td>
        <td>{s.gender}</td>
        <td>{s.nbEpisodes}</td>
        <td>{s.note}</td>
      </tr>
    );
  });

  const ligneAucun =
    texte.trim() !== "" && series.length === 0 ? (
      <tr>
        <td colSpan="5" style={{ textAlign: "center" }}>Aucun résultat</td>
      </tr>
    ) : null;

  function resetFilters() {
    setFilterGenre("");
    setFilterMinEp("");
    if (texte.trim() !== "") chercher(texte);
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h1>Recherche et ajout à la playlist</h1>
        <div className="d-flex gap-2">
          <Link to="/PlayList" className="btn btn-outline-primary">Voir la playlist</Link>
          <Link to="/History" className="btn btn-outline-secondary">Voir l’historique</Link>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
        <input
          value={texte}
          onChange={onChangeRecherche}
          placeholder="Tape un titre"
          style={{ padding: 8, width: 320, maxWidth: "100%" }}
        />
        <button onClick={() => setShowFilters((v) => !v)} className="btn btn-outline-secondary">
          Filtre
        </button>
        <button onClick={onAjouter} disabled={!selection} className="btn btn-primary">
          Ajouter à la playlist
        </button>
      </div>

      {showFilters && (
        <div style={{ border: "1px solid #ddd", borderRadius: 6, padding: 12, marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 12, marginBottom: 4 }}>Genre</div>
              <input
                className="form-control"
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                placeholder="ex: Drama"
                style={{ minWidth: 200 }}
              />
            </div>
            <div>
              <div style={{ fontSize: 12, marginBottom: 4 }}>Nb épisodes minimum</div>
              <input
                type="number"
                className="form-control"
                value={filterMinEp}
                onChange={(e) => setFilterMinEp(e.target.value)}
                placeholder="ex: 10"
                style={{ minWidth: 160 }}
              />
            </div>
            <div className="ms-auto d-flex gap-2">
              <button className="btn btn-outline-secondary" onClick={() => chercher(texte)} disabled={texte.trim()===""}>
                Appliquer
              </button>
              <button className="btn btn-outline-dark" onClick={resetFilters}>
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}

      {montrerFormulaire && selection ? (
        <form
          onSubmit={(e) => { e.preventDefault(); onAjouter(); }}
          style={{ border: "1px solid #ccc", padding: 12, borderRadius: 6, marginBottom: 12, maxWidth: 480 }}
        >
          <div style={{ marginBottom: 8 }}>
            <div style={{ marginBottom: 4 }}>Titre</div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: 8, width: "100%" }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ marginBottom: 4 }}>Genre</div>
            <input value={gender} onChange={(e) => setGender(e.target.value)} style={{ padding: 8, width: "100%" }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ marginBottom: 4 }}>Nombre d'épisodes</div>
            <input type="number" value={nbEpisodes} onChange={(e) => setNbEpisodes(e.target.value)} style={{ padding: 8, width: "100%" }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ marginBottom: 4 }}>Note</div>
            <input value={note} onChange={(e) => setNote(e.target.value)} style={{ padding: 8, width: "100%" }} />
          </div>
          <button type="submit" className="btn btn-primary">Ajouter</button>
        </form>
      ) : null}

      <table border="1" cellPadding="5" style={{ width: "100%", borderCollapse: "collapse" }}>
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
          {lignes}
          {ligneAucun}
        </tbody>
      </table>
    </div>
  );
}
