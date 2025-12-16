# MoviesClub - Frontend

Interface utilisateur du projet MoviesClub. Une application React pour gérer ses séries, suivre les tendances et obtenir des recommandations.

## Installation et Lancement
   ```bash
   npm install
   npm run dev
   ```

## Fonctionnalités
Authentification : Connexion et inscription sécurisées.

Recherche : Filtrage de séries par titre, genre et nombre d'épisodes.

Historique : Sauvegarde automatique des séries consultées.

Tendances : Classement des séries les plus populaires (7 derniers jours).

Recommandations : Suggestions personnalisées basées sur l'historique.

Ajout : Interface pour créer de nouvelles séries dans la base de données.

## Structure du Projet
Organisation du code source pour faciliter la maintenance :

src/pages/ : Contient les écrans principaux (Login, Search, History, Trending, Recommendations).

src/components/ : Composants réutilisables (Navbar, Footer).

src/context/ : UserContext.js gère l'état global de l'utilisateur (Auth & Token).

src/css/ : Fichiers de styles pour l'interface.

src/api.js : Configuration centrale d'Axios pour la communication avec le backend.

## Auteurs
Projet réalisé par Takfarinas, Arda, Yassine, Mehdi.

   
