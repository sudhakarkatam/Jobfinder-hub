-- Migration: Create app_settings table for application configuration
-- Used for Resume Builder toggle and other feature flags

-- Step 1: Create app_settings table
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR UNIQUE NOT NULL,
  setting_value BOOLEAN DEFAULT FALSE,
  description VARCHAR,
  updated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Step 2: Add index on setting_key for fast lookups
CREATE INDEX IF NOT EXISTS idx_app_settings_key ON app_settings(setting_key);

-- Step 3: Insert default settings
INSERT INTO app_settings (setting_key, setting_value, description) 
VALUES 
  ('resume_builder_enabled', FALSE, 'Enable/disable AI Resume Builder feature for users'),
  ('job_alerts_enabled', TRUE, 'Enable/disable job alerts feature'),
  ('company_reviews_enabled', FALSE, 'Enable/disable company reviews feature')
ON CONFLICT (setting_key) DO NOTHING;

-- Step 4: Create function to update timestamp
CREATE OR REPLACE FUNCTION update_app_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Create trigger
DROP TRIGGER IF EXISTS app_settings_updated_at ON app_settings;
CREATE TRIGGER app_settings_updated_at
  BEFORE UPDATE ON app_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_app_settings_timestamp();

-- Comments
COMMENT ON TABLE app_settings IS 'Application-wide settings and feature flags';
COMMENT ON COLUMN app_settings.setting_key IS 'Unique identifier for the setting';
COMMENT ON COLUMN app_settings.setting_value IS 'Boolean value for the setting (TRUE/FALSE)';
COMMENT ON COLUMN app_settings.description IS 'Human-readable description of what this setting controls';

