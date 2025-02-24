import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import HeaderBlock from './HeaderBlock';
import './Header.css';

function Header() {
  const [scrollOpacity, setScrollOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = 500;
      const opacity = Math.max(1 - (scrollPosition / maxScroll), 0.2);
      setScrollOpacity(opacity);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header style={{ opacity: scrollOpacity, transition: 'opacity 0.3s ease' }}>
      <div className="content">
        <Navbar />
        <HeaderBlock />
      </div>
    </header>
  );
}

export default Header;