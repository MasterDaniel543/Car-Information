import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import HeaderBlock from './HeaderBlock';
import './Header.css';

function Header() {
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      fetchUserTheme(storedUsername);
    }

    // Scroll effect
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = 500;
      const opacity = Math.max(1 - (scrollPosition / maxScroll), 0.2);
      setScrollOpacity(opacity);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

    const fetchUserTheme = async (username) => {
      try {
        const response = await axios.get('http://localhost:3001/get-theme', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          params: { usuario: username }
        });
        setTheme(response.data.theme);
        document.body.className = response.data.theme;
      } catch (error) {
        console.error('Error fetching theme:', error);
      }
    };

    const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    try {
      await axios.post('http://localhost:3001/update-theme', 
        { theme: newTheme, usuario: username },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }}
      );
      setTheme(newTheme);
      document.body.className = newTheme;
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    window.location.href = '/';
  };

  return (
    <header style={{ opacity: scrollOpacity, transition: 'opacity 0.3s ease' }}>
      <div className="content">
        <Navbar />
        {isLoggedIn && (
          <div className="user-menu">
            <span>Bienvenido, {username}</span>
            <Link to="/opinions" className="nav-link">Opiniones</Link>
            <Link to="/two-factor" className="nav-link">Configurar 2FA</Link>
            <Link to="/admin" className="nav-link">Panel de Admin</Link>
            <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
          </div>
        )}
        <HeaderBlock />
      </div>
    </header>
  );
}

export default Header;