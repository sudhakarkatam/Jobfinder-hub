import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const CategoryFilters = ({ onFilterChange, activeFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sortOptions = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'alphabetical', label: 'Alphabetical' },
    { value: 'job-count', label: 'Job Count' },
    { value: 'recent', label: 'Recently Updated' }
  ];

  const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'new-york', label: 'New York, NY' },
    { value: 'san-francisco', label: 'San Francisco, CA' },
    { value: 'los-angeles', label: 'Los Angeles, CA' },
    { value: 'chicago', label: 'Chicago, IL' },
    { value: 'boston', label: 'Boston, MA' },
    { value: 'seattle', label: 'Seattle, WA' }
  ];

  const experienceOptions = [
    { value: '', label: 'All Experience Levels' },
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-5 years)' },
    { value: 'senior', label: 'Senior Level (6-10 years)' },
    { value: 'executive', label: 'Executive (10+ years)' }
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...activeFilters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      sort: 'popularity',
      location: '',
      experience: ''
    });
  };

  const hasActiveFilters = activeFilters?.location || activeFilters?.experience || activeFilters?.sort !== 'popularity';

  return (
    <div className="bg-surface border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Filter Categories</h3>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear All
            </Button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden p-2 rounded-md text-text-secondary hover:text-foreground hover:bg-muted transition-micro"
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
          </button>
        </div>
      </div>
      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Sort By"
            options={sortOptions}
            value={activeFilters?.sort || 'popularity'}
            onChange={(value) => handleFilterChange('sort', value)}
          />

          <Select
            label="Location"
            options={locationOptions}
            value={activeFilters?.location || ''}
            onChange={(value) => handleFilterChange('location', value)}
            placeholder="All locations"
          />

          <Select
            label="Experience Level"
            options={experienceOptions}
            value={activeFilters?.experience || ''}
            onChange={(value) => handleFilterChange('experience', value)}
            placeholder="All experience levels"
          />
        </div>

        {/* Quick Filter Tags */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <span className="text-sm text-text-secondary">Quick filters:</span>
          <button
            onClick={() => handleFilterChange('location', 'remote')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeFilters?.location === 'remote' ?'bg-primary text-primary-foreground' :'bg-muted text-text-secondary hover:bg-primary/10 hover:text-primary'
            }`}
          >
            Remote Only
          </button>
          <button
            onClick={() => handleFilterChange('experience', 'entry')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeFilters?.experience === 'entry' ?'bg-primary text-primary-foreground' :'bg-muted text-text-secondary hover:bg-primary/10 hover:text-primary'
            }`}
          >
            Entry Level
          </button>
          <button
            onClick={() => handleFilterChange('sort', 'job-count')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeFilters?.sort === 'job-count' ?'bg-primary text-primary-foreground' :'bg-muted text-text-secondary hover:bg-primary/10 hover:text-primary'
            }`}
          >
            Most Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilters;