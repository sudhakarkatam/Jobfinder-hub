import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { jobsApi } from '../../../lib/database';
import { formatSalary } from '../../../utils/formatSalary';

const LatestJobsSidebar = ({ currentJobId }) => {
  const navigate = useNavigate();
  const [latestJobs, setLatestJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestJobs();
  }, [currentJobId]);

  const fetchLatestJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await jobsApi.getJobs();
      if (data) {
        // Filter out current job and get latest 8
        const filtered = data
          .filter(job => job.id !== currentJobId)
          .slice(0, 8)
          .map(job => ({
            id: job.id,
            url_slug: job.url_slug,
            title: job.title,
            // Use company_name if available, otherwise fall back to companies.name
            company: job.company_name || job.companies?.name || 'Unknown Company',
            logo: job.companies?.logo || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
            location: job.location,
            type: job.employment_type,
            salary: formatSalary(job.salary_min, job.salary_max),
            postedDate: formatPostedDate(job.created_at)
          }));
        setLatestJobs(filtered);
      }
    } catch (error) {
      console.error('Error fetching latest jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPostedDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return '1d ago';
    if (diffDays < 7) return `${diffDays}d ago`;
    return `${Math.floor(diffDays / 7)}w ago`;
  };

  const handleJobClick = (job) => {
    const slug = job.url_slug || job.id;
    navigate(`/job-detail-view/${slug}`);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Jobs</h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="flex space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-20">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Icon name="Newspaper" size={20} className="text-pink-600" />
          <span>Latest Jobs</span>
        </h3>
        <p className="text-sm text-gray-500 mt-1">Recently posted positions</p>
      </div>

      <div className="p-4 max-h-[600px] overflow-y-auto">
        <div className="space-y-3">
          {latestJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => handleJobClick(job)}
              className="group cursor-pointer p-3 rounded-lg hover:bg-pink-50 transition-all duration-200 border border-transparent hover:border-pink-200"
            >
              <div className="flex space-x-3">
                {/* Company Logo */}
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={job.logo}
                    alt={job.company}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Job Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-2 mb-1">
                    {job.title}
                  </h4>
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <Icon name="Building2" size={12} />
                      <span className="truncate">{job.company}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <Icon name="MapPin" size={12} />
                      <span className="truncate">{job.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-pink-600 font-medium">
                      {job.salary}
                    </span>
                    <span className="text-xs text-gray-400">
                      {job.postedDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View All Link */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => navigate('/job-search-results')}
          className="w-full flex items-center justify-center space-x-2 text-sm text-pink-600 hover:text-pink-700 font-medium py-2 hover:bg-pink-50 rounded-lg transition-colors"
        >
          <span>View All Jobs</span>
          <Icon name="ArrowRight" size={14} />
        </button>
      </div>
    </div>
  );
};

export default LatestJobsSidebar;

