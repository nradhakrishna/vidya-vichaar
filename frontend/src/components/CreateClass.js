import React, { useState } from 'react';
import axios from 'axios';

function CreateClass({ onClassCreated }) {
    const [className, setClassName] = useState('');
    const [subject, setSubject] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!className.trim() || !subject.trim()) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('auth-token');
            const response = await axios.post('http://localhost:5000/api/classes/create', 
                { 
                    className: className.trim(), 
                    subject: subject.trim() 
                },
                { headers: { 'x-auth-token': token } }
            );

            setSuccess('Class created successfully!');
            setClassName('');
            setSubject('');
            
            setTimeout(() => {
                onClassCreated();
            }, 1500);

        } catch (err) {
            if (err.response?.data?.msg) {
                setError(err.response.data.msg);
            } else {
                setError('Failed to create class. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-class-form">
            <h3>Create a New Class</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Class Name (e.g., Math 101)"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    disabled={loading}
                    required
                />
                <input
                    type="text"
                    placeholder="Subject (e.g., Mathematics)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={loading}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Class'}
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
        </div>
    );
}

export default CreateClass;