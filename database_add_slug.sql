-- =====================================================
-- Add Slug Field to Jobs Table for SEO-friendly URLs
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Add slug column to jobs table
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS slug VARCHAR UNIQUE;

-- 2. Create function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
  slug TEXT;
BEGIN
  -- Convert to lowercase, replace spaces with hyphens, remove special characters
  slug := lower(regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'));
  slug := regexp_replace(slug, '\s+', '-', 'g');
  slug := regexp_replace(slug, '-+', '-', 'g');
  slug := trim(both '-' from slug);
  
  RETURN slug;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 3. Update existing jobs to have slugs
UPDATE jobs
SET slug = generate_slug(title) || '-' || substring(id::text, 1, 8)
WHERE slug IS NULL;

-- 4. Create trigger to auto-generate slug on insert/update
CREATE OR REPLACE FUNCTION set_job_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    -- Generate slug from title + first 8 chars of UUID for uniqueness
    NEW.slug := generate_slug(NEW.title) || '-' || substring(NEW.id::text, 1, 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS job_slug_trigger ON jobs;
CREATE TRIGGER job_slug_trigger
BEFORE INSERT OR UPDATE ON jobs
FOR EACH ROW
EXECUTE FUNCTION set_job_slug();

-- 5. Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_jobs_slug ON jobs(slug);

-- 6. Add comment
COMMENT ON COLUMN jobs.slug IS 'SEO-friendly URL slug generated from job title';

