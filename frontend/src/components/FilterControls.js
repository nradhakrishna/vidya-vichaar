import React from 'react';

function FilterControls({ currentFilter, onFilterChange }) {
    const filters = ['all', 'unanswered', 'answered', 'important'];

    return (
        <div className="filter-controls">
            {filters.map(filter => (
                <button
                    key={filter}
                    className={currentFilter === filter ? 'active' : ''}
                    onClick={() => onFilterChange(filter)}
                >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
            ))}
        </div>
    );
}

export default FilterControls;