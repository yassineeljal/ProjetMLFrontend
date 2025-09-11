import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="container text-center mt-5">
            <h1 className="display-1">404</h1>
            <h2 className="mb-4">Page non trouvée</h2>
            <p className="mb-4">Désolé, la page que vous recherchez n'existe pas.</p>
            <Link to="/" className="btn btn-primary">
                Retour à l'accueil
            </Link>
        </div>
    );
};

export default NotFound;