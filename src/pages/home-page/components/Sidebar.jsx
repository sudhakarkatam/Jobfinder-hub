import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const Sidebar = () => {
  const navigate = useNavigate();

  const jobCategories = [
    { id: 'technology', name: 'Technology', count: 1247, icon: 'Code' },
    { id: 'design', name: 'Design', count: 432, icon: 'Palette' },
    { id: 'marketing', name: 'Marketing', count: 678, icon: 'Megaphone' },
    { id: 'sales', name: 'Sales', count: 543, icon: 'TrendingUp' },
    { id: 'finance', name: 'Finance', count: 389, icon: 'DollarSign' },
    { id: 'healthcare', name: 'Healthcare', count: 756, icon: 'Heart' },
    { id: 'banking-jobs', name: 'Banking Jobs', count: 523, icon: 'Building2' },
    { id: 'government-jobs', name: 'Government Jobs', count: 892, icon: 'Shield' }
  ];

  const handleCategoryClick = (categoryId) => {
    navigate(`/job-search-results?category=${categoryId}`);
  };

  return (
    <aside className="w-full lg:w-80 space-y-6">
      {/* Job Categories */}
      <div className="bg-surface border border-border rounded-lg p-6 elevation-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Job Categories</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/job-categories')}
            iconName="ArrowRight"
            iconPosition="right"
          >
            View All
          </Button>
        </div>
        
        <div className="space-y-2">
          {jobCategories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => handleCategoryClick(category?.id)}
              className="w-full flex items-center justify-between p-3 rounded-md text-left hover:bg-muted transition-micro group"
            >
              <div className="flex items-center space-x-3">
                <Icon 
                  name={category?.icon} 
                  size={16} 
                  className="text-text-secondary group-hover:text-primary transition-colors" 
                />
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {category?.name}
                </span>
              </div>
              <span className="text-xs text-text-secondary bg-muted px-2 py-1 rounded-full font-data">
                {category?.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;