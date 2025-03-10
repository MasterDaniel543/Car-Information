import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Registro from './components/Registro/Registro';
import Catalog from './components/Catalog/Catalog';
import CarDetails from './components/Catalog/CarDetails';
import Opinions from './components/Opinions/Opinions';
import Footer from './components/Footer/Footer';
import RecuperarPassword from './components/RecuperarPassword/RecuperarPassword';
import TwoFactorAuth from './components/TwoFactorAuth/TwoFactorAuth';
import UserSettings from './components/Configuraciones/UserSettings';
import AdminPanel from './components/Rol/AdminPanel';
import EditorPanel from './components/Rol/EditorPanel';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<><Header /><Catalog /><Footer /></>} />
        <Route path="/Registro" element={<><Registro /><Footer /></>} />
        <Route path="/car/:brand/:id" element={<><CarDetails /><Footer /></>} />
        <Route path="/opinions" element={<><Opinions /><Footer /></>} />
        <Route path="/recuperar-password" element={<><RecuperarPassword /><Footer /></>} />
        <Route path="/two-factor" element={<TwoFactorAuth />} />
        <Route path="/user-settings" element={<UserSettings />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/editor" element={<EditorPanel />} />
      </Routes>
    </div>
  );
}

export default App;