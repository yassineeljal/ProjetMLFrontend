import React, { useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/movie-logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function Navbar2() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext); 

  const closeMenu = () => {
    const el = document.getElementById("navbarNavDropdown");
    if (el) el.classList.remove("show");
  };

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  useEffect(() => {
    const onClick = (e) => {
      const menu = document.getElementById("navbarNavDropdown");
      const nav = document.getElementById("navSimple");
      if (!menu) return;
      const open = menu.classList.contains("show");
      if (!open) return;
      if (nav && !nav.contains(e.target)) closeMenu();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    closeMenu();
    navigate("/Login");
  }

  return (
    <nav id="navSimple" className="navbar navbar-expand-lg navbar-dark neon-nav fixed-top py-3">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <img src={logo} alt="Logo" style={{ height: "60px" }} />
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
              <Link to="/History" className="nav-link" onClick={closeMenu}>
                Mon Historique
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/Trending" className="nav-link" onClick={closeMenu}>
                Tendances
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/PlayList" className="nav-link" onClick={closeMenu}>
                Ma PlayList
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/Search" className="nav-link" onClick={closeMenu}>
                Rechercher une série
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/Recommendations" className="nav-link" onClick={closeMenu}>
                Recommandations
              </Link>
            </li>

            {!user ? (
              <li className="nav-item">
                <Link to="/Login" className="btn neon-btn ms-lg-3 mt-2 mt-lg-0" onClick={closeMenu}>
                  SignUp / Login
                </Link>
              </li>
            ) : (
              <>
                <li className="nav-item d-flex align-items-center ms-lg-3 mt-2 mt-lg-0">
                  <span
                    className="badge text-bg-dark"
                    style={{
                      background: "#3a2b68",
                      color: "#cdbbff",
                      padding: "8px 10px",
                      borderRadius: "10px",
                    }}
                  >
                    Bonjour, <b>{user.username}</b>
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className="btn btn-outline-danger ms-lg-3 mt-2 mt-lg-0"
                    onClick={logout}
                  >
                    Déconnexion
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar2;
