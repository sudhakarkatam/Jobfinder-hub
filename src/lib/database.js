import { supabase } from './supabase.js'

// Debug database connection
console.log('🔗 Database connection status:', {
  url: supabase.supabaseUrl,
  hasKey: !!supabase.supabaseKey,
  isConfigured: supabase.supabaseUrl !== 'your_supabase_project_url'
});

// Cache for frequently accessed data
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Helper function to check cache
const getCachedData = (key) => {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

// Helper function to set cache
const setCachedData = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() })
}

// Helper function for error handling
const handleError = (error, context) => {
  console.error(`❌ Database error in ${context}:`, error)
  console.error(`🔍 Error details:`, {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint
  })
  return { data: null, error: error.message || 'An error occurred' }
}

// Jobs table operations
export const jobsApi = {
  // Get all jobs with optional filters and caching
  async getJobs(filters = {}) {
    const cacheKey = `jobs_${JSON.stringify(filters)}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    try {
      console.log('🔍 Fetching jobs with filters:', filters);
      
      let query = supabase
        .from('jobs')
        .select(`
          *,
          companies(name, logo, website, industry)
        `)
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }
      if (filters.employment_type) {
        query = query.eq('employment_type', filters.employment_type)
      }
      if (filters.featured) {
        query = query.eq('featured', true)
      }
      if (filters.company_id) {
        query = query.eq('company_id', filters.company_id)
      }
      if (filters.salary_min) {
        query = query.gte('salary_min', filters.salary_min)
      }
      if (filters.salary_max) {
        query = query.lte('salary_max', filters.salary_max)
      }
      if (filters.tag) {
        // Filter jobs that contain the tag (case-insensitive array search)
        // Convert tag slug back to possible tag formats for searching
        const tagVariants = [
          filters.tag,
          filters.tag.replace(/-/g, ' '),
          filters.tag.replace(/-/g, ' ').split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')
        ]
        // Use overlaps operator to check if any variant exists in the tags array
        query = query.overlaps('tags', tagVariants)
      }
      if (filters.batch) {
        // Filter jobs by batch year
        query = query.contains('batch', [filters.batch.toString()])
      }
      if (filters.categories && Array.isArray(filters.categories) && filters.categories.length > 0) {
        // Filter jobs by multiple categories
        query = query.in('category', filters.categories)
      }

      const { data, error } = await query
      
      if (error) {
        console.error('❌ Jobs query error:', error);
        throw error;
      }
      
      console.log(`✅ Fetched ${data?.length || 0} jobs successfully`);
      
      const result = { data, error: null }
      setCachedData(cacheKey, result)
      return result
    } catch (error) {
      return handleError(error, 'getJobs')
    }
  },

  // Get a single job by ID or url_slug with enhanced data
  async getJob(identifier) {
    const cacheKey = `job_${identifier}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    try {
      // Check if identifier is a UUID (ID) or a url_slug
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier)
      
      let query = supabase
        .from('jobs')
        .select(`
          *,
          companies(name, logo, website, description, industry, size)
        `)
      
      // Use ID or url_slug based on identifier format
      if (isUUID) {
        query = query.eq('id', identifier)
      } else {
        query = query.eq('url_slug', identifier)
      }
      
      const { data, error } = await query.single()
      
      if (error) throw error
      
      const result = { data, error: null }
      setCachedData(cacheKey, result)
      return result
    } catch (error) {
      return handleError(error, 'getJob')
    }
  },

  // Create a new job
  async createJob(jobData) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert(jobData)
        .select()
        .single()
      
      if (error) throw error
      
      // Clear jobs cache
      cache.forEach((value, key) => {
        if (key.startsWith('jobs_')) cache.delete(key)
      })
      
      return { data, error: null }
    } catch (error) {
      return handleError(error, 'createJob')
    }
  },

  // Update a job
  async updateJob(id, updates) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      
      // Clear related caches
      cache.delete(`job_${id}`)
      cache.forEach((value, key) => {
        if (key.startsWith('jobs_')) cache.delete(key)
      })
      
      return { data, error: null }
    } catch (error) {
      return handleError(error, 'updateJob')
    }
  },

  // Delete a job
  async deleteJob(id) {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      // Clear related caches
      cache.delete(`job_${id}`)
      cache.forEach((value, key) => {
        if (key.startsWith('jobs_')) cache.delete(key)
      })
      
      return { error: null }
    } catch (error) {
      return handleError(error, 'deleteJob')
    }
  },

  // Get featured jobs
  async getFeaturedJobs(limit = 6) {
    const cacheKey = `featured_jobs_${limit}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          companies(name, logo, website)
        `)
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      
      const result = { data, error: null }
      setCachedData(cacheKey, result)
      return result
    } catch (error) {
      return handleError(error, 'getFeaturedJobs')
    }
  },

  // Search jobs with full-text search
  async searchJobs(searchTerm, filters = {}) {
    try {
      let query = supabase
        .from('jobs')
        .select(`
          *,
          companies(name, logo, website)
        `)
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })

      // Apply additional filters
      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      if (filters.employment_type) {
        query = query.eq('employment_type', filters.employment_type)
      }

      const { data, error } = await query
      
      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      return handleError(error, 'searchJobs')
    }
  }
}

