import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import SEO from '../../components/SEO';
import Icon from '../../components/AppIcon';
import { blogsApi } from '../../lib/database';

const BlogListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const filters = { status: 'published' };
      if (selectedCategory) filters.category = selectedCategory;
      
      const { data, error } = await blogsApi.getPosts(filters);
      if (data) {
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await blogsApi.getCategories();
      if (data) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategorySelect = (categorySlug) => {
    setSelectedCategory(categorySlug);
    if (categorySlug) {
      setSearchParams({ category: categorySlug });
    } else {
      setSearchParams({});
    }
  };

  const filteredPosts = posts.filter(post => {
    if (searchQuery) {
      return post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get featured posts (first 3)
  const featuredPosts = filteredPosts.slice(0, 3);
  const regularPosts = filteredPosts.slice(3);

  return (
    <>
      <SEO 
        title="Blog - Career Advice, Interview Questions & Tech Tutorials"
        description="Explore our blog for career advice, interview questions, coding tutorials, and job search tips"
        keywords="career blog, interview questions, coding tutorials, job search tips, tech blog"
        url="/blog"
      />

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <GlobalHeader />

        <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Career Insights & Tutorials
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Expert advice, interview questions, and career guidance to help you succeed
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Icon 
                name="Search" 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
              />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-surface text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => handleCategorySelect(e.target.value)}
              className="px-4 py-3 border border-border rounded-lg bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name} ({cat.post_count})
                </option>
              ))}
            </select>
          </div>

          {/* Category Pills */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => handleCategorySelect('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !selectedCategory 
                  ? 'bg-primary text-white' 
                  : 'bg-surface text-foreground hover:bg-muted border border-border'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.slug 
                    ? 'bg-primary text-white' 
                    : 'bg-surface text-foreground hover:bg-muted border border-border'
                }`}
              >
                {cat.name} ({cat.post_count})
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-text-secondary">Loading posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="FileText" size={48} className="mx-auto text-text-secondary mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No posts found</h3>
              <p className="text-text-secondary">
                Try adjusting your search or filter
              </p>
            </div>
          ) : (
            <>
              {/* Featured Posts */}
              {featuredPosts.length > 0 && !searchQuery && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Featured Posts</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {featuredPosts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.slug}`}
                        className="group bg-surface border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                      >
                        {post.featured_image && (
                          <div className="aspect-video overflow-hidden bg-muted">
                            <img 
                              src={post.featured_image} 
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              {post.category}
                            </span>
                            <span className="text-xs text-text-secondary">
                              {formatDate(post.published_at)}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-text-secondary text-sm line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="mt-4 flex items-center text-primary text-sm font-medium">
                            Read More
                            <Icon name="ArrowRight" size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Posts */}
              {regularPosts.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    {featuredPosts.length > 0 && !searchQuery ? 'More Posts' : 'All Posts'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularPosts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.slug}`}
                        className="group bg-surface border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                      >
                        {post.featured_image && (
                          <div className="aspect-video overflow-hidden bg-muted">
                            <img 
                              src={post.featured_image} 
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                              {post.category}
                            </span>
                            <span className="text-xs text-text-secondary">
                              {formatDate(post.published_at)}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-text-secondary text-sm line-clamp-3">
                            {post.excerpt}
                          </p>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center text-primary text-sm font-medium">
                              Read More
                              <Icon name="ArrowRight" size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <div className="flex items-center text-text-secondary text-xs">
                              <Icon name="Eye" size={12} className="mr-1" />
                              {post.views || 0}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* If only featured posts and no regular posts */}
              {featuredPosts.length > 0 && regularPosts.length === 0 && !searchQuery && null}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogListing;

