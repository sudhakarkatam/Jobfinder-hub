-- =====================================================
-- Add Apply Link Field to Jobs Table
-- Run this in Supabase SQL Editor
-- =====================================================

-- Add apply_link column to jobs table
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS apply_link VARCHAR;

-- Add comment
COMMENT ON COLUMN jobs.apply_link IS 'External application link (URL or mailto) for Apply Now button';

-- Update existing jobs to have null apply_link (optional)
-- No need to set default values, can be null

