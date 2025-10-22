import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';

const StickyApplyButton = ({ job, onApply }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky button when user scrolls past the main apply button
      const scrollPosition = window.scrollY;
      const threshold = 400; // Adjust based on your layout
      
      setIsVisible(scrollPosition > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border p-4 elevation-4 md:hidden animate-slide-up">
      <div className="max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground text-sm truncate">
              {job?.title}
            </h4>
            <p className="text-text-secondary text-xs">{job?.company}</p>
          </div>
          
          <div className="text-right ml-3">
            <div className="text-sm font-semibold text-foreground">
              {job?.salary_min && job?.salary_max 
                ? `$${job?.salary_min?.toLocaleString()} - $${job?.salary_max?.toLocaleString()}`
                : 'Salary not disclosed'
              }
            </div>
          </div>
        </div>
        
        <Button
          onClick={onApply}
          size="lg"
          className="w-full"
          iconName="ExternalLink"
          iconPosition="right"
        >
          Apply Now
        </Button>
      </div>
    </div>
  );
};

export default StickyApplyButton;