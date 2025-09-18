import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PLAYLIST_KEY = "my_playlist";

function readPlaylist() {
  try {
    const raw = localStorage.getItem(PLAYLIST_KEY);
    const pl = raw ? JSON.parse(raw) : null;
    return pl && typeof pl === "object"
      ? { name: pl.name || "Ma playlist", items: Array.isArray(pl.items) ? pl.items : [] }
      : { name: "Ma playlist", items: [] };
  } catch {
    return { name: "Ma playlist", items: [] };
  }
}
function writePlaylist(data) {
  localStorage.setItem(PLAYLIST_KEY, JSON.stringify({ name: data.name, items: data.items }));
}

export default function PlayList() {
  const [name, setName] = useState("Ma playlist");
  const [nameEdit, setNameEdit] = useState(false);
  const [items, setItems] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [gender, setGender] = useState("");
  const [nbEpisodes, setNbEpisodes] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const pl = readPlaylist();
    setName(pl.name);
    setItems(pl.items);
  }, []);

  function startEdit(it) {
    setEditingId(it.id);
    setTitle(it.title ?? "");
    setGender(it.gender ?? "");
    setNbEpisodes(it.nbEpisodes ?? "");
    setNote(it.note ?? "");
  }
  function cancelEdit() {
    setEditingId(null);
    setTitle(""); setGender(""); setNbEpisodes(""); setNote("");
  }
  function saveEdit() {
    if (!editingId) return;
    if (title.trim() === "" || gender.trim() === "" || nbEpisodes === "") return;
    const updated = items.map((it) =>
      it.id === editingId
        ? { ...it, title: title.trim(), gender: gender.trim(), nbEpisodes: Number(nbEpisodes), note: note?.toString().trim() ?? "" }
        : it
    );
    setItems(updated);
    writePlaylist({ name, items: updated });
    cancelEdit();
  }
  function removeItem(id) {
    const updated = items.filter((it) => it.id !== id);
    setItems(updated);
    writePlaylist({ name, items: updated });
  }
  function clearAll() {
    setItems([]);
    writePlaylist({ name, items: [] });
  }
  function saveName() {
    const newName = name.trim() === "" ? "Ma playlist" : name.trim();
    setName(newName);
    writePlaylist({ name: newName, items });
    setNameEdit(false);
  }

  return (
    <div className="container py-4" style={{ maxWidth: 1000 }}>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div className="d-flex flex-column">
          {!nameEdit ? (
            <>
              <div className="d-flex align-items-center gap-2">
                <h1 className="m-0">{name}</h1>
                <button
                  className="btn btn-outline-primary btn-sm ms-1"
                  onClick={() => setNameEdit(true)}
                >
                  Modifier le nom
                </button>
              </div>
            </>
          ) : (
            <form
              className="d-flex align-items-center gap-2"
              onSubmit={(e) => { e.preventDefault(); saveName(); }}
            >
              <input
                className="form-control"
                style={{ width: 260 }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom de la playlist"
              />
              <button className="btn btn-primary" type="submit">Enregistrer</button>
              <button className="btn btn-outline-secondary" type="button" onClick={() => setNameEdit(false)}>Annuler</button>
            </form>
          )}
          <small className="text-muted mt-1">{items.length} série(s)</small>
        </div>

        <div className="d-flex align-items-center gap-2 mt-2 mt-sm-0">
          <Link to="/Search" className="btn btn-outline-secondary">+ Ajouter depuis Recherche</Link>
          <button className="btn btn-outline-danger" onClick={clearAll} disabled={items.length === 0}>Tout supprimer</button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="border rounded p-4 text-muted">Aucune série dans la playlist.</div>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th style={{ width: 90 }}>ID</th>
                <th>Titre</th>
                <th>Genre</th>
                <th>Nb épisodes</th>
                <th>Note</th>
                <th style={{ width: 220 }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td>{it.id}</td>
                  <td>
                    {editingId === it.id ? (
                      <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
                    ) : it.title}
                  </td>
                  <td>
                    {editingId === it.id ? (
                      <input className="form-control" value={gender} onChange={(e) => setGender(e.target.value)} />
                    ) : it.gender}
                  </td>
                  <td style={{ maxWidth: 130 }}>
                    {editingId === it.id ? (
                      <input type="number" className="form-control" value={nbEpisodes} onChange={(e) => setNbEpisodes(e.target.value)} />
                    ) : it.nbEpisodes}
                  </td>
                  <td style={{ maxWidth: 160 }}>
                    {editingId === it.id ? (
                      <input className="form-control" value={note} onChange={(e) => setNote(e.target.value)} />
                    ) : it.note}
                  </td>
                  <td className="text-end">
                    {editingId === it.id ? (
                      <>
                        <button className="btn btn-sm btn-primary me-2" onClick={saveEdit}>Enregistrer</button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={cancelEdit}>Annuler</button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(it)}>Modifier</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(it.id)}>Supprimer</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
