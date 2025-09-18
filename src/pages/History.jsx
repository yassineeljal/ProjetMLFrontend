import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function History() {
  useEffect(() => {
  }, []);

  return (
    <div className="container py-4 page" style={{ maxWidth: 1100 }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="page-title m-0">Historique</h1>
      </div>
    </div>
  );
}

export default History;
