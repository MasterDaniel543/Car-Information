import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserSettings.css';

function UserSettings() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('personal');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [personalInfo, setPersonalInfo] = useState({
        usuario: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const storedUser = localStorage.getItem('usuario');
            const storedToken = localStorage.getItem('token');
            
            console.log('Stored user:', storedUser); // Debug log
            console.log('Stored token:', storedToken); // Debug log

            if (!storedUser || !storedToken) {
                setError('No se encontró información de usuario');
                return;
            }

            const response = await axios.get('http://localhost:3001/user-info', {
                headers: {
                    'Authorization': `Bearer ${storedToken}`
                },
                params: {
                    usuario: storedUser
                }
            });

            console.log('Response data:', response.data); // Debug log

            if (response.data && response.data.usuario) {
                setPersonalInfo({ usuario: response.data.usuario });
            } else {
                setError('No se encontró información del usuario en la respuesta');
            }
        } catch (err) {
            console.error('Error details:', err.response || err); // Debug log
            setError('Error al cargar la información del usuario');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        setLoading(true);
        try {
            await axios.post('http://localhost:3001/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
                usuario: localStorage.getItem('usuario')
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setSuccess('Contraseña actualizada exitosamente');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            setError('Error al actualizar la contraseña');
        }
        setLoading(false);
    };

    const handlePersonalInfoUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:3001/update-personal-info', 
                { usuario: personalInfo.usuario },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setSuccess('Información personal actualizada exitosamente');
        } catch (err) {
            setError('Error al actualizar la información personal');
        }
        setLoading(false);
    };

    return (
        <div className="settings-container">
            <button 
                className="back-button"
                onClick={() => navigate(-1)}
            >
                ← Regresar
            </button>
            
            <h2 className="settings-title">Configuración de la Cuenta</h2>
            
            <div className="settings-tabs">
                <button 
                    className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('personal')}
                >
                    Información Personal
                </button>
                <button 
                    className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
                    onClick={() => setActiveTab('password')}
                >
                    Cambiar Contraseña
                </button>
                <button 
                    className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
                    onClick={() => setActiveTab('security')}
                >
                    Seguridad
                </button>
            </div>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <div className="settings-content">
                {activeTab === 'personal' && (
                    <form onSubmit={handlePersonalInfoUpdate} className="settings-form">
                        <h3>Información Personal</h3>
                        <div className="form-group">
                            <label>Usuario</label>
                            <input
                                type="text"
                                value={personalInfo.usuario}
                                onChange={(e) => setPersonalInfo({
                                    ...personalInfo,
                                    usuario: e.target.value
                                })}
                                disabled={loading}
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="update-button"
                        >
                            {loading ? 'Actualizando...' : 'Actualizar Información'}
                        </button>
                    </form>
                )}

                {activeTab === 'password' && (
                    <form onSubmit={handlePasswordChange} className="settings-form">
                        <h3>Cambiar Contraseña</h3>
                        <div className="form-group">
                            <label>Contraseña Actual</label>
                            <input
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({
                                    ...passwordData,
                                    currentPassword: e.target.value
                                })}
                                disabled={loading}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Nueva Contraseña</label>
                            <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({
                                    ...passwordData,
                                    newPassword: e.target.value
                                })}
                                disabled={loading}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirmar Nueva Contraseña</label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({
                                    ...passwordData,
                                    confirmPassword: e.target.value
                                })}
                                disabled={loading}
                                required
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="update-button"
                        >
                            {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
                        </button>
                    </form>
                )}

                {activeTab === 'security' && (
                    <div className="security-section">
                        <h3>Configuración de Seguridad</h3>
                        <div className="security-option">
                            <h4>Autenticación de Dos Factores</h4>
                            <p>
                                La autenticación de dos factores agrega una capa adicional de seguridad a tu cuenta.
                                Cuando está activada, necesitarás ingresar un código además de tu contraseña.
                            </p>
                            <button 
                                onClick={() => navigate('/two-factor')}
                                className="security-button"
                            >
                                Configurar Autenticación de Dos Factores
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserSettings;