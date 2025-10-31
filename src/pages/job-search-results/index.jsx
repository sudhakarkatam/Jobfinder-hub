import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import GlobalHeader from '../../components/ui/GlobalHeader';
import Icon from '../../components/AppIcon';
import { jobsApi, categoriesApi } from '../../lib/database.js';
import { calculateSimilarity } from '../../utils/fuzzyMatch';
import MobileBottomBar from '../../components/ui/MobileBottomBar';

const JobSearchResults = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [cardDensity, setCardDensity] = useState(() => {
    const saved = localStorage.getItem('jobCardDensity');
    return saved || 'comfortable';
  });
  const [viewMode, setViewMode] = useState(() => {
    const saved = localStorage.getItem('jobViewMode');
    return saved || 'list';
  });
  const [loadingProgress, setLoadingProgress] = useState(0);
  const resultsHeadingRef = React.useRef(null);
  const jobsPerPage = 10;

  // Helper function to get category color
  const getCategoryColor = (categoryName) => {
    if (!categoryName) return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
    const cat = categoryName.toLowerCase();
    if (cat.includes('technology') || cat.includes('software') || cat.includes('it') || cat.includes('development')) {
      return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' };
    }
    if (cat.includes('marketing') || cat.includes('sales')) {
      return { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' };
    }
    if (cat.includes('design') || cat.includes('creative')) {
      return { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' };
    }
    if (cat.includes('finance') || cat.includes('accounting')) {
      return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' };
    }
    if (cat.includes('health') || cat.includes('medical')) {
      return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' };
    }
    if (cat.includes('education') || cat.includes('teaching')) {
      return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' };
    }
    return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
  };

  // Helper function to get job type color
  const getJobTypeColor = (type) => {
    if (!type) return { bg: 'bg-gray-100', text: 'text-gray-700' };
    const t = type.toLowerCase();
    if (t.includes('full-time') || t.includes('fulltime')) {
      return { bg: 'bg-blue-100', text: 'text-blue-700' };
    }
    if (t.includes('part-time') || t.includes('parttime')) {
      return { bg: 'bg-green-100', text: 'text-green-700' };
    }
    if (t.includes('contract')) {
      return { bg: 'bg-orange-100', text: 'text-orange-700' };
    }
    if (t.includes('internship')) {
      return { bg: 'bg-purple-100', text: 'text-purple-700' };
    }
    if (t.includes('freelance')) {
      return { bg: 'bg-pink-100', text: 'text-pink-700' };
    }
    return { bg: 'bg-gray-100', text: 'text-gray-700' };
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, searchParams]);

  // Keep local input in sync with URL (?q=)
  useEffect(() => {
    const urlQ = searchParams.get('q') || '';
    setSearchQuery(urlQ);
  }, [searchParams]);

  // Debounced live search: update URL 300ms after typing
  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    const t = setTimeout(() => {
      const q = searchQuery.trim();
      const params = new URLSearchParams(searchParams);
      if (q) {
        params.set('q', q);
      } else {
        params.delete('q');
      }
      setSearchParams(params);
    }, 300);
    setDebounceTimer(t);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setLoadingProgress(0);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const [jobsResult, categoriesResult] = await Promise.all([
        jobsApi.getJobs(),
        categoriesApi.getCategories()
      ]);

      setLoadingProgress(100);
      clearInterval(progressInterval);

      if (jobsResult.data) {
        const transformedJobs = jobsResult.data.map(job => ({
          id: job.id,
          title: job.title,
          // Use company_name if available, otherwise fall back to companies.name
          company: job.company_name || job.companies?.name || 'Unknown Company',
          description: job.description,
          created_at: job.created_at,
          category: job.category,
          location: job.location,
          employment_type: job.employment_type,
          experience_level: job.experience_level,
          salary_min: job.salary_min,
          salary_max: job.salary_max,
          tags: job.tags || []
        }));
        setJobs(transformedJobs);
        setRecentJobs(transformedJobs.slice(0, 5));
      }

      if (categoriesResult.data) {
        setCategories(categoriesResult.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setLoadingProgress(0);
    }
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const experience = searchParams.get('experience');
    const type = searchParams.get('type');
    const tag = searchParams.get('tag');
    const matcher = searchParams.get('matcher');
    const skills = searchParams.get('skills');

    // If coming from resume matcher, filter to tech jobs only
    if (matcher === 'true') {
      filtered = filtered.filter(job => {
        const techCategories = ['technology', 'development', 'it', 'software'];
        return techCategories.some(cat => 
          job.category?.toLowerCase().includes(cat)
        );
      });

      // If skills are provided, prioritize jobs matching those skills
      if (skills) {
        const skillList = skills.split(',').map(s => s.trim().toLowerCase());
        filtered = filtered.map(job => {
          const jobText = `${job.title} ${job.description}`.toLowerCase();
          const matchCount = skillList.filter(skill => jobText.includes(skill)).length;
          return { ...job, skillMatchCount: matchCount };
        })
        .sort((a, b) => b.skillMatchCount - a.skillMatchCount);
      }
    }

    if (query) {
      filtered = filtered.filter(job => {
        const matchesTitle = job.title?.toLowerCase().includes(query.toLowerCase());
        const matchesDesc = job.description?.toLowerCase().includes(query.toLowerCase());
        const matchesCompany = job.company?.toLowerCase().includes(query.toLowerCase());
        
        // NEW: Fuzzy tag matching with typo tolerance (strict to avoid false matches)
        const matchesTags = job.tags?.some(tag => 
          calculateSimilarity(tag.toLowerCase(), query.toLowerCase()) >= 75
        );
        
        return matchesTitle || matchesDesc || matchesCompany || matchesTags;
      });
    }

    if (category) {
      filtered = filtered.filter(job => 
        job.category?.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase()
      );
    }

    if (experience) {
      if (experience === 'fresher') {
        filtered = filtered.filter(job => 
          job.experience_level?.toLowerCase().includes('entry') ||
          job.title.toLowerCase().includes('fresher') ||
          job.title.toLowerCase().includes('junior')
        );
      } else if (experience === 'experienced') {
        filtered = filtered.filter(job => 
          job.experience_level?.toLowerCase().includes('mid') ||
          job.experience_level?.toLowerCase().includes('senior') ||
          job.experience_level?.toLowerCase().includes('executive')
        );
      }
    }

    if (tag && tag.length > 0) {
      // Filter jobs that have matching tags (case-insensitive)
      filtered = filtered.filter(job => {
        if (!job.tags || job.tags.length === 0) return false;
        
        const tagSlug = tag.toLowerCase();
        return job.tags.some(jobTag => {
          const jobTagSlug = jobTag.toLowerCase().replace(/\s+/g, '-');
          return jobTagSlug === tagSlug || 
                 jobTag.toLowerCase() === tagSlug.replace(/-/g, ' ');
        });
      });
    }

    if (type) {
      filtered = filtered.filter(job => 
        job.employment_type?.toLowerCase().replace('-', '') === type.toLowerCase().replace('-', '')
      );
    }

    setFilteredJobs(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams(searchParams);
      params.set('q', searchQuery.trim());
      setSearchParams(params);
      // Move focus to results heading after search
      setTimeout(() => {
        resultsHeadingRef.current?.focus();
        resultsHeadingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // Save card density and view mode preferences
  useEffect(() => {
    localStorage.setItem('jobCardDensity', cardDensity);
  }, [cardDensity]);

  useEffect(() => {
    localStorage.setItem('jobViewMode', viewMode);
  }, [viewMode]);

  const handleCategoryClick = (categoryName) => {
    const params = new URLSearchParams();
    params.set('category', categoryName.toLowerCase().replace(/\s+/g, '-'));
    setSearchParams(params);
  };

  const handleFilterClick = (filterType, value) => {
    const params = new URLSearchParams(searchParams);
    params.set(filterType, value);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setSearchQuery('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatExcerpt = (text, maxLength = 250) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPaginationNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <GlobalHeader />
        <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-6">
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-20 h-20 mb-6">
                <Icon name="Loader2" size={80} className="animate-spin text-pink-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Jobs</h2>
              <p className="text-gray-600 mb-6">Finding the best opportunities for you...</p>
              
              {/* Progress Bar */}
              <div className="w-full max-w-md mx-auto">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">{loadingProgress}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Job Search Results | JobFinder Hub</title>
        <meta name="description" content="Browse and search job opportunities" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <GlobalHeader />

        <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Job Cards */}
            <div className="lg:col-span-2">
              {/* Page Title */}
              <div className="mb-8">
                {searchParams.get('matcher') === 'true' ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Icon name="Sparkles" size={24} className="text-primary" />
                        </div>
                        <div>
                          <h1 className="text-4xl font-bold text-gray-900">
                            Jobs Matching Your Resume
                          </h1>
                          <p className="text-gray-600 mt-1">
                            AI-powered matches based on your skills and experience
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/resume-builder')}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      >
                        <Icon name="Upload" size={16} />
                        <span>Upload New Resume</span>
                      </button>
                    </div>
                    <p className="text-gray-600">
                      {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} matched
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                      <div className="flex-1 min-w-0">
                        <h1 
                          ref={resultsHeadingRef}
                          tabIndex={-1}
                          className="text-4xl font-bold text-gray-900 mb-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                        >
                          {searchParams.get('q') ? `Results for "${searchParams.get('q')}"` : 'All Jobs'}
                        </h1>
                        <p className="text-gray-700">
                          {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
                        </p>
                      </div>
                      
                      {/* View Controls - Desktop Only */}
                      <div className="hidden md:flex items-center gap-2">
                        {/* View Mode Toggle (Grid/List) */}
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => setViewMode('grid')}
                            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                              viewMode === 'grid'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                            aria-label="Grid view"
                          >
                            <Icon name="LayoutGrid" size={16} className="inline mr-1" />
                            Grid
                          </button>
                          <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                              viewMode === 'list'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                            aria-label="List view"
                          >
                            <Icon name="List" size={16} className="inline mr-1" />
                            List
                          </button>
                        </div>
                        
                        {/* Card Density Toggle */}
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => setCardDensity('comfortable')}
                            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                              cardDensity === 'comfortable'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                            aria-label="Comfortable spacing"
                          >
                            <Icon name="Maximize2" size={16} className="inline mr-1" />
                            Comfortable
                          </button>
                          <button
                            onClick={() => setCardDensity('compact')}
                            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                              cardDensity === 'compact'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                            aria-label="Compact spacing"
                          >
                            <Icon name="Minimize2" size={16} className="inline mr-1" />
                            Compact
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Active Filters */}
              {(searchParams.get('q') || searchParams.get('category') || searchParams.get('experience') || searchParams.get('type') || searchParams.get('tag')) && (
                <div className="mb-6 bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                      {searchParams.get('q') && (
                        <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                          Search: {searchParams.get('q')}
                        </span>
                      )}
                      {searchParams.get('category') && (() => {
                        const colors = getCategoryColor(searchParams.get('category'));
                        return (
                          <span className={`px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-sm font-medium`}>
                            Category: {searchParams.get('category').replace(/-/g, ' ')}
                          </span>
                        );
                      })()}
                      {searchParams.get('experience') && (
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                          Experience: {searchParams.get('experience')}
                        </span>
                      )}
                      {searchParams.get('type') && (() => {
                        const colors = getJobTypeColor(searchParams.get('type'));
                        return (
                          <span className={`px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-sm font-medium`}>
                            Type: {searchParams.get('type').replace(/-/g, ' ')}
                          </span>
                        );
                      })()}
                      {searchParams.get('tag') && (
                        <button
                          onClick={() => {
                            searchParams.delete('tag');
                            setSearchParams(searchParams);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors"
                        >
                          <Icon name="Tag" size={14} />
                          <span>Tag: {searchParams.get('tag').replace(/-/g, ' ')}</span>
                          <Icon name="X" size={14} />
                        </button>
                      )}
                    </div>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              )}

              {/* Job Cards */}
              {viewMode === 'grid' ? (
                currentJobs.length > 0 ? (
                  <div className={`grid gap-6 ${
                    cardDensity === 'compact' 
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
                      : 'grid-cols-1 md:grid-cols-2 gap-6'
                  }`}>
                    {currentJobs.map((job) => {
                      const categoryColors = getCategoryColor(job.category);
                      const typeColors = getJobTypeColor(job.employment_type);
                      return (
                        <article
                          key={job.id}
                          className={`bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 flex flex-col h-full ${
                            cardDensity === 'compact' 
                              ? 'p-4 hover:shadow-lg hover:-translate-y-1' 
                              : 'p-6 hover:shadow-xl hover:-translate-y-1.5'
                          }`}
                          tabIndex={0}
                        >
                          {/* Category Badge */}
                          {job.category && (
                            <div className="mb-3">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 ${categoryColors.bg} ${categoryColors.text} text-xs font-semibold rounded-full`}>
                                <Icon name="Folder" size={12} />
                                {job.category}
                              </span>
                            </div>
                          )}

                          {/* Job Title */}
                          <h2 className={`${cardDensity === 'compact' ? 'text-lg mb-2' : 'text-xl mb-3'} font-bold text-gray-900 line-clamp-2 flex-grow`}>
                            <button
                              onClick={() => navigate(`/job-detail-view/${job.id}`)}
                              className="text-left w-full hover:text-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                            >
                              {job.title}
                            </button>
                          </h2>

                          {/* Company */}
                          <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
                            <Icon name="Building2" size={14} className="text-gray-500" />
                            <span className="font-medium">{job.company}</span>
                          </div>

                          {/* Location & Type */}
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-1">
                              <Icon name="MapPin" size={14} />
                              <span className="truncate">{job.location}</span>
                            </div>
                            {job.employment_type && (
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 ${typeColors.bg} ${typeColors.text} text-xs font-medium rounded`}>
                                {job.employment_type}
                              </span>
                            )}
                          </div>

                          {/* Description Excerpt */}
                          {cardDensity === 'comfortable' && (
                            <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3 text-sm flex-grow">
                              {formatExcerpt(job.description, 150)}
                            </p>
                          )}

                          {/* Salary */}
                          {job.salary_min && job.salary_max && (
                            <p className="text-pink-600 font-bold mb-4 text-base">
                              ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}/yr
                            </p>
                          )}

                          {/* Footer */}
                          <div className={`mt-auto ${cardDensity === 'compact' ? 'pt-3' : 'pt-4'} border-t border-gray-100 flex items-center justify-between`}>
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                                <Icon name="Briefcase" size={12} className="text-white" />
                              </div>
                              <p className="text-xs text-gray-500">{formatDate(job.created_at)}</p>
                            </div>
                            <button
                              onClick={() => navigate(`/job-detail-view/${job.id}`)}
                              className="text-pink-600 hover:text-pink-700 font-medium text-sm inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded"
                            >
                              View
                              <Icon name="ArrowRight" size={14} />
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-16 text-center">
                    <div className="max-w-md mx-auto">
                      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
                        <Icon name="SearchX" size={48} className="text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">No jobs found</h3>
                      <p className="text-gray-600 mb-6 text-lg">We couldn't find any jobs matching your search criteria. Try adjusting your filters or search terms.</p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                          onClick={clearFilters}
                          className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 inline-flex items-center gap-2"
                        >
                          <Icon name="X" size={16} />
                          Clear All Filters
                        </button>
                        <button
                          onClick={() => navigate('/job-search-results')}
                          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                          View All Jobs
                        </button>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className={cardDensity === 'compact' ? 'space-y-4' : 'space-y-6'}>
                  {currentJobs.length > 0 ? (
                    currentJobs.map((job) => {
                      const categoryColors = getCategoryColor(job.category);
                      const typeColors = getJobTypeColor(job.employment_type);
                      return (
                        <article
                          key={job.id}
                          className={`bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${
                            cardDensity === 'compact' 
                              ? 'p-5 hover:shadow-lg hover:-translate-y-0.5' 
                              : 'p-7 hover:shadow-xl hover:-translate-y-1'
                          }`}
                          tabIndex={0}
                        >
                          {/* Top Row: Category & Experience */}
                          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              {job.category && (
                                <span className={`inline-flex items-center gap-1 px-3 py-1 ${categoryColors.bg} ${categoryColors.text} text-xs font-semibold rounded-full`}>
                                  <Icon name="Folder" size={12} />
                                  {job.category}
                                </span>
                              )}
                              {job.experience_level && (
                                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                                  {job.experience_level}
                                </span>
                              )}
                              {job.employment_type && (
                                <span className={`inline-flex items-center gap-1 px-3 py-1 ${typeColors.bg} ${typeColors.text} text-xs font-semibold rounded-full`}>
                                  <Icon name="Briefcase" size={12} />
                                  {job.employment_type}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Job Title */}
                          <h2 className={`${cardDensity === 'compact' ? 'text-xl mb-3' : 'text-2xl mb-4'} font-bold text-gray-900 leading-tight`}>
                            <button
                              onClick={() => navigate(`/job-detail-view/${job.id}`)}
                              className="text-left w-full hover:text-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                            >
                              {job.title}
                            </button>
                          </h2>

                          {/* Company & Meta Info */}
                          <div className={`flex flex-wrap items-center gap-4 ${cardDensity === 'compact' ? 'text-sm mb-3' : 'text-base mb-5'} text-gray-700`}>
                            <div className="flex items-center gap-2">
                              <Icon name="Building2" size={16} className="text-gray-500" />
                              <span className="font-semibold">{job.company}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icon name="MapPin" size={16} className="text-gray-500" />
                              <span>{job.location}</span>
                            </div>
                          </div>

                          {/* Description Excerpt */}
                          {cardDensity === 'comfortable' && (
                            <p className="text-gray-700 mb-5 leading-relaxed text-base">
                              {formatExcerpt(job.description)}
                            </p>
                          )}

                          {/* Salary Row */}
                          <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
                            {job.salary_min && job.salary_max ? (
                              <p className="text-pink-600 font-bold text-lg">
                                ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} / year
                              </p>
                            ) : (
                              <p className="text-gray-500 text-sm italic">Salary not disclosed</p>
                            )}
                            <button
                              onClick={() => navigate(`/job-detail-view/${job.id}`)}
                              className="text-pink-600 hover:text-pink-700 font-semibold text-sm inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded px-4 py-2 hover:bg-pink-50 transition-colors"
                            >
                              View Details
                              <Icon name="ArrowRight" size={16} />
                            </button>
                          </div>

                          {/* Footer - Author & Date */}
                          <div className={`${cardDensity === 'compact' ? 'pt-4' : 'pt-5'} border-t border-gray-100 flex items-center gap-3`}>
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                              <Icon name="Briefcase" size={16} className="text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">JobFinder Hub</p>
                              <p className="text-xs text-gray-500">Posted: {formatDate(job.created_at)}</p>
                            </div>
                          </div>
                        </article>
                      );
                    })
                  ) : (
                    <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-16 text-center">
                      <div className="max-w-md mx-auto">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
                          <Icon name="SearchX" size={48} className="text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">No jobs found</h3>
                        <p className="text-gray-600 mb-6 text-lg">We couldn't find any jobs matching your search criteria. Try adjusting your filters or search terms.</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                          <button
                            onClick={clearFilters}
                            className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 inline-flex items-center gap-2"
                          >
                            <Icon name="X" size={16} />
                            Clear All Filters
                          </button>
                          <button
                            onClick={() => navigate('/job-search-results')}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                          >
                            View All Jobs
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg border ${
                        currentPage === 1
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 text-gray-700 hover:bg-pink-50 hover:border-pink-300'
                      }`}
                    >
                      <Icon name="ChevronLeft" size={16} />
                    </button>

                    {/* Page Numbers */}
                    {getPaginationNumbers().map((page, index) => (
                      <React.Fragment key={index}>
                        {page === '...' ? (
                          <span className="px-3 text-gray-500">...</span>
                        ) : (
                          <button
                            onClick={() => paginate(page)}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium ${
                              currentPage === page
                                ? 'bg-pink-600 text-white'
                                : 'text-gray-700 hover:bg-pink-50 border border-gray-200'
                            }`}
                          >
                            {page}
                          </button>
                        )}
                      </React.Fragment>
                    ))}

                    {/* Next Button */}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg border ${
                        currentPage === totalPages
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 text-gray-700 hover:bg-pink-50 hover:border-pink-300'
                      }`}
                    >
                      <Icon name="ChevronRight" size={16} />
                    </button>
                  </nav>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Search Widget */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Icon name="Search" size={18} className="text-pink-600" />
                    Search
                  </h3>
                  <form onSubmit={handleSearch} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                    >
                      Search
                    </button>
                  </form>
                </div>

                {/* Categories Widget (collapsible on mobile) */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
                  <details className="md:open">
                    <summary className="list-none cursor-pointer flex items-center justify-between mb-3 md:mb-4 select-none">
                      <h3 className="text-lg font-bold text-gray-900">Categories</h3>
                      <span className="md:hidden text-sm text-gray-500">Toggle</span>
                    </summary>
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={clearFilters}
                        className="text-gray-700 hover:text-pink-600 transition-colors text-sm w-full text-left"
                      >
                        All Jobs
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleFilterClick('experience', 'fresher')}
                        className={`text-sm w-full text-left transition-colors ${
                          searchParams.get('experience') === 'fresher'
                            ? 'text-pink-600 font-semibold'
                            : 'text-gray-700 hover:text-pink-600'
                        }`}
                      >
                        Freshers
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleFilterClick('experience', 'experienced')}
                        className={`text-sm w-full text-left transition-colors ${
                          searchParams.get('experience') === 'experienced'
                            ? 'text-pink-600 font-semibold'
                            : 'text-gray-700 hover:text-pink-600'
                        }`}
                      >
                        Experienced
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleFilterClick('type', 'internship')}
                        className={`text-sm w-full text-left transition-colors ${
                          searchParams.get('type') === 'internship'
                            ? 'text-pink-600 font-semibold'
                            : 'text-gray-700 hover:text-pink-600'
                        }`}
                      >
                        Internships
                      </button>
                    </li>
                    {categories.slice(0, 6).map((category) => {
                      const colors = getCategoryColor(category.name);
                      const isActive = searchParams.get('category') === category.name.toLowerCase().replace(/\s+/g, '-');
                      return (
                        <li key={category.id}>
                          <button
                            onClick={() => handleCategoryClick(category.name)}
                            className={`text-sm w-full text-left transition-colors flex items-center gap-2 px-2 py-1.5 rounded-md ${
                              isActive
                                ? `${colors.bg} ${colors.text} font-semibold`
                                : 'text-gray-700 hover:text-pink-600 hover:bg-gray-50'
                            }`}
                          >
                            <Icon name="Folder" size={14} />
                            {category.name}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  </details>
                </div>

                {/* Recent Posts Widget */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Posts</h3>
                  <ul className="space-y-3">
                    {recentJobs.map((job) => (
                      <li key={job.id}>
                        <button
                          onClick={() => navigate(`/job-detail-view/${job.id}`)}
                          className="text-sm text-gray-700 hover:text-pink-600 transition-colors line-clamp-2 text-left"
                        >
                          {job.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Bottom Bar */}
        <MobileBottomBar />
      </div>
      
      {/* Spacer for mobile bottom bar */}
      <div className="md:hidden h-16" />
    </>
  );
};

export default JobSearchResults;
