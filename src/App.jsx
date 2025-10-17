import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from "./header/Navbar";
import Footer from "./header/Footer";
import Trending from "./pages/Trending";

import HomePages from "./pages/HomePages";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import History from "./pages/History";
import PlayList from "./pages/PlayList";
import Search from "./pages/Search";
import Recommendations from "./pages/Recommendation";

import { UserProvider, UserContext } from "./context/UserContext";

function Protected({ children }) {
  const { user } = useContext(UserContext);
  if (!user?.token) return <Navigate to="/Login" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Navbar />
        <main className="app-content container">
          <Routes>
            <Route path='/' element={<HomePages />} />
            <Route path='/Search' element={<Search />} />
            <Route path='/Trending' element={<Trending />} />
            <Route path='/Login' element={<Login />} />

            <Route path='/History' element={<Protected><History /></Protected>} />
            <Route path='/Recommendations' element={<Protected><Recommendations /></Protected>} />
            <Route path='/PlayList' element={<Protected><PlayList /></Protected>} />

            <Route path='*' element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
