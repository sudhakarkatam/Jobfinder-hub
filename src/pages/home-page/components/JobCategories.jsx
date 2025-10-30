import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import { jobsApi } from '../../../lib/database.js';
import '../../../styles/categories.css';

const JobCategories = () => {
  const navigate = useNavigate();
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [categoryCounts, setCategoryCounts] = useState({
    'Technology': 0,
    'Government Jobs': 0,
    'Internship': 0,
    'Walk-in': 0
  });

  useEffect(() => {
    loadCategoryCounts();
  }, []);

  const loadCategoryCounts = async () => {
    try {
      const { data, error } = await jobsApi.getJobs();
      
      if (!error && data) {
        const counts = {
          'Technology': 0,
          'Government Jobs': 0,
          'Internship': 0,
          'Walk-in': 0
        };

        data.forEach(job => {
          // Count Technology and Development jobs
          if (job.category === 'Technology' || job.category === 'Development') {
            counts['Technology']++;
          }
          // Count Government Jobs
          if (job.category === 'Government Jobs') {
            counts['Government Jobs']++;
          }
          // Count Internships (by employment_type)
          if (job.employment_type === 'Internship') {
            counts['Internship']++;
          }
          // Count Walk-in jobs (by tags or keywords in description)
          if (job.tags?.some(tag => tag.toLowerCase().includes('walk-in')) || 
              job.description?.toLowerCase().includes('walk-in') ||
              job.description?.toLowerCase().includes('walkin')) {
            counts['Walk-in']++;
          }
        });

        setCategoryCounts(counts);
      }
    } catch (err) {
      console.error('Error loading category counts:', err);
    }
  };

  const categories = [
    {
      id: 'it-software',
      name: 'IT/Software Jobs',
      icon: 'Code',
      count: categoryCounts['Technology'],
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      link: '/job-search-results?category=Technology'
    },
    {
      id: 'government',
      name: 'Government Jobs',
      icon: 'Building2',
      count: categoryCounts['Government Jobs'],
      gradient: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      link: '/job-search-results?category=Government Jobs'
    },
    {
      id: 'internships',
      name: 'Internships',
      icon: 'GraduationCap',
      count: categoryCounts['Internship'],
      gradient: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      link: '/job-search-results?employment_type=Internship'
    },
    {
      id: 'walkin',
      name: 'Walk-in Drives',
      icon: 'Users',
      count: categoryCounts['Walk-in'],
      gradient: 'from-orange-500 to-orange-600',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      link: '/job-search-results?search=walk-in'
    }
  ];

  return (
    <section className="py-10 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Explore Jobs !!</h2>
          <p className="text-text-secondary">Browse opportunities by category</p>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden mb-4">
          <button
            type="button"
            aria-expanded={isOpenMobile}
            onClick={() => setIsOpenMobile(o => !o)}
            className="w-full flex items-center justify-between px-4 py-3 bg-surface border border-border rounded-lg"
          >
            <span className="font-medium text-foreground">Categories</span>
            <Icon name={isOpenMobile ? 'ChevronUp' : 'ChevronDown'} size={18} className="text-text-secondary" />
          </button>
        </div>

        {/* Category Cards Grid */}
        <div className={`${isOpenMobile ? 'grid' : 'hidden'} md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6`}>
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => navigate(category.link)}
              className="group relative bg-surface border border-border rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`${category.iconBg} w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon 
                    name={category.icon} 
                    size={28} 
                    className={category.iconColor}
                  />
                </div>

                {/* Category Name */}
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>

                {/* Job Count */}
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary text-sm">
                    {category.count} {category.count === 1 ? 'opening' : 'openings'}
                  </span>
                  <Icon 
                    name="ArrowRight" 
                    size={18} 
                    className="text-text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </div>
          ))}
        </div>

        {/* View All Categories Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/job-categories')}
            className="inline-flex items-center space-x-2 text-primary hover:text-primary-hover font-medium transition-colors"
          >
            <span>View All Categories</span>
            <Icon name="ArrowRight" size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default JobCategories;

