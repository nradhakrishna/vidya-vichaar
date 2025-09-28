import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student'); // Default role
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);
        
        // Basic validation
        if (!username.trim() || !password.trim() || !role) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        if (username.trim().length < 3) {
            setError('Username must be at least 3 characters long');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/users/register', {
                username: username.trim(),
                password,
                role
            });
            
            if (response.status === 201) {
                setSuccess(`Account created successfully! Welcome ${username}! Redirecting to login...`);
                // Clear form
                setUsername('');
                setPassword('');
                setRole('student');
                
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            console.error('Registration error:', err);
            if (err.response && err.response.data && err.response.data.msg) {
                setError(err.response.data.msg);
            } else if (err.code === 'ECONNREFUSED') {
                setError('Cannot connect to server. Please make sure the backend is running.');
            } else {
                setError("Registration failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-form">
            <h2>Sign Up</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    disabled={isLoading}
                />
                <input
                    type="password"
                    placeholder="Password (min 6 characters)"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={isLoading}
                />
                <div className="role-selector">
                    <label>
                        <input
                            type="radio"
                            value="student"
                            checked={role === 'student'}
                            onChange={e => setRole(e.target.value)}
                            disabled={isLoading}
                        />
                        Student
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="teacher"
                            checked={role === 'teacher'}
                            onChange={e => setRole(e.target.value)}
                            disabled={isLoading}
                        />
                        Teacher
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="ta"
                            checked={role === 'ta'}
                            onChange={e => setRole(e.target.value)}
                            disabled={isLoading}
                        />
                        Teaching Assistant
                    </label>
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>
            <p>
                Already have an account? <Link to="/login">Log In</Link>
            </p>
        </div>
    );
}

export default Register;