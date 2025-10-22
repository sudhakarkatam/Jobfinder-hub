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
  const itemsPerPage = 12;
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
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Icon name="Star" size={24} className="text-warning fill-current" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Featured Jobs
            </h2>
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: 0.5 }}
            >
              <Icon name="Star" size={24} className="text-warning fill-current" />
            </motion.div>
          </div>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Hand-picked opportunities from top companies looking for exceptional talent
          </p>
          <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-text-secondary">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span>{filteredAndSortedJobs?.length} featured positions available</span>
          </div>
        </motion.div>


        {/* Jobs Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-text-secondary">Loading featured jobs...</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-12 text-error">
                <p className="text-lg text-text-secondary">{error}</p>
              </div>
            ) : filteredAndSortedJobs?.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-text-secondary">No featured jobs found matching your criteria.</p>
              </div>
            ) : (
              filteredAndSortedJobs?.map((job, index) => (
              <motion.div
                key={job?.id}
                variants={itemVariants}
                layout
                onClick={() => handleJobClick(job)}
                className="bg-surface/90 backdrop-blur-sm border border-border rounded-xl p-6 hover:shadow-xl transition-all duration-500 cursor-pointer group relative overflow-hidden"
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Featured Badge */}
                <div className="absolute top-0 right-0 bg-gradient-to-r from-warning to-accent text-white px-3 py-1 rounded-bl-lg text-xs font-semibold shadow-sm">
                  FEATURED
                </div>

                {/* Urgent Badge */}
                {job?.urgent && (
                  <motion.div 
                    className="absolute top-8 right-0 bg-error text-error-foreground px-3 py-1 rounded-bl-lg text-xs font-semibold shadow-sm"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    URGENT
                  </motion.div>
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
                      <motion.button
                        onClick={(e) => handleBookmark(job?.id, e)}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          bookmarkedJobs?.has(job?.id)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-text-secondary hover:bg-primary hover:text-primary-foreground'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Icon 
                          name={bookmarkedJobs?.has(job?.id) ? "Bookmark" : "BookmarkPlus"} 
                          size={16} 
                          className={bookmarkedJobs?.has(job?.id) ? "fill-current" : ""}
                        />
                      </motion.button>
                    </div>
                    {/* Job Details */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {job?.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-text-secondary mb-2">
                        <Icon name="Building2" size={14} />
                        <span className="text-sm">{job?.company}</span>
                        <div className="flex items-center space-x-1 ml-auto">
                          <Icon name="Star" size={12} className="text-warning fill-current" />
                          <span className="text-xs">{job?.rating}</span>
                        </div>
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
                      {job?.skills?.slice(0, 3)?.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {job?.skills?.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-text-secondary text-xs rounded-full">
                          +{job?.skills?.length - 3} more
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
                        onClick={(e) => handleApplyClick(job, e)}
                        iconName="ArrowRight"
                        iconPosition="right"
                        className="group-hover:shadow-md"
                      >
                        Apply Now
                      </Button>
                      </div>
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
              View All Featured Jobs
            </Button> 
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;