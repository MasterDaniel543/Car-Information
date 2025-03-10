import React, { useState } from 'react';
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
    const [showEmailVerification, setShowEmailVerification] = useState(false);
    const [emailVerificationCode, setEmailVerificationCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const navigate = useNavigate();

    const toggleForm = () => {
        setShowLogin(!showLogin);
        setError('');
        setSuccessMessage('');
        setUsuario('');
        setContraseña('');
        setShowEmailVerification(false);
        setEmailVerificationCode('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);
    
        try {
            let response;
            if (showLogin) {
                response = await axios.post('http://localhost:3001/login', {
                    usuario,
                    contraseña
                });

                if (response.data.token) {
                    try {
                        const twoFactorResponse = await axios.get('http://localhost:3001/get-user-email', {
                            params: { usuario },
                            headers: { 'Authorization': `Bearer ${response.data.token}` }
                        });

                        if (twoFactorResponse.data.email) {
                            localStorage.setItem('tempToken', response.data.token);
                            localStorage.setItem('tempUsuario', response.data.usuario);
                            
                            const code = Math.floor(100000 + Math.random() * 900000).toString();
                            setGeneratedCode(code);
                            
                            await axios.post('http://localhost:3001/send-verification-email', {
                                email: twoFactorResponse.data.email,
                                code: code
                            }, {
                                headers: { 'Authorization': `Bearer ${response.data.token}` }
                            });

                            setShowEmailVerification(true);
                            setSuccessMessage('Por favor, verifica tu correo electrónico');
                        } else {
                            setSuccessMessage('Inicio de sesión exitoso');
                            localStorage.setItem('token', response.data.token);
                            localStorage.setItem('usuario', response.data.usuario);
                            setTimeout(() => navigate('/'), 2000);
                        }
                    } catch (err) {
                        console.error('Error en verificación 2FA:', err);
                        setError('Error en la verificación de dos factores');
                    }
                } else {
                    setError('Credenciales inválidas');
                }
            } else {
                response = await axios.post('http://localhost:3001/registro', {
                    usuario,
                    contraseña
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
                if (err.response.status === 404) {
                    setError('Usuario no encontrado');
                } else if (err.response.status === 401) {
                    setError('Contraseña incorrecta');
                } else if (err.response.status === 409) {
                    setError('El usuario ya existe');
                } else {
                    setError(err.response.data.message || 'Error en el servidor');
                }
            } else {
                setError('Error de conexión');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerificationSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (emailVerificationCode === generatedCode) {
            setSuccessMessage('Verificación exitosa');
            localStorage.setItem('token', localStorage.getItem('tempToken'));
            localStorage.setItem('usuario', localStorage.getItem('tempUsuario'));
            localStorage.removeItem('tempToken');
            localStorage.removeItem('tempUsuario');
            setTimeout(() => navigate('/'), 2000);
        } else {
            setError('Código de verificación inválido');
        }
        setLoading(false);
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
                    <h2>
                        {showEmailVerification 
                            ? 'Verificación de Email' 
                            : (showLogin ? 'Log In' : 'Sign Up')}
                    </h2>
                    {error && <p className="error-message">{error}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    
                    {showEmailVerification ? (
                        <form onSubmit={handleVerificationSubmit}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Ingrese el código"
                                    value={emailVerificationCode}
                                    onChange={(e) => setEmailVerificationCode(e.target.value)}
                                    maxLength="6"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="form-button"
                                disabled={loading}
                            >
                                {loading ? 'Verificando...' : 'Verificar Código'}
                            </button>
                        </form>
                    ) : (
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
                            <button 
                                type="submit" 
                                className="form-button"
                                disabled={loading}
                            >
                                {loading ? 'Procesando...' : (showLogin ? 'Login' : 'Sign Up')}
                            </button>
                        </form>
                    )}
                </div>
                &nbsp;
                <button 
                    className="form-button" 
                    onClick={() => navigate('/')}
                    disabled={loading}
                >
                    Regresar al Inicio
                </button>
                &nbsp;
                <button 
                    className="form-button1" 
                    onClick={() => navigate('/recuperar-password')}
                    disabled={loading}
                >
                    Recuperar Contraseña
                </button>
            </div>
        </div>
    );
}

export default LoginForm;