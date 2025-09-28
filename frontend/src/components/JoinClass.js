import React, { useState } from 'react';
import axios from 'axios';

function JoinClass({ onClassJoined }) {
    const [classCode, setClassCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (!classCode.trim()) {
            setError('Please enter a class code');
            setIsLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('auth-token');
            const response = await axios.post('http://localhost:5000/api/classes/join', {
                classCode: classCode.trim()
            }, {
                headers: { 'x-auth-token': token }
            });

            setSuccess(`Successfully joined ${response.data.class.className} - ${response.data.class.subject}!`);
            setClassCode('');
            
            if (onClassJoined) {
                onClassJoined(response.data.class);
            }
        } catch (err) {
            console.error('Join class error:', err);
            if (err.response && err.response.data && err.response.data.msg) {
                setError(err.response.data.msg);
            } else {
                setError("Failed to join class. Please check the code and try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="join-class-form">
            <h3>Join a Class</h3>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter Class Code (6 characters)"
                    value={classCode}
                    onChange={e => setClassCode(e.target.value.toUpperCase())}
                    maxLength="6"
                    required
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Joining...' : 'Join Class'}
                </button>
            </form>
            
            <div className="info-box">
                <p><strong>Need a class code?</strong> Ask your teacher for the 6-character class code to join their class.</p>
                <p><strong>Already in a class?</strong> You can only be in one class at a time. You'll need to leave your current class first if you want to join a different one.</p>
            </div>
        </div>
    );
}

export default JoinClass;
