import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Select from './Select';

const SearchInterface = ({ expanded = false, onSearch }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [location, setLocation] = useState(searchParams?.get('location') || '');
  const [jobType, setJobType] = useState(searchParams?.get('type') || '');
  const [salaryRange, setSalaryRange] = useState(searchParams?.get('salary') || '');
  const [experience, setExperience] = useState(searchParams?.get('experience') || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const searchRef = useRef(null);

  const jobTypeOptions = [
    { value: '', label: 'All Job Types' },
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'internship', label: 'Internship' }
  ];

  const salaryRangeOptions = [
    { value: '', label: 'Any Salary' },
    { value: '0-30000', label: 'Under $30,000' },
    { value: '30000-50000', label: '$30,000 - $50,000' },
    { value: '50000-75000', label: '$50,000 - $75,000' },
    { value: '75000-100000', label: '$75,000 - $100,000' },
    { value: '100000-150000', label: '$100,000 - $150,000' },
    { value: '150000+', label: '$150,000+' }
  ];

  const experienceOptions = [
    { value: '', label: 'Any Experience' },
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-5 years)' },
    { value: 'senior', label: 'Senior Level (6-10 years)' },
    { value: 'executive', label: 'Executive (10+ years)' }
  ];

  const mockSuggestions = [
    'Software Engineer',
    'Product Manager',
    'Data Scientist',
    'UX Designer',
    'Marketing Manager',
    'Sales Representative',
    'DevOps Engineer',
    'Business Analyst',
    'Frontend Developer',
    'Backend Developer'
  ];

  const locationSuggestions = [
    'New York, NY',
    'San Francisco, CA',
    'Los Angeles, CA',
    'Chicago, IL',
    'Boston, MA',
    'Seattle, WA',
    'Austin, TX',
    'Denver, CO',
    'Remote',
    'Hybrid'
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery?.length > 0) {
      const filtered = mockSuggestions?.filter(suggestion =>
        suggestion?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
      setSuggestions(filtered?.slice(0, 6));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchQuery?.trim()) params?.set('q', searchQuery?.trim());
    if (location.trim()) params?.set('location', location.trim());
    if (jobType) params?.set('type', jobType);
    if (salaryRange) params?.set('salary', salaryRange);
    if (experience) params?.set('experience', experience);

    const queryString = params?.toString();
    navigate(`/job-search-results${queryString ? `?${queryString}` : ''}`);
    
    if (onSearch) {
      onSearch({
        query: searchQuery,
        location,
        jobType,
        salaryRange,
        experience
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Enter') {
      e?.preventDefault();
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocation('');
    setJobType('');
    setSalaryRange('');
    setExperience('');
    navigate('/job-search-results');
  };

  if (!expanded) {
    // Compact search for header
    return (
      <div className="relative" ref={searchRef}>
        <div className="relative">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
          />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-10 py-2 border border-border rounded-md bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-micro"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-primary hover:text-primary/80 transition-micro"
          >
            <Icon name="ArrowRight" size={14} />
          </button>
        </div>
        {showSuggestions && suggestions?.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md elevation-3 z-60 animate-slide-down">
            {suggestions?.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-micro first:rounded-t-md last:rounded-b-md"
              >
                <div className="flex items-center space-x-2">
                  <Icon name="Search" size={14} className="text-text-secondary" />
                  <span>{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Expanded search interface
  return (
    <div className="bg-surface border border-border rounded-lg p-6 elevation-2">
      <div className="space-y-6">
        {/* Main Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative" ref={searchRef}>
            <label className="block text-sm font-medium text-foreground mb-2">
              Job Title or Keywords
            </label>
            <div className="relative">
              <Icon 
                name="Search" 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
              />
              <input
                type="text"
                placeholder="e.g. Software Engineer, Product Manager"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-md bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-micro"
              />
            </div>

            {showSuggestions && suggestions?.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md elevation-3 z-60 animate-slide-down">
                {suggestions?.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left text-sm text-foreground hover:bg-muted transition-micro first:rounded-t-md last:rounded-b-md"
                  >
                    <div className="flex items-center space-x-2">
                      <Icon name="Search" size={14} className="text-text-secondary" />
                      <span>{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Location
            </label>
            <div className="relative">
              <Icon 
                name="MapPin" 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
              />
              <input
                type="text"
                placeholder="City, State or Remote"
                value={location}
                onChange={(e) => setLocation(e?.target?.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-md bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-micro"
              />
            </div>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80 transition-micro"
          >
            <Icon name={isAdvancedOpen ? "ChevronUp" : "ChevronDown"} size={16} />
            <span>Advanced Filters</span>
          </button>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear All
            </Button>
            <Button
              onClick={handleSearch}
              iconName="Search"
              iconPosition="left"
              className="px-8"
            >
              Search Jobs
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {isAdvancedOpen && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border animate-slide-down">
            <Select
              label="Job Type"
              options={jobTypeOptions}
              value={jobType}
              onChange={setJobType}
              placeholder="Select job type"
            />

            <Select
              label="Salary Range"
              options={salaryRangeOptions}
              value={salaryRange}
              onChange={setSalaryRange}
              placeholder="Select salary range"
            />

            <Select
              label="Experience Level"
              options={experienceOptions}
              value={experience}
              onChange={setExperience}
              placeholder="Select experience level"
            />
          </div>
        )}

        {/* Search Stats */}
        <div className="flex items-center justify-between text-sm text-text-secondary pt-2 border-t border-border">
          <div className="flex items-center space-x-4">
            <span>Over 5,000 active job listings</span>
            <span>•</span>
            <span>Updated hourly</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={14} />
            <span>Last updated: 15 minutes ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchInterface;