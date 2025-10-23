-- =====================================================
-- JobBoard Pro - Complete Supabase Database Setup
-- =====================================================

-- 1. CREATE TABLES
-- =====================================================

-- Companies Table
CREATE TABLE companies (
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

-- Users Table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  avatar VARCHAR,
  role VARCHAR DEFAULT 'user' CHECK (role IN ('user', 'admin', 'employer')),
  company_id UUID REFERENCES companies(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs Table (with created_by column)
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  company_id UUID REFERENCES companies(id),
  location VARCHAR,
  employment_type VARCHAR CHECK (employment_type IN ('Full-time', 'Part-time', 'Contract', 'Internship')),
  experience_level VARCHAR CHECK (experience_level IN ('Entry Level', 'Mid Level', 'Senior Level', 'Executive')),
  category VARCHAR,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency VARCHAR DEFAULT 'USD',
  featured BOOLEAN DEFAULT false,
  urgent BOOLEAN DEFAULT false,
  status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
  batch TEXT[],
  tags TEXT[],
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications Table
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  cover_letter TEXT,
  resume_url VARCHAR,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories Table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR,
  job_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 3. CREATE SECURITY POLICIES
-- =====================================================

-- Jobs Policies
CREATE POLICY "Jobs are viewable by everyone" ON jobs FOR SELECT USING (true);
CREATE POLICY "Jobs can be created by authenticated users" ON jobs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Jobs can be updated by authenticated users" ON jobs FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Jobs can be deleted by authenticated users" ON jobs FOR DELETE USING (auth.role() = 'authenticated');

-- Companies Policies
CREATE POLICY "Companies are viewable by everyone" ON companies FOR SELECT USING (true);
CREATE POLICY "Companies can be created by authenticated users" ON companies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Companies can be updated by authenticated users" ON companies FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Companies can be deleted by authenticated users" ON companies FOR DELETE USING (auth.role() = 'authenticated');

-- Applications Policies
CREATE POLICY "Applications are viewable by everyone" ON applications FOR SELECT USING (true);
CREATE POLICY "Applications can be created by authenticated users" ON applications FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Applications can be updated by authenticated users" ON applications FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Applications can be deleted by authenticated users" ON applications FOR DELETE USING (auth.role() = 'authenticated');

-- Users Policies
CREATE POLICY "Users are viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Users can be created by authenticated users" ON users FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can be updated by authenticated users" ON users FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can be deleted by authenticated users" ON users FOR DELETE USING (auth.role() = 'authenticated');

-- Categories Policies
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Categories can be created by authenticated users" ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Categories can be updated by authenticated users" ON categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Categories can be deleted by authenticated users" ON categories FOR DELETE USING (auth.role() = 'authenticated');

-- 4. INSERT SAMPLE DATA
-- =====================================================

-- Sample Companies
INSERT INTO companies (name, logo, website, description, industry, size) VALUES
('TechCorp Inc', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center', 'https://techcorp.com', 'Leading technology company specializing in innovative software solutions', 'Technology', 'Large'),
('StartupXYZ', 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=200&h=200&fit=crop&crop=center', 'https://startupxyz.com', 'Innovative startup disrupting the fintech industry', 'Technology', 'Startup'),
('DesignStudio Pro', 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200&h=200&fit=crop&crop=center', 'https://designstudio.com', 'Creative design agency focused on user experience', 'Design', 'Medium'),
('DataCorp', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop&crop=center', 'https://datacorp.com', 'Data analytics and machine learning solutions', 'Technology', 'Medium'),
('MarketingHub', 'https://images.unsplash.com/photo-1560472355-536de3962603?w=200&h=200&fit=crop&crop=center', 'https://marketinghub.com', 'Digital marketing and growth hacking agency', 'Marketing', 'Small'),
('FinanceFlow', 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=200&fit=crop&crop=center', 'https://financeflow.com', 'Financial technology and investment platform', 'Finance', 'Large');

-- Sample Users
INSERT INTO users (email, name, role) VALUES
('admin@jobboard.pro', 'Admin User', 'admin'),
('john.doe@example.com', 'John Doe', 'user'),
('sarah.johnson@example.com', 'Sarah Johnson', 'user'),
('mike.wilson@example.com', 'Mike Wilson', 'employer');

-- Sample Categories
INSERT INTO categories (name, description, icon, job_count) VALUES
('Development', 'Software development and programming roles', '💻', 4),
('Design', 'UI/UX design and creative roles', '🎨', 1),
('Data Science', 'Data analysis and machine learning roles', '📊', 1),
('Marketing', 'Digital marketing and growth roles', '📈', 1),
('Product', 'Product management and strategy roles', '📋', 1),
('Finance', 'Financial analysis and accounting roles', '💰', 1);

-- Sample Jobs
INSERT INTO jobs (title, description, company_id, location, employment_type, experience_level, category, salary_min, salary_max, featured, urgent, created_by) VALUES
('Senior React Developer', 'We are looking for an experienced React developer to join our frontend team. You will be responsible for building scalable web applications and mentoring junior developers.', (SELECT id FROM companies WHERE name = 'TechCorp Inc'), 'San Francisco, CA', 'Full-time', 'Senior Level', 'Development', 120000, 150000, true, true, (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('UX Designer', 'Join our design team to create amazing user experiences. You will work closely with product managers and developers to design intuitive interfaces.', (SELECT id FROM companies WHERE name = 'DesignStudio Pro'), 'New York, NY', 'Full-time', 'Mid Level', 'Design', 80000, 100000, true, false, (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('Backend Engineer', 'Build scalable backend systems and APIs using Node.js and Python. Experience with PostgreSQL and Docker required.', (SELECT id FROM companies WHERE name = 'StartupXYZ'), 'Remote', 'Full-time', 'Mid Level', 'Development', 90000, 120000, true, true, (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('Data Scientist', 'Analyze complex data sets and build machine learning models. Experience with Python, R, and statistical analysis required.', (SELECT id FROM companies WHERE name = 'DataCorp'), 'Austin, TX', 'Full-time', 'Senior Level', 'Data Science', 110000, 140000, true, false, (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('Marketing Manager', 'Lead digital marketing campaigns and growth strategies. Experience with Google Ads, Facebook Ads, and analytics tools required.', (SELECT id FROM companies WHERE name = 'MarketingHub'), 'Los Angeles, CA', 'Full-time', 'Mid Level', 'Marketing', 75000, 95000, true, true, (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('Mobile Developer', 'Develop native iOS and Android applications. Experience with React Native, Swift, and Kotlin preferred.', (SELECT id FROM companies WHERE name = 'StartupXYZ'), 'Remote', 'Contract', 'Mid Level', 'Development', 80000, 110000, false, false, (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('Product Manager', 'Lead product strategy and development. Work with cross-functional teams to deliver exceptional user experiences.', (SELECT id FROM companies WHERE name = 'TechCorp Inc'), 'San Francisco, CA', 'Full-time', 'Senior Level', 'Product', 130000, 160000, true, false, (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('Financial Analyst', 'Analyze financial data and create reports for stakeholders. Experience with Excel, SQL, and financial modeling required.', (SELECT id FROM companies WHERE name = 'FinanceFlow'), 'Chicago, IL', 'Full-time', 'Entry Level', 'Finance', 60000, 80000, false, true, (SELECT id FROM users WHERE role = 'admin' LIMIT 1));

-- 5. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_featured ON jobs(featured);
CREATE INDEX idx_jobs_created_by ON jobs(created_by);
CREATE INDEX idx_jobs_batch ON jobs USING GIN (batch);
CREATE INDEX idx_jobs_tags ON jobs USING GIN (tags);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_companies_name ON companies(name);

-- 6. UPDATE JOB COUNTS IN CATEGORIES
-- =====================================================

UPDATE categories SET job_count = (
  SELECT COUNT(*) FROM jobs WHERE jobs.category = categories.name
);

-- 7. VERIFICATION QUERIES
-- =====================================================

-- Check if all tables were created successfully
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Check sample data
SELECT 'Companies' as table_name, COUNT(*) as count FROM companies
UNION ALL
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Jobs' as table_name, COUNT(*) as count FROM jobs
UNION ALL
SELECT 'Categories' as table_name, COUNT(*) as count FROM categories;

-- Check jobs with company information
SELECT j.title, c.name as company_name, j.location, j.employment_type, j.salary_min, j.salary_max
FROM jobs j
JOIN companies c ON j.company_id = c.id
LIMIT 5; 