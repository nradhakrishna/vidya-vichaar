import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import QuestionBoard from './QuestionBoard';

function TADashboard() {
    const [currentClass, setCurrentClass] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('auth-token');

    const fetchClassInfo = useCallback(async () => {
        if (!token) return;
        try {
            const res = await axios.get('http://localhost:5000/api/classes/my-class', {
                headers: { 'x-auth-token': token }
            });
            setCurrentClass(res.data.class);
        } catch (err) {
            setCurrentClass(null);
        }
    }, [token]);

    const fetchQuestions = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/questions', {
                headers: { 'x-auth-token': token }
            });
            setQuestions(res.data);
        } catch (err) {
            // ignore
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchClassInfo();
    }, [fetchClassInfo]);

    useEffect(() => {
        if (currentClass) {
            fetchQuestions();
        }
    }, [currentClass, fetchQuestions]);

    return (
        <div>
            <h2>Teaching Assistant Dashboard</h2>
            {!currentClass ? (
                <div className="no-class-message">
                    <h3>You are not assigned to any class yet.</h3>
                    <p>Please ask your teacher to assign you as a TA.</p>
                </div>
            ) : (
                <>
                    <div className="class-info">
                        <h3>📚 {currentClass.className} - {currentClass.subject}</h3>
                        <div className="class-details">
                            <p><strong>Class Code:</strong> <span className="class-code">{currentClass.classCode}</span></p>
                            <p><strong>Teacher:</strong> {currentClass.teacher?.username}</p>
                            <p><strong>Students:</strong> {currentClass.studentCount}</p>
                        </div>
                    </div>
                    <div className="dashboard-controls">
                        <h3>Class Questions</h3>
                        <button 
                            className="refresh-btn" 
                            onClick={fetchQuestions}
                            disabled={loading}
                        >
                            {loading ? '🔄 Refreshing...' : '🔄 Refresh'}
                        </button>
                    </div>
                    <QuestionBoard
                        questions={questions}
                        onStatusChange={() => {}}
                        onDelete={() => {}}
                    />
                </>
            )}
        </div>
    );
}

export default TADashboard;




