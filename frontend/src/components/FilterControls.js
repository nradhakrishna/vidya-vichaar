import React, { useState, useEffect } from 'react';

function FilterControls({ questions, onFilterChange }) {
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        let filtered = questions;

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(q => q.status === statusFilter);
        }

        // Filter by search term
        if (searchTerm.trim()) {
            filtered = filtered.filter(q => 
                q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        onFilterChange(filtered);
    }, [questions, statusFilter, searchTerm, onFilterChange]);

    const getStatusCounts = () => {
        return {
            all: questions.length,
            unanswered: questions.filter(q => q.status === 'unanswered').length,
            answered: questions.filter(q => q.status === 'answered').length,
            important: questions.filter(q => q.status === 'important').length
        };
    };

    const statusCounts = getStatusCounts();

    return (
        <div className="filter-controls">
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="status-filters">
                {[
                    { key: 'all', label: 'All', count: statusCounts.all },
                    { key: 'unanswered', label: 'Unanswered', count: statusCounts.unanswered },
                    { key: 'answered', label: 'Answered', count: statusCounts.answered },
                    { key: 'important', label: 'Important', count: statusCounts.important }
                ].map(filter => (
                    <button
                        key={filter.key}
                        className={`filter-btn ${statusFilter === filter.key ? 'active' : ''}`}
                        onClick={() => setStatusFilter(filter.key)}
                    >
                        {filter.label} ({filter.count})
                    </button>
                ))}
            </div>
        </div>
    );
}

export default FilterControls;