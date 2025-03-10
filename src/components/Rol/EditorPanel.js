import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EditorPanel.css';

function EditorPanel() {
    const navigate = useNavigate();
    const [opinions, setOpinions] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchOpinions();
    }, []);

    const fetchOpinions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3001/api/opinions', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setOpinions(response.data);
        } catch (error) {
            setError('Error al cargar opiniones');
        }
    };

    const handleDeleteOpinion = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3001/api/opinions/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSuccess('Opinión eliminada exitosamente');
            fetchOpinions();
        } catch (error) {
            setError('Error al eliminar la opinión');
        }
    };

    return (
        <div className="editor-container">
            <button className="back-button" onClick={() => navigate('/')}>
                ← Volver
            </button>
            <h2>Panel de Editor</h2>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="opinions-table">
                <table>
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Opinión</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {opinions.map(opinion => (
                            <tr key={opinion.id}>
                                <td>{opinion.usuario}</td>
                                <td>{opinion.opinion}</td>
                                <td>{new Date(opinion.created_at).toLocaleDateString()}</td>
                                <td>
                                    <button 
                                        className="delete-button"
                                        onClick={() => handleDeleteOpinion(opinion.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EditorPanel;