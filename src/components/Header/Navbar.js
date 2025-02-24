import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/Registro');
    setIsMenuOpen(false);
  };

  const scrollToCatalog = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const catalogSection = document.getElementById('catalog');
        if (catalogSection) {
          catalogSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const catalogSection = document.getElementById('catalog');
      if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <nav>
      <p className="brand">
        <Link to="/">Car <strong> Information</strong></Link>
      </p>
      <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}></div>
      </div>
      <ul className={isMenuOpen ? 'active' : ''}>
        <li>
          <a href="#catalog" onClick={scrollToCatalog}>Catálogo</a>
        </li>
        <li>
          <Link to="/opinions" onClick={() => setIsMenuOpen(false)}>Opiniones</Link>
        </li>
        {token ? (
          <li>
            <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
          </li>
        ) : (
          <li>
            <Link to="/Registro" onClick={() => setIsMenuOpen(false)}>Iniciar Sesion</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;