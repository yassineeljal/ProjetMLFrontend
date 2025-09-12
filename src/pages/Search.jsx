import React, { useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8888/people";

function App() {
  const [texte, setTexte] = useState("");
  const [personnes, setPersonnes] = useState([]);

  const [selection, setSelection] = useState(null);
  const [montrerFormulaire, setMontrerFormulaire] = useState(false);
  const [nom, setNom] = useState("");
  const [genre, setGenre] = useState("");
  const [age, setAge] = useState("");

  async function chercher(nomTape) {
    try {
      const url = API + "/findUser/" + encodeURIComponent(nomTape);
      const res = await axios.post(url);
      if (Array.isArray(res.data)) {
        setPersonnes(res.data);
      } else {
        setPersonnes([]);
      }
    } catch (e) {
      setPersonnes([]);
    }
  }

  function onChangeRecherche(event) {
    var v = event.target.value;
    setTexte(v);


    if (v.trim() === "") {
      setPersonnes([]);
      setSelection(null);
      setMontrerFormulaire(false);
      return;
    }

    chercher(v);
  }

  function onChoisir(personne) {
    setSelection(personne);
    setMontrerFormulaire(false);



    setNom(personne.name);
    setGenre(personne.gender);
    setAge(personne.age);

  }

  function onCliquerModifier() {
    if (!selection) return;
    setMontrerFormulaire(true);
  }

  async function onEnregistrer(event) {
    event.preventDefault();
    if (!selection) return;

    if (nom.trim() === "" || genre.trim() === "" || age === "") {
      alert("Remplis tous les champs");
      return;
    }

    var objet = {
      id: selection.id,
      name: nom.trim(),
      gender: genre.trim(),
      age: Number(age)
    };

    try {
      const url = API + "/addUser";
      await axios.post(url, objet);

      var nouvelleListe = personnes.map(function (p) {
        if (p.id === selection.id) {
          return {
            id: selection.id,
            name: objet.name,
            gender: objet.gender,
            age: objet.age
          };
        } else {
          return p;
        }
      });

      setPersonnes(nouvelleListe);


     
      setSelection({
        id: selection.id,
        name: objet.name,
        gender: objet.gender,
        age: objet.age
      });

      setMontrerFormulaire(false);
      alert("Modifications enregistrées !");
    } catch (e) {
      alert("Erreur pendant l'enregistrement");
    }
  }

  var lignes = personnes.map(function (p) {
    var estSelectionne = selection && selection.id === p.id;
    return (
      <tr
        key={p.id}
        onClick={function () { onChoisir(p); }}
        style={{ cursor: "pointer", background: estSelectionne ? "#eef" : "transparent" }}
        title="Clique pour sélectionner"
      >
        <td>{p.id}</td>
        <td>{p.name}</td>
        <td>{p.gender}</td>
        <td>{p.age}</td>
      </tr>
    );
  });

  var ligneAucun = null;
  if (texte.trim() !== "" && personnes.length === 0) {
    ligneAucun = (
      <tr>
        <td colSpan="4" style={{ textAlign: "center" }}>Aucun résultat</td>
      </tr>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>Recherche et modification</h1>


      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <input
          value={texte}
          onChange={onChangeRecherche}
          placeholder="Tape un nom (ex: Pa)"
          style={{ padding: 8, width: 320 }}
        />
        <button
          onClick={onCliquerModifier}
          disabled={!selection}
          style={{ padding: "8px 12px" }}
          title={!selection ? "Sélectionne une ligne d'abord" : "Modifier la personne sélectionnée"}
        >
          Modifier
        </button>
      </div>


      {montrerFormulaire && selection ? (
        <form onSubmit={onEnregistrer} style={{ border: "1px solid #ccc", padding: 12, borderRadius: 6, marginBottom: 12, maxWidth: 400 }}>

          <div style={{ marginBottom: 8 }}>
            <div style={{ marginBottom: 4 }}>Nom</div>
            <input value={nom} onChange={function (e) { setNom(e.target.value); }} style={{ padding: 8, width: "100%" }} />
          </div>

          <div style={{ marginBottom: 8 }}>
            <div style={{ marginBottom: 4 }}>Genre</div>
            <input value={genre} onChange={function (e) { setGenre(e.target.value); }} style={{ padding: 8, width: "100%" }} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ marginBottom: 4 }}>Âge</div>
            <input type="number" value={age} onChange={function (e) { setAge(e.target.value); }} style={{ padding: 8, width: "100%" }} />
          </div>

          <button type="submit" style={{ padding: "8px 12px" }}>Enregistrer</button>
        </form>
      ) : null}


      <table border="1" cellPadding="5" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Genre</th>
            <th>Âge</th>
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

export default App;
