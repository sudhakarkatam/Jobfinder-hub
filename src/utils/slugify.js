import GithubSlugger from 'github-slugger';

/**
 * Generate SEO-friendly slug from job title
 * @param {string} title - Job title
 * @param {string} id - Job ID (optional, for uniqueness)
 * @returns {string} - URL-safe slug
 */
export const slugify = (title, id = '') => {
  if (!title) return id || 'job';
  
  // Convert to lowercase, handle backticks first, replace spaces with hyphens, remove special characters
  let slug = title
    .toLowerCase()
    .replace(/`/g, '')              // Remove backticks
    .replace(/[()]/g, '')           // Remove parentheses
    .replace(/[^a-z0-9\s-]/g, '')   // Remove special characters
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/-+/g, '-')            // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, '');       // Trim hyphens from start/end
  
  // Add first 8 chars of ID for uniqueness if provided
  if (id) {
    const shortId = id.substring(0, 8);
    slug = `${slug}-${shortId}`;
  }
  
  return slug || 'job';
};

/**
 * Get job slug from job object
 * @param {object} job - Job object with url_slug, title, and id
 * @returns {string} - Job slug for URL
 */
export const getJobSlug = (job) => {
  // If job already has a url_slug field from database, use it
  if (job?.url_slug) {
    return job.url_slug;
  }
  
  // Fallback to slug for backward compatibility
  if (job?.slug) {
    return job.slug;
  }
  
  // Otherwise use ID (UUID) as fallback
  return job?.id || 'job';
};

/**
 * Generate slug for blog posts or any content
 * Alias for slugify without ID parameter
 * @param {string} text - Text to convert to slug
 * @returns {string} - URL-safe slug
 */
export const generateSlug = (text) => {
  return slugify(text);
};

/**
 * Extract table of contents from markdown content
 * @param {string} markdown - Markdown content
 * @returns {Array<{id: string, title: string}>} - Array of TOC items
 */
export const extractTOC = (markdown) => {
  if (!markdown) return [];
  
  const headings = [];
  const slugger = new GithubSlugger();
  // Match h2 headings (## Title)
  const regex = /^##\s+(.+)$/gm;
  let match;
  
  while ((match = regex.exec(markdown)) !== null) {
    const title = match[1];
    // Use github-slugger to generate consistent IDs with rehype-slug
    const id = slugger.slug(title);
    headings.push({ id, title });
  }
  
  return headings;
};

