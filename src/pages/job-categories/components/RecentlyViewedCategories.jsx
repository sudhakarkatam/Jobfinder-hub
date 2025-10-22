import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const RecentlyViewedCategories = ({ categories }) => {
  if (!categories || categories?.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recently Viewed</h3>
        <Icon name="Clock" size={16} className="text-text-secondary" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {categories?.map((category) => (
          <Link
            key={category?.id}
            to={`/job-search-results?category=${category?.id}`}
            className="group flex items-center space-x-3 p-3 rounded-md border border-border hover:border-primary/20 hover:bg-muted/50 transition-all"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-md bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Icon name={category?.icon} size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                {category?.name}
              </p>
              <p className="text-xs text-text-secondary">
                {category?.jobCount} jobs
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewedCategories;