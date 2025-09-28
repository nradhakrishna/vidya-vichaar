import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import QuestionBoard from './QuestionBoard';
import FilterControls from './FilterControls';
import CreateClass from './CreateClass';
import TAManagement from './TAManagement';

function TeacherDashboard() {
    const [questions, setQuestions] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [currentClass, setCurrentClass] = useState(null);
    const [showCreateClass, setShowCreateClass] = useState(false);
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

    const fetchQuestions = useCallback(async () => {
        if (!token || !currentClass) return;
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/questions', { 
                headers: { 'x-auth-token': token } 
            });
            setQuestions(res.data);
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
            fetchQuestions();
            
            // Auto-refresh every 30 seconds, but only when page is visible
            const interval = setInterval(() => {
                if (!document.hidden) {
                    fetchQuestions();
                }
            }, 30000);
            
            // Also refresh when page becomes visible
            const handleVisibilityChange = () => {
                if (!document.hidden) {
                    fetchQuestions();
                }
            };
            
            document.addEventListener('visibilitychange', handleVisibilityChange);
            
            return () => {
                clearInterval(interval);
                document.removeEventListener('visibilitychange', handleVisibilityChange);
            };
        }
    }, [fetchQuestions, currentClass]);

    const handleStatusChange = (id, newStatus) => {
        axios.patch(`http://localhost:5000/api/questions/update/${id}`, { status: newStatus }, { headers: { 'x-auth-token': token } })
            .then(() => fetchQuestions());
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            axios.delete(`http://localhost:5000/api/questions/${id}`, { headers: { 'x-auth-token': token } })
                .then(() => fetchQuestions());
        }
    };

    const handleClassCreated = (newClass) => {
        setCurrentClass(newClass);
        setShowCreateClass(false);
        fetchClassInfo();
    };

    const handleTAsUpdated = () => {
        fetchClassInfo();
    };

    const filteredQuestions = questions.filter(q => filter === 'all' || q.status === filter);

    if (!currentClass && !showCreateClass) {
        return (
            <div>
                <h2>Teacher Dashboard</h2>
                <div className="no-class-message">
                    <h3>Welcome! You haven't created a class yet.</h3>
                    <p>Create a class to start receiving questions from your students.</p>
                    <button 
                        className="create-class-btn" 
                        onClick={() => setShowCreateClass(true)}
                    >
                        Create New Class
                    </button>
                </div>
            </div>
        );
    }

    if (showCreateClass) {
        return (
            <div>
                <h2>Teacher Dashboard</h2>
                <CreateClass onClassCreated={handleClassCreated} />
                <button 
                    className="back-btn" 
                    onClick={() => setShowCreateClass(false)}
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div>
            <h2>Teacher Dashboard</h2>
            
            {/* Class Information */}
            <div className="class-info">
                <h3>📚 {currentClass?.className} - {currentClass?.subject}</h3>
                <div className="class-details">
                    <p><strong>Class Code:</strong> <span className="class-code">{currentClass?.classCode}</span></p>
                    <p><strong>Students:</strong> {currentClass?.studentCount || 0}</p>
                    <p><strong>Teaching Assistants:</strong> {currentClass?.teachingAssistants?.length || 0}</p>
                </div>
            </div>

            {/* TA Management */}
            <TAManagement 
                classInfo={currentClass} 
                onTAsUpdated={handleTAsUpdated}
            />

            <div className="dashboard-controls">
                <FilterControls currentFilter={filter} onFilterChange={setFilter} />
                <button 
                    className="refresh-btn" 
                    onClick={fetchQuestions}
                    disabled={loading}
                >
                    {loading ? '🔄 Refreshing...' : '🔄 Refresh'}
                </button>
            </div>
            {loading && <div className="loading-indicator">Loading questions...</div>}
            <QuestionBoard
                questions={filteredQuestions}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
            />
        </div>
    );
}
export default TeacherDashboard;