import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const JobDescription = ({ job, onApply }) => {
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    responsibilities: true,
    requirements: true,
    benefits: false,
    company: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const renderSection = (title, content, sectionKey, icon) => {
    const isExpanded = expandedSections?.[sectionKey];
    
    // Don't render section if content is empty
    if (!content || (Array.isArray(content) && content.length === 0) || (typeof content === 'string' && !content.trim())) {
      return null;
    }
    
    return (
      <div className="border border-border rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full px-6 py-4 bg-muted hover:bg-muted/80 transition-micro flex items-center justify-between text-left"
        >
          <div className="flex items-center space-x-3">
            <Icon name={icon} size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          </div>
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={20} 
            className="text-text-secondary" 
          />
        </button>
        {isExpanded && (
          <div className="px-6 py-4 bg-surface animate-slide-down">
            {Array.isArray(content) ? (
              <ul className="space-y-2">
                {content?.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Icon name="ChevronRight" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-line">
                  {content}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Job Description */}
      {renderSection(
        'Job Description',
        job?.description,
        'description',
        'FileText'
      )}
      {/* Responsibilities */}
      {renderSection(
        'Key Responsibilities',
        job?.responsibilities,
        'responsibilities',
        'CheckSquare'
      )}
      {/* Requirements */}
      {renderSection(
        'Requirements & Qualifications',
        job?.requirements,
        'requirements',
        'GraduationCap'
      )}
      
      {/* Apply Now Button - Small */}
      <div className="border border-border rounded-lg p-4 bg-surface/50">
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-secondary">Apply Now:</span>
          <Button
            onClick={onApply}
            size="sm"
            iconName="ExternalLink"
            iconPosition="right"
          >
            Apply Now
          </Button>
        </div>
      </div>
      
      {/* Benefits */}
      {renderSection(
        'Benefits & Perks',
        job?.benefits,
        'benefits',
        'Gift'
      )}
      {/* Company Information */}
      {renderSection(
        'About the Company',
        job?.company_info,
        'company',
        'Building2'
      )}
      {/* Skills & Technologies */}
      {job?.skills && job?.skills?.length > 0 && (
        <div className="border border-border rounded-lg p-6 bg-surface">
          <div className="flex items-center space-x-3 mb-4">
            <Icon name="Code" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Required Skills & Technologies</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {job?.skills?.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      {/* Application Instructions */}
      {job?.application_instructions && (
        <div className="border border-border rounded-lg p-6 bg-accent/5">
          <div className="flex items-center space-x-3 mb-4">
            <Icon name="Info" size={20} className="text-accent" />
            <h3 className="text-lg font-semibold text-foreground">Application Instructions</h3>
          </div>
          
          <p className="text-foreground leading-relaxed">
            {job?.application_instructions}
          </p>
        </div>
      )}
      {/* Job Details Summary */}
      <div className="border border-border rounded-lg p-6 bg-surface">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-3">
          <Icon name="Info" size={20} className="text-primary" />
          <span>Job Details</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Job ID:</span>
              <span className="text-foreground font-medium">{job?.id}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-text-secondary">Employment Type:</span>
              <span className="text-foreground font-medium">{job?.employment_type}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-text-secondary">Experience Level:</span>
              <span className="text-foreground font-medium">{job?.experience_level}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-text-secondary">Category:</span>
              <span className="text-foreground font-medium">{job?.category}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Posted Date:</span>
              <span className="text-foreground font-medium">
                {new Date(job.posted_date)?.toLocaleDateString()}
              </span>
            </div>
            
            {job?.deadline && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Application Deadline:</span>
                <span className="text-foreground font-medium">
                  {new Date(job.deadline)?.toLocaleDateString()}
                </span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-text-secondary">Remote Work:</span>
              <span className="text-foreground font-medium">
                {job?.remote_work ? 'Available' : 'Not Available'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;