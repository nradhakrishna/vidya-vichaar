import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import './App.css';

function App() {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('auth-token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setToken(storedToken);
                setUser(userData);
                setIsLoading(false);
            } catch (error) {
                console.log('Invalid user data, clearing storage');
                localStorage.removeItem('auth-token');
                localStorage.removeItem('user');
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    }, []);

    const handleLogout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user');
    };

    if (isLoading) {
        return (
            <div className="app-container">
                <div className="loading-screen">
                    <div className="loading-spinner"></div>
                    <h2>Loading VidyaVichara...</h2>
                </div>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <div className="app-container">
                <header className="header">
                    <h1>VidyaVichara 📌</h1>
                    <nav>
                        {token && <button onClick={handleLogout} className="logout-button">Logout</button>}
                    </nav>
                </header>
                <main>
                    <Routes>
                        <Route path="/login" element={<Login setToken={setToken} setUser={setUser} />} />
                        <Route path="/register" element={<Register />} />
                        
                        <Route path="/student" element={
                            user?.role === 'student' ? <StudentDashboard /> : <Navigate to="/login" />
                        }/>
                        
                        <Route path="/teacher" element={
                            user?.role === 'teacher' ? <TeacherDashboard /> : <Navigate to="/login" />
                        }/>

                        <Route path="*" element={<Navigate to={user ? (user.role === 'teacher' ? '/teacher' : '/student') : '/login'} />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;