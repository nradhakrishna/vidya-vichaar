import React, { useState } from 'react';

function QuestionForm({ onQuestionSubmit }) {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) {
            alert('Question cannot be empty!');
            return;
        }
        onQuestionSubmit(text);
        setText('');
    };

    return (
        <form onSubmit={handleSubmit} className="question-form">
            <h2>Ask a Question</h2>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your question here..."
            />
            <button type="submit">Post Question</button>
        </form>
    );
}

export default QuestionForm;