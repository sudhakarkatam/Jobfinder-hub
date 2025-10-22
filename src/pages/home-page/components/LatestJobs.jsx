import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Pagination from '../../../components/ui/Pagination';
import { jobsApi } from '../../../lib/database.js';
import { getJobSlug } from '../../../utils/slugify';
import { formatSalary } from '../../../utils/formatSalary';

const LatestJobs = () => {
  const navigate = useNavigate();
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [bookmarkedJobs, setBookmarkedJobs] = useState(new Set());

  useEffect(() => {
    loadAllJobs();
  }, []);

  const loadAllJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await jobsApi.getJobs();
      
      if (error) {
        console.error('Error fetching jobs:', error);
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
          isNew: isJobNew(job.created_at)
        })) || [];
        
        setAllJobs(transformedJobs);
      }
    } catch (err) {
      console.error('Error loading jobs:', err);
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

  const JobSkeleton = () => (
    <div className="bg-surface border border-border rounded-lg p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-muted rounded-lg"></div>
        <div className="w-8 h-8 bg-muted rounded-full"></div>
      </div>
      <div className="space-y-3">
        <div className="h-5 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
        <div className="flex space-x-2">
          <div className="h-6 bg-muted rounded w-16"></div>
          <div className="h-6 bg-muted rounded w-16"></div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Latest Jobs</h2>
            <p className="text-text-secondary">Fresh opportunities posted recently</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/job-search-results')}
            iconName="ArrowRight"
            iconPosition="right"
          >
            View All Jobs
          </Button>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedJobs?.map((job) => (
                   <div
                     key={job?.id}
                     onClick={() => handleJobClick(job)}
                     className="bg-surface border border-border rounded-lg p-6 hover:shadow-md transition-all duration-300 cursor-pointer group relative"
                   >
              {/* New Badge */}
              {job?.isNew && (
                <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-semibold">
                  NEW
                </div>
              )}

              {/* Company Logo & Bookmark */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={job?.logo}
                    alt={`${job?.company} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={(e) => handleBookmark(job?.id, e)}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    bookmarkedJobs?.has(job?.id)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-text-secondary hover:bg-primary hover:text-primary-foreground'
                  }`}
                >
                  <Icon 
                    name={bookmarkedJobs?.has(job?.id) ? "Bookmark" : "BookmarkPlus"} 
                    size={16} 
                    className={bookmarkedJobs?.has(job?.id) ? "fill-current" : ""}
                  />
                </button>
              </div>

              {/* Job Details */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {job?.title}
                </h3>
                <div className="flex items-center space-x-2 text-text-secondary mb-2">
                  <Icon name="Building2" size={14} />
                  <span className="text-sm">{job?.company}</span>
                </div>
                <div className="flex items-center space-x-2 text-text-secondary mb-2">
                  <Icon name="MapPin" size={14} />
                  <span className="text-sm">{job?.location}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-text-secondary">
                    <Icon name="Clock" size={14} />
                    <span>{job?.type}</span>
                  </div>
                  <div className="text-primary font-semibold">
                    {job?.salary}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                {job?.description}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {job?.skills?.slice(0, 2)?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {job?.skills?.length > 2 && (
                  <span className="px-2 py-1 bg-muted text-text-secondary text-xs rounded-full">
                    +{job?.skills?.length - 2} more
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center space-x-2 text-xs text-text-secondary">
                  <Icon name="Calendar" size={12} />
                  <span>{job?.postedDate}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => handleApplyClick(job, e)}
                  iconName="ArrowRight"
                  iconPosition="right"
                >
                  Apply
                </Button>
              </div>
            </div>
          ))}

          {/* Loading Skeletons */}
          {loading && (
            <>
              <JobSkeleton />
              <JobSkeleton />
              <JobSkeleton />
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

export default LatestJobs;