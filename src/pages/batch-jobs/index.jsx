import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import GlobalHeader from '../../components/ui/GlobalHeader';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import { jobsApi } from '../../lib/database.js';
import { getJobSlug } from '../../utils/slugify';
import { formatSalary } from '../../utils/formatSalary';
import '../../styles/batch-tags.css';

const BatchJobs = () => {
  const { batchYear } = useParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [bookmarkedJobs, setBookmarkedJobs] = useState(new Set());

  // Extract batch year from parameter (e.g., "2025-batch" => "2025")
  const batch = batchYear?.replace('-batch', '');

  useEffect(() => {
    if (batch) {
      loadBatchJobs();
    }
  }, [batch]);

  const loadBatchJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await jobsApi.getJobs({ batch });
      
      if (error) {
        console.error('Error fetching batch jobs:', error);
      } else {
        const transformedJobs = data?.map(job => ({
          id: job.id,
          url_slug: job.url_slug,
          title: job.title,
          company: job.company_name || job.companies?.name || 'Unknown Company',
          location: job.location,
          type: job.employment_type,
          salary: formatSalary(job.salary_min, job.salary_max),
          logo: job.companies?.logo || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center',
          postedDate: formatPostedDate(job.created_at),
          description: job.description,
          batch: job.batch || [],
          tags: job.tags || [],
          eligibility_criteria: job.eligibility_criteria
        })) || [];
        
        setJobs(transformedJobs);
      }
    } catch (err) {
      console.error('Error loading batch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPostedDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const paginatedJobs = jobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookmark = (jobId, e) => {
    e?.stopPropagation();
    const newBookmarked = new Set(bookmarkedJobs);
    if (newBookmarked.has(jobId)) {
      newBookmarked.delete(jobId);
    } else {
      newBookmarked.add(jobId);
    }
    setBookmarkedJobs(newBookmarked);
  };

  const handleJobClick = (job) => {
    const slug = getJobSlug(job);
    navigate(`/job-detail-view/${slug}`);
  };

  return (
    <>
      <Helmet>
        <title>{batch} Batch Jobs | JobFinder Hub</title>
        <meta 
          name="description" 
          content={`Find jobs for ${batch} batch graduates. Explore opportunities for fresh graduates from ${batch} batch.`} 
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <GlobalHeader />
        
        <main className="pt-16">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 mb-4">
                  <Icon name="GraduationCap" size={32} className="text-primary" />
                  <span className="text-4xl font-bold text-primary">{batch}</span>
                </div>
                <h1 className="text-4xl font-bold text-foreground mb-4">
                  {batch} Batch Jobs
                </h1>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-6">
                  Exclusive opportunities for {batch} batch graduates. Find your perfect start to your career journey.
                </p>
                <div className="inline-flex items-center space-x-2 bg-accent/20 px-4 py-2 rounded-full">
                  <Icon name="Briefcase" size={18} className="text-accent" />
                  <span className="text-accent font-semibold">
                    {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'} Available
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Jobs Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="bg-surface border border-border rounded-lg p-6 animate-pulse">
                    <div className="w-12 h-12 bg-muted rounded-lg mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-5 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20">
                <Icon name="Inbox" size={64} className="text-text-secondary mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  No Jobs Found
                </h2>
                <p className="text-text-secondary mb-6">
                  No jobs are currently available for {batch} batch. Check back later or explore other opportunities.
                </p>
                <Button
                  onClick={() => navigate('/job-search-results')}
                  iconName="Search"
                  iconPosition="left"
                >
                  Browse All Jobs
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {paginatedJobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => handleJobClick(job)}
                      className="bg-surface border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer group"
                    >
                      {/* Batch Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {job.batch?.map((b, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                b === batch
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-text-secondary'
                              }`}
                            >
                              {b} Batch
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={(e) => handleBookmark(job.id, e)}
                          className={`p-2 rounded-full transition-all ${
                            bookmarkedJobs.has(job.id)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-text-secondary hover:bg-primary hover:text-primary-foreground'
                          }`}
                        >
                          <Icon 
                            name={bookmarkedJobs.has(job.id) ? "Bookmark" : "BookmarkPlus"} 
                            size={16}
                            className={bookmarkedJobs.has(job.id) ? "fill-current" : ""}
                          />
                        </button>
                      </div>

                      {/* Company Logo */}
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted mb-4">
                        <Image
                          src={job.logo}
                          alt={`${job.company} logo`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Job Info */}
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {job.title}
                      </h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-text-secondary text-sm">
                          <Icon name="Building2" size={14} />
                          <span className="line-clamp-1">{job.company}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-text-secondary text-sm">
                          <Icon name="MapPin" size={14} />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2 text-text-secondary">
                            <Icon name="Briefcase" size={14} />
                            <span>{job.type}</span>
                          </div>
                          {job.salary !== 'Not Disclosed' && (
                            <span className="text-primary font-semibold text-xs">{job.salary}</span>
                          )}
                        </div>
                      </div>

                      {/* Eligibility */}
                      {job.eligibility_criteria && (
                        <div className="mb-4 p-2 bg-accent/10 border border-accent/20 rounded text-xs text-text-secondary">
                          <Icon name="CheckCircle" size={12} className="inline mr-1 text-accent" />
                          {job.eligibility_criteria}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center space-x-2 text-xs text-text-secondary">
                          <Icon name="Clock" size={12} />
                          <span>{job.postedDate}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          iconName="ArrowRight"
                          iconPosition="right"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJobClick(job);
                          }}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {jobs.length > itemsPerPage && (
                  <Pagination
                    totalItems={jobs.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default BatchJobs;

