import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TAManagement({ classInfo, onTAsUpdated }) {
    const [taUsername, setTaUsername] = useState('');
    const [teachingAssistants, setTeachingAssistants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (classInfo && classInfo.teachingAssistants) {
            setTeachingAssistants(classInfo.teachingAssistants);
        }
    }, [classInfo]);

    const handleAssignTA = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!taUsername.trim()) {
            setError('Please enter a TA username');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('auth-token');
            const response = await axios.post('http://localhost:5000/api/classes/assign-ta', 
                { username: taUsername.trim() },
                { headers: { 'x-auth-token': token } }
            );

            setSuccess('TA assigned successfully!');
            setTaUsername('');
            
            // Update the TAs list
            if (response.data.teachingAssistants) {
                setTeachingAssistants(response.data.teachingAssistants);
                if (onTAsUpdated) {
                    onTAsUpdated();
                }
            }

        } catch (err) {
            if (err.response?.data?.msg) {
                setError(err.response.data.msg);
            } else {
                setError('Failed to assign TA. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveTA = async (taId) => {
        if (!window.confirm('Are you sure you want to remove this TA?')) {
            return;
        }

        try {
            const token = localStorage.getItem('auth-token');
            const response = await axios.delete(`http://localhost:5000/api/classes/remove-ta/${taId}`, {
                headers: { 'x-auth-token': token }
            });

            setSuccess('TA removed successfully!');
            
            // Update the TAs list
            if (response.data.teachingAssistants) {
                setTeachingAssistants(response.data.teachingAssistants);
                if (onTAsUpdated) {
                    onTAsUpdated();
                }
            }

        } catch (err) {
            if (err.response?.data?.msg) {
                setError(err.response.data.msg);
            } else {
                setError('Failed to remove TA. Please try again.');
            }
        }
    };

    if (!classInfo) {
        return null;
    }

    return (
        <div className="ta-management">
            <h3>Teaching Assistant Management</h3>
            
            {/* Assign TA Form */}
            <div className="assign-ta-form">
                <h4>Assign New TA</h4>
                <form onSubmit={handleAssignTA}>
                    <input
                        type="text"
                        placeholder="Enter TA username"
                        value={taUsername}
                        onChange={(e) => setTaUsername(e.target.value)}
                        disabled={loading}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Assigning...' : 'Assign TA'}
                    </button>
                </form>
            </div>

            {/* Current TAs List */}
            <div className="current-tas">
                <h4>Current Teaching Assistants ({teachingAssistants.length})</h4>
                {teachingAssistants.length === 0 ? (
                    <p className="no-tas">No TAs assigned yet.</p>
                ) : (
                    <div className="tas-list">
                        {teachingAssistants.map((ta) => (
                            <div key={ta._id} className="ta-item">
                                <span className="ta-username">{ta.username}</span>
                                <button 
                                    className="remove-ta-btn"
                                    onClick={() => handleRemoveTA(ta._id)}
                                    disabled={loading}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Messages */}
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
        </div>
    );
}

export default TAManagement;


