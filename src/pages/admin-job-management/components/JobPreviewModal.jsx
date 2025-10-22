import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const JobPreviewModal = ({ job, isOpen, onClose, onEdit }) => {
  if (!isOpen || !job) return null;

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `$${min?.toLocaleString()} - $${max?.toLocaleString()} per year`;
    if (min) return `$${min?.toLocaleString()}+ per year`;
    return `Up to $${max?.toLocaleString()} per year`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success text-success-foreground', icon: 'CheckCircle' },
      inactive: { color: 'bg-secondary text-secondary-foreground', icon: 'XCircle' },
      pending: { color: 'bg-warning text-warning-foreground', icon: 'Clock' },
      expired: { color: 'bg-error text-error-foreground', icon: 'AlertCircle' },
      draft: { color: 'bg-muted text-muted-foreground', icon: 'Edit' }
    };

    const config = statusConfig?.[status] || statusConfig?.inactive;
    
    return (
      <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={14} />
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-surface border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden elevation-4 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="Eye" size={24} className="text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">Job Preview</h2>
              <p className="text-sm text-text-secondary">Preview how this job appears to candidates</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => onEdit(job)}
              iconName="Edit"
              iconPosition="left"
            >
              Edit Job
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              iconName="X"
            />
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6">
            {/* Job Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">{job?.title}</h1>
                  <div className="flex items-center space-x-4 text-text-secondary mb-4">
                    <div className="flex items-center space-x-2">
                      <Icon name="Building2" size={16} />
                      <span className="font-medium">{job?.company}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="MapPin" size={16} />
                      <span>{job?.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Clock" size={16} />
                      <span>{job?.type}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  {getStatusBadge(job?.status)}
                  <span className="text-sm text-text-secondary">
                    Posted {formatDate(job?.postedDate)}
                  </span>
                </div>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-muted rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-2">
                    <Icon name="DollarSign" size={20} className="text-primary" />
                  </div>
                  <div className="font-semibold text-foreground">{formatSalary(job?.salaryMin, job?.salaryMax)}</div>
                  <div className="text-sm text-text-secondary">Salary Range</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mx-auto mb-2">
                    <Icon name="Users" size={20} className="text-accent" />
                  </div>
                  <div className="font-semibold text-foreground">{job?.experience || 'Not specified'}</div>
                  <div className="text-sm text-text-secondary">Experience Level</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-full mx-auto mb-2">
                    <Icon name="Tag" size={20} className="text-secondary" />
                  </div>
                  <div className="font-semibold text-foreground capitalize">{job?.category}</div>
                  <div className="text-sm text-text-secondary">Category</div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Job Description</h2>
              <div className="prose prose-sm max-w-none text-foreground">
                <p className="mb-4">
                  {job?.description || `We are seeking a talented ${job?.title} to join our dynamic team at ${job?.company}. This is an excellent opportunity for a motivated professional to contribute to our growing organization and advance their career in ${job?.category}.`}
                </p>
                
                <h3 className="text-lg font-semibold mb-3">Key Responsibilities:</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>Lead and execute strategic initiatives in {job?.category?.toLowerCase()}</li>
                  <li>Collaborate with cross-functional teams to deliver high-quality results</li>
                  <li>Analyze market trends and provide actionable insights</li>
                  <li>Mentor junior team members and contribute to team growth</li>
                  <li>Drive innovation and continuous improvement processes</li>
                </ul>

                <h3 className="text-lg font-semibold mb-3">Requirements:</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>Bachelor's degree in relevant field or equivalent experience</li>
                  <li>3+ years of experience in {job?.category?.toLowerCase()} or related field</li>
                  <li>Strong analytical and problem-solving skills</li>
                  <li>Excellent communication and interpersonal abilities</li>
                  <li>Proficiency in industry-standard tools and technologies</li>
                </ul>

                <h3 className="text-lg font-semibold mb-3">Benefits:</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Competitive salary and performance-based bonuses</li>
                  <li>Comprehensive health, dental, and vision insurance</li>
                  <li>401(k) retirement plan with company matching</li>
                  <li>Flexible work arrangements and remote work options</li>
                  <li>Professional development opportunities and training programs</li>
                  <li>Generous paid time off and holiday schedule</li>
                </ul>
              </div>
            </div>

            {/* Company Information */}
            <div className="mb-8 p-6 bg-muted rounded-lg">
              <h2 className="text-xl font-semibold text-foreground mb-4">About {job?.company}</h2>
              <p className="text-foreground mb-4">
                {job?.company} is a leading organization in the {job?.category?.toLowerCase()} industry, committed to innovation and excellence. We foster a collaborative work environment where talented professionals can thrive and make a meaningful impact.
              </p>
              <div className="flex items-center space-x-6 text-sm text-text-secondary">
                <div className="flex items-center space-x-2">
                  <Icon name="Users" size={14} />
                  <span>500-1000 employees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="MapPin" size={14} />
                  <span>Multiple locations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Globe" size={14} />
                  <span>www.{job?.company?.toLowerCase()?.replace(/\s+/g, '')}.com</span>
                </div>
              </div>
            </div>

            {/* Application CTA */}
            <div className="text-center p-8 bg-primary/5 rounded-lg border border-primary/20">
              <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Apply?</h3>
              <p className="text-text-secondary mb-6">
                Join our team and take the next step in your career journey.
              </p>
              <Button
                size="lg"
                iconName="ExternalLink"
                iconPosition="right"
                className="px-8"
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPreviewModal;