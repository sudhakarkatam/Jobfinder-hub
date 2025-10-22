import React, { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import Icon from '../AppIcon';

const CategorySidebar = ({ isOpen, onClose }) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    { 
      id: 'technology', 
      name: 'Technology', 
      icon: 'Code', 
      count: 1247,
      subcategories: ['Software Engineering', 'Data Science', 'DevOps', 'Cybersecurity']
    },
    { 
      id: 'design', 
      name: 'Design', 
      icon: 'Palette', 
      count: 432,
      subcategories: ['UI/UX Design', 'Graphic Design', 'Product Design', 'Web Design']
    },
    { 
      id: 'marketing', 
      name: 'Marketing', 
      icon: 'Megaphone', 
      count: 678,
      subcategories: ['Digital Marketing', 'Content Marketing', 'SEO', 'Social Media']
    },
    { 
      id: 'sales', 
      name: 'Sales', 
      icon: 'TrendingUp', 
      count: 543,
      subcategories: ['Inside Sales', 'Account Management', 'Business Development', 'Sales Operations']
    },
    { 
      id: 'finance', 
      name: 'Finance', 
      icon: 'DollarSign', 
      count: 389,
      subcategories: ['Financial Analysis', 'Accounting', 'Investment Banking', 'Risk Management']
    },
    { 
      id: 'healthcare', 
      name: 'Healthcare', 
      icon: 'Heart', 
      count: 756,
      subcategories: ['Nursing', 'Medical Technology', 'Healthcare Administration', 'Pharmacy']
    },
    { 
      id: 'education', 
      name: 'Education', 
      icon: 'GraduationCap', 
      count: 234,
      subcategories: ['Teaching', 'Educational Technology', 'Curriculum Development', 'Administration']
    },
    { 
      id: 'operations', 
      name: 'Operations', 
      icon: 'Settings', 
      count: 445,
      subcategories: ['Supply Chain', 'Project Management', 'Quality Assurance', 'Process Improvement']
    },
    { 
      id: 'hr', 
      name: 'Human Resources', 
      icon: 'Users', 
      count: 298,
      subcategories: ['Recruiting', 'Employee Relations', 'Compensation', 'Training & Development']
    },
    { 
      id: 'customer-service', 
      name: 'Customer Service', 
      icon: 'Headphones', 
      count: 367,
      subcategories: ['Customer Support', 'Technical Support', 'Customer Success', 'Call Center']
    }
  ];

  useEffect(() => {
    const category = searchParams?.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    if (onClose) {
      onClose();
    }
  };

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Job Categories</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-text-secondary hover:text-foreground hover:bg-muted transition-micro"
          >
            <Icon name="X" size={20} />
          </button>
        )}
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {/* All Jobs */}
          <Link
            to="/job-search-results"
            onClick={() => handleCategoryClick('')}
            className={`flex items-center justify-between p-3 rounded-md transition-micro group ${
              !selectedCategory && location.pathname === '/job-search-results' ?'bg-primary text-primary-foreground' :'text-text-secondary hover:text-foreground hover:bg-muted'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Icon name="Briefcase" size={18} />
              <span className="font-medium">All Jobs</span>
            </div>
            <span className="text-xs font-data bg-muted text-muted-foreground px-2 py-1 rounded group-hover:bg-background">
              {categories?.reduce((total, cat) => total + cat?.count, 0)}
            </span>
          </Link>

          {/* Category Items */}
          {categories?.map((category) => (
            <div key={category?.id} className="space-y-1">
              <Link
                to={`/job-search-results?category=${category?.id}`}
                onClick={() => handleCategoryClick(category?.id)}
                className={`flex items-center justify-between p-3 rounded-md transition-micro group ${
                  selectedCategory === category?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-secondary hover:text-foreground hover:bg-muted'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon name={category?.icon} size={18} />
                  <span className="font-medium">{category?.name}</span>
                </div>
                <span className={`text-xs font-data px-2 py-1 rounded transition-micro ${
                  selectedCategory === category?.id
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground group-hover:bg-background'
                }`}>
                  {category?.count}
                </span>
              </Link>

              {/* Subcategories */}
              {selectedCategory === category?.id && (
                <div className="ml-6 space-y-1 animate-slide-down">
                  {category?.subcategories?.map((subcategory, index) => (
                    <Link
                      key={index}
                      to={`/job-search-results?category=${category?.id}&subcategory=${encodeURIComponent(subcategory)}`}
                      className="block px-3 py-2 text-sm text-text-secondary hover:text-foreground hover:bg-muted rounded-md transition-micro"
                    >
                      {subcategory}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-text-secondary">
          <p className="mb-2">Updated daily with new opportunities</p>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={12} />
            <span>Last updated: 2 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop Sidebar
  if (!onClose) {
    return (
      <aside className="hidden lg:block lg:fixed lg:left-0 lg:top-16 lg:bottom-0 lg:w-80 bg-surface border-r border-border z-40">
        {sidebarContent}
      </aside>
    );
  }

  // Mobile Drawer
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-80 bg-surface z-60 lg:hidden transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default CategorySidebar;