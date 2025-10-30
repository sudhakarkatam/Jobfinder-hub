import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { categoriesApi, jobsApi } from '../../lib/database';
import { calculateSimilarity, extractUniqueTags } from '../../utils/fuzzyMatch';


const GlobalHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLatestJobsDropdown, setShowLatestJobsDropdown] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState(null); // 'categories' | 'latestJobs' | null
  const [allJobs, setAllJobs] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);
  const latestJobsDropdownRef = useRef(null);
  const categoriesDropdownRef = useRef(null);

  const isAdminRoute = location.pathname?.startsWith('/admin');

  useEffect(() => {
    fetchCategories();
    fetchAllJobs();
  }, []);

  const fetchAllJobs = async () => {
    try {
      const { data, error } = await jobsApi.getJobs();
      if (data) {
        setAllJobs(data);
      }
    } catch (error) {
      console.error('Error fetching jobs for search:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await categoriesApi.getCategories();
      if (data) {
        const categoryIconMap = {
          'Technology': 'Cpu',
          'Development': 'Code',
          'Design': 'Palette',
          'Data Science': 'BarChart3',
          'Marketing': 'Megaphone',
          'Product': 'Package',
          'Finance': 'DollarSign',
          'Sales': 'TrendingUp',
          'Healthcare': 'Heart',
          'Education': 'GraduationCap',
          'Banking Jobs': 'Building2',
          'Government Jobs': 'Landmark'
        };

        const transformedCategories = data.map(cat => ({
          label: cat.name,
          path: `/job-search-results?category=${cat.name.toLowerCase().replace(/\s+/g, '-')}`,
          icon: categoryIconMap[cat.name] || 'Folder',
          count: cat.job_count || 0
        }));

        setCategories(transformedCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const navigationItems = [
    { label: 'Find Jobs', path: '/job-search-results', icon: 'Search' },
    { 
      label: 'Categories', 
      path: '#', 
      icon: 'Grid3X3',
      hasDropdown: true,
      dropdownType: 'categories'
    },
    { 
      label: 'Latest Jobs', 
      path: '#', 
      icon: 'Newspaper',
      hasDropdown: true,
      dropdownType: 'latestJobs',
      submenu: [
        { label: 'Fresher Jobs', path: '/job-search-results?experience=fresher', icon: 'GraduationCap' },
        { label: 'Experienced Jobs', path: '/job-search-results?experience=experienced', icon: 'Briefcase' },
        { label: 'Internships', path: '/job-search-results?type=internship', icon: 'Users' }
      ]
    },
    { label: 'Blog', path: '/blog', icon: 'BookOpen' },
    { label: 'AI Resume Builder', path: '/resume-builder', icon: 'Sparkles' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event.target)) {
        setShowSuggestions(false);
        setIsSearchExpanded(false);
      }
      if (latestJobsDropdownRef?.current && !latestJobsDropdownRef?.current?.contains(event.target)) {
        setShowLatestJobsDropdown(false);
      }
      if (categoriesDropdownRef?.current && !categoriesDropdownRef?.current?.contains(event.target)) {
        setShowCategoriesDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery?.length > 1) {
      // Get real job titles, companies, and tags from database
      const uniqueSuggestions = new Map(); // Use Map to store with type indicator
      const query = searchQuery.toLowerCase();
      
      allJobs.forEach(job => {
        // Add job title if matches
        if (job.title?.toLowerCase().includes(query)) {
          uniqueSuggestions.set(job.title, { text: job.title, type: 'job' });
        }
        
        // Add company name if matches
        if (job.companies?.name?.toLowerCase().includes(query)) {
          uniqueSuggestions.set(job.companies.name, { text: job.companies.name, type: 'company' });
        }
        
        // Add tags with fuzzy matching (typo tolerance)
        if (job.tags && Array.isArray(job.tags)) {
          job.tags.forEach(tag => {
            const similarity = calculateSimilarity(query, tag);
            // Match with 75% similarity or higher (stricter to avoid false matches)
            if (similarity >= 75) {
              uniqueSuggestions.set(`tag:${tag}`, { text: tag, type: 'tag', similarity });
            }
          });
        }
      });
      
      // Convert Map to array and sort (tags first if high similarity, then others)
      const filtered = Array.from(uniqueSuggestions.values())
        .sort((a, b) => {
          // Prioritize exact tag matches
          if (a.type === 'tag' && b.type !== 'tag') return -1;
          if (a.type !== 'tag' && b.type === 'tag') return 1;
          // Sort tags by similarity
          if (a.type === 'tag' && b.type === 'tag') {
            return (b.similarity || 0) - (a.similarity || 0);
          }
          return 0;
        })
        .slice(0, 6);
      
      setSearchSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery, allJobs]);

  const handleSearch = (query = searchQuery) => {
    if (query?.trim()) {
      navigate(`/job-search-results?q=${encodeURIComponent(query?.trim())}`);
      setShowSuggestions(false);
      setIsSearchExpanded(false);
      setIsMenuOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleSearchKeyDown = (e) => {
    if (e?.key === 'Enter') {
      e?.preventDefault();
      handleSearch();
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchFocus = () => {
    setIsSearchExpanded(true);
    if (searchQuery?.length > 0) {
      setShowSuggestions(true);
    }
  };

  if (isAdminRoute) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border elevation-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/home-page" 
            className="flex items-center space-x-2 transition-micro hover:opacity-80"
          >
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Icon name="Briefcase" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              JobFinder Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems?.map((item) => (
              item.hasDropdown ? (
                <div key={item.label} className="relative" ref={item.dropdownType === 'latestJobs' ? latestJobsDropdownRef : categoriesDropdownRef}>
                  <button
                    onClick={() => {
                      if (item.dropdownType === 'latestJobs') {
                        setShowLatestJobsDropdown(!showLatestJobsDropdown);
                        setShowCategoriesDropdown(false);
                      } else if (item.dropdownType === 'categories') {
                        setShowCategoriesDropdown(!showCategoriesDropdown);
                        setShowLatestJobsDropdown(false);
                      }
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-micro text-text-secondary hover:text-foreground hover:bg-muted"
                  >
                    <Icon name={item.icon} size={16} />
                    <span>{item.label}</span>
                    <Icon name="ChevronDown" size={14} className={`transition-transform ${
                      (item.dropdownType === 'latestJobs' && showLatestJobsDropdown) || 
                      (item.dropdownType === 'categories' && showCategoriesDropdown) 
                        ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {((item.dropdownType === 'latestJobs' && showLatestJobsDropdown) || 
                    (item.dropdownType === 'categories' && showCategoriesDropdown)) && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-slide-down max-h-96 overflow-y-auto">
                      {(item.dropdownType === 'categories' ? categories : item.submenu)?.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          onClick={() => {
                            setShowLatestJobsDropdown(false);
                            setShowCategoriesDropdown(false);
                          }}
                          className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <Icon name={subItem.icon} size={16} />
                            <span>{subItem.label}</span>
                          </div>
                          {subItem.count !== undefined && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {subItem.count}
                            </span>
                          )}
                        </Link>
                      ))}
                      {item.dropdownType === 'categories' && categories.length > 0 && (
                        <div className="border-t border-gray-200 mt-1">
                          <Link
                            to="/job-categories"
                            onClick={() => setShowCategoriesDropdown(false)}
                            className="flex items-center justify-center space-x-2 px-4 py-3 text-sm text-pink-600 hover:bg-pink-50 transition-colors rounded-b-lg font-medium"
                          >
                            <span>View All Categories</span>
                            <Icon name="ArrowRight" size={14} />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-micro ${
                    location.pathname === item?.path
                      ? 'text-primary bg-primary/10' :'text-text-secondary hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={16} />
                  <span>{item?.label}</span>
                </Link>
              )
            ))}
          </nav>

          {/* Desktop Search */}
          <div className="hidden md:block relative" ref={searchRef}>
            <div className={`relative transition-all duration-300 ${
              isSearchExpanded ? 'w-80' : 'w-64'
            }`}>
              <div className="relative">
                <Icon 
                  name="Search" 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
                />
                <input
                  type="text"
                  placeholder="Search jobs, companies, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  onFocus={handleSearchFocus}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full pl-10 pr-10 py-2 border border-border rounded-md bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-micro"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowSuggestions(false);
                    }}
                    className="absolute right-8 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-foreground transition-micro"
                  >
                    <Icon name="X" size={14} />
                  </button>
                )}
                <button
                  onClick={() => handleSearch()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-text-secondary hover:text-primary transition-micro"
                >
                  <Icon name="ArrowRight" size={14} />
                </button>
              </div>

              {/* Search Suggestions */}
              {showSuggestions && searchSuggestions?.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md elevation-3 z-60 animate-slide-down"
                >
                  {searchSuggestions?.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(typeof suggestion === 'string' ? suggestion : suggestion.text)}
                      className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-micro first:rounded-t-md last:rounded-b-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {typeof suggestion === 'object' && suggestion.type === 'tag' ? (
                            <Icon name="Tag" size={14} className="text-secondary" />
                          ) : typeof suggestion === 'object' && suggestion.type === 'company' ? (
                            <Icon name="Building2" size={14} className="text-text-secondary" />
                          ) : (
                            <Icon name="Briefcase" size={14} className="text-text-secondary" />
                          )}
                          <span>{typeof suggestion === 'string' ? suggestion : suggestion.text}</span>
                        </div>
                        {typeof suggestion === 'object' && suggestion.type === 'tag' && (
                          <span className="text-xs text-text-secondary">Tag</span>
                        )}
                        {typeof suggestion === 'object' && suggestion.type === 'company' && (
                          <span className="text-xs text-text-secondary">Company</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-3 rounded-md text-text-secondary hover:text-foreground hover:bg-muted transition-micro min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <Icon name={isMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-surface border-t border-border elevation-2 animate-slide-down max-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
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
                  onKeyDown={handleSearchKeyDown}
                  className="w-full pl-10 pr-10 py-3 border border-border rounded-md bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  onClick={() => handleSearch()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-primary"
                >
                  <Icon name="ArrowRight" size={16} />
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {navigationItems?.map((item) => (
                item.hasDropdown ? (
                  <div key={item.label} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setMobileOpenDropdown(prev => prev === item.dropdownType ? null : item.dropdownType)}
                      className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-text-secondary hover:text-foreground hover:bg-muted rounded-md min-h-[44px]"
                      aria-expanded={mobileOpenDropdown === item.dropdownType}
                    >
                      <span className="flex items-center space-x-3">
                        <Icon name={item.icon} size={20} />
                        <span>{item.label}</span>
                      </span>
                      <Icon name="ChevronDown" size={16} className={`${mobileOpenDropdown === item.dropdownType ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileOpenDropdown === item.dropdownType && (
                      <div className="pl-8 space-y-1">
                        {(item.dropdownType === 'categories' ? categories : item.submenu)?.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-between px-4 py-3 rounded-md text-sm text-text-secondary hover:text-foreground hover:bg-muted min-h-[44px]"
                          >
                            <div className="flex items-center space-x-3">
                              <Icon name={subItem.icon} size={16} />
                              <span>{subItem.label}</span>
                            </div>
                            {subItem.count !== undefined && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {subItem.count}
                              </span>
                            )}
                          </Link>
                        ))}
                        {item.dropdownType === 'categories' && categories.length > 0 && (
                          <Link
                            to="/job-categories"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-center space-x-2 px-4 py-2 text-sm text-pink-600 hover:bg-pink-50 transition-colors rounded font-medium mt-2"
                          >
                            <span>View All Categories</span>
                            <Icon name="ArrowRight" size={14} />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item?.path}
                    to={item?.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium transition-micro min-h-[44px] ${
                      location.pathname === item?.path
                        ? 'text-primary bg-primary/10' :'text-text-secondary hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={item?.icon} size={20} />
                    <span>{item?.label}</span>
                  </Link>
                )
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default GlobalHeader;