import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© 2024 Car Information. Todos los derechos reservados.</p>
        <p>Creado por <span className="creator">El Daniel</span></p>
      </div>
    </footer>
  );
};

export default Footer;