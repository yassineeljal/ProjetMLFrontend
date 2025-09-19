import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';

function HomePages() {
  return (
    <div className="home center">
      <div className="card home-card">
        <h1 className="page-title">HomePage</h1>
        <p className="page-subtitle">Bienvenue sur Movie Search</p>
        <div className="actions">
          <Link to="/Search" className="btn primary">Rechercher une série</Link>
          <Link to="/History" className="btn ghost">Voir l’historique</Link>
          <Link to="/PlayList" className="btn light">Voir ma Playlist</Link>
        </div>
      </div>
    </div>
  );
}

export default HomePages;
