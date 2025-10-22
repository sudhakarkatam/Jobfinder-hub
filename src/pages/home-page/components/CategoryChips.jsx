import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import { categoriesApi, jobsApi } from '../../../lib/database.js';

const CategoryChips = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const [categoriesResult, jobsResult] = await Promise.all([
        categoriesApi.getCategories(),
        jobsApi.getJobs()
      ]);

      if (categoriesResult.data) {
        // Map categories to include icons
        const categoryIconMap = {
          'Development': 'Code',
          'Design': 'Palette',
          'Data Science': 'BarChart3',
          'Marketing': 'Megaphone',
          'Product': 'Package',
          'Finance': 'DollarSign',
          'Sales': 'TrendingUp',
          'Technology': 'Cpu',
          'Healthcare': 'Heart',
          'Education': 'GraduationCap'
        };

        const transformedCategories = [
          { id: 'all', name: 'All Jobs', icon: 'Briefcase', count: jobsResult.data?.length || 0 },
          ...categoriesResult.data.map(cat => ({
            id: cat.name.toLowerCase().replace(/\s+/g, '-'),
            name: cat.name,
            icon: categoryIconMap[cat.name] || 'Folder',
            count: cat.job_count || 0
          }))
        ];

        setCategories(transformedCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback categories if database fetch fails
      setCategories([
        { id: 'all', name: 'All Jobs', icon: 'Briefcase', count: 0 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    
    if (categoryId === 'all') {
      navigate('/job-search-results');
    } else {
      navigate(`/job-search-results?category=${categoryId}`);
    }
  };

  return (
    <section className="py-8 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Browse by Category
          </h2>
          <p className="text-text-secondary">
            Find jobs in your preferred industry
          </p>
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex flex-wrap justify-center gap-3">
          {categories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => handleCategoryClick(category?.id)}
              className={`flex items-center space-x-3 px-6 py-3 rounded-full border transition-all duration-300 group ${
                activeCategory === category?.id
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105'
                  : 'bg-surface text-text-secondary border-border hover:border-primary hover:text-primary hover:shadow-md hover:scale-102'
              }`}
            >
              <Icon 
                name={category?.icon} 
                size={18} 
                className={`transition-colors ${
                  activeCategory === category?.id 
                    ? 'text-primary-foreground' 
                    : 'text-text-secondary group-hover:text-primary'
                }`}
              />
              <span className="font-medium">{category?.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-data ${
                activeCategory === category?.id
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
              }`}>
                {category?.count}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile View - Horizontal Scroll */}
        <div className="md:hidden">
          <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
            {categories?.map((category) => (
              <button
                key={category?.id}
                onClick={() => handleCategoryClick(category?.id)}
                className={`flex-shrink-0 flex flex-col items-center space-y-2 p-4 rounded-xl border transition-all duration-300 min-w-[100px] ${
                  activeCategory === category?.id
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                    : 'bg-surface text-text-secondary border-border hover:border-primary hover:text-primary'
                }`}
              >
                <Icon 
                  name={category?.icon} 
                  size={24} 
                  className={`transition-colors ${
                    activeCategory === category?.id 
                      ? 'text-primary-foreground' 
                      : 'text-text-secondary'
                  }`}
                />
                <div className="text-center">
                  <div className="text-sm font-medium">{category?.name}</div>
                  <div className={`text-xs font-data ${
                    activeCategory === category?.id
                      ? 'text-primary-foreground/80'
                      : 'text-muted-foreground'
                  }`}>
                    {category?.count} jobs
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* View All Categories Link */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/job-categories')}
            className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 font-medium transition-micro"
          >
            <span>View All Categories</span>
            <Icon name="ArrowRight" size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoryChips;