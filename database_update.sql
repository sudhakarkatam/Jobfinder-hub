-- =====================================================
-- JobBoard Pro - Database Update Script
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. DROP EXISTING TABLES IF NEEDED (uncomment if you want to start fresh)
-- DROP TABLE IF EXISTS job_applications CASCADE;
-- DROP TABLE IF EXISTS jobs CASCADE;
-- DROP TABLE IF EXISTS companies CASCADE;
-- DROP TABLE IF EXISTS categories CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- 2. CREATE TABLES (if they don't exist)
-- =====================================================

-- Companies Table
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  logo VARCHAR,
  website VARCHAR,
  description TEXT,
  industry VARCHAR,
  size VARCHAR CHECK (size IN ('Startup', 'Small', 'Medium', 'Large')),
  founded_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR,
  job_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  location VARCHAR,
  employment_type VARCHAR CHECK (employment_type IN ('Full-time', 'Part-time', 'Contract', 'Internship')),
  experience_level VARCHAR CHECK (experience_level IN ('Entry Level', 'Mid Level', 'Senior Level', 'Executive')),
  category VARCHAR,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency VARCHAR DEFAULT 'USD',
  requirements TEXT,
  responsibilities TEXT,
  benefits TEXT,
  featured BOOLEAN DEFAULT false,
  urgent BOOLEAN DEFAULT false,
  status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job Applications Table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_name VARCHAR NOT NULL,
  applicant_email VARCHAR NOT NULL,
  applicant_phone VARCHAR,
  cover_letter TEXT,
  resume_url VARCHAR,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Table (for admin only)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  role VARCHAR DEFAULT 'admin' CHECK (role IN ('admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 4. DROP EXISTING POLICIES (to avoid conflicts)
-- =====================================================

DROP POLICY IF EXISTS "Jobs are viewable by everyone" ON jobs;
DROP POLICY IF EXISTS "Jobs can be created by authenticated users" ON jobs;
DROP POLICY IF EXISTS "Jobs can be updated by authenticated users" ON jobs;
DROP POLICY IF EXISTS "Jobs can be deleted by authenticated users" ON jobs;

DROP POLICY IF EXISTS "Companies are viewable by everyone" ON companies;
DROP POLICY IF EXISTS "Companies can be created by authenticated users" ON companies;
DROP POLICY IF EXISTS "Companies can be updated by authenticated users" ON companies;
DROP POLICY IF EXISTS "Companies can be deleted by authenticated users" ON companies;

DROP POLICY IF EXISTS "Applications are viewable by everyone" ON job_applications;
DROP POLICY IF EXISTS "Applications can be created by everyone" ON job_applications;
DROP POLICY IF EXISTS "Applications can be updated by authenticated users" ON job_applications;
DROP POLICY IF EXISTS "Applications can be deleted by authenticated users" ON job_applications;

DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Categories can be created by authenticated users" ON categories;
DROP POLICY IF EXISTS "Categories can be updated by authenticated users" ON categories;
DROP POLICY IF EXISTS "Categories can be deleted by authenticated users" ON categories;

-- 5. CREATE SECURITY POLICIES
-- =====================================================

-- Jobs Policies: Public read, Admin write
CREATE POLICY "Jobs are viewable by everyone" ON jobs FOR SELECT USING (true);
CREATE POLICY "Jobs can be created by authenticated users" ON jobs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Jobs can be updated by authenticated users" ON jobs FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Jobs can be deleted by authenticated users" ON jobs FOR DELETE USING (auth.role() = 'authenticated');

-- Companies Policies: Public read, Admin write
CREATE POLICY "Companies are viewable by everyone" ON companies FOR SELECT USING (true);
CREATE POLICY "Companies can be created by authenticated users" ON companies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Companies can be updated by authenticated users" ON companies FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Companies can be deleted by authenticated users" ON companies FOR DELETE USING (auth.role() = 'authenticated');

-- Job Applications Policies: Public create, Admin read/update
CREATE POLICY "Applications are viewable by authenticated users" ON job_applications FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Applications can be created by everyone" ON job_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Applications can be updated by authenticated users" ON job_applications FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Applications can be deleted by authenticated users" ON job_applications FOR DELETE USING (auth.role() = 'authenticated');

-- Categories Policies: Public read, Admin write
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Categories can be created by authenticated users" ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Categories can be updated by authenticated users" ON categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Categories can be deleted by authenticated users" ON categories FOR DELETE USING (auth.role() = 'authenticated');

-- 6. INSERT SAMPLE DATA
-- =====================================================

-- Insert sample companies
INSERT INTO companies (name, logo, website, description, industry, size) VALUES
('TechCorp Inc', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center', 'https://techcorp.com', 'Leading technology company specializing in innovative software solutions', 'Technology', 'Large'),
('StartupXYZ', 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=200&h=200&fit=crop&crop=center', 'https://startupxyz.com', 'Innovative startup disrupting the fintech industry', 'Technology', 'Startup'),
('DesignStudio Pro', 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200&h=200&fit=crop&crop=center', 'https://designstudio.com', 'Creative design agency focused on user experience', 'Design', 'Medium'),
('DataCorp', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop&crop=center', 'https://datacorp.com', 'Data analytics and machine learning solutions', 'Technology', 'Medium'),
('MarketingHub', 'https://images.unsplash.com/photo-1560472355-536de3962603?w=200&h=200&fit=crop&crop=center', 'https://marketinghub.com', 'Digital marketing and growth hacking agency', 'Marketing', 'Small'),
('FinanceFlow', 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=200&fit=crop&crop=center', 'https://financeflow.com', 'Financial technology and investment platform', 'Finance', 'Large')
ON CONFLICT DO NOTHING;

-- Insert sample categories
INSERT INTO categories (name, description, icon, job_count) VALUES
('Development', 'Software development and programming roles', '💻', 0),
('Design', 'UI/UX design and creative roles', '🎨', 0),
('Data Science', 'Data analysis and machine learning roles', '📊', 0),
('Marketing', 'Digital marketing and growth roles', '📈', 0),
('Product', 'Product management and strategy roles', '📋', 0),
('Finance', 'Financial analysis and accounting roles', '💰', 0)
ON CONFLICT (name) DO NOTHING;

-- Insert sample jobs
INSERT INTO jobs (title, description, company_id, location, employment_type, experience_level, category, salary_min, salary_max, featured, urgent, requirements, responsibilities, benefits) VALUES
(
  'Senior React Developer',
  'We are looking for an experienced React developer to join our frontend team. You will be responsible for building scalable web applications and mentoring junior developers.',
  (SELECT id FROM companies WHERE name = 'TechCorp Inc' LIMIT 1),
  'San Francisco, CA',
  'Full-time',
  'Senior Level',
  'Development',
  120000,
  150000,
  true,
  true,
  '- 5+ years of React experience
- Strong TypeScript skills
- Experience with state management (Redux, Zustand)
- Excellent problem-solving abilities
- Bachelor''s degree in Computer Science or related field',
  '- Build and maintain React applications
- Mentor junior developers
- Code reviews and technical guidance
- Collaborate with design and backend teams
- Optimize application performance',
  '- Competitive salary and equity
- Health, dental, and vision insurance
- 401(k) matching
- Flexible work schedule
- Remote work options
- Professional development budget'
),
(
  'UX Designer',
  'Join our design team to create amazing user experiences. You will work closely with product managers and developers to design intuitive interfaces.',
  (SELECT id FROM companies WHERE name = 'DesignStudio Pro' LIMIT 1),
  'New York, NY',
  'Full-time',
  'Mid Level',
  'Design',
  80000,
  100000,
  true,
  false,
  '- 3+ years of UX design experience
- Proficiency in Figma, Sketch, or Adobe XD
- Strong portfolio demonstrating user-centered design
- Understanding of accessibility standards
- Excellent communication skills',
  '- Create wireframes, prototypes, and mockups
- Conduct user research and usability testing
- Collaborate with product and engineering teams
- Maintain design systems and style guides
- Present design concepts to stakeholders',
  '- Competitive salary
- Creative and collaborative work environment
- Latest design tools and software
- Unlimited PTO
- Team building events'
),
(
  'Backend Engineer',
  'Build scalable backend systems and APIs using Node.js and Python. Experience with PostgreSQL and Docker required.',
  (SELECT id FROM companies WHERE name = 'StartupXYZ' LIMIT 1),
  'Remote',
  'Full-time',
  'Mid Level',
  'Development',
  90000,
  120000,
  true,
  true,
  '- 3+ years of backend development experience
- Strong knowledge of Node.js and Python
- Experience with PostgreSQL or other SQL databases
- Docker and containerization expertise
- RESTful API design experience',
  '- Design and implement scalable backend services
- Write clean, maintainable code
- Optimize database queries and performance
- Collaborate with frontend developers
- Participate in code reviews',
  '- Fully remote position
- Flexible working hours
- Stock options
- Health insurance
- Learning and development budget
- Home office setup allowance'
),
(
  'Data Scientist',
  'Analyze complex data sets and build machine learning models. Experience with Python, R, and statistical analysis required.',
  (SELECT id FROM companies WHERE name = 'DataCorp' LIMIT 1),
  'Austin, TX',
  'Full-time',
  'Senior Level',
  'Data Science',
  110000,
  140000,
  true,
  false,
  '- 5+ years of data science experience
- Strong Python and R programming skills
- Experience with machine learning frameworks
- Statistical analysis expertise
- SQL and data visualization skills',
  '- Develop and deploy machine learning models
- Analyze large datasets to extract insights
- Create data visualizations and reports
- Collaborate with business stakeholders
- Mentor junior data scientists',
  '- Competitive salary and bonuses
- Comprehensive health benefits
- 401(k) with company match
- Generous PTO
- Conference and training opportunities'
),
(
  'Marketing Manager',
  'Lead digital marketing campaigns and growth strategies. Experience with Google Ads, Facebook Ads, and analytics tools required.',
  (SELECT id FROM companies WHERE name = 'MarketingHub' LIMIT 1),
  'Los Angeles, CA',
  'Full-time',
  'Mid Level',
  'Marketing',
  75000,
  95000,
  true,
  true,
  '- 4+ years of digital marketing experience
- Google Ads and Facebook Ads certification
- Analytics tools proficiency (Google Analytics, etc.)
- Strong copywriting skills
- Data-driven decision making',
  '- Plan and execute digital marketing campaigns
- Manage advertising budgets
- Analyze campaign performance
- Lead a team of marketing specialists
- Develop growth strategies',
  '- Competitive salary with performance bonuses
- Health and wellness benefits
- Professional development
- Flexible work arrangements
- Team outings and events'
),
(
  'Mobile Developer',
  'Develop native iOS and Android applications. Experience with React Native, Swift, and Kotlin preferred.',
  (SELECT id FROM companies WHERE name = 'StartupXYZ' LIMIT 1),
  'Remote',
  'Contract',
  'Mid Level',
  'Development',
  80000,
  110000,
  false,
  false,
  '- 3+ years of mobile development experience
- React Native expertise
- iOS (Swift) and Android (Kotlin) knowledge
- Experience with mobile app deployment
- Understanding of mobile UX best practices',
  '- Develop and maintain mobile applications
- Implement new features and improvements
- Fix bugs and optimize performance
- Work with design team on UI implementation
- Collaborate with backend developers on API integration',
  '- Competitive contract rates
- Flexible schedule
- Remote work
- Potential for full-time conversion
- Collaborative team environment'
),
(
  'Product Manager',
  'Lead product strategy and development. Work with cross-functional teams to deliver exceptional user experiences.',
  (SELECT id FROM companies WHERE name = 'TechCorp Inc' LIMIT 1),
  'San Francisco, CA',
  'Full-time',
  'Senior Level',
  'Product',
  130000,
  160000,
  true,
  false,
  '- 5+ years of product management experience
- Strong analytical and problem-solving skills
- Experience with agile methodologies
- Excellent communication and leadership
- Technical background preferred',
  '- Define product vision and roadmap
- Prioritize features and requirements
- Work with engineering, design, and marketing
- Analyze user feedback and metrics
- Present to executives and stakeholders',
  '- Competitive salary and equity
- Comprehensive benefits package
- Unlimited PTO
- Professional growth opportunities
- Impact on company direction'
),
(
  'Financial Analyst',
  'Analyze financial data and create reports for stakeholders. Experience with Excel, SQL, and financial modeling required.',
  (SELECT id FROM companies WHERE name = 'FinanceFlow' LIMIT 1),
  'Chicago, IL',
  'Full-time',
  'Entry Level',
  'Finance',
  60000,
  80000,
  false,
  true,
  '- Bachelor''s degree in Finance, Accounting, or related field
- Strong Excel and financial modeling skills
- SQL knowledge preferred
- Analytical mindset
- Attention to detail',
  '- Prepare financial reports and analysis
- Build and maintain financial models
- Support budgeting and forecasting
- Analyze financial trends and variances
- Present findings to management',
  '- Competitive entry-level salary
- Health and dental insurance
- 401(k) plan
- Mentorship program
- Career advancement opportunities'
)
ON CONFLICT DO NOTHING;

-- 7. UPDATE JOB COUNTS IN CATEGORIES
-- =====================================================

UPDATE categories SET job_count = (
  SELECT COUNT(*) FROM jobs WHERE jobs.category = categories.name AND jobs.status = 'active'
);

-- 8. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_featured ON jobs(featured);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);

-- 9. VERIFICATION QUERIES
-- =====================================================

-- Check all data
SELECT 'Companies' as table_name, COUNT(*) as count FROM companies
UNION ALL
SELECT 'Jobs' as table_name, COUNT(*) as count FROM jobs
UNION ALL
SELECT 'Categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Job Applications' as table_name, COUNT(*) as count FROM job_applications;

-- Display sample jobs with company info
SELECT 
  j.title, 
  c.name as company_name, 
  j.location, 
  j.employment_type, 
  j.salary_min, 
  j.salary_max,
  j.featured
FROM jobs j
JOIN companies c ON j.company_id = c.id
ORDER BY j.created_at DESC;

