import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AdminNavigation from '../../components/ui/AdminNavigation';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { blogsApi } from '../../lib/database';
import BlogTable from './components/BlogTable';
import CreateBlogModal from './components/CreateBlogModal';

const AdminBlogManagement = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [filterCategory, filterStatus]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const filters = { status: filterStatus === 'all' ? undefined : filterStatus };
      if (filterCategory) filters.category = filterCategory;
      
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

  const handleCreatePost = () => {
    setEditingPost(null);
    setIsCreateModalOpen(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setIsCreateModalOpen(true);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      await blogsApi.deletePost(postId);
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const handleSavePost = async (postData) => {
    try {
      if (editingPost) {
        await blogsApi.updatePost(editingPost.id, postData);
      } else {
        await blogsApi.createPost(postData);
      }
      setIsCreateModalOpen(false);
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      throw error;
    }
  };

  const handleToggleStatus = async (post) => {
    try {
      const newStatus = post.status === 'published' ? 'draft' : 'published';
      const updateData = { 
        status: newStatus,
        published_at: newStatus === 'published' ? new Date().toISOString() : null
      };
      await blogsApi.updatePost(post.id, updateData);
      fetchPosts();
    } catch (error) {
      console.error('Error updating post status:', error);
      alert('Failed to update status');
    }
  };

  const filteredPosts = posts.filter(post => {
    if (searchQuery) {
      return post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <>
      <Helmet>
        <title>Blog Management | Admin | JobFinder Hub</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <AdminNavigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Blog Management</h1>
                <p className="text-text-secondary mt-2">
                  Create and manage blog posts
                </p>
              </div>
              <Button onClick={handleCreatePost}>
                <Icon name="Plus" size={16} className="mr-2" />
                Create New Post
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-surface rounded-lg border border-border p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Icon 
                  name="Search" 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
                />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Blog Table */}
          {loading ? (
            <div className="bg-surface rounded-lg border border-border p-12 text-center">
              <p className="text-text-secondary">Loading blog posts...</p>
            </div>
          ) : (
            <BlogTable 
              posts={filteredPosts}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </div>

        {/* Create/Edit Modal */}
        {isCreateModalOpen && (
          <CreateBlogModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSave={handleSavePost}
            editPost={editingPost}
            categories={categories}
          />
        )}
      </div>
    </>
  );
};

export default AdminBlogManagement;

