import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { defaultSchema } from 'rehype-sanitize';
import Icon from './AppIcon';

// Allow safe HTML with classes on code/pre and math elements
// Based on default schema from rehype-sanitize
const sanitizedSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    h1: [...(defaultSchema.attributes?.h1 || []), 'id'],
    h2: [...(defaultSchema.attributes?.h2 || []), 'id'],
    h3: [...(defaultSchema.attributes?.h3 || []), 'id'],
    h4: [...(defaultSchema.attributes?.h4 || []), 'id'],
    h5: [...(defaultSchema.attributes?.h5 || []), 'id'],
    h6: [...(defaultSchema.attributes?.h6 || []), 'id'],
    code: [...(defaultSchema.attributes?.code || []), 'className'],
    pre: [...(defaultSchema.attributes?.pre || []), 'className'],
    span: [...(defaultSchema.attributes?.span || []), 'className'],
    div: [...(defaultSchema.attributes?.div || []), 'className']
  },
  clobberPrefix: 'md-'
};

function isExternalHref(href) {
  try {
    const url = new URL(href, window.location.origin);
    return url.origin !== window.location.origin;
  } catch {
    return false;
  }
}

// Copy button component for code blocks
const CopyButton = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors duration-200 flex items-center gap-1 text-sm"
      title="Copy code"
    >
      {copied ? (
        <>
          <Icon name="Check" size={14} />
          Copied!
        </>
      ) : (
        <>
          <Icon name="Copy" size={14} />
          Copy
        </>
      )}
    </button>
  );
};

// Helper to extract plain text from React children (handles syntax highlighting spans)
const extractText = (children) => {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (children && typeof children === 'object' && 'props' in children) {
    return extractText(children.props?.children);
  }
  return '';
};

const MarkdownRenderer = ({ markdown = '', isExcerpt = false }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[
        [rehypeSanitize, sanitizedSchema],  // Sanitize first
        rehypeSlug,                          // Then add IDs
        // Disabled autolink to avoid wrapping headings in links (interferes with TOC navigation)
        // [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        rehypeKatex,
        [rehypeHighlight, { detect: true, ignoreMissing: true }],
        // Only allow raw HTML when not rendering excerpts
        ...(isExcerpt ? [] : [rehypeRaw])
      ]}
      components={{
        a: ({ node, href = '', children, ...props }) => {
          const external = isExternalHref(href);
          return (
            <a
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'nofollow noopener noreferrer' : undefined}
              className="text-primary hover:underline"
              {...props}
            >
              {children}
            </a>
          );
        },
        pre: ({ children, ...props }) => {
          const childArray = React.Children.toArray(children);
          const codeElement = childArray[0];
          const className = codeElement?.props?.className || '';
          const codeText = extractText(codeElement?.props?.children ?? codeElement);

          return (
            <div className="relative group my-6">
              <pre
                {...props}
                className="relative bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto border border-gray-700"
              >
                {children}
              </pre>
              <CopyButton code={codeText} />
            </div>
          );
        },
        code: ({ inline, className, children, ...props }) => {
          // Inline code - styled differently
          if (inline) {
            return (
              <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            );
          }
          // Block code - handled by pre component
          return <code className={className} {...props}>{children}</code>;
        },
        h2: ({ children, ...props }) => (
          <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground border-b border-gray-200 pb-2 first:mt-0" {...props}>
            {children}
          </h2>
        ),
        h3: ({ children, ...props }) => (
          <h3 className="text-2xl font-bold mt-6 mb-3 text-foreground" {...props}>
            {children}
          </h3>
        ),
        h4: ({ children, ...props }) => (
          <h4 className="text-xl font-bold mt-4 mb-2 text-foreground" {...props}>
            {children}
          </h4>
        ),
        p: ({ children, ...props }) => (
          <p className="mb-4 text-foreground leading-7" {...props}>
            {children}
          </p>
        ),
        ul: ({ children, ...props }) => (
          <ul className="list-disc list-inside mb-4 space-y-2 text-foreground ml-4" {...props}>
            {children}
          </ul>
        ),
        ol: ({ children, ...props }) => (
          <ol className="list-decimal list-inside mb-4 space-y-2 text-foreground ml-4" {...props}>
            {children}
          </ol>
        ),
        li: ({ children, ...props }) => (
          <li className="leading-7" {...props}>
            {children}
          </li>
        ),
        table: ({ children, ...props }) => (
          <div className="overflow-x-auto my-6 rounded-lg border border-gray-300">
            <table
              className="min-w-full border-collapse"
              {...props}
            >
              {children}
            </table>
          </div>
        ),
        thead: ({ children, ...props }) => (
          <thead className="bg-gray-100" {...props}>
            {children}
          </thead>
        ),
        th: ({ children, ...props }) => (
          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-foreground" {...props}>
            {children}
          </th>
        ),
        td: ({ children, ...props }) => (
          <td className="border border-gray-300 px-4 py-3 text-foreground" {...props}>
            {children}
          </td>
        ),
        blockquote: ({ children, ...props }) => (
          <blockquote
            className="border-l-4 border-primary pl-4 py-2 my-4 italic text-text-secondary bg-gray-50 rounded-r"
            {...props}
          >
            {children}
          </blockquote>
        ),
        strong: ({ children, ...props }) => (
          <strong className="font-bold text-foreground" {...props}>
            {children}
          </strong>
        ),
        em: ({ children, ...props }) => (
          <em className="italic" {...props}>
            {children}
          </em>
        ),
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;


