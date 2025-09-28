import React, { useState } from 'react';
import axios from 'axios';

function QuestionForm({ onQuestionAdded }) {
    const [text, setText] = useState('');
    const [author, setAuthor] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!text.trim()) {
            setError('Please enter a question');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('auth-token');
            await axios.post('http://localhost:5000/api/questions/add', 
                { text: text.trim(), author: author.trim() || undefined },
                { headers: { 'x-auth-token': token } }
            );

            setText('');
            setAuthor('');
            onQuestionAdded();

        } catch (err) {
            if (err.response?.data?.msg) {
                setError(err.response.data.msg);
            } else {
                setError('Failed to post question. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="question-form">
            <h4>Ask a Question</h4>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Your name (optional)"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    disabled={loading}
                />
                <textarea
                    placeholder="What would you like to ask?"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows="3"
                    disabled={loading}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Posting...' : 'Post Question'}
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default QuestionForm;