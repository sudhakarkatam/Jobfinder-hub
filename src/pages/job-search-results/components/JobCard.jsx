import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const JobCard = ({ job, onBookmark, onShare }) => {
  const [isBookmarked, setIsBookmarked] = useState(job?.isBookmarked || false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleBookmark = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsBookmarked(!isBookmarked);
    if (onBookmark) {
      onBookmark(job?.id, !isBookmarked);
    }
  };

  const handleShare = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setShowShareMenu(!showShareMenu);
  };

  const handleShareOption = (platform) => {
    if (onShare) {
      onShare(job?.id, platform);
    }
    setShowShareMenu(false);
  };

  const formatSalary = (min, max) => {
    // Convert to strings and check if valid
    const minStr = min ? String(min).trim() : '';
    const maxStr = max ? String(max).trim() : '';
    
    // If both are empty, return "Salary not disclosed"
    if (!minStr && !maxStr) return 'Salary not disclosed';
    
    // Handle text salary (e.g., "$80k-$120k", "Negotiable")
    if (minStr && isNaN(Number(minStr))) {
      if (maxStr && isNaN(Number(maxStr))) {
        return `${minStr} - ${maxStr}`;
      }
      return minStr;
    }
    
    // Handle numeric salary
    if (minStr && maxStr) {
      const minNum = Number(minStr);
      const maxNum = Number(maxStr);
      if (!isNaN(minNum) && !isNaN(maxNum)) {
        return `$${minNum.toLocaleString()} - $${maxNum.toLocaleString()}`;
      }
    }
    if (minStr) {
      const minNum = Number(minStr);
      return !isNaN(minNum) ? `From $${minNum.toLocaleString()}` : minStr;
    }
    if (maxStr) {
      const maxNum = Number(maxStr);
      return !isNaN(maxNum) ? `Up to $${maxNum.toLocaleString()}` : maxStr;
    }
    return 'Salary not disclosed';
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just posted';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  const getBadgeColor = (type) => {
    const colors = {
      'full-time': 'bg-primary text-primary-foreground',
      'part-time': 'bg-secondary text-secondary-foreground',
      'contract': 'bg-warning text-warning-foreground',
      'freelance': 'bg-accent text-accent-foreground',
      'internship': 'bg-success text-success-foreground'
    };
    return colors?.[type] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:elevation-2 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4 flex-1">
          {/* Company Logo */}
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
            <Image
              src={job?.company?.logo}
              alt={`${job?.company?.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Job Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Link
                  to={`/job-detail-view?id=${job?.id}`}
                  className="block group-hover:text-primary transition-micro"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-2">
                    {job?.title}
                  </h3>
                </Link>
                <p className="text-text-secondary font-medium mb-2">
                  {job?.company?.name}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={handleBookmark}
                  className={`p-2 rounded-md transition-micro ${
                    isBookmarked
                      ? 'text-primary bg-primary/10' :'text-text-secondary hover:text-foreground hover:bg-muted'
                  }`}
                  title={isBookmarked ? 'Remove bookmark' : 'Bookmark job'}
                >
                  <Icon name={isBookmarked ? "Bookmark" : "BookmarkPlus"} size={16} />
                </button>

                <div className="relative">
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-md text-text-secondary hover:text-foreground hover:bg-muted transition-micro"
                    title="Share job"
                  >
                    <Icon name="Share2" size={16} />
                  </button>

                  {/* Share Menu */}
                  {showShareMenu && (
                    <div className="absolute right-0 top-full mt-1 bg-popover border border-border rounded-md elevation-3 z-50 animate-slide-down">
                      <div className="py-1 min-w-[120px]">
                        <button
                          onClick={() => handleShareOption('copy')}
                          className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-micro"
                        >
                          <Icon name="Copy" size={14} />
                          <span>Copy Link</span>
                        </button>
                        <button
                          onClick={() => handleShareOption('linkedin')}
                          className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-micro"
                        >
                          <Icon name="Linkedin" size={14} />
                          <span>LinkedIn</span>
                        </button>
                        <button
                          onClick={() => handleShareOption('twitter')}
                          className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-micro"
                        >
                          <Icon name="Twitter" size={14} />
                          <span>Twitter</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-3">
              <div className="flex items-center space-x-1">
                <Icon name="MapPin" size={14} />
                <span>{job?.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="DollarSign" size={14} />
                <span>{formatSalary(job?.salaryMin, job?.salaryMax)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={14} />
                <span>{getTimeAgo(job?.postedDate)}</span>
              </div>
            </div>

            {/* Job Type & Remote Badge */}
            <div className="flex items-center space-x-2 mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(job?.type)}`}>
                {job?.type?.charAt(0)?.toUpperCase() + job?.type?.slice(1)?.replace('-', ' ')}
              </span>
              {job?.isRemote && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                  Remote
                </span>
              )}
              {job?.isUrgent && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-error text-error-foreground">
                  Urgent
                </span>
              )}
            </div>

            {/* Job Description Preview */}
            <p className="text-sm text-text-secondary line-clamp-2 mb-4">
              {job?.description}
            </p>

            {/* Skills */}
            {job?.skills && job?.skills?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {job?.skills?.slice(0, 4)?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                  >
                    {skill}
                  </span>
                ))}
                {job?.skills?.length > 4 && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                    +{job?.skills?.length - 4} more
                  </span>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Button
                as="a"
                href={job?.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                iconName="ExternalLink"
                iconPosition="right"
                className="flex-1 sm:flex-none"
              >
                Apply Now
              </Button>
              <Link to={`/job-detail-view?id=${job?.id}`}>
                <Button
                  variant="outline"
                  iconName="Eye"
                  iconPosition="left"
                  className="hidden sm:flex"
                >
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Company Rating & Reviews */}
      {job?.company?.rating && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {[...Array(5)]?.map((_, i) => (
                <Icon
                  key={i}
                  name="Star"
                  size={12}
                  className={i < Math.floor(job?.company?.rating) ? 'text-warning fill-current' : 'text-muted'}
                />
              ))}
            </div>
            <span className="text-sm text-text-secondary">
              {job?.company?.rating} ({job?.company?.reviewCount} reviews)
            </span>
          </div>
          
          {job?.applicantCount && (
            <div className="flex items-center space-x-1 text-sm text-text-secondary">
              <Icon name="Users" size={14} />
              <span>{job?.applicantCount} applicants</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobCard;