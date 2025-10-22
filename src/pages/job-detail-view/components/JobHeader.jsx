import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const JobHeader = ({ job, onApply, onBookmark, isBookmarked }) => {
  const [shareMenuOpen, setShareMenuOpen] = useState(false);

  const handleShare = (platform) => {
    const url = window.location?.href;
    const title = `${job?.title} at ${job?.company}`;
    
    switch (platform) {
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`);
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this job opportunity: ${url}`)}`;
        break;
      default:
        break;
    }
    setShareMenuOpen(false);
  };

  const formatSalary = (min, max) => {
    // Return null if no salary data - will hide the section
    if (!min && !max) return null;
    
    // Handle text salary (e.g., "$80k-$120k", "Negotiable")
    // If it's already formatted text, just display it
    if (min && isNaN(Number(min))) {
      // Text salary - display as is
      if (max && isNaN(Number(max))) {
        return `${min} - ${max}`;
      }
      return min;
    }
    
    // Handle numeric salary
    if (min && max) {
      const minNum = Number(min);
      const maxNum = Number(max);
      if (!isNaN(minNum) && !isNaN(maxNum)) {
        return `$${minNum.toLocaleString()} - $${maxNum.toLocaleString()}`;
      }
    }
    if (min) {
      const minNum = Number(min);
      return !isNaN(minNum) ? `From $${minNum.toLocaleString()}` : min;
    }
    if (max) {
      const maxNum = Number(max);
      return !isNaN(maxNum) ? `Up to $${maxNum.toLocaleString()}` : max;
    }
    return null;
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

  return (
    <div className="bg-surface border border-border rounded-lg p-6 elevation-2">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Company Logo & Basic Info */}
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border border-border flex-shrink-0">
            <Image
              src={job?.company_logo}
              alt={`${job?.company} logo`}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl lg:text-3xl font-semibold text-foreground mb-2 leading-tight">
              {job?.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-text-secondary mb-4">
              <div className="flex items-center space-x-2">
                <Icon name="Building2" size={16} />
                <span className="font-medium text-foreground">{job?.company}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={16} />
                <span>{job?.location}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} />
                <span>{getTimeAgo(job?.posted_date)}</span>
              </div>
            </div>

            {/* Job Meta Info */}
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                {job?.employment_type}
              </span>
              
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent/10 text-accent">
                {job?.experience_level}
              </span>
              
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary/10 text-secondary">
                {job?.category}
              </span>
            </div>

            {/* Salary - Only show if available */}
            {formatSalary(job?.salary_min, job?.salary_max) && (
              <div className="text-lg font-semibold text-foreground mb-4">
                {formatSalary(job?.salary_min, job?.salary_max)}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-48">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onBookmark}
              className="flex-1 sm:flex-none lg:flex-1"
              iconName={isBookmarked ? "BookmarkCheck" : "Bookmark"}
              iconPosition="left"
            >
              {isBookmarked ? 'Saved' : 'Save'}
            </Button>
            
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShareMenuOpen(!shareMenuOpen)}
                className="flex-1 sm:flex-none lg:flex-1"
                iconName="Share2"
                iconPosition="left"
              >
                Share
              </Button>
              
              {shareMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-popover border border-border rounded-md elevation-3 z-50 animate-slide-down">
                  <div className="py-2">
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-micro flex items-center space-x-2"
                    >
                      <Icon name="Linkedin" size={16} />
                      <span>Share on LinkedIn</span>
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-micro flex items-center space-x-2"
                    >
                      <Icon name="Twitter" size={16} />
                      <span>Share on Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare('email')}
                      className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-micro flex items-center space-x-2"
                    >
                      <Icon name="Mail" size={16} />
                      <span>Share via Email</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Application Status */}
      {job?.application_status && (
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon 
              name={job?.application_status === 'applied' ? 'CheckCircle' : 'Clock'} 
              size={16} 
              className={job?.application_status === 'applied' ? 'text-success' : 'text-warning'} 
            />
            <span className="text-sm font-medium text-foreground">
              {job?.application_status === 'applied' ? 'Application Submitted' : 'Application In Progress'}
            </span>
            <span className="text-sm text-text-secondary">
              • {job?.application_date}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobHeader;