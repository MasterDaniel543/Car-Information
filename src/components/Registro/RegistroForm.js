import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Registro.css';

function LoginForm() {
    const [showLogin, setShowLogin] = useState(true);
    const [usuario, setUsuario] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadRecaptchaScript = () => {
            const existingScript = document.querySelector('script[src*="recaptcha"]');
            if (existingScript) {
                existingScript.remove();
            }

            const script = document.createElement('script');
            script.src = 'https://www.google.com/recaptcha/api.js';
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);

            return () => {
                const scriptToRemove = document.querySelector('script[src*="recaptcha"]');
                if (scriptToRemove) {
                    scriptToRemove.remove();
                }
            };
        };

        loadRecaptchaScript();
    }, []);

    const toggleForm = () => {
        setShowLogin(!showLogin);
        setError('');
        setSuccessMessage('');
        setUsuario('');
        setContraseña('');
        if (window.grecaptcha) {
            window.grecaptcha.reset();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        try {
            const captchaToken = window.grecaptcha.getResponse();
            if (!captchaToken) {
                throw new Error('Por favor, complete el captcha');
            }

            let response;
            if (showLogin) {
                response = await axios.post('http://localhost:3001/login', {
                    usuario,
                    contraseña,
                    captchaToken
                });
                setSuccessMessage('Inicio de sesión exitoso');
                localStorage.setItem('token', response.data.token);
                setTimeout(() => navigate('/'), 2000);
            } else {
                response = await axios.post('http://localhost:3001/registro', {
                    usuario,
                    contraseña,
                    captchaToken
                });
                setSuccessMessage('Registro exitoso');
                setTimeout(() => {
                    setShowLogin(true);
                    setUsuario('');
                    setContraseña('');
                }, 2000);
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || 'Error en el servidor');
            } else {
                setError(err.message || 'Error de conexión');
            }
        } finally {
            setLoading(false);
            window.grecaptcha.reset();
        }
    };

    return (
        <div className="login-container">
            <div className="form-toggle-labels">
                <span 
                    className={showLogin ? 'active' : ''} 
                    onClick={() => !loading && setShowLogin(true)}
                >
                    Log In
                </span>
                <span 
                    className={!showLogin ? 'active' : ''} 
                    onClick={() => !loading && setShowLogin(false)}
                >
                    Sign Up
                </span>
            </div>
            <div className="form-toggle">
                <label className="switch">
                    <input 
                        type="checkbox" 
                        checked={!showLogin} 
                        onChange={toggleForm}
                        disabled={loading}
                    />
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
                                disabled={loading}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={contraseña}
                                onChange={(e) => setContraseña(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>
                        <div className="recaptcha-container">
                            <div 
                                className="g-recaptcha" 
                                data-sitekey="6LfyiuIqAAAAAIB6G8R_2OS6gOn55WJJv2byzNs3"
                            ></div>
                        </div>
                        <button 
                            type="submit" 
                            className="form-button"
                            disabled={loading}
                        >
                            {loading ? 'Procesando...' : (showLogin ? 'Login' : 'Sign Up')}
                        </button>
                    </form>
                </div>
                &nbsp;
                <button 
                    className="form-button" 
                    onClick={() => navigate('/')}
                    disabled={loading}
                >
                    Regresar al Inicio
                </button>
            </div>
        </div>
    );
}

export default LoginForm;