// Companies table operations
export const companiesApi = {
  async getCompanies() {
    const cacheKey = 'companies'
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name')
      
      if (error) throw error
      
      const result = { data, error: null }
      setCachedData(cacheKey, result)
      return result
    } catch (error) {
      return handleError(error, 'getCompanies')
    }
  },

  async getCompany(id) {
    const cacheKey = `company_${id}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    try {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          jobs(count)
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      
      const result = { data, error: null }
      setCachedData(cacheKey, result)
      return result
    } catch (error) {
      return handleError(error, 'getCompany')
    }
  }
}

// Users table operations
export const usersApi = {
  async getUser(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      return handleError(error, 'getUser')
    }
  },

  async updateUser(id, updates) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      return handleError(error, 'updateUser')
    }
  }
}

// Applications table operations with enhanced functionality
export const applicationsApi = {
  // Get all applications with enhanced data
  async getApplications(filters = {}) {
    const cacheKey = `applications_${JSON.stringify(filters)}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    try {
      let query = supabase
        .from('applications')
        .select(`
          *,
          jobs(title, company_id, employment_type),
          users(name, email, avatar_url),
          companies(name, logo)
        `)
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.job_id) {
        query = query.eq('job_id', filters.job_id)
      }
      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id)
      }
      if (filters.date_from) {
        query = query.gte('applied_at', filters.date_from)
      }
      if (filters.date_to) {
        query = query.lte('applied_at', filters.date_to)
      }

      const { data, error } = await query
      
      if (error) throw error
      
      const result = { data, error: null }
      setCachedData(cacheKey, result)
      return result
    } catch (error) {
      return handleError(error, 'getApplications')
    }
  },

  // Get applications for a specific job
  async getJobApplications(jobId) {
    const cacheKey = `job_applications_${jobId}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          users(name, email, avatar_url, phone),
          jobs(title, company_id)
        `)
        .eq('job_id', jobId)
        .order('applied_at', { ascending: false })
      
      if (error) throw error
      
      const result = { data, error: null }
      setCachedData(cacheKey, result)
      return result
    } catch (error) {
      return handleError(error, 'getJobApplications')
    }
  },

  // Get user's applications
  async getUserApplications(userId) {
    const cacheKey = `user_applications_${userId}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          jobs(title, company_id, location, employment_type),
          companies(name, logo)
        `)
        .eq('user_id', userId)
        .order('applied_at', { ascending: false })
      
      if (error) throw error
      
      const result = { data, error: null }
      setCachedData(cacheKey, result)
      return result
    } catch (error) {
      return handleError(error, 'getUserApplications')
    }
  },

  async createApplication(applicationData) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .insert(applicationData)
        .select()
        .single()
      
      if (error) throw error
      
      // Clear applications cache
      cache.forEach((value, key) => {
        if (key.startsWith('applications_') || key.startsWith('job_applications_') || key.startsWith('user_applications_')) {
          cache.delete(key)
        }
      })
      
      return { data, error: null }
    } catch (error) {
      return handleError(error, 'createApplication')
    }
  },

  async updateApplication(id, updates) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      
      // Clear applications cache
      cache.forEach((value, key) => {
        if (key.startsWith('applications_') || key.startsWith('job_applications_') || key.startsWith('user_applications_')) {
          cache.delete(key)
        }
      })
      
      return { data, error: null }
    } catch (error) {
      return handleError(error, 'updateApplication')
    }
  },

  async deleteApplication(id) {
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      // Clear applications cache
      cache.forEach((value, key) => {
        if (key.startsWith('applications_') || key.startsWith('job_applications_') || key.startsWith('user_applications_')) {
          cache.delete(key)
        }
      })
      
      return { error: null }
    } catch (error) {
      return handleError(error, 'deleteApplication')
    }
  },

  // Get application statistics
  async getApplicationStats() {
    const cacheKey = 'application_stats'
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    try {
      const { data, error } = await supabase
        .from('applications')
        .select('status')
      
      if (error) throw error
      
      const stats = {
        total: data.length,
        pending: data.filter(app => app.status === 'pending').length,
        reviewed: data.filter(app => app.status === 'reviewed').length,
        accepted: data.filter(app => app.status === 'accepted').length,
        rejected: data.filter(app => app.status === 'rejected').length
      }
      
      const result = { data: stats, error: null }
      setCachedData(cacheKey, result)
      return result
    } catch (error) {
      return handleError(error, 'getApplicationStats')
    }
  }
}

