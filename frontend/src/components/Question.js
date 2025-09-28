import React from 'react';

function Question({ question, onStatusChange, onDelete }) {
    const { _id, text, status, createdAt, author } = question;

    const handleStatusChange = (newStatus) => {
        onStatusChange(_id, newStatus);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'answered': return '✅';
            case 'important': return '⭐';
            case 'unanswered': return '❓';
            default: return '❓';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'answered': return '#4CAF50';
            case 'important': return '#FF9800';
            case 'unanswered': return '#2196F3';
            default: return '#2196F3';
        }
    };

    const formatDate = (date) => {
        const now = new Date();
        const questionDate = new Date(date);
        const diffInMs = now - questionDate;
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        
        // For older dates, show the actual date
        return questionDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: questionDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    return (
        <div className={`question-card ${status}`}>
            <div className="question-header">
                <div className="status-badge" style={{ backgroundColor: getStatusColor(status) }}>
                    <span className="status-icon">{getStatusIcon(status)}</span>
                    <span className="status-text">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                </div>
                <div className="question-time">{formatDate(createdAt)}</div>
            </div>
            
            <div className="question-content">
                <p className="question-text">{text}</p>
                {author && author !== 'Anonymous' && (
                    <div className="question-author">
                        <span className="author-label">Asked by:</span>
                        <span className="author-name">{author}</span>
                    </div>
                )}
            </div>
            
            <div className="question-actions">
                <button 
                    className={`action-btn ${status === 'answered' ? 'active' : ''}`}
                    onClick={() => handleStatusChange('answered')}
                >
                    <span>✅</span> Answered
                </button>
                <button 
                    className={`action-btn ${status === 'important' ? 'active' : ''}`}
                    onClick={() => handleStatusChange('important')}
                >
                    <span>⭐</span> Important
                </button>
                <button 
                    className={`action-btn ${status === 'unanswered' ? 'active' : ''}`}
                    onClick={() => handleStatusChange('unanswered')}
                >
                    <span>❓</span> Unanswered
                </button>
                <button className="action-btn delete-btn" onClick={() => onDelete(_id)}>
                    <span>🗑️</span> Delete
                </button>
            </div>
        </div>
    );
}

export default Question;