import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RecuperarPassword.css';

function RecuperarPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [recoveryMethod, setRecoveryMethod] = useState('password');
    const [usuario, setUsuario] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [codigo, setCodigo] = useState('');
    const [nuevaContraseña, setNuevaContraseña] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const verificarCredenciales = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:3001/verificar-usuario', {
                usuario,
                contraseña
            });
            setContraseña('');
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Credenciales incorrectas');
        }
        setLoading(false);
    };

    const enviarCodigoEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:3001/enviar-codigo-email', {
                usuario,
                email
            });
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al enviar código');
        }
        setLoading(false);
    };

    const enviarCodigoSMS = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let formattedPhone = telefono;
            if (!telefono.startsWith('+')) {
                formattedPhone = '+52' + telefono.replace(/\D/g, '');
            }

            await axios.post('http://localhost:3001/enviar-codigo', {
                usuario,
                telefono: formattedPhone
            });
            setTelefono('');
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al enviar código');
        }
        setLoading(false);
    };

    const verificarCodigo = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:3001/verificar-codigo', {
                usuario,
                codigo,
                nuevaContraseña
            });
            setCodigo('');
            setNuevaContraseña('');
            alert('Contraseña actualizada exitosamente');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Código incorrecto');
        }
        setLoading(false);
    };

    return (
        <div className="recuperar-container">
            <h2>Recuperar Contraseña</h2>
            {error && <p className="error-message">{error}</p>}
            
            {step === 1 && (
                <>
                    <div className="recovery-options">
                        <button 
                            className={`option-button ${recoveryMethod === 'password' ? 'active' : ''}`}
                            onClick={() => setRecoveryMethod('password')}
                        >
                            Usar contraseña actual
                        </button>
                        <button 
                            className={`option-button ${recoveryMethod === 'email' ? 'active' : ''}`}
                            onClick={() => setRecoveryMethod('email')}
                        >
                            Recuperar por email
                        </button>
                        <button 
                            className={`option-button ${recoveryMethod === 'phone' ? 'active' : ''}`}
                            onClick={() => setRecoveryMethod('phone')}
                        >
                            Recuperar por SMS
                        </button>
                    </div>

                    {recoveryMethod === 'password' && (
                        <form onSubmit={verificarCredenciales}>
                            <input
                                type="text"
                                placeholder="Usuario"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Contraseña actual"
                                value={contraseña}
                                onChange={(e) => setContraseña(e.target.value)}
                                required
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? 'Verificando...' : 'Verificar'}
                            </button>
                        </form>
                    )}

                    {recoveryMethod === 'email' && (
                        <form onSubmit={enviarCodigoEmail}>
                            <input
                                type="text"
                                placeholder="Usuario"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? 'Enviando...' : 'Enviar código'}
                            </button>
                        </form>
                    )}

                    {recoveryMethod === 'phone' && (
                        <form onSubmit={enviarCodigoSMS}>
                            <input
                                type="text"
                                placeholder="Usuario"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                required
                            />
                            <input
                                type="tel"
                                placeholder="Número de teléfono (10 dígitos)"
                                value={telefono}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length <= 10) {
                                        setTelefono(value);
                                    }
                                }}
                                pattern="[0-9]{10}"
                                maxLength="10"
                                required
                            />
                            <small>Ingresa los 10 dígitos de tu número sin espacios ni guiones</small>
                            <button type="submit" disabled={loading || telefono.length !== 10}>
                                {loading ? 'Enviando...' : 'Enviar código'}
                            </button>
                        </form>
                    )}
                </>
            )}

            {step === 2 && (
                <form onSubmit={enviarCodigoSMS}>
                    <input
                        type="tel"
                        placeholder="Número de teléfono (10 dígitos)"
                        value={telefono}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 10) {
                                setTelefono(value);
                            }
                        }}
                        pattern="[0-9]{10}"
                        maxLength="10"
                        required
                    />
                    <small>Ingresa los 10 dígitos de tu número sin espacios ni guiones</small>
                    <button type="submit" disabled={loading || telefono.length !== 10}>
                        {loading ? 'Enviando...' : 'Enviar código'}
                    </button>
                </form>
            )}

            {step === 3 && (
                <form onSubmit={verificarCodigo}>
                    <input
                        type="text"
                        placeholder="Código de verificación"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Nueva contraseña"
                        value={nuevaContraseña}
                        onChange={(e) => setNuevaContraseña(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Verificando...' : 'Cambiar contraseña'}
                    </button>
                </form>
            )}

            <button className="back-button" onClick={() => navigate('/')}>
                Volver al inicio
            </button>
        </div>
    );
}

export default RecuperarPassword;