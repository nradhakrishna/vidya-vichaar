import React, { useState } from 'react';
import axios from 'axios';

function CreateClass({ onClassCreated }) {
    const [className, setClassName] = useState('');
    const [subject, setSubject] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (!className.trim() || !subject.trim()) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('auth-token');
            const response = await axios.post('http://localhost:5000/api/classes/create', {
                className: className.trim(),
                subject: subject.trim()
            }, {
                headers: { 'x-auth-token': token }
            });

            setSuccess(`Class created successfully! Your class code is: ${response.data.class.classCode}`);
            setClassName('');
            setSubject('');
            
            if (onClassCreated) {
                onClassCreated(response.data.class);
            }
        } catch (err) {
            console.error('Create class error:', err);
            if (err.response && err.response.data && err.response.data.msg) {
                setError(err.response.data.msg);
            } else {
                setError("Failed to create class. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="create-class-form">
            <h3>Create New Class</h3>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Class Name (e.g., CS101)"
                    value={className}
                    onChange={e => setClassName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Subject (e.g., Data Structures)"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    required
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Class'}
                </button>
            </form>
            
            <div className="info-box">
                <p><strong>Note:</strong> A unique 6-character code will be generated for your class. Share this code with your students so they can join.</p>
            </div>
        </div>
    );
}

export default CreateClass;
