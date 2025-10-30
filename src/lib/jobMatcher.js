/**
 * Local Job Matcher - Hybrid AI Resume Matcher
 * 
 * This module implements algorithmic job matching without AI dependency.
 * Use Gemini AI for resume parsing (skill extraction), then this algorithm for fast, reliable matching.
 */

// Map job categories to related keywords for intelligent matching
const categoryKeywords = {
  'software-development': ['developer', 'engineer', 'programmer', 'software', 'full stack', 'web developer', 'backend', 'frontend'],
  'data-science': ['data scientist', 'ml engineer', 'data analyst', 'data engineer', 'machine learning', 'ai engineer'],
  'devops': ['devops', 'sre', 'infrastructure', 'cloud engineer', 'site reliability'],
  'ui-ux': ['ui designer', 'ux designer', 'designer', 'ui/ux', 'product designer'],
  'qa-testing': ['qa', 'tester', 'quality assurance', 'test engineer', 'qa engineer'],
  'mobile-development': ['mobile', 'ios', 'android', 'react native', 'flutter'],
  'database': ['dba', 'database administrator', 'database engineer'],
  'network-security': ['network', 'security', 'cybersecurity', 'network engineer'],
  'it-support': ['it support', 'help desk', 'technical support', 'system administrator'],
  'government': ['government', 'public sector', 'railway', 'rrb', 'ssc', 'banking', 'psu', 'government job', 'public service'],
  'government-jobs': ['government', 'public sector', 'railway', 'rrb', 'ssc', 'banking', 'psu', 'government job', 'public service'],
  'finance': ['finance', 'accounting', 'auditor', 'financial analyst', 'accountant', 'banking'],
  'education': ['teacher', 'professor', 'educator', 'academic', 'training', 'instruction']
};

// Scoring weights configuration
const SCORING_WEIGHTS = {
  SKILL: 0.50,          // 50% - Skill overlap (most important)
  EXPERIENCE: 0.20,     // 20% - Experience level fit
  CATEGORY: 0.15,       // 15% - Job category relevance
  FRESHNESS: 0.10,      // 10% - Recently posted
  PRIORITY: 0.05        // 5% - Urgent/Featured jobs
};

/**
 * Calculate skill match score (0-100)
 * Checks skill overlap between resume and job requirements
 */
function calculateSkillMatch(resumeSkills, job) {
  if (!resumeSkills || resumeSkills.length === 0) {
    return { score: 0, matchingSkills: [] };
  }

  const normalizedResumeSkills = resumeSkills.map(s => s.toLowerCase().trim());
  
  // Combine all job text to search for skills (title, description, requirements, responsibilities)
  const jobText = `${job.title || ''} ${job.description || ''} ${job.requirements || ''} ${job.responsibilities || ''}`.toLowerCase();
  
  // Find matching skills (improved matching)
  const matchingSkills = normalizedResumeSkills.filter(skill => {
    const lowerSkill = skill.toLowerCase();
    // Direct match
    if (jobText.includes(lowerSkill)) {
      return true;
    }
    // Partial word match (e.g., "Python" matches "Python Developer")
    const skillWords = lowerSkill.split(/\s+/);
    if (skillWords.length === 1) {
      // Single word skill - check for word boundaries
      return jobText.includes(` ${lowerSkill} `) || 
             jobText.includes(` ${lowerSkill}.`) || 
             jobText.includes(` ${lowerSkill},`) ||
             jobText.startsWith(lowerSkill + ' ') ||
             jobText.endsWith(' ' + lowerSkill);
    }
    // Multi-word skill - check if all words appear
    return skillWords.every(word => jobText.includes(word));
  });
  
  // Calculate base score based on match ratio
  let skillScore = (matchingSkills.length / Math.max(normalizedResumeSkills.length, 1)) * 100;
  
  // Bonus for high-value skills in job title (indicates core requirement)
  const titleMatches = normalizedResumeSkills.filter(skill =>
    job.title.toLowerCase().includes(skill.toLowerCase())
  );
  skillScore += titleMatches.length * 5;  // +5 points per title match
  
  // Bonus for advanced skills (longer skill names often indicate specialization)
  const advancedSkills = matchingSkills.filter(skill => skill.split(' ').length >= 2);
  skillScore += advancedSkills.length * 2;  // +2 points per advanced skill
  
  return {
    score: Math.min(skillScore, 100),
    matchingSkills: matchingSkills
  };
}

