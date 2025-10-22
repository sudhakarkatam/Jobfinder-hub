import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BlogTable = ({ posts, onEdit, onDelete, onToggleStatus }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not published';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: {
        bg: 'bg-success/10',
        text: 'text-success',
        label: 'Published'
      },
      draft: {
        bg: 'bg-warning/10',
        text: 'text-warning',
        label: 'Draft'
      },
      archived: {
        bg: 'bg-muted',
        text: 'text-text-secondary',
        label: 'Archived'
      }
    };

    const config = statusConfig[status] || statusConfig.draft;

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (posts.length === 0) {
    return (
      <div className="bg-surface rounded-lg border border-border p-12 text-center">
        <Icon name="FileText" size={48} className="mx-auto text-text-secondary mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No blog posts yet</h3>
        <p className="text-text-secondary">
          Create your first blog post to get started
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Published
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    {post.featured_image && (
                      <img 
                        src={post.featured_image} 
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {post.title}
                      </p>
                      {post.excerpt && (
                        <p className="text-sm text-text-secondary line-clamp-2 mt-1">
                          {post.excerpt}
                        </p>
                      )}
                      {post.status === 'published' && (
                        <Link 
                          to={`/blog/${post.slug}`}
                          className="text-xs text-primary hover:underline mt-1 inline-flex items-center"
                          target="_blank"
                        >
                          View Post
                          <Icon name="ExternalLink" size={12} className="ml-1" />
                        </Link>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-secondary/10 text-secondary">
                    {post.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(post.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  {formatDate(post.published_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  <div className="flex items-center">
                    <Icon name="Eye" size={14} className="mr-1" />
                    {post.views || 0}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onToggleStatus(post)}
                      className="text-text-secondary hover:text-foreground transition-colors p-1"
                      title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                    >
                      <Icon name={post.status === 'published' ? 'EyeOff' : 'Eye'} size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(post)}
                      className="text-primary hover:text-primary-dark transition-colors p-1"
                      title="Edit"
                    >
                      <Icon name="Edit" size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(post.id)}
                      className="text-error hover:text-error-dark transition-colors p-1"
                      title="Delete"
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogTable;

