const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://back-car-4ibg.onrender.com'
  : 'http://192.168.100.17:3001';

export default API_URL;