import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { generateSlug } from '../../../utils/slugify';

const CreateBlogModal = ({ isOpen, onClose, onSave, editPost = null, categories }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    markdown_content: '',
    category: '',
    author: 'Admin',
    featured_image: '',
    tags: [],
    customTag: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    status: 'draft'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Predefined blog tags
  const PREDEFINED_TAGS = [
    'Interview Questions',
    'Tutorial',
    'Career Advice',
    'Tips',
    'Best Practices',
    'Guide',
    'Resources'
  ];

  // Populate form with edit post data
  useEffect(() => {
    if (editPost) {
      setFormData({
        title: editPost.title || '',
        slug: editPost.slug || '',
        excerpt: editPost.excerpt || '',
        content: editPost.content || '',
        markdown_content: editPost.markdown_content || '',
        category: editPost.category || '',
        author: editPost.author || 'Admin',
        featured_image: editPost.featured_image || '',
        tags: editPost.tags || [],
        customTag: '',
        meta_title: editPost.meta_title || '',
        meta_description: editPost.meta_description || '',
        meta_keywords: editPost.meta_keywords || '',
        status: editPost.status || 'draft'
      });
    } else {
      resetForm();
    }
  }, [editPost, isOpen]);

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      markdown_content: '',
      category: '',
      author: 'Admin',
      featured_image: '',
      tags: [],
      customTag: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      status: 'draft'
    });
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate slug from title
    if (field === 'title' && !editPost) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }));
    }

    // Auto-generate meta fields if empty
    if (field === 'title' && !formData.meta_title) {
      setFormData(prev => ({
        ...prev,
        meta_title: value
      }));
    }

    if (field === 'excerpt' && !formData.meta_description) {
      setFormData(prev => ({
        ...prev,
        meta_description: value
      }));
    }

    // Clear error
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Tag management handlers
  const handleTagToggle = (tag, checked) => {
    setFormData(prev => ({
      ...prev,
      tags: checked 
        ? [...prev.tags, tag]
        : prev.tags.filter(t => t !== tag)
    }));
  };

  const handleAddCustomTag = () => {
    const newTag = formData.customTag.trim();
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag],
        customTag: ''
      }));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.markdown_content.trim()) {
      newErrors.markdown_content = 'Content is required';
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e, publishNow = false) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const postData = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.markdown_content, // Store markdown as content for now
        markdown_content: formData.markdown_content,
        category: formData.category,
        author: formData.author,
        featured_image: formData.featured_image.trim() || null,
        tags: formData.tags.length > 0 ? formData.tags : null,
        meta_title: formData.meta_title.trim() || formData.title.trim(),
        meta_description: formData.meta_description.trim() || formData.excerpt.trim(),
        meta_keywords: formData.meta_keywords.trim() || null,
        status: publishNow ? 'published' : formData.status,
        published_at: publishNow ? new Date().toISOString() : (formData.status === 'published' ? new Date().toISOString() : null)
      };

      await onSave(postData);
      resetForm();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-surface rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">
            {editPost ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-foreground transition-colors"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Toggle Preview */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
              >
                <Icon name={showPreview ? 'Edit' : 'Eye'} size={16} className="mr-2" />
                {showPreview ? 'Edit Mode' : 'Preview Mode'}
              </button>
            </div>

            {!showPreview ? (
              <>
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
                  
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter blog post title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-error">{errors.title}</p>
                    )}
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      placeholder="url-friendly-slug"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    {errors.slug && (
                      <p className="mt-1 text-sm text-error">{errors.slug}</p>
                    )}
                    <p className="mt-1 text-xs text-text-secondary">
                      URL: /blog/{formData.slug || 'your-post-slug'}
                    </p>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-error">{errors.category}</p>
                    )}
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Excerpt *
                    </label>
                    <textarea
                      placeholder="Brief description of your post (shown in listings)"
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange('excerpt', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    {errors.excerpt && (
                      <p className="mt-1 text-sm text-error">{errors.excerpt}</p>
                    )}
                  </div>

                  {/* Featured Image */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Featured Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.featured_image}
                      onChange={(e) => handleInputChange('featured_image', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Markdown Content */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Content (Markdown) *</h3>
                  <textarea
                    placeholder="Write your post content in markdown..."
                    value={formData.markdown_content}
                    onChange={(e) => handleInputChange('markdown_content', e.target.value)}
                    rows={20}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                  />
                  {errors.markdown_content && (
                    <p className="mt-1 text-sm text-error">{errors.markdown_content}</p>
                  )}
                  <p className="text-xs text-text-secondary">
                    Supports markdown syntax: **bold**, *italic*, `code`, ```language for code blocks, # headings, - lists, etc.
                  </p>
                </div>

                {/* Tags */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Tags (Optional)</h3>
                  
                  {/* Predefined Tags */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Select Predefined Tags
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {PREDEFINED_TAGS.map(tag => (
                        <label key={tag} className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors">
                          <input
                            type="checkbox"
                            checked={formData.tags.includes(tag)}
                            onChange={(e) => handleTagToggle(tag, e.target.checked)}
                            className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                          />
                          <span className="text-sm text-foreground">{tag}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Custom Tags */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Add Custom Tag
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g., Advanced Topics"
                        value={formData.customTag}
                        onChange={(e) => handleInputChange('customTag', e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomTag();
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddCustomTag}
                        disabled={!formData.customTag.trim()}
                      >
                        Add Tag
                      </Button>
                    </div>
                  </div>
                  
                  {/* Selected Tags */}
                  {formData.tags.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Selected Tags ({formData.tags.length})
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="hover:text-error transition-colors ml-1"
                            >
                              <Icon name="X" size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* SEO Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">SEO Settings</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      placeholder="SEO title (defaults to post title)"
                      value={formData.meta_title}
                      onChange={(e) => handleInputChange('meta_title', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Meta Description
                    </label>
                    <textarea
                      placeholder="SEO description (defaults to excerpt)"
                      value={formData.meta_description}
                      onChange={(e) => handleInputChange('meta_description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Meta Keywords
                    </label>
                    <input
                      type="text"
                      placeholder="keyword1, keyword2, keyword3"
                      value={formData.meta_keywords}
                      onChange={(e) => handleInputChange('meta_keywords', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white p-8 rounded-md border border-border">
                <div className="mb-6">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{formData.title || 'Untitled Post'}</h1>
                  {formData.excerpt && (
                    <p className="text-xl text-gray-600 mb-4">{formData.excerpt}</p>
                  )}
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                      {formData.category || 'Uncategorized'}
                    </span>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="border-t border-border my-6"></div>
                <div className="prose prose-lg max-w-none">
                  {formData.markdown_content ? (
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-mono text-sm bg-gray-50 p-4 rounded">
                      {formData.markdown_content}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">Start writing your content...</p>
                  )}
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                    Preview shows plain text. Markdown rendering disabled.
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="flex items-center space-x-2">
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="draft">Save as Draft</option>
              <option value="published">Publish</option>
              <option value="archived">Archive</option>
            </select>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              onClick={(e) => handleSubmit(e, false)} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (editPost ? 'Update Post' : 'Save Post')}
            </Button>
            {!editPost && (
              <Button 
                onClick={(e) => handleSubmit(e, true)} 
                disabled={isSubmitting}
                className="bg-success hover:bg-success-dark"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Now'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogModal;

