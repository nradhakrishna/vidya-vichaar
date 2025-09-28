import React, { useState } from 'react';

function QuestionForm({ onQuestionSubmit, existingQuestions = [] }) {
    const [text, setText] = useState('');
    const [duplicateWarning, setDuplicateWarning] = useState('');

    const checkForDuplicate = (questionText) => {
        const trimmedText = questionText.trim().toLowerCase();
        const duplicate = existingQuestions.find(q => 
            q.text.trim().toLowerCase() === trimmedText
        );
        return duplicate;
    };

    const handleTextChange = (e) => {
        const newText = e.target.value;
        setText(newText);
        
        if (newText.trim()) {
            const duplicate = checkForDuplicate(newText);
            if (duplicate) {
                setDuplicateWarning('You have already asked this question. Please check the existing questions or ask a different question.');
            } else {
                setDuplicateWarning('');
            }
        } else {
            setDuplicateWarning('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) {
            alert('Question cannot be empty!');
            return;
        }
        
        if (duplicateWarning) {
            alert(duplicateWarning);
            return;
        }
        
        onQuestionSubmit(text);
        setText('');
        setDuplicateWarning('');
    };

    return (
        <form onSubmit={handleSubmit} className="question-form">
            <h2>Ask a Question</h2>
            <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Type your question here..."
            />
            {duplicateWarning && (
                <div className="duplicate-warning" style={{ 
                    color: '#ff6b6b', 
                    fontSize: '14px', 
                    marginTop: '5px',
                    fontStyle: 'italic'
                }}>
                    {duplicateWarning}
                </div>
            )}
            <button type="submit" disabled={!!duplicateWarning}>Post Question</button>
        </form>
    );
}

export default QuestionForm;