import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import SEO from '../../components/SEO';
import Icon from '../../components/AppIcon';
import { blogsApi } from '../../lib/database';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import { extractTOC } from '../../utils/slugify';

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('');
  const [toc, setToc] = useState([]);
  const contentRef = useRef(null);
  const tocContainerRef = useRef(null);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const { data, error } = await blogsApi.getPost(slug);
      if (data) {
        setPost(data);
        // Extract TOC from markdown content
        const markdown = data.markdown_content || data.content || '';
        const extractedTOC = extractTOC(markdown);
        setToc(extractedTOC);
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

  // Track active section on scroll and auto-scroll TOC
  useEffect(() => {
    if (!toc.length || !tocContainerRef.current) return;

    const handleScroll = () => {
      const sections = toc.map(t => document.getElementById(t.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          
          // Auto-scroll TOC to keep active item visible
          const activeTocButton = tocContainerRef.current?.querySelector(`button[data-section-id="${section.id}"]`);
          if (activeTocButton && tocContainerRef.current) {
            const container = tocContainerRef.current;
            const containerTop = container.scrollTop;
            const containerBottom = containerTop + container.clientHeight;
            const buttonTop = activeTocButton.offsetTop;
            const buttonBottom = buttonTop + activeTocButton.offsetHeight;

            // Scroll if active button is outside visible area
            if (buttonTop < containerTop) {
              container.scrollTo({
                top: buttonTop - 10,
                behavior: 'smooth'
              });
            } else if (buttonBottom > containerBottom) {
              container.scrollTo({
                top: buttonBottom - container.clientHeight + 10,
                behavior: 'smooth'
              });
            }
          }
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);

  // Scroll to section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  // Scroll TOC to top
  const scrollTocToTop = () => {
    if (tocContainerRef.current) {
      tocContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <article className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12 mb-8 min-w-0">
                {/* Category and Date */}
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-200">
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
                <div className="flex items-center space-x-3 pt-6 pb-6 border-b border-border">
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

                {/* Content */}
                <div ref={contentRef} className="blog-content max-w-none text-foreground mt-8">
                  <MarkdownRenderer markdown={post.markdown_content || post.content || ''} />
                </div>
              </article>

              {/* Sidebar - Table of Contents */}
              {toc.length > 0 && (
                <aside className="lg:w-80 flex-shrink-0">
                  <div className="sticky top-24 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-foreground">
                        Table of Contents
                      </h3>
                      <button
                        onClick={scrollTocToTop}
                        className="p-1.5 text-text-secondary hover:text-primary hover:bg-gray-100 rounded-md transition-colors"
                        title="Scroll to top"
                        aria-label="Scroll Table of Contents to top"
                      >
                        <Icon name="ArrowUp" size={16} />
                      </button>
                    </div>
                    <nav 
                      ref={tocContainerRef}
                      className="space-y-1 max-h-[calc(100vh-250px)] overflow-y-auto pr-2"
                      style={{ scrollBehavior: 'smooth' }}
                    >
                      {toc.map((item, index) => (
                        <button
                          key={item.id}
                          data-section-id={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 text-sm ${
                            activeSection === item.id
                              ? 'bg-blue-50 text-blue-700 font-medium border-l-3 border-blue-600'
                              : 'text-text-secondary hover:bg-gray-50 hover:text-foreground'
                          }`}
                        >
                          <span className="text-gray-400 mr-2">#{index + 1}</span>
                          {item.title}
                        </button>
                      ))}
                    </nav>
                  </div>
                </aside>
              )}
            </div>

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

