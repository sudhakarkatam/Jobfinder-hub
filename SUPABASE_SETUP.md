# Supabase Setup Guide for JobBoard Pro

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Note down your project URL and anon key

## 2. Update Configuration

Update `src/config/supabase.js` with your actual credentials:

```javascript
export const SUPABASE_CONFIG = {
  url: 'https://your-project-id.supabase.co',
  anonKey: 'your-actual-anon-key'
}
```

## 3. Database Schema

Run these SQL commands in your Supabase SQL editor:

### Jobs Table
```sql
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Companies Table
```sql
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
```

### Users Table
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  avatar VARCHAR,
  role VARCHAR DEFAULT 'user' CHECK (role IN ('user', 'admin', 'employer')),
  company_id UUID REFERENCES companies(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Applications Table
```sql
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  cover_letter TEXT,
  resume_url VARCHAR,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Categories Table
```sql
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR,
  job_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 4. Row Level Security (RLS)

Enable RLS and create policies:

```sql
-- Enable RLS on all tables
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Jobs: Anyone can read, only authenticated users can create/update
CREATE POLICY "Jobs are viewable by everyone" ON jobs FOR SELECT USING (true);
CREATE POLICY "Jobs can be created by authenticated users" ON jobs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Jobs can be updated by owners" ON jobs FOR UPDATE USING (auth.uid() = created_by);

-- Companies: Anyone can read, only authenticated users can create/update
CREATE POLICY "Companies are viewable by everyone" ON companies FOR SELECT USING (true);
CREATE POLICY "Companies can be created by authenticated users" ON companies FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Applications: Users can only see their own applications, admins can see all
CREATE POLICY "Users can view their own applications" ON applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create applications" ON applications FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 5. Sample Data

Insert some sample data:

```sql
-- Insert sample companies
INSERT INTO companies (name, logo, website, description, industry) VALUES
('TechCorp Inc', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center', 'https://techcorp.com', 'Leading technology company', 'Technology'),
('StartupXYZ', 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=200&h=200&fit=crop&crop=center', 'https://startupxyz.com', 'Innovative startup', 'Technology'),
('DesignStudio Pro', 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200&h=200&fit=crop&crop=center', 'https://designstudio.com', 'Creative design agency', 'Design');

-- Insert sample jobs
INSERT INTO jobs (title, description, company_id, location, employment_type, experience_level, category, salary_min, salary_max, featured) VALUES
('Senior React Developer', 'We are looking for an experienced React developer...', (SELECT id FROM companies WHERE name = 'TechCorp Inc'), 'San Francisco, CA', 'Full-time', 'Senior Level', 'Development', 120000, 150000, true),
('UX Designer', 'Join our design team to create amazing user experiences...', (SELECT id FROM companies WHERE name = 'DesignStudio Pro'), 'New York, NY', 'Full-time', 'Mid Level', 'Design', 80000, 100000, true),
('Backend Engineer', 'Build scalable backend systems and APIs...', (SELECT id FROM companies WHERE name = 'StartupXYZ'), 'Remote', 'Full-time', 'Mid Level', 'Development', 90000, 120000, true);
```

## 6. Environment Variables (Optional)

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

## 7. Testing the Connection

You can test the connection by importing and using the database functions:

```javascript
import { jobsApi } from './src/lib/database.js'

// Test fetching jobs
const { data, error } = await jobsApi.getJobs()
console.log('Jobs:', data)
```

## 8. Next Steps

1. Replace mock data in components with real API calls
2. Implement authentication with Supabase Auth
3. Add real-time features with Supabase subscriptions
4. Set up file uploads for resumes and company logos 