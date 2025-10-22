import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import GlobalHeader from '../../components/ui/GlobalHeader';
import Icon from '../../components/AppIcon';
import { jobsApi, categoriesApi } from '../../lib/database.js';
import { calculateSimilarity } from '../../utils/fuzzyMatch';

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
  const jobsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, searchParams]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsResult, categoriesResult] = await Promise.all([
        jobsApi.getJobs(),
        categoriesApi.getCategories()
      ]);

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
    }
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const experience = searchParams.get('experience');
    const type = searchParams.get('type');
    const tag = searchParams.get('tag');

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
    }
  };

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
      <div className="min-h-screen bg-gray-50">
        <GlobalHeader />
        <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-600">Loading jobs...</p>
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
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {searchParams.get('q') ? `Results for "${searchParams.get('q')}"` : 'All Jobs'}
                </h1>
                <p className="text-gray-600">
                  {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
                </p>
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
                      {searchParams.get('category') && (
                        <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                          {searchParams.get('category')}
                        </span>
                      )}
                      {searchParams.get('experience') && (
                        <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                          {searchParams.get('experience')}
                        </span>
                      )}
                      {searchParams.get('type') && (
                        <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                          {searchParams.get('type')}
                        </span>
                      )}
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
              <div className="space-y-6">
                {currentJobs.length > 0 ? (
                  currentJobs.map((job) => (
                    <article
                      key={job.id}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="p-6">
                        {/* Badge */}
                        {job.experience_level && (
                          <span className="inline-block px-3 py-1 bg-pink-100 text-pink-600 text-xs font-semibold rounded-full mb-3">
                            {job.experience_level}
                          </span>
                        )}

                        {/* Job Title */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-pink-600 transition-colors">
                          <button
                            onClick={() => navigate(`/job-detail-view/${job.id}`)}
                            className="text-left w-full"
                          >
                            {job.title}
                          </button>
                        </h2>

                        {/* Company & Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Icon name="Building2" size={14} />
                            <span>{job.company}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon name="MapPin" size={14} />
                            <span>{job.location}</span>
                          </div>
                          {job.employment_type && (
                            <div className="flex items-center gap-1">
                              <Icon name="Briefcase" size={14} />
                              <span>{job.employment_type}</span>
                            </div>
                          )}
                        </div>

                        {/* Description Excerpt */}
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {formatExcerpt(job.description)}
                        </p>

                        {/* Salary */}
                        {job.salary_min && job.salary_max && (
                          <p className="text-pink-600 font-semibold mb-4">
                            ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} / year
                          </p>
                        )}

                        {/* Read More */}
                        <button
                          onClick={() => navigate(`/job-detail-view/${job.id}`)}
                          className="text-pink-600 hover:text-pink-700 font-medium text-sm inline-flex items-center gap-1"
                        >
                          Read More
                          <Icon name="ArrowRight" size={14} />
                        </button>

                        {/* Footer - Author & Date */}
                        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                            <Icon name="Briefcase" size={14} className="text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">JobFinder Hub</p>
                            <p className="text-xs text-gray-500">Posted: {formatDate(job.created_at)}</p>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <Icon name="Search" size={48} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>

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
                      className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
                    >
                      Search
                    </button>
                  </form>
                </div>

                {/* Categories Widget */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
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
                    {categories.slice(0, 6).map((category) => (
                      <li key={category.id}>
                        <button
                          onClick={() => handleCategoryClick(category.name)}
                          className={`text-sm w-full text-left transition-colors ${
                            searchParams.get('category') === category.name.toLowerCase().replace(/\s+/g, '-')
                              ? 'text-pink-600 font-semibold'
                              : 'text-gray-700 hover:text-pink-600'
                          }`}
                        >
                          {category.name}
                        </button>
                      </li>
                    ))}
                  </ul>
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
      </div>
    </>
  );
};

export default JobSearchResults;
