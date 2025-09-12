//Arda
 
import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
 
import Navbar from "./header/Navbar";
import Footer from "./header/Footer";
 
import HomePages from "./pages/HomePages";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import History from "./pages/History";
import Filter from "./pages/Filter";
import Search from "./pages/Search";
 
import { UserProvider } from "./context/UserContext";
 
function App() {  
  return (
    <BrowserRouter>
      <UserProvider>
      <Navbar/>
      <div>
        <Routes>
            <Route path='/' element={<HomePages/>} />
            <Route path='/Search' element={<Search/>} />
            <Route path='/Admin' element={<Admin/>} />
            <Route path='/Filter' element={<Filter/>} />
            <Route path='/History' element={<History/>} />
         
         
           
            <Route path='*' element={<NotFound/>} />
        </Routes>
      </div>
      <Footer/>
      </UserProvider>
    </BrowserRouter>
  );
}
 
export default App;
 