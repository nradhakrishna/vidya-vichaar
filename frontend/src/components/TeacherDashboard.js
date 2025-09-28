import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateClass from './CreateClass';
import QuestionBoard from './QuestionBoard';
import FilterControls from './FilterControls';

function TeacherDashboard() {
    const [classInfo, setClassInfo] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
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
            setFilteredQuestions(response.data);
        } catch (err) {
            setError('Failed to fetch questions');
        } finally {
            setLoading(false);
        }
    };

    const handleClassCreated = () => {
        fetchClassInfo();
        fetchQuestions();
    };

    const handleQuestionUpdated = () => {
        fetchQuestions();
    };

    const handleFilterChange = (filtered) => {
        setFilteredQuestions(filtered);
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
                    <p>Create a class to start managing questions from your students.</p>
                    <CreateClass onClassCreated={handleClassCreated} />
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
                <p><strong>Students:</strong> {classInfo.studentCount}</p>
                <div className="class-actions">
                    <button 
                        className="deactivate-btn"
                        onClick={() => handleDeactivateClass()}
                    >
                        Deactivate Class
                    </button>
                </div>
            </div>

            <div className="questions-section">
                <div className="questions-header">
                    <h3>Student Questions ({questions.length})</h3>
                    <FilterControls 
                        questions={questions} 
                        onFilterChange={handleFilterChange}
                    />
                </div>
                <QuestionBoard 
                    questions={filteredQuestions} 
                    isTeacher={true}
                    onQuestionUpdated={handleQuestionUpdated}
                />
            </div>
        </div>
    );

    async function handleDeactivateClass() {
        if (window.confirm('Are you sure you want to deactivate this class? This will remove all students from the class.')) {
            try {
                const token = localStorage.getItem('auth-token');
                await axios.patch(`http://localhost:5000/api/classes/deactivate/${classInfo.id}`, {}, {
                    headers: { 'x-auth-token': token }
                });
                
                setClassInfo(null);
                setQuestions([]);
                setFilteredQuestions([]);
            } catch (err) {
                setError('Failed to deactivate class');
            }
        }
    }
}

export default TeacherDashboard;