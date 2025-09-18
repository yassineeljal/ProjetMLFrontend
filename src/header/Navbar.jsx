import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/logoMovie.png';
import { Link } from 'react-router-dom';

function Navbar2(props) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top py-3">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="Logo" id="logo" style={{ height: "50px" }} />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/History" className="nav-link">Mon Historique</Link>
            </li>
            <li className="nav-item">
              <Link to="/PlayList" className="nav-link">Ma PlayList</Link>
            </li>
            <li className="nav-item">
              <Link to="/Search" className="nav-link">Rechercher une série</Link>
            </li>
            <li className="nav-item">
              <Link to="/Admin" className="nav-link">Admin</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar2;
