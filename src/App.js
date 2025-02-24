import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Registro from './components/Registro/Registro';
import Catalog from './components/Catalog/Catalog';
import CarDetails from './components/Catalog/CarDetails';
import Opinions from './components/Opinions/Opinions';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<><Header /><Catalog /><Footer /></>} />
        <Route path="/Registro" element={<><Registro /><Footer /></>} />
        <Route path="/car/:brand/:id" element={<><CarDetails /><Footer /></>} />
        <Route path="/opinions" element={<><Opinions /><Footer /></>} />
      </Routes>
    </div>
  );
}

export default App;