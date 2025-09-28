import React from 'react';
import Question from './Question';

function QuestionBoard({ questions }) {
    if (questions.length === 0) {
        return (
            <div className="question-board">
                <div className="no-questions">
                    <p>No questions yet. Be the first to ask something!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="question-board">
            <h4>Class Questions ({questions.length})</h4>
            <div className="questions-list">
                {questions.map((question) => (
                    <Question key={question._id} question={question} />
                ))}
            </div>
        </div>
    );
}

export default QuestionBoard;