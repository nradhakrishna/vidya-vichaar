import React from 'react';

function Question({ question }) {
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
        </div>
    );
}

export default Question;