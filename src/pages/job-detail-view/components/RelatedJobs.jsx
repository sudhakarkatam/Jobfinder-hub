import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { getJobSlug } from '../../../utils/slugify';

const RelatedJobs = ({ jobs, currentJobId }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef?.current) {
      const scrollAmount = 320; // Width of one card plus gap
      scrollRef?.current?.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not disclosed';
    if (min && max) return `$${min?.toLocaleString()} - $${max?.toLocaleString()}`;
    if (min) return `From $${min?.toLocaleString()}`;
    return `Up to $${max?.toLocaleString()}`;
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  // Filter out current job
  const relatedJobs = jobs?.filter(job => job?.id !== currentJobId);

  if (relatedJobs?.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-6 elevation-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Briefcase" size={20} />
          <span>Related Jobs</span>
        </h3>
        
        <div className="hidden md:flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('left')}
            iconName="ChevronLeft"
            className="w-10 h-10 p-0"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('right')}
            iconName="ChevronRight"
            className="w-10 h-10 p-0"
          />
        </div>
      </div>
      {/* Mobile: Vertical Stack */}
      <div className="md:hidden space-y-4">
               {relatedJobs?.slice(0, 3)?.map((job) => (
                 <Link
                   key={job?.id}
                   to={`/job-detail-view/${getJobSlug(job)}`}
                   className="block bg-muted hover:bg-muted/80 rounded-lg p-4 transition-micro"
                 >
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-border flex-shrink-0">
                <Image
                  src={job?.company_logo}
                  alt={`${job?.company} logo`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground text-sm mb-1 truncate">
                  {job?.title}
                </h4>
                <p className="text-text-secondary text-xs mb-2">{job?.company}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-text-secondary">
                    <Icon name="MapPin" size={12} />
                    <span>{job?.location}</span>
                  </div>
                  <span className="text-xs text-text-secondary">
                    {getTimeAgo(job?.posted_date)}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {/* Desktop: Horizontal Scroll */}
      <div className="hidden md:block">
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
                 {relatedJobs?.map((job) => (
                   <Link
                     key={job?.id}
                     to={`/job-detail-view/${getJobSlug(job)}`}
                     className="flex-shrink-0 w-80 bg-muted hover:bg-muted/80 rounded-lg p-6 transition-micro group"
                   >
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-border">
                  <Image
                    src={job?.company_logo}
                    alt={`${job?.company} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-micro line-clamp-2">
                    {job?.title}
                  </h4>
                  <p className="text-text-secondary text-sm mb-2">{job?.company}</p>
                  
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <Icon name="MapPin" size={14} />
                    <span>{job?.location}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {job?.employment_type}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                    {job?.experience_level}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-foreground">
                    {formatSalary(job?.salary_min, job?.salary_max)}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {getTimeAgo(job?.posted_date)}
                  </div>
                </div>

                <p className="text-sm text-text-secondary line-clamp-2">
                  {job?.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* View All Related Jobs */}
      <div className="mt-6 text-center">
        <Link
          to="/job-search-results"
          className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-micro"
        >
          <span>View all similar jobs</span>
          <Icon name="ArrowRight" size={16} />
        </Link>
      </div>
    </div>
  );
};

export default RelatedJobs;