import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JoinClass from './JoinClass';
import QuestionBoard from './QuestionBoard';
import QuestionForm from './QuestionForm';

function StudentDashboard() {
    const [classInfo, setClassInfo] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchClassInfo();
        fetchQuestions();
    }, []);

    const fetchClassInfo = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await axios.get('http://localhost:5000/api/classes/my-class', {
                headers: { 'x-auth-token': token }
            });
            setClassInfo(response.data.class);
        } catch (err) {
            if (err.response?.status === 404) {
                setClassInfo(null);
            } else {
                setError('Failed to fetch class information');
            }
        }
    };

    const fetchQuestions = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await axios.get('http://localhost:5000/api/questions', {
                headers: { 'x-auth-token': token }
            });
            setQuestions(response.data);
        } catch (err) {
            setError('Failed to fetch questions');
        } finally {
            setLoading(false);
        }
    };

    const handleClassJoined = () => {
        fetchClassInfo();
        fetchQuestions();
    };

    const handleQuestionAdded = () => {
        fetchQuestions();
    };

    if (loading) {
        return (
            <div className="dashboard">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    if (!classInfo) {
        return (
            <div className="dashboard">
                <div className="welcome-section">
                    <h2>Welcome to VidyaVichara!</h2>
                    <p>Join a class to start asking questions and learning together.</p>
                    <JoinClass onClassJoined={handleClassJoined} />
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="class-info">
                <h2>{classInfo.className}</h2>
                <p><strong>Subject:</strong> {classInfo.subject}</p>
                <p><strong>Class Code:</strong> <span className="class-code">{classInfo.classCode}</span></p>
                <p><strong>Teacher:</strong> {classInfo.teacher.username}</p>
                <p><strong>Students:</strong> {classInfo.studentCount}</p>
            </div>

            <div className="questions-section">
                <h3>Questions & Discussions</h3>
                <QuestionForm onQuestionAdded={handleQuestionAdded} />
                <QuestionBoard questions={questions} />
            </div>
        </div>
    );
}

export default StudentDashboard;