import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TwoFactorAuth.css';

function TwoFactorAuth() {
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [showCodeForm, setShowCodeForm] = useState(false);
    const [email, setEmail] = useState('');
    const [currentEmail, setCurrentEmail] = useState('');
    const [hasEmail, setHasEmail] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkCurrentEmail();
    }, []);

    const checkCurrentEmail = async () => {
        try {
            const response = await axios.get('http://localhost:3001/get-user-email', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                params: {
                    usuario: localStorage.getItem('usuario')
                }
            });
            if (response.data.email) {
                setCurrentEmail(response.data.email);
                setHasEmail(true);
            }
        } catch (err) {
            console.error('Error checking email:', err);
        }
    };

    const generateCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        const code = generateCode();
        setGeneratedCode(code);

        try {
            await axios.post('http://localhost:3001/send-verification-email', {
                email: email,
                code: code
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            setSuccess('Verification code sent to your email');
            setShowCodeForm(true);
        } catch (err) {
            console.error('Error details:', err);
            if (err.response) {
                setError(`Error: ${err.response.data.message || 'Error sending verification code'}`);
            } else {
                setError('Error connecting to server');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCodeVerification = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (verificationCode === generatedCode) {
            try {
                await axios.post('http://localhost:3001/update-user-email', {
                    email,
                    usuario: localStorage.getItem('usuario')
                }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setSuccess('Email verified and updated successfully');
                setTimeout(() => {
                    setShowEmailForm(false);
                    setShowCodeForm(false);
                    setEmail('');
                    setVerificationCode('');
                    checkCurrentEmail();
                }, 2000);
            } catch (err) {
                setError('Error updating email');
            }
        } else {
            setError('Invalid verification code');
        }
        setLoading(false);
    };

    const handleDeactivate = async () => {
        setLoading(true);
        try {
            await axios.post('http://localhost:3001/deactivate-2fa', {
                usuario: localStorage.getItem('usuario')
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setHasEmail(false);
            setCurrentEmail('');
            setShowEmail(false);
            setSuccess('Two-factor authentication deactivated successfully');
            setTimeout(() => {
                setSuccess('');
            }, 2000);
        } catch (err) {
            setError('Error deactivating two-factor authentication');
        }
        setLoading(false);
    };

    return (
        <div className="two-factor-container">
             <button 
                className="back-button"
                onClick={() => navigate(-1)}
            >
                ← Regresar
            </button>
            {!showEmailForm ? (
                hasEmail ? (
                    <div className="email-status">
                        <h3>Autenticación de dos factores activa</h3>
                        <p className="email-info">Su cuenta está protegida con autenticación de dos factores.</p>
                        {!showEmail ? (
                            <button 
                                className="show-email-button"
                                onClick={() => setShowEmail(true)}
                            >
                                Mostrar Email
                            </button>
                        ) : (
                            <>
                                <p className="visible-email">Email: {currentEmail}</p>
                                <button 
                                    className="show-email-button"
                                    onClick={() => setShowEmail(false)}
                                >
                                    Hide Email
                                </button>
                            </>
                        )}
                        {error && <p className="error-message">{error}</p>}
                        {success && <p className="success-message">{success}</p>}
                        <button 
                            className="deactivate-button"
                            onClick={handleDeactivate}
                            disabled={loading}
                        >
                            {loading ? 'Deactivating...' : 'Desactivar la autenticación de dos factores'}
                        </button>
                        <p className="confirmation-message">
                            Nota: Después de la desactivación, se eliminará la verificación de correo electrónico y deberá configurarla nuevamente para reactivarla.
                        </p>
                    </div>
                ) : (
                    <div className="email-status">
                        <h3>Mejore la seguridad de su cuenta</h3>
                        <p className="email-info">
                            Activa la autenticación de dos factores para agregar una capa adicional de seguridad.
                            Necesitarás verificar tu correo electrónico para iniciar sesión.
                        </p>
                        <button 
                            className="activate-button"
                            onClick={() => setShowEmailForm(true)}
                        >
                            Activar la autenticación de dos factores
                        </button>
                    </div>
                )
            ) : !showCodeForm ? (
                <form onSubmit={handleEmailSubmit} className="email-form">
                    <h3>Enter your email</h3>
                    <p className="email-info">
                        This email will be used for verification when you sign in.
                    </p>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        disabled={loading}
                    />
                    <div className="button-group">
                        <button 
                            type="submit" 
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Code'}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setShowEmailForm(false)}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleCodeVerification} className="email-form">
                    <h3>Enter Verification Code</h3>
                    <p className="email-info">
                        Please enter the 6-digit code sent to your email.
                    </p>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        maxLength="6"
                        required
                        disabled={loading}
                    />
                    <div className="button-group">
                        <button 
                            type="submit" 
                            disabled={loading}
                        >
                            {loading ? 'Verifying...' : 'Verify Code'}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => {
                                setShowCodeForm(false);
                                setVerificationCode('');
                            }}
                            disabled={loading}
                        >
                            Back
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default TwoFactorAuth;