import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: 'job_posted',
      title: 'New job posted',
      description: 'Senior React Developer at TechCorp Inc.',
      timestamp: new Date(Date.now() - 300000),
      icon: 'Briefcase',
      color: 'success'
    },
    {
      id: 2,
      type: 'user_registered',
      title: 'New user registration',
      description: 'Sarah Johnson joined the platform',
      timestamp: new Date(Date.now() - 900000),
      icon: 'UserPlus',
      color: 'primary'
    },
    {
      id: 3,
      type: 'application_received',
      title: 'Application received',
      description: 'Marketing Manager position at StartupXYZ',
      timestamp: new Date(Date.now() - 1800000),
      icon: 'FileText',
      color: 'warning'
    },
    {
      id: 4,
      type: 'job_expired',
      title: 'Job listing expired',
      description: 'Data Scientist position at DataCorp',
      timestamp: new Date(Date.now() - 3600000),
      icon: 'Clock',
      color: 'error'
    },
    {
      id: 5,
      type: 'system_notification',
      title: 'System maintenance',
      description: 'Scheduled backup completed successfully',
      timestamp: new Date(Date.now() - 7200000),
      icon: 'Settings',
      color: 'primary'
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'success':
        return 'bg-success/10 text-success border-success/20';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'error':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      return timestamp?.toLocaleDateString();
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg elevation-2">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
          <button className="text-sm text-primary hover:text-primary/80 transition-micro">
            View All
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activities?.map((activity) => (
            <div key={activity?.id} className="flex items-start space-x-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center border flex-shrink-0 ${getColorClasses(activity?.color)}`}>
                <Icon name={activity?.icon} size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">{activity?.title}</h3>
                  <span className="text-xs text-text-secondary">{formatTimestamp(activity?.timestamp)}</span>
                </div>
                <p className="text-sm text-text-secondary mt-1">{activity?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;