/**
 * Calculate experience match score (0-100)
 * Matches candidate experience with job requirements
 */
function calculateExperienceMatch(candidateYears, job) {
  // Extract experience requirements from job
  const jobText = `${job.description || ''} ${job.requirements || ''}`.toLowerCase();
  
  // Try to find explicit experience range
  const experiencePattern = /(\d+)[\s-]+(\d*)\s*years?/g;
  const matches = [...jobText.matchAll(experiencePattern)];
  
  if (matches.length > 0) {
    const match = matches[0];
    const minYears = parseInt(match[1]);
    const maxYears = match[2] ? parseInt(match[2]) : minYears + 5;
    
    if (candidateYears >= minYears && candidateYears <= maxYears) {
      return 100;  // Perfect fit
    } else if (candidateYears > maxYears) {
      return 80;   // Overqualified (still good but less ideal)
    } else {
      // Underqualified - score based on how close they are
      return Math.max(0, (candidateYears / minYears) * 100);
    }
  }
  
  // Fallback: use experience_level field if available
  if (job.experience_level) {
    const level = job.experience_level.toLowerCase();
    if (level.includes('entry') || level.includes('junior')) {
      return candidateYears <= 2 ? 100 : 70;
    } else if (level.includes('mid') || level.includes('intermediate')) {
      return candidateYears >= 2 && candidateYears <= 5 ? 100 : 70;
    } else if (level.includes('senior')) {
      return candidateYears >= 5 ? 100 : 70;
    }
  }
  
  // Default: neutral score if no explicit requirements
  return 50;
}

/**
 * Calculate category match score (0-100)
 * Matches job category with resume job titles and education
 */
function calculateCategoryMatch(resumeJobTitles, resumeEducation, jobCategory) {
  const keywords = categoryKeywords[jobCategory] || [];
  
  // Combine resume information
  const resumeText = [
    ...(resumeJobTitles || []),
    ...(resumeEducation || [])
  ].join(' ').toLowerCase();
  
  if (resumeText.length === 0) {
    return 30;  // Generic fallback if no resume info
  }
  
  // Check for keyword matches
  const matches = keywords.filter(keyword => 
    resumeText.includes(keyword.toLowerCase())
  );
  
  if (matches.length > 0) {
    return 100;  // Direct category match
  }
  
  return 30;  // Generic fallback
}

/**
 * Calculate freshness score (0-100)
 * Rewards recently posted jobs
 */
function calculateFreshnessScore(jobCreatedAt) {
  if (!jobCreatedAt) return 50;
  
  const now = new Date();
  const createdAt = new Date(jobCreatedAt);
  const daysSincePosted = (now - createdAt) / (1000 * 60 * 60 * 24);  // Convert to days
  
  if (daysSincePosted <= 7) {
    return 100;   // Posted this week - highest priority
  } else if (daysSincePosted <= 30) {
    return 70;    // Posted this month
  } else if (daysSincePosted <= 90) {
    return 40;    // Posted in last 3 months
  } else {
    return 10;    // Older posts
  }
}

/**
 * Calculate priority bonus (0-100)
 * Rewards urgent and featured jobs
 */
function calculatePriorityScore(job) {
  let priorityScore = 0;
  
  if (job.urgent) {
    priorityScore += 50;  // Urgent jobs get +50 points
  }
  
  if (job.featured) {
    priorityScore += 50;  // Featured jobs get +50 points
  }
  
  return Math.min(priorityScore, 100);  // Cap at 100
}

/**
 * Generate human-readable match reason
 */
