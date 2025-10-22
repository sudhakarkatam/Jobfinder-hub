-- Migration: Change salary columns from integer to varchar to support text input
-- This allows admins to enter salary as text (e.g., "$80k-$120k", "Negotiable") or numbers

-- Step 1: Alter salary_min column to accept text
ALTER TABLE jobs 
ALTER COLUMN salary_min TYPE VARCHAR USING salary_min::VARCHAR;

-- Step 2: Alter salary_max column to accept text  
ALTER TABLE jobs 
ALTER COLUMN salary_max TYPE VARCHAR USING salary_max::VARCHAR;

-- Add comments for documentation
COMMENT ON COLUMN jobs.salary_min IS 'Minimum salary - can be number (e.g., 80000) or text (e.g., "$80k", "Negotiable"). Optional field.';
COMMENT ON COLUMN jobs.salary_max IS 'Maximum salary - can be number (e.g., 120000) or text (e.g., "$120k"). Optional field.';

-- Note: Existing numeric values will be automatically converted to text
-- Example: 80000 becomes '80000', 120000 becomes '120000'

