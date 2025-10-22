import React from 'react';
import Icon from '../../../components/AppIcon';

const CategoryStats = ({ totalCategories, totalJobs, lastUpdated }) => {
  const stats = [
    {
      label: 'Job Categories',
      value: totalCategories,
      icon: 'Grid3X3',
      color: 'text-primary'
    },
    {
      label: 'Active Jobs',
      value: totalJobs?.toLocaleString(),
      icon: 'Briefcase',
      color: 'text-success'
    },
    {
      label: 'Companies Hiring',
      value: '2,400+',
      icon: 'Building2',
      color: 'text-warning'
    },
    {
      label: 'New This Week',
      value: '847',
      icon: 'TrendingUp',
      color: 'text-accent'
    }
  ];

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mb-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats?.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-muted mb-3 ${stat?.color}`}>
              <Icon name={stat?.icon} size={24} />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {stat?.value}
            </div>
            <div className="text-sm text-text-secondary">
              {stat?.label}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-center space-x-2 text-sm text-text-secondary">
          <Icon name="Clock" size={14} />
          <span>Last updated: {lastUpdated}</span>
        </div>
      </div>
    </div>
  );
};

export default CategoryStats;