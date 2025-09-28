import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import QuestionForm from './QuestionForm';
import JoinClass from './JoinClass';
import QuestionBoard from './QuestionBoard';

function StudentDashboard() {
    const [myQuestions, setMyQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentClass, setCurrentClass] = useState(null);
    const [showJoinClass, setShowJoinClass] = useState(false);
    const token = localStorage.getItem('auth-token');

    const fetchClassInfo = useCallback(async () => {
        if (!token) return;
        try {
            const res = await axios.get('http://localhost:5000/api/classes/my-class', { 
                headers: { 'x-auth-token': token } 
            });
            setCurrentClass(res.data.class);
        } catch (error) {
            console.error('Error fetching class info:', error);
            if (error.response?.status === 404) {
                // No class found
                setCurrentClass(null);
            }
        }
    }, [token]);

    const fetchMyQuestions = useCallback(async () => {
        if (!token || !currentClass) return;
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/questions', {
                headers: { 'x-auth-token': token }
            });
            setMyQuestions(res.data);
        } catch (error) {
            console.error('Error fetching questions:', error);
            if (error.response?.status === 401) {
                // Token is invalid, redirect to login
                localStorage.removeItem('auth-token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    }, [token, currentClass]);

    useEffect(() => {
        fetchClassInfo();
    }, [fetchClassInfo]);

    useEffect(() => {
        if (currentClass) {
            fetchMyQuestions();
            
            // Auto-refresh every 30 seconds, but only when page is visible
            const interval = setInterval(() => {
                if (!document.hidden) {
                    fetchMyQuestions();
                }
            }, 30000);
            
            // Also refresh when page becomes visible
            const handleVisibilityChange = () => {
                if (!document.hidden) {
                    fetchMyQuestions();
                }
            };
            
            document.addEventListener('visibilitychange', handleVisibilityChange);
            
            return () => {
                clearInterval(interval);
                document.removeEventListener('visibilitychange', handleVisibilityChange);
            };
        }
    }, [fetchMyQuestions, currentClass]);

    const handleQuestionSubmit = async (text) => {
        try {
            await axios.post('http://localhost:5000/api/questions/add', { text }, {
                headers: { 'x-auth-token': token }
            });
            fetchMyQuestions();
        } catch (error) {
            if (error.response?.status === 409) {
                alert(error.response.data.msg);
            } else {
                console.error('Error submitting question:', error);
                alert('Failed to submit question. Please try again.');
            }
        }
    };

    const handleClassJoined = (joinedClass) => {
        setCurrentClass(joinedClass);
        setShowJoinClass(false);
        fetchClassInfo();
    };


    if (!currentClass && !showJoinClass) {
        return (
            <div>
                <h2>Student Dashboard</h2>
                <div className="no-class-message">
                    <h3>Welcome! You haven't joined a class yet.</h3>
                    <p>Join a class using the class code provided by your teacher to start posting questions.</p>
                    <button 
                        className="join-class-btn" 
                        onClick={() => setShowJoinClass(true)}
                    >
                        Join a Class
                    </button>
                </div>
            </div>
        );
    }

    if (showJoinClass) {
        return (
            <div>
                <h2>Student Dashboard</h2>
                <JoinClass onClassJoined={handleClassJoined} />
                <button 
                    className="back-btn" 
                    onClick={() => setShowJoinClass(false)}
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div>
            <h2>Student Dashboard</h2>
            
            {/* Class Information */}
            <div className="class-info">
                <h3>📚 {currentClass?.className} - {currentClass?.subject}</h3>
                <div className="class-details">
                    <p><strong>Class Code:</strong> <span className="class-code">{currentClass?.classCode}</span></p>
                    <button 
                        className="change-class-btn" 
                        onClick={async () => {
                            if (window.confirm('Are you sure you want to leave this class? You will need a new class code to join again.')) {
                                try {
                                    const token = localStorage.getItem('auth-token');
                                    await axios.delete('http://localhost:5000/api/classes/leave', {
                                        headers: { 'x-auth-token': token }
                                    });
                                    
                                    setCurrentClass(null);
                                    setShowJoinClass(false);
                                    fetchClassInfo();
                                } catch (err) {
                                    console.error('Error leaving class:', err);
                                    alert('Failed to leave class. Please try again.');
                                }
                            }
                        }}
                    >
                        Change Class
                    </button>
                </div>
            </div>

            <QuestionForm 
                onQuestionSubmit={handleQuestionSubmit} 
                existingQuestions={myQuestions}
            />
            <div className="dashboard-controls">
                <h3>Class Questions</h3>
                <button 
                    className="refresh-btn" 
                    onClick={fetchMyQuestions}
                    disabled={loading}
                >
                    {loading ? '🔄 Refreshing...' : '🔄 Refresh'}
                </button>
            </div>
            {loading && <div className="loading-indicator">Loading questions...</div>}
            <QuestionBoard
                questions={myQuestions}
                onStatusChange={() => {}} // Students can't change status
                onDelete={() => {}} // Students can't delete questions
            />
        </div>
    );
}
export default StudentDashboard;