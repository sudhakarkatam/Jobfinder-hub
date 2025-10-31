import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const MobileBottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path);

  const items = [
    { 
      label: 'Search', 
      icon: 'Search', 
      path: '/job-search-results',
      onClick: () => navigate('/job-search-results')
    },
    { 
      label: 'Categories', 
      icon: 'Grid3X3', 
      path: '/job-categories',
      onClick: () => navigate('/job-categories')
    },
    { 
      label: 'Latest', 
      icon: 'Newspaper', 
      path: '/job-search-results',
      onClick: () => navigate('/job-search-results?experience=fresher')
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <nav className="flex items-center justify-around h-16 px-2">
        {items.map((item) => (
          <button
            key={item.path}
            onClick={item.onClick}
            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset rounded-t-lg ${
              isActive(item.path)
                ? 'text-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-label={item.label}
          >
            <Icon 
              name={item.icon} 
              size={22} 
              className={isActive(item.path) ? 'text-primary' : ''}
            />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default MobileBottomBar;

