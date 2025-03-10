import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchUserRole = async () => {
      if (token) {
        try {
          const usuario = localStorage.getItem('usuario');
          const response = await axios.get('http://localhost:3001/user-info', {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { usuario }
          });
          setUserRole(response.data.rol);
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
    };

    fetchUserRole();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUserRole('');
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
        <Link to="/">Car <strong>Information</strong></Link>
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
          <>
            {userRole === 'administrador' && (
              <li>
                <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                  Panel de Admin
                </Link>
              </li>
            )}
            {userRole === 'editor' && (
                <li>
                    <Link to="/editor" onClick={() => setIsMenuOpen(false)}>
                        Panel de Editor
                    </Link>
                </li>
            )}
            <li>
              <Link to="/user-settings" onClick={() => setIsMenuOpen(false)}>
                Configuración
              </Link>
            </li>
            <li>
              <button className="logout-button" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/Registro" onClick={() => setIsMenuOpen(false)}>
              Iniciar Sesión
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;