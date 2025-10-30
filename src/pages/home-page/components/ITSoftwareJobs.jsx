import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Pagination from '../../../components/ui/Pagination';
import { jobsApi } from '../../../lib/database.js';
import { getJobSlug } from '../../../utils/slugify';
import { formatSalary } from '../../../utils/formatSalary';

const ITSoftwareJobs = () => {
  const navigate = useNavigate();
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [bookmarkedJobs, setBookmarkedJobs] = useState(new Set());

  useEffect(() => {
    loadITSoftwareJobs();
  }, []);

  const loadITSoftwareJobs = async () => {
    setLoading(true);
    try {
      // Fetch jobs filtered by Technology or Development categories
      const { data, error } = await jobsApi.getJobs({ 
        categories: ['Technology', 'Development'] 
      });
      
      if (error) {
        console.error('Error fetching IT/Software jobs:', error);
      } else {
        // Transform database data to match component expectations
        const transformedJobs = data?.map(job => ({
          id: job.id,
          url_slug: job.url_slug,
          title: job.title,
          // Use company_name if available, otherwise fall back to companies.name
          company: job.company_name || job.companies?.name || 'Unknown Company',
          location: job.location,
          type: job.employment_type,
          salary: formatSalary(job.salary_min, job.salary_max),
          logo: job.companies?.logo || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center',
          postedDate: formatPostedDate(job.created_at),
          postedTimestamp: new Date(job.created_at).getTime(),
          description: job.description,
          skills: extractSkillsFromDescription(job.description),
          isNew: isJobNew(job.created_at),
          batch: job.batch || [],
          tags: job.tags || []
        })) || [];
        
        setAllJobs(transformedJobs);
      }
    } catch (err) {
      console.error('Error loading IT/Software jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format posted date
  const formatPostedDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  // Helper function to extract skills from description
  const extractSkillsFromDescription = (description) => {
    if (!description) return [];
    const skills = ['React', 'JavaScript', 'Python', 'Node.js', 'CSS', 'HTML', 'TypeScript', 'AWS', 'Docker', 'SQL', 'Machine Learning', 'Figma', 'Agile', 'WordPress', 'SEO', 'Social Media', 'Adobe Creative Suite', 'Illustrator', 'Photoshop', 'InDesign', 'Sales', 'CRM', 'Communication', 'Negotiation'];
    return skills.filter(skill => description.toLowerCase().includes(skill.toLowerCase()));
  };

  // Helper function to check if job is new (posted within 24 hours)
  const isJobNew = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    return diffHours < 24;
  };

  // Paginated jobs
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allJobs.slice(startIndex, endIndex);
  }, [allJobs, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookmark = (jobId, e) => {
    e?.stopPropagation();
    const newBookmarked = new Set(bookmarkedJobs);
    if (newBookmarked?.has(jobId)) {
      newBookmarked?.delete(jobId);
    } else {
      newBookmarked?.add(jobId);
    }
    setBookmarkedJobs(newBookmarked);
  };

  const handleJobClick = (job) => {
    const slug = getJobSlug(job);
    navigate(`/job-detail-view/${slug}`);
  };

  const handleApplyClick = (job, e) => {
    e?.stopPropagation();
    const slug = getJobSlug(job);
    navigate(`/job-detail-view/${slug}#apply`);
  };


  return (
    <section className="py-16 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Trending IT/Software Jobs</h2>
            <p className="text-text-secondary">Discover the most popular technology and development opportunities</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/job-search-results?category=Technology')}
            iconName="ArrowRight"
            iconPosition="right"
          >
            View All
          </Button>
        </div>

        {/* Jobs List */}
        <div className="flex flex-col space-y-4 mb-8">
          {paginatedJobs?.map((job) => (
            <div
              key={job?.id}
              onClick={() => handleJobClick(job)}
              className="flex items-center gap-4 p-4 bg-surface border border-border rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              {/* Company Logo */}
              <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={job?.logo}
                  alt={`${job?.company} logo`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Job Details - All Inline */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                  {job?.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-text-secondary flex-wrap">
                  <span className="font-medium">{job?.company}</span>
                  <span>•</span>
                  <span>{job?.location}</span>
                  <span>•</span>
                  <span>{job?.type}</span>
                  <span>•</span>
                  <span className="text-primary font-semibold">{job?.salary}</span>
                  {job?.skills?.length > 0 && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        {job?.skills?.slice(0, 2)?.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {job?.skills?.length > 2 && (
                          <span className="text-xs text-text-secondary">
                            +{job?.skills?.length - 2} more
                          </span>
                        )}
                      </div>
                    </>
                  )}
                  <span>•</span>
                  <span>{job?.postedDate}</span>
                </div>
              </div>

              {/* Apply Button */}
              <Button
                size="sm"
                onClick={(e) => handleApplyClick(job, e)}
                className="flex-shrink-0 group-hover:shadow-md"
              >
                Apply
              </Button>
            </div>
          ))}

          {/* Loading Skeletons */}
          {loading && (
            <>
              <div className="flex items-center gap-4 p-4 bg-surface border border-border rounded-lg animate-pulse">
                <div className="w-12 h-12 bg-muted rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
                <div className="w-16 h-8 bg-muted rounded"></div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-surface border border-border rounded-lg animate-pulse">
                <div className="w-12 h-12 bg-muted rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
                <div className="w-16 h-8 bg-muted rounded"></div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-surface border border-border rounded-lg animate-pulse">
                <div className="w-12 h-12 bg-muted rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
                <div className="w-16 h-8 bg-muted rounded"></div>
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {allJobs?.length > itemsPerPage && (
          <div className="mt-8">
            <Pagination
              totalItems={allJobs?.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default ITSoftwareJobs;

