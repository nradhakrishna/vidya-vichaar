import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login({ setToken, setUser }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Basic validation
        if (!username.trim() || !password.trim()) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const loginRes = await axios.post('http://localhost:5000/api/users/login', { 
                username: username.trim(), 
                password 
            });
            const { token, user } = loginRes.data;
            
            if (!token || !user) {
                setError('Invalid response from server');
                return;
            }
            
            setToken(token);
            setUser(user);

            localStorage.setItem('auth-token', token);
            localStorage.setItem('user', JSON.stringify(user));

            if (user.role === 'teacher') {
                navigate('/teacher');
            } else if (user.role === 'ta') {
                navigate('/ta');
            } else {
                navigate('/student');
            }
        } catch (err) {
            console.error('Login error:', err);
            if (err.response && err.response.data && err.response.data.msg) {
                setError(err.response.data.msg);
            } else if (err.code === 'ECONNREFUSED') {
                setError('Cannot connect to server. Please make sure the backend is running.');
            } else {
                setError("Login failed. Please check your credentials and try again.");
            }
        }
    };

    return (
        <div className="auth-form">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" required onChange={e => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" required onChange={e => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
        </div>
    );
}
export default Login;