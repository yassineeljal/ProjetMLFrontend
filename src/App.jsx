import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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

import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Navbar />
        <main className="app-content container">
          <Routes>
            <Route path='/' element={<HomePages />} />
            <Route path='/Search' element={<Search />} />
            <Route path='/Login' element={<Login />} />
            <Route path='/PlayList' element={<PlayList />} />
            <Route path='/History' element={<History />} />
            <Route path='/Trending' element={<Trending />} />
            <Route path='/Recommendations' element={<Recommendations />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