// Categories table operations
export const categoriesApi = {
  async getCategories() {
    const cacheKey = 'categories_with_counts'
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    try {
      // Define all available categories
      const allCategories = [
        'Technology',
        'Development',
        'Design',
        'Data Science',
        'Marketing',
        'Sales',
        'Finance',
        'Product',
        'Healthcare',
        'Banking Jobs',
        'Government Jobs'
      ]

      // Get all jobs to count by category
      const { data: jobs, error } = await supabase
        .from('jobs')
        .select('category')
      
      if (error) throw error

      // Count jobs per category
      const categoryCounts = {}
      allCategories.forEach(cat => {
        categoryCounts[cat] = 0
      })

      jobs.forEach(job => {
        if (job.category && categoryCounts.hasOwnProperty(job.category)) {
          categoryCounts[job.category]++
        }
      })

      // Create category objects with counts
      const categoriesWithCounts = allCategories.map((name, index) => ({
        id: index + 1,
        name: name,
        job_count: categoryCounts[name] || 0
      }))
      
      const result = { data: categoriesWithCounts, error: null }
      setCachedData(cacheKey, result)
      return result
    } catch (error) {
      return handleError(error, 'getCategories')
    }
  }
}

// App Settings operations
export const appSettingsApi = {
  // Get a specific setting by key
  async getSetting(settingKey) {
    const cacheKey = `setting_${settingKey}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .eq('setting_key', settingKey)
        .single()
      
      if (error) throw error
      
      const result = { data, error: null }
      setCachedData(cacheKey, result)
      return result
    } catch (error) {
      return handleError(error, 'getSetting')
    }
  },

  // Get all settings
  async getAllSettings() {
    const cacheKey = 'app_settings_all'
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .order('setting_key')
      
      if (error) throw error
      
      const result = { data, error: null }
      setCachedData(cacheKey, result)
      return result
    } catch (error) {
      return handleError(error, 'getAllSettings')
    }
  },

  // Update a setting
  async updateSetting(settingKey, settingValue) {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .update({ setting_value: settingValue })
        .eq('setting_key', settingKey)
        .select()
        .single()
      
      if (error) throw error
      
      // Clear cache for this setting
      cache.delete(`setting_${settingKey}`)
      cache.delete('app_settings_all')
      
      return { data, error: null }
    } catch (error) {
      return handleError(error, 'updateSetting')
    }
  },

  // Create a new setting (insert or update)
  async upsertSetting(settingKey, settingValue, description = '') {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .upsert({ 
          setting_key: settingKey, 
          setting_value: settingValue,
          description: description
        })
        .select()
        .single()
      
      if (error) throw error
      
      // Clear cache
      cache.delete(`setting_${settingKey}`)
      cache.delete('app_settings_all')
      
      return { data, error: null }
    } catch (error) {
      return handleError(error, 'upsertSetting')
    }
  }
}

// Blog Posts API
export const blogsApi = {
  // Get all blog posts with optional filters
  async getPosts(filters = {}) {
    const cacheKey = `blog_posts_${JSON.stringify(filters)}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    try {
      console.log('🔍 Fetching blog posts with filters:', filters);
      
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false })

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      if (filters.status) {
        query = query.eq('status', filters.status)
      } else {
        // By default, only show published posts for public
        query = query.eq('status', 'published')
      }
      if (filters.tag) {
        query = query.contains('tags', [filters.tag])
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`)
      }
      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query
      
      if (error) {
        console.error('❌ Blog posts query error:', error);
        throw error;
      }
      
      console.log(`✅ Fetched ${data?.length || 0} blog posts successfully`);
      
      const result = { data, error: null }
      setCachedData(cacheKey, result)
      return result
    } catch (error) {
      return handleError(error, 'getPosts')
    }
  },

  // Get a single blog post by slug
  async getPost(slug) {
    const cacheKey = `blog_post_${slug}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    try {
      console.log(`🔍 Fetching blog post: ${slug}`);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (error) {
        console.error('❌ Blog post query error:', error);
        throw error;
      }
      
      // Increment view count
      if (data) {
        await supabase
          .from('blog_posts')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', data.id)
      }
      
      console.log('✅ Blog post fetched successfully');
      
      const result = { data, error: null }
      setCachedData(cacheKey, result)
      return result
    } catch (error) {
      return handleError(error, 'getPost')
    }
  },

  // Create a new blog post (admin only)
  async createPost(postData) {
    try {
      console.log('🔍 Creating blog post:', postData.title);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([postData])
        .select()
        .single()
      
      if (error) {
        console.error('❌ Create post error:', error);
        throw error;
      }
      
      // Clear cache
      clearBlogCache()
      
      console.log('✅ Blog post created successfully');
      return { data, error: null }
    } catch (error) {
      return handleError(error, 'createPost')
    }
  },

  // Update an existing blog post (admin only)
  async updatePost(id, postData) {
    try {
      console.log('🔍 Updating blog post:', id);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('❌ Update post error:', error);
        throw error;
      }
      
      // Clear cache
      clearBlogCache()
      
      console.log('✅ Blog post updated successfully');
      return { data, error: null }
    } catch (error) {
      return handleError(error, 'updatePost')
    }
  },

  // Delete a blog post (admin only)
  async deletePost(id) {
    try {
      console.log('🔍 Deleting blog post:', id);
      
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('❌ Delete post error:', error);
        throw error;
      }
      
      // Clear cache
      clearBlogCache()
      
      console.log('✅ Blog post deleted successfully');
      return { data: null, error: null }
    } catch (error) {
      return handleError(error, 'deletePost')
    }
  },

  // Get all blog categories
  async getCategories() {
    const cacheKey = 'blog_categories'
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    try {
      console.log('🔍 Fetching blog categories');
      
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name')
      
      if (error) {
        console.error('❌ Blog categories query error:', error);
        throw error;
      }
      
      console.log(`✅ Fetched ${data?.length || 0} blog categories`);
      
      const result = { data, error: null }
      setCachedData(cacheKey, result)
      return result
    } catch (error) {
      return handleError(error, 'getBlogCategories')
    }
  }
}

// Clear blog cache
const clearBlogCache = () => {
  // Clear all blog-related cache entries
  for (const key of cache.keys()) {
    if (key.startsWith('blog_')) {
      cache.delete(key)
    }
  }
  console.log('🗑️ Blog cache cleared')
}

// Clear cache function
export const clearCache = () => {
  cache.clear()
  console.log('🗑️ Database cache cleared')
}

// Export cache for debugging
export const getCacheInfo = () => {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
    entries: Array.from(cache.entries()).map(([key, value]) => ({
      key,
      age: Date.now() - value.timestamp
    }))
  }
} 