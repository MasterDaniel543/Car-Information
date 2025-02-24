import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Catalog.css';

const carData = [
  {
    brand: 'Ford',
    models: [
      { id: 1, name: 'Mustang', year: 2023, image: 'https://www.vdm.ford.com/content/dam/vdm_ford/live/en_us/ford/nameplate/mustang/2024/collections/_360/atlas-blue/mst_24_gtp_ext_360_atlas_blue_01.jpg' },
      { id: 2, name: 'F-150', year: 2023, image: 'https://cdn.motor1.com/images/mgl/7ZQn7J/672:0:4292:3222/ford-f-150-raptor-2025---argentina.webp' },
      { id: 3, name: 'Explorer', year: 2023, image: 'https://www.ford.mx/content/dam/Ford/website-assets/latam/mx/nameplate/explorer/2023/colorizer/azul-cobalto/ford-explorer-2023-camioneta-suv-tecnologia-poder-color-azul-cobalto.jpg.dam.full.high.jpg/1673024635789.jpg' },
      { id: 4, name: 'Focus', year: 2023, image: 'https://acnews.blob.core.windows.net/imgnews/medium/NAZ_8820e31532944ed39b569ef0e4db174d.webp' },
      { id: 5, name: 'Bronco', year: 2023, image: 'https://hips.hearstapps.com/hmg-prod/images/2021-ford-bronco-08-1594707079.jpg?resize=980:*' },
      { id: 6, name: 'Ranger', year: 2023, image: 'https://img.asmedia.epimg.net/resizer/v2/AI6VFIPNG5ADFC35F3NQUBQBLE.jpg?auth=230e4209bb6cdc14cfdd01e7d1d9b079a6bbb422dc3d6d81aeaede8ad44e7949&width=360&height=203&focal=790%2C356' }
    ]
  },
  {
    brand: 'Toyota',
    models: [
      { id: 11, name: 'Camry', year: 2023, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_CoSssY0kFn-AigAkTh-_vvX1EWqaFfHhog&s' },
      { id: 12, name: 'Corolla', year: 2023, image: 'https://i.blogs.es/41ee2a/20220401_01_08_s/1366_2000.jpeg' },
      { id: 13, name: 'RAV4', year: 2023, image: 'https://soymotor.com/sites/default/files/imagenes/noticia/toyota_rav4_gr_sport_1.jpg' },
      { id: 14, name: 'Tacoma', year: 2023, image: 'https://di-uploads-pod7.dealerinspire.com/toyotaofnorthmiami/uploads/2022/10/2-2023-Tacoma.png' },
      { id: 15, name: 'Highlander', year: 2023, image: 'https://img.remediosdigitales.com/3cca8f/2023-toyota-highlander-2/1366_2000.jpeg' },
      { id: 16, name: 'Prius', year: 2023, image: 'https://img.remediosdigitales.com/07bb27/toyota-prius-2023-prueba-mexico_/1366_2000.jpg' }
    ]
  },
  {
    brand: 'Honda',
    models: [
      { id: 21, name: 'Civic', year: 2023, image: 'https://mma.prnewswire.com/media/1930875/02_2023_Civic_Type__R.jpg?p=twitter' },
      { id: 22, name: 'Accord', year: 2023, image: 'https://d3s8goeblmpptu.cloudfront.net/mrp/honda/2023/accord/2023-honda-accord_landing_629427.jpg' },
      { id: 23, name: 'CR-V', year: 2023, image: 'https://img.remediosdigitales.com/a39df1/honda-cr-v-hybrid-2023-51/1366_2000.jpg' },
      { id: 24, name: 'Pilot', year: 2023, image: 'https://acnews.blob.core.windows.net/imgnews/large/NAZ_f91a2eb4b6dc494fa63f3dd40819f794.webp' },
      { id: 25, name: 'HR-V', year: 2023, image: 'https://acnews.blob.core.windows.net/imgnews/medium/NAZ_ee49c24e0763470a9c96b2b311977464.webp' },
      { id: 26, name: 'Odyssey', year: 2023, image: 'https://acnews.blob.core.windows.net/imgnews/medium/NAZ_0a95597bac254b5789d443ef86e6ec9c.webp' }
    ]
  },
  {
    brand: 'Mercedes',
    models: [
      { id: 31, name: 'C-Class', year: 2023, image: 'https://media.ed.edmunds-media.com/mercedes-benz/c-class/2023/oem/2023_mercedes-benz_c-class_sedan_amg-c-43_fq_oem_1_1600.jpg' },
      { id: 32, name: 'E-Class', year: 2023, image: 'https://hips.hearstapps.com/hmg-prod/images/2021-genesis-g80-3p5t-prestige-v-2021-mercedes-benz-e450-sedan-1768-edit-1621887031.jpg?crop=0.454xw:0.378xh;0.171xw,0.540xh&resize=2048:*' },
      { id: 33, name: 'S-Class', year: 2023, image: 'https://hips.hearstapps.com/hmg-prod/images/2023-mercedes-benz-s580e-phev-105-653a8ae3e3eb2.jpg?crop=0.670xw:0.564xh;0.295xw,0.372xh&resize=2048:*' },
      { id: 34, name: 'GLC', year: 2023, image: 'https://cdn.motor1.com/images/mgl/2NAmJx/s3/mercedes-amg-glc63-s-e-performance-european-model.jpg' },
      { id: 35, name: 'GLE', year: 2023, image: 'https://s3-us-west-2.amazonaws.com/my-car-mexico/modelos/799813e4/GLE%20Coupe%20AMG%202020%201.2.webp' },
      { id: 36, name: 'G-Class', year: 2023, image: 'https://acnews.blob.core.windows.net/imgnews/medium/NAZ_a75ec977dd1d465c8952f3af88e3e9a5.webp' }
    ]
  },
  {
    brand: 'Nissan',
    models: [
      { id: 41, name: 'Sentra', year: 2023, image: 'https://cdn-ds.com/blogs-media/sites/592/2023/07/05113309/2023-Nissan-Sentra-in-Two-tone-Monarch-Orange-Metallic-Super-Black-at-night-near-building_o.jpg' },
      { id: 42, name: 'Altima', year: 2023, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThjSpDnDVzckSfRd8Z-Hrjwp1Zp85YlKinsA&s' },
      { id: 43, name: 'Rogue', year: 2023, image: 'https://cdn.motor1.com/images/mgl/BXXoKm/s1/2023-nissan-rogue-midnight-front-quarter.webp' },
      { id: 44, name: 'Pathfinder', year: 2023, image: 'https://oem.com.mx/elsoldemexico/img/15893999/1669096751/BASE_LANDSCAPE/1200/2022%20Nissan%20Pathfinder%20-%20image%2001.jpg' },
      { id: 45, name: 'Frontier', year: 2023, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREVYmlh7lXJa-v-D0SgGJWvlFRg0UIFRu89g&s' },
      { id: 46, name: 'GT-R', year: 2023, image: 'https://es.nissanusa.com/content/dam/Nissan/us/vehicles/gtr/2024/site-simp/nismo/accordion/2024-nissan-gt-r-nismo-driving-down-racetrack.jpg' }
    ]
  }
];

function Catalog() {
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredCars = selectedBrand === 'all'
    ? carData.flatMap(brand => 
        brand.models
          .filter(car => car.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .slice(0, 2)
      )
    : carData.flatMap(brand => 
        brand.models.filter(car => 
          brand.brand.toLowerCase() === selectedBrand &&
          car.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

// In your Catalog component, update the handleCardClick function:
const handleCardClick = (car) => {
  const brandData = carData.find(b => b.models.some(m => m.id === car.id));
  navigate(`/car/${brandData.brand.toLowerCase()}/${car.id}`, { 
    state: { car }
  });
};
  return (
    <section className="catalog" id="catalog">
      <div className="content">
        <div className="title-wrapper-catalog">
          <p>Encuentra lo que deseas</p>
          <h3>Catálogo</h3>
        </div>

        <div className="filter-card">
          <select 
            className="brand-select"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="all">Todas las marcas</option>
            <option value="ford">Ford</option>
            <option value="toyota">Toyota</option>
            <option value="honda">Honda</option>
            <option value="mercedes">Mercedes</option>
            <option value="nissan">Nissan</option>
          </select>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Elige tu modelo favorito"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button">Buscar</button>
        </div>

        <div className="car-grid">
          {filteredCars.map(car => (
            <div 
              key={car.id} 
              className="car-card"
              onClick={() => handleCardClick(car)}
              style={{ cursor: 'pointer' }}
            >
              <img src={car.image} alt={car.name} />
              <h4>{car.name}</h4>
              <p>{car.year}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Catalog;