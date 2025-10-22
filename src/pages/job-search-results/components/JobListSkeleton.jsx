import React from 'react';

const JobListSkeleton = ({ count = 6 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count })?.map((_, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-6 animate-pulse">
          <div className="flex items-start space-x-4">
            {/* Company Logo Skeleton */}
            <div className="w-12 h-12 bg-muted rounded-lg flex-shrink-0"></div>

            {/* Content Skeleton */}
            <div className="flex-1 space-y-3">
              {/* Title and Company */}
              <div className="space-y-2">
                <div className="h-5 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>

              {/* Job Details */}
              <div className="flex space-x-4">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-4 bg-muted rounded w-32"></div>
                <div className="h-4 bg-muted rounded w-20"></div>
              </div>

              {/* Badges */}
              <div className="flex space-x-2">
                <div className="h-6 bg-muted rounded-full w-16"></div>
                <div className="h-6 bg-muted rounded-full w-20"></div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-4/5"></div>
              </div>

              {/* Skills */}
              <div className="flex space-x-2">
                <div className="h-6 bg-muted rounded w-16"></div>
                <div className="h-6 bg-muted rounded w-20"></div>
                <div className="h-6 bg-muted rounded w-18"></div>
                <div className="h-6 bg-muted rounded w-14"></div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2">
                <div className="h-10 bg-muted rounded w-24"></div>
                <div className="h-10 bg-muted rounded w-28"></div>
              </div>
            </div>

            {/* Actions Skeleton */}
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-muted rounded"></div>
              <div className="w-8 h-8 bg-muted rounded"></div>
            </div>
          </div>

          {/* Company Rating Skeleton */}
          <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {Array.from({ length: 5 })?.map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-muted rounded"></div>
                ))}
              </div>
              <div className="h-4 bg-muted rounded w-24"></div>
            </div>
            <div className="h-4 bg-muted rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobListSkeleton;