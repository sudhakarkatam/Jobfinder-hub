import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const CategoryCard = ({ category, featured = false }) => {
  const handleCardClick = () => {
    // Track category click for analytics
    console.log(`Category clicked: ${category?.name}`);
  };

  return (
    <Link
      to={`/job-search-results?category=${category?.id}`}
      onClick={handleCardClick}
      className={`group block bg-surface border border-border rounded-lg p-6 transition-all duration-300 hover:elevation-3 hover:border-primary/20 ${
        featured ? 'md:col-span-2 lg:col-span-1' : ''
      }`}
    >
      <div className="flex items-start space-x-4">
        {/* Category Icon */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
          featured 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-text-secondary group-hover:bg-primary group-hover:text-primary-foreground'
        }`}>
          <Icon name={category?.icon} size={24} />
        </div>

        {/* Category Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {category?.name}
            </h3>
            {featured && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                Popular
              </span>
            )}
          </div>

          <p className="text-sm text-text-secondary mb-3 line-clamp-2">
            {category?.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {category?.jobCount?.toLocaleString()} jobs
              </span>
              {category?.isGrowing && (
                <div className="flex items-center space-x-1 text-xs text-success">
                  <Icon name="TrendingUp" size={12} />
                  <span>Growing</span>
                </div>
              )}
            </div>

            <Icon 
              name="ArrowRight" 
              size={16} 
              className="text-text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all" 
            />
          </div>

          {/* Subcategories Preview */}
          {category?.subcategories && category?.subcategories?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex flex-wrap gap-1">
                {category?.subcategories?.slice(0, 3)?.map((sub, index) => (
                  <span 
                    key={index}
                    className="inline-block px-2 py-1 text-xs bg-muted text-text-secondary rounded"
                  >
                    {sub}
                  </span>
                ))}
                {category?.subcategories?.length > 3 && (
                  <span className="inline-block px-2 py-1 text-xs text-text-secondary">
                    +{category?.subcategories?.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;