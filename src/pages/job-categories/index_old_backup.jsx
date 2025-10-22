import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GlobalHeader from '../../components/ui/GlobalHeader';
import CategoryCard from './components/CategoryCard';
import CategoryFilters from './components/CategoryFilters';
import RecentlyViewedCategories from './components/RecentlyViewedCategories';
import CategorySearch from './components/CategorySearch';
import CategoryStats from './components/CategoryStats';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const JobCategories = () => {
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    sort: 'popularity',
    location: '',
    experience: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  const allCategories = [
    {
      id: 'technology',
      name: 'Technology',
      icon: 'Code',
      jobCount: 1247,
      description: 'Software development, data science, cybersecurity, and emerging tech roles across all experience levels.',
      subcategories: ['Software Engineering', 'Data Science', 'DevOps', 'Cybersecurity', 'AI/ML', 'Cloud Computing'],
      isGrowing: true,
      featured: true
    },
    {
      id: 'design',
      name: 'Design & Creative',
      icon: 'Palette',
      jobCount: 432,
      description: 'UI/UX design, graphic design, product design, and creative roles for visual storytellers.',
      subcategories: ['UI/UX Design', 'Graphic Design', 'Product Design', 'Web Design', 'Motion Graphics'],
      isGrowing: true,
      featured: true
    },
    {
      id: 'marketing',
      name: 'Marketing & Sales',
      icon: 'Megaphone',
      jobCount: 678,
      description: 'Digital marketing, content creation, SEO, social media, and sales positions.',
      subcategories: ['Digital Marketing', 'Content Marketing', 'SEO', 'Social Media', 'Email Marketing'],
      isGrowing: true,
      featured: true
    },
    {
      id: 'finance',
      name: 'Finance & Accounting',
      icon: 'DollarSign',
      jobCount: 389,
      description: 'Financial analysis, accounting, investment banking, and risk management opportunities.',
      subcategories: ['Financial Analysis', 'Accounting', 'Investment Banking', 'Risk Management', 'Fintech'],
      isGrowing: false
    },
    {
      id: 'healthcare',
      name: 'Healthcare & Medical',
      icon: 'Heart',
      jobCount: 756,
      description: 'Nursing, medical technology, healthcare administration, and pharmaceutical roles.',
      subcategories: ['Nursing', 'Medical Technology', 'Healthcare Administration', 'Pharmacy', 'Telemedicine'],
      isGrowing: true
    },
    {
      id: 'education',
      name: 'Education & Training',
      icon: 'GraduationCap',
      jobCount: 234,
      description: 'Teaching, educational technology, curriculum development, and academic administration.',
      subcategories: ['Teaching', 'Educational Technology', 'Curriculum Development', 'Administration', 'E-Learning'],
      isGrowing: false
    },
    {
      id: 'operations',
      name: 'Operations & Management',
      icon: 'Settings',
      jobCount: 445,
      description: 'Supply chain, project management, quality assurance, and process improvement roles.',
      subcategories: ['Supply Chain', 'Project Management', 'Quality Assurance', 'Process Improvement', 'Logistics'],
      isGrowing: false
    },
    {
      id: 'hr',
      name: 'Human Resources',
      icon: 'Users',
      jobCount: 298,
      description: 'Recruiting, employee relations, compensation, and training & development positions.',
      subcategories: ['Recruiting', 'Employee Relations', 'Compensation', 'Training & Development', 'HR Analytics'],
      isGrowing: false
    },
    {
      id: 'customer-service',
      name: 'Customer Service',
      icon: 'Headphones',
      jobCount: 367,
      description: 'Customer support, technical support, customer success, and call center opportunities.',
      subcategories: ['Customer Support', 'Technical Support', 'Customer Success', 'Call Center', 'Live Chat'],
      isGrowing: false
    },
    {
      id: 'legal',
      name: 'Legal & Compliance',
      icon: 'Scale',
      jobCount: 156,
      description: 'Legal counsel, compliance, paralegal, and regulatory affairs positions.',
      subcategories: ['Legal Counsel', 'Compliance', 'Paralegal', 'Regulatory Affairs', 'Contract Management'],
      isGrowing: false
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing & Engineering',
      icon: 'Wrench',
      jobCount: 523,
      description: 'Mechanical engineering, manufacturing, quality control, and industrial design roles.',
      subcategories: ['Mechanical Engineering', 'Manufacturing', 'Quality Control', 'Industrial Design', 'Automation'],
      isGrowing: true
    },
    {
      id: 'retail',
      name: 'Retail & E-commerce',
      icon: 'ShoppingBag',
      jobCount: 412,
      description: 'Retail management, e-commerce, merchandising, and customer experience positions.',
      subcategories: ['Retail Management', 'E-commerce', 'Merchandising', 'Customer Experience', 'Inventory Management'],
      isGrowing: false
    }
  ];

  const recentlyViewedCategories = [
    { id: 'technology', name: 'Technology', icon: 'Code', jobCount: 1247 },
    { id: 'design', name: 'Design & Creative', icon: 'Palette', jobCount: 432 },
    { id: 'marketing', name: 'Marketing & Sales', icon: 'Megaphone', jobCount: 678 }
  ];

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    const timer = setTimeout(() => {
      setFilteredCategories(allCategories);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = [...allCategories];

    // Apply sorting
    switch (activeFilters?.sort) {
      case 'alphabetical':
        filtered?.sort((a, b) => a?.name?.localeCompare(b?.name));
        break;
      case 'job-count':
        filtered?.sort((a, b) => b?.jobCount - a?.jobCount);
        break;
      case 'recent':
        filtered?.sort((a, b) => b?.isGrowing - a?.isGrowing);
        break;
      default: // popularity
        filtered?.sort((a, b) => (b?.featured ? 1 : 0) - (a?.featured ? 1 : 0));
        break;
    }

    setFilteredCategories(filtered);
  }, [activeFilters]);

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
  };

  const handleSearchResults = (results) => {
    setFilteredCategories(results);
  };

  const totalJobs = allCategories?.reduce((sum, category) => sum + category?.jobCount, 0);
  const featuredCategories = filteredCategories?.filter(cat => cat?.featured);
  const regularCategories = filteredCategories?.filter(cat => !cat?.featured);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Job Categories - JobBoard Pro</title>
          <meta name="description" content="Browse job opportunities by category. Find technology, design, marketing, healthcare, and other career opportunities." />
        </Helmet>
        <GlobalHeader />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Loading Skeleton */}
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-muted rounded w-2/3 mb-8"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)]?.map((_, index) => (
                  <div key={index} className="bg-surface border border-border rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-muted rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-full mb-2"></div>
                        <div className="h-4 bg-muted rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Job Categories - JobBoard Pro</title>
        <meta name="description" content="Browse job opportunities by category. Find technology, design, marketing, healthcare, and other career opportunities." />
        <meta name="keywords" content="job categories, career opportunities, technology jobs, design jobs, marketing jobs" />
      </Helmet>
      <GlobalHeader />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Explore Job Categories
            </h1>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto">
              Discover career opportunities across diverse industries and functions. 
              Browse by category to find roles that match your skills and interests.
            </p>
          </div>

          {/* Category Stats */}
          <CategoryStats 
            totalCategories={allCategories?.length}
            totalJobs={totalJobs}
            lastUpdated="2 hours ago"
          />

          {/* Recently Viewed Categories */}
          <RecentlyViewedCategories categories={recentlyViewedCategories} />

          {/* Search Interface */}
          <CategorySearch 
            categories={allCategories}
            onSearchResults={handleSearchResults}
          />

          {/* Filters */}
          <CategoryFilters 
            onFilterChange={handleFilterChange}
            activeFilters={activeFilters}
          />

          {/* Featured Categories */}
          {featuredCategories?.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Popular Categories</h2>
                <div className="flex items-center space-x-2 text-sm text-text-secondary">
                  <Icon name="TrendingUp" size={16} />
                  <span>High demand</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCategories?.map((category) => (
                  <CategoryCard 
                    key={category?.id} 
                    category={category} 
                    featured={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Categories */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">All Categories</h2>
              <div className="text-sm text-text-secondary">
                {filteredCategories?.length} categories found
              </div>
            </div>
            
            {filteredCategories?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularCategories?.map((category) => (
                  <CategoryCard 
                    key={category?.id} 
                    category={category}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon name="Search" size={48} className="text-text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No categories found</h3>
                <p className="text-text-secondary mb-4">
                  Try adjusting your search terms or filters to find relevant categories.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveFilters({ sort: 'popularity', location: '', experience: '' });
                    setFilteredCategories(allCategories);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Can't find the right category?
            </h3>
            <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
              Use our advanced search to find specific roles, or browse all available 
              job listings to discover opportunities you might have missed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="default"
                iconName="Search"
                iconPosition="left"
                onClick={() => window.location.href = '/job-search-results'}
              >
                Browse All Jobs
              </Button>
              <Button
                variant="outline"
                iconName="Filter"
                iconPosition="left"
                onClick={() => window.location.href = '/job-search-results?advanced=true'}
              >
                Advanced Search
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobCategories;