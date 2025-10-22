/**
 * Fuzzy String Matching Utility
 * Implements Levenshtein distance algorithm for typo-tolerant search
 */

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Edit distance between strings
 */
const levenshteinDistance = (str1, str2) => {
  const len1 = str1.length;
  const len2 = str2.length;
  
  // Create 2D array for dynamic programming
  const dp = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));
  
  // Initialize base cases
  for (let i = 0; i <= len1; i++) dp[i][0] = i;
  for (let j = 0; j <= len2; j++) dp[0][j] = j;
  
  // Fill the matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,    // deletion
          dp[i][j - 1] + 1,    // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }
  
  return dp[len1][len2];
};

/**
 * Calculate similarity percentage between two strings with smart word matching
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Similarity score from 0 to 100
 */
export const calculateSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;
  
  // Normalize strings
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  // Exact match
  if (s1 === s2) return 100;
  
  // Check if one string contains the other completely
  if (s1.includes(s2) || s2.includes(s1)) return 90;
  
  // Split into words for intelligent matching
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  
  // If both have multiple words, check if key words match
  if (words1.length > 1 && words2.length > 1) {
    // Check if the first significant word matches (not common words like "developer")
    const commonWords = ['developer', 'engineer', 'designer', 'manager', 'analyst', 'specialist'];
    
    // Get significant words (non-common words)
    const sig1 = words1.filter(w => !commonWords.includes(w));
    const sig2 = words2.filter(w => !commonWords.includes(w));
    
    // If both have significant words and none match, return low similarity
    if (sig1.length > 0 && sig2.length > 0) {
      const hasMatchingKeyword = sig1.some(w1 => 
        sig2.some(w2 => {
          // Check for exact match or very close match (1-2 char difference for typos)
          if (w1 === w2) return true;
          const dist = levenshteinDistance(w1, w2);
          const maxLen = Math.max(w1.length, w2.length);
          // Only consider it a match if < 3 characters different AND > 70% similar
          return dist <= 2 && ((maxLen - dist) / maxLen) * 100 >= 70;
        })
      );
      
      // If no key words match, these are different things entirely
      if (!hasMatchingKeyword) {
        return 0; // "react developer" vs "java developer" = 0
      }
    }
  }
  
  // Calculate Levenshtein distance for overall similarity
  const distance = levenshteinDistance(s1, s2);
  const maxLength = Math.max(s1.length, s2.length);
  
  // Convert distance to similarity percentage
  const similarity = ((maxLength - distance) / maxLength) * 100;
  
  return Math.round(similarity);
};

/**
 * Find if search query matches any job tags with fuzzy matching
 * @param {string} searchQuery - User's search query
 * @param {Array<string>} jobTags - Array of job tags
 * @param {number} threshold - Minimum similarity score (0-100)
 * @returns {boolean} - True if any tag matches above threshold
 */
export const findBestTagMatch = (searchQuery, jobTags, threshold = 75) => {
  if (!searchQuery || !jobTags || jobTags.length === 0) return false;
  
  return jobTags.some(tag => {
    const similarity = calculateSimilarity(searchQuery, tag);
    return similarity >= threshold;
  });
};

/**
 * Get all matching tags from job tags array
 * @param {string} searchQuery - User's search query
 * @param {Array<string>} jobTags - Array of job tags
 * @param {number} threshold - Minimum similarity score (0-100)
 * @returns {Array<{tag: string, similarity: number}>} - Matching tags with scores
 */
export const getMatchingTags = (searchQuery, jobTags, threshold = 75) => {
  if (!searchQuery || !jobTags || jobTags.length === 0) return [];
  
  return jobTags
    .map(tag => ({
      tag,
      similarity: calculateSimilarity(searchQuery, tag)
    }))
    .filter(({ similarity }) => similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity);
};

/**
 * Extract unique tags from all jobs
 * @param {Array<Object>} jobs - Array of job objects
 * @returns {Array<string>} - Unique tags across all jobs
 */
export const extractUniqueTags = (jobs) => {
  const tagSet = new Set();
  
  jobs.forEach(job => {
    if (job.tags && Array.isArray(job.tags)) {
      job.tags.forEach(tag => tagSet.add(tag));
    }
  });
  
  return Array.from(tagSet);
};

