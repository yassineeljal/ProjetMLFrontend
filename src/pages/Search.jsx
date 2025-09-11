import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    axios.post("http://localhost:3306/finduser", { q: "" })
      .then(res => setRows(res.data))
      .catch(err => console.error("Erreur backend :", err));
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    axios.post("http://localhost:3306/finduser", { q: value })
      .then(res => setRows(res.data))
      .catch(err => console.error("Erreur recherche :", err));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Recherche dans la base</h1>

      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Ex: PHI"
        style={{ padding: "0.5rem", width: "300px" }}
      />

      <table border="1" cellPadding="5" style={{ marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Genre</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((u, idx) => (
            <tr key={idx}>
              <td>{u.id}</td>
              <td>{u.first_name}</td>
              <td>{u.last_name}</td>
              <td>{u.email}</td>
              <td>{u.gender}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
