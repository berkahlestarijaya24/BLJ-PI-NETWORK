import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message
        try {
            const response = await axios.post('https://tesnet.berkahlestarijaya.com/api/login', {
                email,
                password,
            });
            localStorage.setItem('token', response.data.token); // Simpan token
            alert('Login berhasil');
            // Redirect atau update state untuk navigasi
        } catch (err) {
            setError('Login gagal. Pastikan email dan password benar.');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2>Login</h2>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="login-input"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="login-input"
                />
                {error && <p className="login-error">{error}</p>}
                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
    );
}

export default Login;
