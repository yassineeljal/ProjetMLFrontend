import React from "react";

export default function PlayList() {
  return (
    <div className="page-wrap">
      <div className="page-head">
        <h1 className="page-h1">Ma playlist</h1>
        <div className="head-actions"></div>
      </div>
      <div className="table-card">
        <div className="empty">Aucune série dans la playlist.</div>
      </div>
    </div>
  );
}
