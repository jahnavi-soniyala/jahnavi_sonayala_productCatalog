import React, { useState } from 'react';
import { login } from '../services/api';

function Login({ setAuth }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await login({ email, password });
            localStorage.setItem('token', data.token);
            setAuth(true);
        } catch {
            alert("Login failed");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            <button type="submit">Login</button>
        </form>
    );
}

export default Login;
