import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import GlobalHeader from '../../components/ui/GlobalHeader';
import Icon from '../../components/AppIcon';
import { categoriesApi, jobsApi } from '../../lib/database';

const JobCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [batchCounts, setBatchCounts] = useState({
    '2024': 0,
    '2025': 0,
    '2026': 0,
    '2027': 0
  });

  useEffect(() => {
    fetchCategories();
    fetchBatchCounts();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await categoriesApi.getCategories();
      
      if (data) {
        // Map categories to include icons and job counts
        const categoryIconMap = {
          'Technology': 'Cpu',
          'Development': 'Code',
          'Design': 'Palette',
          'Data Science': 'BarChart3',
          'Marketing': 'Megaphone',
          'Product': 'Package',
          'Finance': 'DollarSign',
          'Sales': 'TrendingUp',
          'Healthcare': 'Heart',
          'Education': 'GraduationCap',
          'Banking Jobs': 'Building2',
          'Government Jobs': 'Landmark'
        };

        const transformedCategories = data.map(cat => ({
          id: cat.id,
          name: cat.name,
          icon: categoryIconMap[cat.name] || 'Folder',
          jobCount: cat.job_count || 0,
          slug: cat.name.toLowerCase().replace(/\s+/g, '-')
        }));

        setCategories(transformedCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBatchCounts = async () => {
    try {
      const { data, error } = await jobsApi.getJobs();
      
      if (!error && data) {
        const batches = {
          '2024': 0,
          '2025': 0,
          '2026': 0,
          '2027': 0
        };

        data.forEach(job => {
          // Count jobs by batch
          if (job.batch && Array.isArray(job.batch)) {
            job.batch.forEach(year => {
              if (batches[year] !== undefined) {
                batches[year]++;
              }
            });
          }
        });

        setBatchCounts(batches);
      }
    } catch (err) {
      console.error('Error loading batch counts:', err);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/job-search-results?category=${category.slug}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <>
      <Helmet>
        <title>Job Categories | JobFinder Hub</title>
        <meta name="description" content="Browse jobs by category - Technology, Healthcare, Finance, and more." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <GlobalHeader />

        <main className="pt-16">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Browse Jobs by Category
                </h1>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                  Find your perfect opportunity in your field of expertise
                </p>
              </motion.div>
            </div>
          </section>

          {/* Jobs by Batch Section */}
          <section className="py-16 bg-muted/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header */}
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Jobs by Batch
                </h2>
                <p className="text-text-secondary">
                  Find opportunities tailored for your graduation year
                </p>
              </div>

              {/* Batch Cards Grid */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {[
                  { id: '2024', name: '2024 Batch', gradient: 'from-pink-500 to-pink-600', iconBg: 'bg-pink-100', iconColor: 'text-pink-600' },
                  { id: '2025', name: '2025 Batch', gradient: 'from-indigo-500 to-indigo-600', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
                  { id: '2026', name: '2026 Batch', gradient: 'from-teal-500 to-teal-600', iconBg: 'bg-teal-100', iconColor: 'text-teal-600' },
                  { id: '2027', name: '2027 Batch', gradient: 'from-amber-500 to-amber-600', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' }
                ].map((batch) => (
                  <motion.div
                    key={batch.id}
                    variants={itemVariants}
                    onClick={() => navigate(`/tag/${batch.id}-batch`)}
                    className="group relative bg-surface border border-border rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Gradient Background on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${batch.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon */}
                      <div className={`${batch.iconBg} w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon 
                          name="Calendar" 
                          size={28} 
                          className={batch.iconColor}
                        />
                      </div>

                      {/* Batch Name */}
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {batch.name}
                      </h3>

                      {/* Job Count */}
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary text-sm">
                          {batchCounts[batch.id]} {batchCounts[batch.id] === 1 ? 'job' : 'jobs'}
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
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Categories Grid */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {loading ? (
                /* Loading Skeleton */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-surface border border-border rounded-lg p-6 animate-pulse">
                      <div className="w-12 h-12 bg-muted rounded-lg mb-4"></div>
                      <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {categories.map((category) => (
                    <motion.div
                      key={category.id}
                      variants={itemVariants}
                      onClick={() => handleCategoryClick(category)}
                      className="bg-surface border border-border rounded-lg p-6 hover:shadow-xl hover:border-primary transition-all duration-300 cursor-pointer group"
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Icon */}
                      <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
                        <Icon name={category.icon} size={28} className="text-primary group-hover:text-primary-foreground" />
                      </div>

                      {/* Category Name */}
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>

                      {/* Job Count */}
                      <p className="text-sm text-text-secondary mb-4">
                        {category.jobCount} open position{category.jobCount !== 1 ? 's' : ''}
                      </p>

                      {/* View Jobs Button */}
                      <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                        <span>View Jobs</span>
                        <Icon name="ArrowRight" size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* No Categories State */}
              {!loading && categories.length === 0 && (
                <div className="text-center py-16">
                  <Icon name="FolderOpen" size={64} className="text-text-secondary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Categories Available</h3>
                  <p className="text-text-secondary">
                    Categories will appear here once jobs are added to the system.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-surface border-t border-border mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center text-text-secondary">
              <p>&copy; 2024 JobBoard Pro. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default JobCategories;

