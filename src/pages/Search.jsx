import { useState } from "react";
import axios from "axios";
 
const API_URL = "http://127.0.0.1:8888/people";
 
function App() {
  const [people, setPeople] = useState([]);
  const [search, setSearch] = useState("");
 
  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
 
    if (!value.trim()) {
      setPeople([]);
      return;
    }
 
    axios
      .post(`${API_URL}/findUser/${encodeURIComponent(value)}`)
      .then((res) => setPeople(Array.isArray(res.data) ? res.data : []))
      .catch(() => setPeople([]));
  };
 
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Recherche des personnes</h1>
 
      <input
        value={search}
        onChange={handleChange}
        placeholder="Tape un nom (ex: Pa)"
        style={{ padding: "0.5rem", width: 320 }}
      />
 
      <table border="1" cellPadding="5" style={{ marginTop: 16, width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Genre</th>
            <th>Âge</th>
          </tr>
        </thead>
        <tbody>
          {people.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.gender}</td>
              <td>{p.age}</td>
            </tr>
          ))}
         
        </tbody>
      </table>
    </div>
  );
}
 
export default App;