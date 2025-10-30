import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const JobMatchCard = ({ job }) => {
  const navigate = useNavigate();
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-primary';
    return 'text-warning';
  };
  
  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-success/10 border-success/20';
    if (score >= 60) return 'bg-primary/10 border-primary/20';
    return 'bg-warning/10 border-warning/20';
  };
  
  const handleViewDetails = () => {
    if (job.url_slug) {
      navigate(`/job-detail-view/${job.url_slug}`);
    }
  };
  
  return (
    <div className="job-match-card bg-surface border border-border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer"
         onClick={handleViewDetails}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-foreground mb-2 hover:text-primary transition-colors">
            {job.title}
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary mb-2">
            <div className="flex items-center space-x-1">
              <Icon name="Building2" size={14} />
              <span>{job.company || job.company_name || 'Company'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="MapPin" size={14} />
              <span>{job.location}</span>
            </div>
          </div>
        </div>
        
        {/* Match Score Badge */}
        <div className={`match-score-badge flex-shrink-0 ${getScoreBgColor(job.matchScore)} border rounded-lg p-3 text-center min-w-[80px]`}>
          <div className={`text-3xl font-bold ${getScoreColor(job.matchScore)}`}>
            {job.matchScore}%
          </div>
          <div className="text-xs text-text-secondary mt-1">Match</div>
        </div>
      </div>
      
      {/* Matching Skills */}
      {job.matchingSkills && job.matchingSkills.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="CheckCircle2" size={16} className="text-success" />
            <span className="text-sm font-medium text-foreground">Matching Skills:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {job.matchingSkills.slice(0, 5).map((skill, index) => (
              <span 
                key={index}
                className="skill-badge-match inline-flex items-center px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium"
              >
                <Icon name="Check" size={12} className="mr-1" />
                {skill}
              </span>
            ))}
            {job.matchingSkills.length > 5 && (
              <span className="inline-flex items-center px-3 py-1 bg-muted text-text-secondary rounded-full text-sm">
                +{job.matchingSkills.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Match Reason */}
      {job.matchReason && (
        <div className="mb-4 p-3 bg-muted rounded-md">
          <div className="flex items-start space-x-2">
            <Icon name="Sparkles" size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground">
              <span className="font-medium">AI Insight: </span>
              {job.matchReason}
            </p>
          </div>
        </div>
      )}
      
      {/* Job Meta */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
          {job.employment_type}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent/10 text-accent">
          {job.experience_level}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary/10 text-secondary">
          {job.category}
        </span>
      </div>
      
      {/* View Details Button */}
      <Button
        variant="outline"
        className="w-full"
        iconName="ArrowRight"
        iconPosition="right"
        onClick={(e) => {
          e.stopPropagation();
          handleViewDetails();
        }}
      >
        View Job Details
      </Button>
    </div>
  );
};

export default JobMatchCard;

