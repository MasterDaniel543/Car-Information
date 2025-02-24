import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './CarDetails.css';

// Car specifications data
const carSpecs = {
    'Ford': {
      'Mustang': { engine: 'V8 5.0L', transmission: 'Manual 6 velocidades', fuel: 'Gasolina Premium', cylinders: '8 cilindros', power: '460 HP', acceleration: '0-100 km/h: 4.3s' },
      'F-150': { engine: 'V6 3.5L EcoBoost', transmission: 'Automática 10 velocidades', fuel: 'Gasolina Regular', cylinders: '6 cilindros', power: '400 HP', acceleration: '0-100 km/h: 6.1s' },
      'Explorer': { engine: '2.3L EcoBoost', transmission: 'Automática 10 velocidades', fuel: 'Gasolina Regular', cylinders: '4 cilindros', power: '300 HP', acceleration: '0-100 km/h: 7.0s' },
      'Focus': { engine: '2.0L EcoBoost', transmission: 'Manual 6 velocidades', fuel: 'Gasolina Regular', cylinders: '4 cilindros', power: '252 HP', acceleration: '0-100 km/h: 6.3s' },
      'Bronco': { engine: '2.7L EcoBoost', transmission: 'Automática 10 velocidades', fuel: 'Gasolina Regular', cylinders: '6 cilindros', power: '330 HP', acceleration: '0-100 km/h: 6.7s' },
      'Ranger': { engine: '2.3L EcoBoost', transmission: 'Automática 10 velocidades', fuel: 'Gasolina Regular', cylinders: '4 cilindros', power: '270 HP', acceleration: '0-100 km/h: 7.4s' }
    },
    'Toyota': {
      'Camry': { engine: '2.5L Dynamic Force', transmission: 'Automática 8 velocidades', fuel: 'Gasolina Regular', cylinders: '4 cilindros', power: '203 HP', acceleration: '0-100 km/h: 8.3s' },
      'Corolla': { engine: '2.0L Dynamic Force', transmission: 'CVT', fuel: 'Gasolina Regular', cylinders: '4 cilindros', power: '169 HP', acceleration: '0-100 km/h: 9.2s' },
      'RAV4': { engine: '2.5L Hybrid', transmission: 'CVT', fuel: 'Gasolina Regular', cylinders: '4 cilindros', power: '219 HP', acceleration: '0-100 km/h: 7.8s' },
      'Tacoma': { engine: '3.5L V6', transmission: 'Automática 6 velocidades', fuel: 'Gasolina Regular', cylinders: '6 cilindros', power: '278 HP', acceleration: '0-100 km/h: 7.7s' },
      'Highlander': { engine: '3.5L V6', transmission: 'Automática 8 velocidades', fuel: 'Gasolina Regular', cylinders: '6 cilindros', power: '295 HP', acceleration: '0-100 km/h: 7.2s' },
      'Prius': { engine: '1.8L Hybrid', transmission: 'CVT', fuel: 'Gasolina Regular', cylinders: '4 cilindros', power: '121 HP', acceleration: '0-100 km/h: 10.6s' }
    },
    'Honda': {
      'Civic': { engine: '2.0L VTEC Turbo', transmission: 'Manual 6 velocidades', fuel: 'Gasolina Premium', cylinders: '4 cilindros', power: '306 HP', acceleration: '0-100 km/h: 5.4s' },
      'Accord': { engine: '1.5L Turbo', transmission: 'CVT', fuel: 'Gasolina Regular', cylinders: '4 cilindros', power: '192 HP', acceleration: '0-100 km/h: 7.2s' },
      'CR-V': { engine: '1.5L Turbo', transmission: 'CVT', fuel: 'Gasolina Regular', cylinders: '4 cilindros', power: '190 HP', acceleration: '0-100 km/h: 7.8s' },
      'Pilot': { engine: '3.5L V6', transmission: 'Automática 9 velocidades', fuel: 'Gasolina Regular', cylinders: '6 cilindros', power: '280 HP', acceleration: '0-100 km/h: 6.2s' },
      'HR-V': { engine: '2.0L', transmission: 'CVT', fuel: 'Gasolina Regular', cylinders: '4 cilindros', power: '158 HP', acceleration: '0-100 km/h: 9.4s' },
      'Odyssey': { engine: '3.5L V6', transmission: 'Automática 10 velocidades', fuel: 'Gasolina Regular', cylinders: '6 cilindros', power: '280 HP', acceleration: '0-100 km/h: 6.5s' }
    },
    'Mercedes': {
      'C-Class': { engine: '2.0L Turbo', transmission: 'Automática 9 velocidades', fuel: 'Gasolina Premium', cylinders: '4 cilindros', power: '255 HP', acceleration: '0-100 km/h: 5.9s' },
      'E-Class': { engine: '3.0L Turbo', transmission: 'Automática 9 velocidades', fuel: 'Gasolina Premium', cylinders: '6 cilindros', power: '362 HP', acceleration: '0-100 km/h: 4.9s' },
      'S-Class': { engine: '4.0L V8 Biturbo', transmission: 'Automática 9 velocidades', fuel: 'Gasolina Premium', cylinders: '8 cilindros', power: '496 HP', acceleration: '0-100 km/h: 4.3s' },
      'GLC': { engine: '2.0L Turbo', transmission: 'Automática 9 velocidades', fuel: 'Gasolina Premium', cylinders: '4 cilindros', power: '255 HP', acceleration: '0-100 km/h: 6.2s' },
      'GLE': { engine: '3.0L Turbo', transmission: 'Automática 9 velocidades', fuel: 'Gasolina Premium', cylinders: '6 cilindros', power: '362 HP', acceleration: '0-100 km/h: 5.3s' },
      'G-Class': { engine: '4.0L V8 Biturbo', transmission: 'Automática 9 velocidades', fuel: 'Gasolina Premium', cylinders: '8 cilindros', power: '577 HP', acceleration: '0-100 km/h: 4.5s' }
    },
    'Nissan': {
      'Sentra': { engine: '2.0L', transmission: 'CVT', fuel: 'Gasolina Regular', cylinders: '4 cilindros', power: '149 HP', acceleration: '0-100 km/h: 9.2s' },
      'Altima': { engine: '2.5L', transmission: 'CVT', fuel: 'Gasolina Regular', cylinders: '4 cilindros', power: '188 HP', acceleration: '0-100 km/h: 7.9s' },
      'Rogue': { engine: '1.5L Turbo', transmission: 'CVT', fuel: 'Gasolina Regular', cylinders: '3 cilindros', power: '201 HP', acceleration: '0-100 km/h: 8.2s' },
      'Pathfinder': { engine: '3.5L V6', transmission: 'Automática 9 velocidades', fuel: 'Gasolina Regular', cylinders: '6 cilindros', power: '284 HP', acceleration: '0-100 km/h: 6.7s' },
      'Frontier': { engine: '3.8L V6', transmission: 'Automática 9 velocidades', fuel: 'Gasolina Regular', cylinders: '6 cilindros', power: '310 HP', acceleration: '0-100 km/h: 7.3s' },
      'GT-R': { engine: '3.8L V6 Twin-Turbo', transmission: 'Automática 6 velocidades', fuel: 'Gasolina Premium', cylinders: '6 cilindros', power: '565 HP', acceleration: '0-100 km/h: 2.7s' }
    }
  };

const CarDetails = () => {
  const { brand, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { car } = location.state || {};

  if (!car) {
    return <div>Car not found</div>;
  }

  const formattedBrand = brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();
  const specs = carSpecs[formattedBrand]?.[car.name];

  return (
    <section className="car-details">
      <div className="container">
      <button className="back-button" onClick={() => navigate(-1)}>
          ← Volver al catálogo
        </button>
        <div className="car-details-content">
          <div className="car-image">
            <img src={car.image} alt={car.name} />
          </div>
          <div className="car-info">
            <h2>{car.name}</h2>
            <p className="brand">Marca: {formattedBrand}</p>
            <p className="year">Año: {car.year}</p>
            <div className="specs-grid">
              <div className="spec-item">
                <h4>Motor</h4>
                <p>{specs?.engine || 'N/A'}</p>
              </div>
              <div className="spec-item">
                <h4>Transmisión</h4>
                <p>{specs?.transmission || 'N/A'}</p>
              </div>
              <div className="spec-item">
                <h4>Combustible</h4>
                <p>{specs?.fuel || 'N/A'}</p>
              </div>
              <div className="spec-item">
                <h4>Cilindros</h4>
                <p>{specs?.cylinders || 'N/A'}</p>
              </div>
              <div className="spec-item">
                <h4>Potencia</h4>
                <p>{specs?.power || 'N/A'}</p>
              </div>
              <div className="spec-item">
                <h4>Aceleración</h4>
                <p>{specs?.acceleration || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
);
};

export default CarDetails;