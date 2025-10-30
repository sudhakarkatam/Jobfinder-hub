import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Pagination from '../../../components/ui/Pagination';
import { jobsApi } from '../../../lib/database.js';
import { getJobSlug } from '../../../utils/slugify';
import { formatSalary } from '../../../utils/formatSalary';

const FeaturedJobs = () => {
  const navigate = useNavigate();
  const [bookmarkedJobs, setBookmarkedJobs] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch featured jobs from database
  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        setLoading(true);
        const { data, error } = await jobsApi.getJobs({ featured: true });
        
        if (error) {
          setError(error.message);
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
            salaryMin: job.salary_min,
            logo: job.companies?.logo || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center',
            featured: job.featured,
            urgent: job.urgent,
            postedDate: formatPostedDate(job.created_at),
            postedTimestamp: new Date(job.created_at).getTime(),
            description: job.description,
            skills: job.description?.split(' ').filter(word => 
              ['React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'AWS', 'Docker', 'SQL', 'Machine Learning', 'Figma', 'Agile'].includes(word)
            ) || [],
            benefits: ['Health Insurance', 'Remote Work', '401k Match'], // Default benefits
            experienceLevel: job.experience_level,
            companySize: '50-200', // Default company size
            rating: 4.5 // Default rating
          })) || [];
          
          setFeaturedJobs(transformedJobs);
        }
      } catch (err) {
        setError('Failed to fetch featured jobs');
        console.error('Error fetching featured jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

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
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Filter and sort jobs - simplified
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = [...featuredJobs];

    // Sort by newest first
    filtered?.sort((a, b) => b?.postedTimestamp - a?.postedTimestamp);

    // Paginate
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered?.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage, featuredJobs]);

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of featured jobs section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Icon name="TrendingUp" size={24} className="text-accent fill-current" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Trending Jobs
            </h2>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: 0.5 }}
            >
              <Icon name="TrendingUp" size={24} className="text-accent fill-current" />
            </motion.div>
          </div>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Discover the most popular and in-demand job opportunities right now
          </p>
          <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-text-secondary">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span>{filteredAndSortedJobs?.length} trending positions available</span>
          </div>
        </motion.div>


        {/* Jobs List */}
        <AnimatePresence mode="wait">
          <motion.div
            className="flex flex-col space-y-4 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {loading ? (
              <div className="text-center py-12">
                <p className="text-lg text-text-secondary">Loading trending jobs...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-error">
                <p className="text-lg text-text-secondary">{error}</p>
              </div>
            ) : filteredAndSortedJobs?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-text-secondary">No trending jobs found matching your criteria.</p>
              </div>
            ) : (
              filteredAndSortedJobs?.map((job, index) => (
              <motion.div
                key={job?.id}
                variants={itemVariants}
                layout
                onClick={() => handleJobClick(job)}
                className="flex items-center gap-4 p-4 bg-surface border border-border rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer group"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
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
              </motion.div>
            ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {featuredJobs?.length > itemsPerPage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <Pagination
              totalItems={featuredJobs?.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </motion.div>
        )}
        
        {/* View All */}
        <div className="text-center mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/job-search-results?featured=true')}
              iconName="ArrowRight"
              iconPosition="right"
              className="px-8"
            >
              View All Trending Jobs
            </Button> 
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;