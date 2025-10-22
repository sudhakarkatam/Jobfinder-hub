import React from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const Pagination = ({ 
  totalItems, 
  itemsPerPage, 
  currentPage, 
  onPageChange,
  className = ''
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 2; // Pages to show before and after current page
    const range = [];
    const rangeWithDots = [];
    let l;

    // Always show first page
    range.push(1);

    // Add pages around current page
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }

    // Always show last page
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Remove duplicates and sort
    const uniqueRange = [...new Set(range)].sort((a, b) => a - b);

    // Add dots where there are gaps
    uniqueRange.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="hidden sm:flex"
        iconName="ChevronLeft"
        iconPosition="left"
      >
        Previous
      </Button>

      {/* Mobile Previous */}
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="sm:hidden"
        iconName="ChevronLeft"
      />

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`dots-${index}`}
                className="px-2 py-1 text-text-secondary"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`
                min-w-[32px] sm:min-w-[40px] h-8 sm:h-10 px-2 sm:px-3 py-1 sm:py-2
                rounded-md text-sm font-medium transition-all
                ${
                  currentPage === page
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-surface text-foreground hover:bg-muted border border-border'
                }
              `}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="hidden sm:flex"
        iconName="ChevronRight"
        iconPosition="right"
      >
        Next
      </Button>

      {/* Mobile Next */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="sm:hidden"
        iconName="ChevronRight"
      />
    </div>
  );
};

export default Pagination;

