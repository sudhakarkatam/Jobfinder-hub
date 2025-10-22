import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const Breadcrumb = ({ job }) => {
  const breadcrumbItems = [
    { label: 'Home', path: '/home-page' },
    { label: 'Jobs', path: '/job-search-results' },
    { label: job?.category, path: `/job-search-results?category=${job?.category?.toLowerCase()?.replace(/\s+/g, '-')}` },
    { label: job?.title, path: null, current: true }
  ];

  return (
    <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-6 overflow-x-auto">
      {breadcrumbItems?.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <Icon name="ChevronRight" size={14} className="flex-shrink-0" />
          )}
          
          {item?.current ? (
            <span className="text-foreground font-medium truncate">
              {item?.label}
            </span>
          ) : (
            <Link
              to={item?.path}
              className="hover:text-foreground transition-micro truncate flex-shrink-0"
            >
              {item?.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;