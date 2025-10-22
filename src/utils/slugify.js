/**
 * Generate SEO-friendly slug from job title
 * @param {string} title - Job title
 * @param {string} id - Job ID (optional, for uniqueness)
 * @returns {string} - URL-safe slug
 */
export const slugify = (title, id = '') => {
  if (!title) return id || 'job';
  
  // Convert to lowercase, replace spaces with hyphens, remove special characters
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/-+/g, '-')           // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, '');      // Trim hyphens from start/end
  
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

