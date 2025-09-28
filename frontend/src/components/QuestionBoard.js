import React from 'react';
import Question from './Question';

function QuestionBoard({ questions, onStatusChange, onDelete }) {
    if (questions.length === 0) {
        return <p>No questions to display.</p>;
    }

    return (
        <div className="question-board">
            {questions.map(q => (
                <Question
                    key={q._id}
                    question={q}
                    onStatusChange={onStatusChange}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

export default QuestionBoard;