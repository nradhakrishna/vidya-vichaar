import React, { useState } from 'react';
import axios from 'axios';

function Question({ question, isTeacher = false, onQuestionUpdated }) {
    const [isUpdating, setIsUpdating] = useState(false);

    const getStatusColor = (status) => {
        switch (status) {
            case 'answered':
                return '#38a169';
            case 'important':
                return '#e53e3e';
            default:
                return '#718096';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'answered':
                return '✅';
            case 'important':
                return '⭐';
            default:
                return '❓';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleStatusChange = async (newStatus) => {
        if (!isTeacher) return;
        
        setIsUpdating(true);
        try {
            const token = localStorage.getItem('auth-token');
            await axios.patch(`http://localhost:5000/api/questions/update/${question._id}`, 
                { status: newStatus },
                { headers: { 'x-auth-token': token } }
            );
            
            if (onQuestionUpdated) {
                onQuestionUpdated();
            }
        } catch (err) {
            console.error('Failed to update question status:', err);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!isTeacher) return;
        
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                const token = localStorage.getItem('auth-token');
                await axios.delete(`http://localhost:5000/api/questions/${question._id}`, {
                    headers: { 'x-auth-token': token }
                });
                
                if (onQuestionUpdated) {
                    onQuestionUpdated();
                }
            } catch (err) {
                console.error('Failed to delete question:', err);
            }
        }
    };

    return (
        <div className="question-card">
            <div className="question-header">
                <div className="question-meta">
                    <span className="question-author">{question.author}</span>
                    <span className="question-date">{formatDate(question.createdAt)}</span>
                </div>
                <div 
                    className="question-status"
                    style={{ color: getStatusColor(question.status) }}
                >
                    {getStatusIcon(question.status)} {question.status}
                </div>
            </div>
            <div className="question-text">
                {question.text}
            </div>
            
            {isTeacher && (
                <div className="question-actions">
                    <div className="status-buttons">
                        <button 
                            className={`status-btn ${question.status === 'unanswered' ? 'active' : ''}`}
                            onClick={() => handleStatusChange('unanswered')}
                            disabled={isUpdating}
                        >
                            ❓ Unanswered
                        </button>
                        <button 
                            className={`status-btn ${question.status === 'answered' ? 'active' : ''}`}
                            onClick={() => handleStatusChange('answered')}
                            disabled={isUpdating}
                        >
                            ✅ Answered
                        </button>
                        <button 
                            className={`status-btn ${question.status === 'important' ? 'active' : ''}`}
                            onClick={() => handleStatusChange('important')}
                            disabled={isUpdating}
                        >
                            ⭐ Important
                        </button>
                    </div>
                    <button 
                        className="delete-btn"
                        onClick={handleDelete}
                        disabled={isUpdating}
                    >
                        🗑️ Delete
                    </button>
                </div>
            )}
        </div>
    );
}

export default Question;