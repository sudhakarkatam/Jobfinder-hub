import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { jobsApi } from '../../../lib/database';
import { getJobSlug } from '../../../utils/slugify';
import { formatSalary } from '../../../utils/formatSalary';

const LatestJobsCarousel = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const autoPlayRef = useRef(null);

  // Detect screen size for responsive carousel
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getJobsPerSlide = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  useEffect(() => {
    fetchLatestJobs();
  }, []);

  useEffect(() => {
    if (isPlaying && jobs.length > 0) {
      autoPlayRef.current = setInterval(() => {
        const jobsPerSlide = getJobsPerSlide();
        setCurrentIndex((prev) => {
          const next = prev + jobsPerSlide;
          return next >= jobs.length ? 0 : next;
        });
      }, 3000); // Auto-scroll every 3 seconds
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isPlaying, jobs.length, isMobile, isTablet]);

  const fetchLatestJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await jobsApi.getJobs();
      if (data) {
        // Show last 20 jobs regardless of date
        const uniqueJobs = [];
        const seenIds = new Set();
        
        for (const job of data) {
          // No date filter - show all recent jobs
          if (!seenIds.has(job.id)) {
            seenIds.add(job.id);
            uniqueJobs.push({
              id: job.id,
              url_slug: job.url_slug,
              title: job.title,
              // Use company_name if available, otherwise fall back to companies.name
              company: job.company_name || job.companies?.name || 'Unknown Company',
              logo: job.companies?.logo || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
              location: job.location,
              type: job.employment_type,
              salary: formatSalary(job.salary_min, job.salary_max),
              postedDate: formatPostedDate(job.created_at),
              createdAt: job.created_at,
              urgent: job.urgent,
              featured: job.featured
            });
          }
          if (uniqueJobs.length >= 20) break;
        }
        
        setJobs(uniqueJobs);
      }
    } catch (error) {
      console.error('Error fetching latest jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPostedDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  const handlePrevious = () => {
    const jobsPerSlide = getJobsPerSlide();
    setCurrentIndex((prev) => (prev === 0 ? jobs.length - jobsPerSlide : Math.max(0, prev - jobsPerSlide)));
  };

  const handleNext = () => {
    const jobsPerSlide = getJobsPerSlide();
    setCurrentIndex((prev) => {
      const next = prev + jobsPerSlide;
      return next >= jobs.length ? 0 : next;
    });
  };

  const getDisplayJobs = () => {
    if (jobs.length === 0) return [];
    const jobsPerSlide = getJobsPerSlide();
    if (jobs.length <= jobsPerSlide) return jobs;
    
    const displayJobs = [];
    for (let i = 0; i < jobsPerSlide; i++) {
      const index = (currentIndex + i) % jobs.length;
      displayJobs.push(jobs[index]);
    }
    return displayJobs;
  };

  const handleJobClick = (job) => {
    const slug = getJobSlug(job);
    navigate(`/job-detail-view/${slug}`);
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="text-center">
          <p className="text-gray-600">Loading latest jobs...</p>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) return null;

  return (
    <div className="relative">
      {/* Header */}
             <div className="flex items-center justify-between mb-8">
                 <div>
                   <div className="flex items-center space-x-3">
                     <div className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                       🔥 THIS WEEK
                     </div>
                     <span className="text-gray-600">{jobs.length} new positions</span>
                   </div>
                   <h2 className="text-2xl font-bold text-gray-900 mt-2">
                     Fresh Opportunities Added This Week
                   </h2>
                 </div>

          {/* Play/Pause Control */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all"
            >
              <Icon name={isPlaying ? "Pause" : "Play"} size={16} />
              <span className="text-sm font-medium">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Navigation Buttons */}
        <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-pink-500 hover:border-pink-500 hover:text-white transition-all shadow-lg"
          >
            <Icon name="ChevronLeft" size={24} />
        </button>

        <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-pink-500 hover:border-pink-500 hover:text-white transition-all shadow-lg"
          >
            <Icon name="ChevronRight" size={24} />
        </button>

        {/* Jobs Display */}
        <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
              >
                {getDisplayJobs().map((job, index) => (
                  <motion.div
                    key={job.id}
                    onClick={() => handleJobClick(job)}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden group"
                    whileHover={{ y: -5 }}
                  >
                    {/* Badge */}
                    {(job.urgent || job.featured) && (
                      <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 text-xs font-semibold text-center">
                        {job.urgent && '⚡ URGENT HIRING'}
                        {job.featured && !job.urgent && '⭐ FEATURED'}
                      </div>
                    )}

                    <div className="p-6">
                      {/* Company Logo */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                          <Image
                            src={job.logo}
                            alt={job.company}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {job.postedDate}
                        </div>
                      </div>

                      {/* Job Info */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors line-clamp-2">
                        {job.title}
                      </h3>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-2">
                          <Icon name="Building2" size={14} />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icon name="MapPin" size={14} />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icon name="Briefcase" size={14} />
                          <span>{job.type}</span>
                        </div>
                      </div>

                      {/* Salary */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="text-pink-600 font-semibold">
                          {job.salary}
                        </div>
                        <Icon name="ArrowRight" size={16} className="text-gray-400 group-hover:text-pink-600 transition-colors" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: Math.ceil(jobs.length / getJobsPerSlide()) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * getJobsPerSlide())}
              className={`w-2 h-2 rounded-full transition-all ${
                Math.floor(currentIndex / getJobsPerSlide()) === index
                  ? 'bg-pink-500 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
            ))}
          </div>
      </div>

      {/* View All Link */}
             <div className="text-center mt-8">
                 <button
                   onClick={() => navigate('/job-search-results')}
                   className="inline-flex items-center space-x-2 text-pink-600 hover:text-pink-700 font-semibold"
                 >
                   <span>View All Jobs This Week</span>
                   <Icon name="ArrowRight" size={16} />
                 </button>
               </div>
    </div>
  );
};

export default LatestJobsCarousel;

