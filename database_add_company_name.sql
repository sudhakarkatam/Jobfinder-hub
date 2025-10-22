-- =====================================================
-- Add company_name Column to Jobs Table
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Add company_name column to jobs table
-- This allows jobs to have a simple text company name
-- alongside the existing company_id relationship
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_name VARCHAR;

-- 2. Backfill existing jobs with company names from the companies table
-- This ensures existing jobs have company_name populated
UPDATE jobs 
SET company_name = companies.name
FROM companies
WHERE jobs.company_id = companies.id
  AND jobs.company_name IS NULL;

-- 3. Create index for performance on company_name searches
CREATE INDEX IF NOT EXISTS idx_jobs_company_name ON jobs(company_name);

-- 4. Verification query
-- Check that company_name is populated correctly
SELECT 
  id,
  title,
  company_name,
  company_id,
  location,
  status
FROM jobs
ORDER BY created_at DESC
LIMIT 10;

-- 5. Count jobs with company_name
SELECT 
  COUNT(*) as total_jobs,
  COUNT(company_name) as jobs_with_company_name,
  COUNT(company_id) as jobs_with_company_id
FROM jobs;

