import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import SEO from '../../components/SEO';
import Icon from '../../components/AppIcon';
import { blogsApi } from '../../lib/database';

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const { data, error } = await blogsApi.getPost(slug);
      if (data) {
        setPost(data);
        // Fetch related posts from same category
        fetchRelatedPosts(data.category, data.id);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async (category, currentPostId) => {
    try {
      const { data, error } = await blogsApi.getPosts({ category, limit: 4 });
      if (data) {
        // Filter out current post
        const related = data.filter(p => p.id !== currentPostId).slice(0, 3);
        setRelatedPosts(related);
      }
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = post?.title || '';
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };


  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
          <GlobalHeader />
          <div className="pt-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <p className="text-text-secondary">Loading post...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
          <GlobalHeader />
          <div className="pt-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <Icon name="FileX" size={48} className="mx-auto text-text-secondary mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Post Not Found</h1>
              <p className="text-text-secondary mb-6">
                The blog post you're looking for doesn't exist.
              </p>
              <Link to="/blog" className="text-primary hover:underline">
                Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt}
        keywords={post.meta_keywords}
        image={post.featured_image}
        url={`/blog/${post.slug}`}
        type="article"
        article={{
          publishedAt: post.published_at,
          updatedAt: post.updated_at,
          category: post.category,
          tags: post.tags
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <GlobalHeader />

        <div className="pt-20">
          {/* Featured Image */}
          {post.featured_image && (
            <div className="w-full h-96 overflow-hidden bg-muted">
              <img 
                src={post.featured_image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content Container */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm text-text-secondary">
                <li>
                  <Link to="/" className="hover:text-primary">Home</Link>
                </li>
                <Icon name="ChevronRight" size={14} />
                <li>
                  <Link to="/blog" className="hover:text-primary">Blog</Link>
                </li>
                <Icon name="ChevronRight" size={14} />
                <li>
                  <Link to={`/blog?category=${post.category}`} className="hover:text-primary">
                    {post.category}
                  </Link>
                </li>
              </ol>
            </nav>

            {/* Post Header */}
            <article className="bg-surface rounded-lg p-8 md:p-12 mb-8">
              {/* Category and Date */}
              <div className="flex items-center space-x-3 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                  {post.category}
                </span>
                <span className="text-sm text-text-secondary">
                  {formatDate(post.published_at)}
                </span>
                <span className="text-sm text-text-secondary flex items-center">
                  <Icon name="Eye" size={14} className="mr-1" />
                  {post.views || 0} views
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-xl text-text-secondary mb-6">
                  {post.excerpt}
                </p>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary/10 text-secondary"
                    >
                      <Icon name="Tag" size={12} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share Buttons */}
              <div className="flex items-center space-x-3 pt-6 border-t border-border">
                <span className="text-sm font-medium text-text-secondary">Share:</span>
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 text-text-secondary hover:text-primary transition-colors"
                  title="Share on Twitter"
                >
                  <Icon name="Twitter" size={18} />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-2 text-text-secondary hover:text-primary transition-colors"
                  title="Share on LinkedIn"
                >
                  <Icon name="Linkedin" size={18} />
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 text-text-secondary hover:text-primary transition-colors"
                  title="Share on Facebook"
                >
                  <Icon name="Facebook" size={18} />
                </button>
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-text-secondary hover:text-primary transition-colors"
                  title="Copy link"
                >
                  <Icon name="Link" size={18} />
                </button>
              </div>

              {/* Divider */}
              <div className="my-8 border-t border-border"></div>

              {/* Content */}
              <div className="blog-content prose prose-lg max-w-none text-foreground">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-sans">
                  {post.markdown_content || post.content}
                </div>
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Blog content is displayed as plain text. Markdown rendering has been temporarily disabled due to build issues.
                  </p>
                </div>
              </div>
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-foreground mb-6">Related Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((related) => (
                    <Link
                      key={related.id}
                      to={`/blog/${related.slug}`}
                      className="group bg-surface border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      {related.featured_image && (
                        <div className="aspect-video overflow-hidden bg-muted">
                          <img 
                            src={related.featured_image} 
                            alt={related.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {related.title}
                        </h3>
                        <p className="text-sm text-text-secondary line-clamp-2">
                          {related.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetail;

