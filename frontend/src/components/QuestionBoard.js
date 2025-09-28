import React from 'react';
import Question from './Question';

function QuestionBoard({ questions, isTeacher = false, onQuestionUpdated }) {
    if (questions.length === 0) {
        return (
            <div className="question-board">
                <div className="no-questions">
                    <p>No questions yet. {isTeacher ? 'Students will appear here when they ask questions.' : 'Be the first to ask something!'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="question-board">
            <h4>Class Questions ({questions.length})</h4>
            <div className="questions-list">
                {questions.map((question) => (
                    <Question 
                        key={question._id} 
                        question={question} 
                        isTeacher={isTeacher}
                        onQuestionUpdated={onQuestionUpdated}
                    />
                ))}
            </div>
        </div>
    );
}

export default QuestionBoard;