function generateMatchReason(skillScore, experienceScore, categoryScore, matchingSkills) {
  const reasons = [];
  
  // Skill-based reasons
  if (skillScore >= 80) {
    reasons.push(`Excellent skill match: ${matchingSkills.length} skills align with requirements`);
  } else if (skillScore >= 60) {
    reasons.push(`Strong skill match: ${matchingSkills.length} relevant skills`);
  } else if (skillScore >= 40) {
    reasons.push(`Partial skill match: ${matchingSkills.length} matching skills`);
  }
  
  // Experience-based reasons
  if (experienceScore === 100) {
    reasons.push('Experience level perfectly matches requirements');
  } else if (experienceScore >= 80) {
    reasons.push('Experience level is a good fit');
  } else if (experienceScore < 40) {
    reasons.push('Consider growing your experience');
  }
  
  // Category-based reasons
  if (categoryScore === 100) {
    reasons.push('Job category aligns with your background');
  }
  
  return reasons.length > 0 ? reasons.join('. ') : 'Good match based on your profile';
}

/**
 * Main matching function
 * Matches jobs to parsed resume data using algorithmic scoring
 * 
 * @param {Object} resumeData - Parsed resume data (from Gemini AI)
 * @param {Array} jobs - All jobs from database
 * @returns {Array} Jobs sorted by match score (highest first)
 */
export function matchJobsLocally(resumeData, jobs) {
  if (!jobs || jobs.length === 0) {
    return [];
  }
  
  // Prepare resume data
  const resumeSkills = resumeData.skills || [];
  const resumeJobTitles = resumeData.jobTitles || [];
  const resumeEducation = resumeData.education || [];
  const candidateYears = resumeData.totalExperience || 0;
  
  // Score each job
  const scoredJobs = jobs.map(job => {
    // Calculate individual component scores
    const skillResult = calculateSkillMatch(resumeSkills, job);
    const experienceScore = calculateExperienceMatch(candidateYears, job);
    const categoryScore = calculateCategoryMatch(resumeJobTitles, resumeEducation, job.category);
    const freshnessScore = calculateFreshnessScore(job.created_at);
    const priorityScore = calculatePriorityScore(job);
    
    // Calculate weighted total score
    const totalScore = Math.round(
      skillResult.score * SCORING_WEIGHTS.SKILL +
      experienceScore * SCORING_WEIGHTS.EXPERIENCE +
      categoryScore * SCORING_WEIGHTS.CATEGORY +
      freshnessScore * SCORING_WEIGHTS.FRESHNESS +
      priorityScore * SCORING_WEIGHTS.PRIORITY
    );
    
    // Generate match reason
    const matchReason = generateMatchReason(
      skillResult.score,
      experienceScore,
      categoryScore,
      skillResult.matchingSkills
    );
    
    return {
      ...job,
      matchScore: Math.min(Math.max(totalScore, 0), 100),  // Clamp 0-100
      matchingSkills: skillResult.matchingSkills,
      matchReason: matchReason
    };
  });
  
  // Sort by match score (highest first)
  scoredJobs.sort((a, b) => b.matchScore - a.matchScore);
  
  // Filter: Only return jobs with 50% or higher match score
  const highQualityMatches = scoredJobs.filter(job => job.matchScore >= 50);
  
  // If we have good matches, return only those; otherwise return top 10 regardless
  return highQualityMatches.length > 0 ? highQualityMatches : scoredJobs.slice(0, 10);
}

/**
 * Get match quality category for display purposes
 */
export function getMatchQuality(matchScore) {
  if (matchScore >= 80) return 'Excellent';
  if (matchScore >= 60) return 'Strong';
  if (matchScore >= 40) return 'Good';
  if (matchScore >= 20) return 'Fair';
  return 'Limited';
}

/**
 * Configuration for future customization
 */
export const MATCHER_CONFIG = {
  weights: SCORING_WEIGHTS,
  categoryKeywords: categoryKeywords
};

