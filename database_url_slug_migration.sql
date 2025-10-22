-- Migration: Add url_slug column to jobs table for custom URLs
-- This allows admins to create SEO-friendly URLs like /job-detail-view/senior-engineer-techcorp

-- Step 1: Add url_slug column
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS url_slug VARCHAR;

-- Step 2: Create unique constraint
ALTER TABLE jobs 
ADD CONSTRAINT jobs_url_slug_unique UNIQUE (url_slug);

-- Step 3: Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_jobs_url_slug ON jobs(url_slug);

-- Step 4: Add comment for documentation
COMMENT ON COLUMN jobs.url_slug IS 'Custom URL slug for SEO-friendly job links (e.g., senior-software-engineer-techcorp). Must be unique.';

-- Note: Existing jobs will have NULL url_slug. 
-- Admin should update them or they can be auto-generated from title on first edit.

