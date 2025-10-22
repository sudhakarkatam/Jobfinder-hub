import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const CategorySearch = ({ categories, onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

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
      const filtered = categories?.filter(category =>
        category?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        category?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        (category?.subcategories && category?.subcategories?.some(sub => 
          sub?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        ))
      );
      setSuggestions(filtered?.slice(0, 6));
      setShowSuggestions(true);
      onSearchResults(filtered);
    } else {
      setShowSuggestions(false);
      onSearchResults(categories);
    }
  }, [searchQuery, categories, onSearchResults]);

  const handleSearch = () => {
    if (searchQuery?.trim()) {
      navigate(`/job-search-results?q=${encodeURIComponent(searchQuery?.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Enter') {
      e?.preventDefault();
      handleSearch();
    }
  };

  const handleSuggestionClick = (category) => {
    setSearchQuery(category?.name);
    setShowSuggestions(false);
    navigate(`/job-search-results?category=${category?.id}`);
  };

  return (
    <div className="relative mb-6" ref={searchRef}>
      <div className="relative">
        <Icon 
          name="Search" 
          size={20} 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" 
        />
        <input
          type="text"
          placeholder="Search categories, skills, or job types..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
          onKeyDown={handleKeyDown}
          className="w-full pl-12 pr-12 py-4 border border-border rounded-lg bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-micro text-lg"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setShowSuggestions(false);
              onSearchResults(categories);
            }}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-foreground transition-micro"
          >
            <Icon name="X" size={16} />
          </button>
        )}
        <button
          onClick={handleSearch}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80 transition-micro"
        >
          <Icon name="ArrowRight" size={16} />
        </button>
      </div>
      {/* Search Suggestions */}
      {showSuggestions && suggestions?.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg elevation-3 z-50 animate-slide-down">
          <div className="p-2">
            <div className="text-xs text-text-secondary px-3 py-2 border-b border-border">
              Categories matching "{searchQuery}"
            </div>
            {suggestions?.map((category) => (
              <button
                key={category?.id}
                onClick={() => handleSuggestionClick(category)}
                className="w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-muted rounded-md transition-micro"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                  <Icon name={category?.icon} size={16} className="text-text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {category?.name}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {category?.jobCount} jobs available
                  </p>
                </div>
                <Icon name="ArrowRight" size={14} className="text-text-secondary" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySearch;