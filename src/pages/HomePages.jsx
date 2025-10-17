import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';

function HomePages() {
  return (
    <div className="home">
      <div className="card">
        <h1 className="page-title">MoviesClub</h1>
        <p className="page-subtitle">Un hub pour tes séries: recherche, tendances, recommandations et playlist.</p>
        <div className="actions">
          <Link to="/Search" className="btn primary">Rechercher une série</Link>
          <Link to="/Trending" className="btn ghost">Voir les tendances</Link>
          <Link to="/PlayList" className="btn light">Voir ma Playlist</Link>
        </div>
      </div>
    </div>
  );
}

export default HomePages;
