import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Opinions.css';
import { jwtDecode } from 'jwt-decode';

function Opinions() {
    const [opinions, setOpinions] = useState([]);
    const [newOpinion, setNewOpinion] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    //Fucnion para expandir opiniones
    const [expandedOpinions, setExpandedOpinions] = useState({});
    const navigate = useNavigate();
    const fileInputRef = React.useRef(null);

    useEffect(() => {
        fetchOpinions();
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setCurrentUser(decoded.usuario);
            } catch (error) {
                localStorage.removeItem('token');
                setCurrentUser('');
            }
        }
    }, []);

    const fetchOpinions = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/opinions');
            setOpinions(response.data);
        } catch (error) {
            console.error('Error fetching opinions:', error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    const clearForm = () => {
        setNewOpinion('');
        setImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
//Funcion para expandir opiniones
    const toggleOpinion = (id) => {
        setExpandedOpinions(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        if (!token) {
            navigate('/login');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('opinion', newOpinion);
            formData.append('token', token);
            if (image) {
                formData.append('image', image);
            }

            await axios.post('http://localhost:3001/api/opinions', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            clearForm();
            fetchOpinions();
        } catch (error) {
            console.error('Error submitting opinion:', error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                setCurrentUser('');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredOpinions = opinions.filter(opinion =>
        opinion.opinion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opinion.usuario.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="opinions-container">
            <div className="header-section">
                <button className="back-button" onClick={() => navigate(-1)}>
                    ← Regresar
                </button>
                <h2>Opiniones de Usuarios</h2>
            </div>
            
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Buscar por usuario o contenido..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {currentUser ? (
                <form onSubmit={handleSubmit} className="opinion-form">
                    <div className="form-group">
                        <label>Usuario:</label>
                        <input
                            type="text"
                            value={currentUser}
                            disabled
                            className="user-input"
                        />
                    </div>
                    <textarea
                        value={newOpinion}
                        onChange={(e) => setNewOpinion(e.target.value)}
                        placeholder="Escribe tu opinión..."
                        required
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="file-input"
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Publicando...' : 'Publicar Opinión'}
                    </button>
                </form>
            ) : (
                <div className="login-prompt">
                    <p>Para publicar una opinión, necesitas iniciar sesión</p>
                    <button onClick={() => navigate('/Registro')}>Iniciar Sesión</button>
                </div>
            )}

            <div className="opinions-content">
                {filteredOpinions.map((opinion, index) => (
                    <div key={index} className="opinion-card">
                        <div className="opinion-header">
                            <h4>{opinion.usuario}</h4>
                            <span className="opinion-date">
                                {new Date(opinion.created_at).toLocaleDateString()}
                            </span>
                        </div>

                        <p className={expandedOpinions[index] ? 'expanded' : ''}>
                            {opinion.opinion.length > 150 && !expandedOpinions[index]
                                ? `${opinion.opinion.substring(0, 150)}...`
                                : opinion.opinion}
                        </p>
                        {opinion.opinion.length > 150 && (
                            <button 
                                className="read-more-btn"
                                onClick={() => toggleOpinion(index)}
                            >
                                {expandedOpinions[index] ? 'Leer menos' : 'Leer más'}
                            </button>
                        )}
                        {opinion.image_url && (
                            <img 
                                src={opinion.image_url} 
                                alt="Opinion" 
                                style={{ maxWidth: '100%', height: 'auto' }}
                            />
                        )}
                    </div>
                ))}
                {filteredOpinions.length === 0 && (
                    <div className="no-results">
                        <p>No se encontraron opiniones</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Opinions;