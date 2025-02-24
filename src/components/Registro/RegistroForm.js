import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Registro.css';

function LoginForm() {
    const [showLogin, setShowLogin] = useState(true);
    const [usuario, setUsuario] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [captchaAnswer, setCaptchaAnswer] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const toggleForm = () => {
        setShowLogin(!showLogin);
        setError('');
        setSuccessMessage('');
        setCaptchaAnswer('');
        setUsuario('');
        setContraseña('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (captchaAnswer !== '15') {
            setError('Por favor, verifica tu respuesta de seguridad');
            return;
        }

        try {
            let response;
            if (showLogin) {
                response = await axios.post('http://localhost:3001/login', {
                    usuario,
                    contraseña,
                });
                setSuccessMessage(response.data.message);
                localStorage.setItem('token', response.data.token);
                setTimeout(() => navigate('/'), 2000);
            } else {
                response = await axios.post('http://localhost:3001/registro', {
                    usuario,
                    contraseña,
                });
                setSuccessMessage(response.data);
                setTimeout(() => navigate('/Registro'), 2000);
            }
        } catch (err) {
            if (err.response) {
                const errorMessage = err.response.data.sqlMessage || err.response.data.message || 'Error desconocido';
                setError(errorMessage);
            } else {
                setError('Ocurrió un error inesperado. Inténtalo de nuevo.');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="form-toggle-labels">
                <span className={showLogin ? 'active' : ''} onClick={() => setShowLogin(true)}>
                    Log In
                </span>
                <span className={!showLogin ? 'active' : ''} onClick={() => setShowLogin(false)}>
                    Sign Up
                </span>
            </div>
            <div className="form-toggle">
                <label className="switch">
                    <input type="checkbox" checked={!showLogin} onChange={toggleForm} />
                    <span className="slider round"></span>
                </label>
            </div>
            <div className="container">
                <div className="form-card">
                    <h2>{showLogin ? 'Log In' : 'Sign Up'}</h2>
                    {error && <p className="error-message">{error}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Usuario"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={contraseña}
                                onChange={(e) => setContraseña(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group captcha">
                            <label>Verificación: ¿Cuánto es 5 + 10?</label>
                            <input
                                type="text"
                                value={captchaAnswer}
                                onChange={(e) => setCaptchaAnswer(e.target.value)}
                                placeholder="Escribe tu respuesta"
                                required
                            />
                        </div>
                        <button type="submit" className="form-button">
                            {showLogin ? 'Login' : 'Sign Up'}
                        </button>
                    </form>
                </div>
                &nbsp;
                <button className="form-button" onClick={() => navigate('/')}>
                    Regresar al Inicio
                </button>
            </div>
        </div>
    );
}

export default LoginForm;