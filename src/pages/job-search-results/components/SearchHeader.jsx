import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SearchHeader = ({ onFiltersToggle, resultsCount, onSortChange, onViewChange, currentView }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [location, setLocation] = useState(searchParams?.get('location') || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const searchRef = useRef(null);

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'date', label: 'Most Recent' },
    { value: 'salary-high', label: 'Salary: High to Low' },
    { value: 'salary-low', label: 'Salary: Low to High' },
    { value: 'company', label: 'Company A-Z' }
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
      setSuggestions(filtered?.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    
    if (searchQuery?.trim()) {
      params?.set('q', searchQuery?.trim());
    } else {
      params?.delete('q');
    }
    
    if (location.trim()) {
      params?.set('location', location.trim());
    } else {
      params?.delete('location');
    }

    setSearchParams(params);
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
    const params = new URLSearchParams(searchParams);
    params?.set('q', suggestion);
    setSearchParams(params);
  };

  const saveSearch = () => {
    // Mock save search functionality
    alert('Search saved! You\'ll receive notifications for new matching jobs.');
  };

  return (
    <div className="bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Search Bar */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Job Search Input */}
            <div className="md:col-span-6 relative" ref={searchRef}>
              <div className="relative">
                <Icon 
                  name="Search" 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
                />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-md bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-micro"
                />
              </div>

              {/* Search Suggestions */}
              {showSuggestions && suggestions?.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md elevation-3 z-50 animate-slide-down">
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

            {/* Location Input */}
            <div className="md:col-span-4">
              <div className="relative">
                <Icon 
                  name="MapPin" 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
                />
                <input
                  type="text"
                  placeholder="City, state, or remote"
                  value={location}
                  onChange={(e) => setLocation(e?.target?.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-md bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-micro"
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="md:col-span-2">
              <Button
                onClick={handleSearch}
                className="w-full h-12"
                iconName="Search"
                iconPosition="left"
              >
                Search
              </Button>
            </div>
          </div>

          {/* Advanced Search Toggle */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80 transition-micro"
            >
              <Icon name={isAdvancedOpen ? "ChevronUp" : "ChevronDown"} size={16} />
              <span>Advanced Search</span>
            </button>

            <Button
              variant="ghost"
              size="sm"
              onClick={saveSearch}
              iconName="Bell"
              iconPosition="left"
            >
              Save Search
            </Button>
          </div>

          {/* Advanced Search Fields */}
          {isAdvancedOpen && (
            <div className="mt-4 p-4 bg-muted rounded-lg animate-slide-down">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Skills"
                  placeholder="e.g. JavaScript, Python"
                />
                <Select
                  label="Education Level"
                  options={[
                    { value: '', label: 'Any Education' },
                    { value: 'high-school', label: 'High School' },
                    { value: 'bachelor', label: 'Bachelor\'s Degree' },
                    { value: 'master', label: 'Master\'s Degree' }
                  ]}
                  value=""
                  onChange={() => {}}
                />
                <Select
                  label="Remote Work"
                  options={[
                    { value: '', label: 'Any' },
                    { value: 'remote', label: 'Remote Only' },
                    { value: 'hybrid', label: 'Hybrid' },
                    { value: 'onsite', label: 'On-site' }
                  ]}
                  value=""
                  onChange={() => {}}
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Mobile Filter Button */}
            <Button
              variant="outline"
              onClick={onFiltersToggle}
              iconName="Filter"
              iconPosition="left"
              className="lg:hidden"
            >
              Filters
            </Button>

            {/* Results Count */}
            <div className="text-sm text-text-secondary">
              <span className="font-medium text-foreground">{resultsCount?.toLocaleString()}</span> jobs found
              {searchQuery && (
                <span> for "{searchQuery}"</span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-text-secondary hidden sm:block">Sort by:</span>
              <Select
                options={sortOptions}
                value="relevance"
                onChange={onSortChange}
                className="min-w-[140px]"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center border border-border rounded-md">
              <button
                onClick={() => onViewChange('list')}
                className={`p-2 rounded-l-md transition-micro ${
                  currentView === 'list' ?'bg-primary text-primary-foreground' :'text-text-secondary hover:text-foreground hover:bg-muted'
                }`}
                title="List view"
              >
                <Icon name="List" size={16} />
              </button>
              <button
                onClick={() => onViewChange('grid')}
                className={`p-2 transition-micro ${
                  currentView === 'grid' ?'bg-primary text-primary-foreground' :'text-text-secondary hover:text-foreground hover:bg-muted'
                }`}
                title="Grid view"
              >
                <Icon name="Grid3X3" size={16} />
              </button>
              <button
                onClick={() => onViewChange('map')}
                className={`p-2 rounded-r-md transition-micro hidden lg:block ${
                  currentView === 'map' ?'bg-primary text-primary-foreground' :'text-text-secondary hover:text-foreground hover:bg-muted'
                }`}
                title="Map view"
              >
                <Icon name="Map" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;