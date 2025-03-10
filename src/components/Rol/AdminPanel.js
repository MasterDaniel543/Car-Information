import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3001/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            setError('Error al cargar usuarios');
        }
    };

    const handleRoleChange = async (usuario, newRole) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3001/admin/update-user-role', 
                { usuario, newRole },
                { headers: { 'Authorization': `Bearer ${token}` }}
            );
            setSuccess(`Rol actualizado para ${usuario}`);
            fetchUsers();
        } catch (error) {
            setError('Error al actualizar rol');
        }
    };

    const handleDeleteUser = async (usuario) => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario ${usuario}?`)) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:3001/admin/delete-user/${usuario}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setSuccess(`Usuario ${usuario} eliminado exitosamente`);
                fetchUsers();
            } catch (error) {
                setError('Error al eliminar usuario');
            }
        }
    };

    return (
        <div className="admin-container">
            <button className="back-button" onClick={() => navigate('/')}>
                ← Volver
            </button>
            <h2>Panel de Administración</h2>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="users-table">
                <table>
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Rol Actual</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.usuario}>
                                <td>{user.usuario}</td>
                                <td>{user.rol}</td>
                                <td className="action-buttons">
                                    <select
                                        value={user.rol}
                                        onChange={(e) => handleRoleChange(user.usuario, e.target.value)}
                                    >
                                        <option value="usuario">Usuario</option>
                                        <option value="editor">Editor</option>
                                        <option value="administrador">Administrador</option>
                                    </select>
                                    <button 
                                        className="delete-button"
                                        onClick={() => handleDeleteUser(user.usuario)}
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

export default AdminPanel;