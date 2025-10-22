import React from 'react';

import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CompanySidebar = ({ company }) => {
  const handleFollowCompany = () => {
    // Handle company follow logic
    console.log('Following company:', company?.name);
  };

  const handleViewAllJobs = () => {
    // Navigate to company jobs page
    console.log('Viewing all jobs for:', company?.name);
  };

  return (
    <div className="space-y-6">
      {/* Company Profile Card */}
      <div className="bg-surface border border-border rounded-lg p-6 elevation-2">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-lg overflow-hidden border border-border mb-4">
            <Image
              src={company?.logo}
              alt={`${company?.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
          
          <h3 className="text-xl font-semibold text-foreground mb-2">{company?.name}</h3>
          <p className="text-text-secondary text-sm">{company?.industry}</p>
        </div>

        {/* Company Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{company?.employee_count}</div>
            <div className="text-xs text-text-secondary">Employees</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{company?.open_positions}</div>
            <div className="text-xs text-text-secondary">Open Jobs</div>
          </div>
        </div>

        {/* Company Description */}
        <p className="text-sm text-foreground leading-relaxed mb-6">
          {company?.description}
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={handleFollowCompany}
            iconName="Plus"
            iconPosition="left"
            className="w-full"
          >
            Follow Company
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleViewAllJobs}
            iconName="ExternalLink"
            iconPosition="right"
            className="w-full"
          >
            View All Jobs ({company?.open_positions})
          </Button>
        </div>
      </div>
      {/* Company Details */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Building2" size={18} />
          <span>Company Details</span>
        </h4>
        
        <div className="space-y-4">
          {company?.founded && (
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-sm">Founded</span>
              <span className="text-foreground text-sm font-medium">{company?.founded}</span>
            </div>
          )}
          
          {company?.headquarters && (
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-sm">Headquarters</span>
              <span className="text-foreground text-sm font-medium">{company?.headquarters}</span>
            </div>
          )}
          
          {company?.company_size && (
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-sm">Company Size</span>
              <span className="text-foreground text-sm font-medium">{company?.company_size}</span>
            </div>
          )}
          
          {company?.website && (
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-sm">Website</span>
              <a
                href={company?.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm font-medium hover:underline flex items-center space-x-1"
              >
                <span>Visit Site</span>
                <Icon name="ExternalLink" size={12} />
              </a>
            </div>
          )}
        </div>
      </div>
      {/* Company Culture */}
      {company?.culture && company?.culture?.length > 0 && (
        <div className="bg-surface border border-border rounded-lg p-6">
          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Icon name="Heart" size={18} />
            <span>Company Culture</span>
          </h4>
          
          <div className="flex flex-wrap gap-2">
            {company?.culture?.map((value, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent"
              >
                {value}
              </span>
            ))}
          </div>
        </div>
      )}
      {/* Recent Company News */}
      {company?.recent_news && company?.recent_news?.length > 0 && (
        <div className="bg-surface border border-border rounded-lg p-6">
          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Icon name="Newspaper" size={18} />
            <span>Recent News</span>
          </h4>
          
          <div className="space-y-3">
            {company?.recent_news?.slice(0, 3)?.map((news, index) => (
              <div key={index} className="border-b border-border last:border-b-0 pb-3 last:pb-0">
                <h5 className="text-sm font-medium text-foreground mb-1">{news?.title}</h5>
                <p className="text-xs text-text-secondary">{news?.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Contact Information */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Phone" size={18} />
          <span>Contact Info</span>
        </h4>
        
        <div className="space-y-3">
          {company?.email && (
            <div className="flex items-center space-x-3">
              <Icon name="Mail" size={16} className="text-text-secondary" />
              <a
                href={`mailto:${company?.email}`}
                className="text-sm text-primary hover:underline"
              >
                {company?.email}
              </a>
            </div>
          )}
          
          {company?.phone && (
            <div className="flex items-center space-x-3">
              <Icon name="Phone" size={16} className="text-text-secondary" />
              <a
                href={`tel:${company?.phone}`}
                className="text-sm text-primary hover:underline"
              >
                {company?.phone}
              </a>
            </div>
          )}
          
          {company?.address && (
            <div className="flex items-start space-x-3">
              <Icon name="MapPin" size={16} className="text-text-secondary mt-0.5" />
              <span className="text-sm text-foreground">{company?.address}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanySidebar;