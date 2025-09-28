import React, { useState } from 'react';
import axios from 'axios';

function JoinClass({ onClassJoined }) {
    const [classCode, setClassCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!classCode.trim()) {
            setError('Please enter a class code');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('auth-token');
            const response = await axios.post('http://localhost:5000/api/classes/join', 
                { classCode: classCode.trim().toUpperCase() },
                { headers: { 'x-auth-token': token } }
            );

            setSuccess('Successfully joined the class!');
            setTimeout(() => {
                onClassJoined();
            }, 1500);

        } catch (err) {
            if (err.response?.data?.msg) {
                setError(err.response.data.msg);
            } else {
                setError('Failed to join class. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="join-class-form">
            <h3>Join a Class</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter 6-character class code"
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                    maxLength="6"
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Joining...' : 'Join Class'}
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
        </div>
    );
}

export default JoinClass;