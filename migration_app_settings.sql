-- =====================================================
-- Add App Settings Table for Feature Toggles
-- =====================================================

-- Create App Settings Table
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR UNIQUE NOT NULL,
  setting_value TEXT,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Create Security Policies
CREATE POLICY "Settings are viewable by everyone" 
  ON app_settings FOR SELECT USING (true);

CREATE POLICY "Settings can be created by authenticated users" 
  ON app_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Settings can be updated by authenticated users" 
  ON app_settings FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert Default Settings
INSERT INTO app_settings (setting_key, setting_value, description) VALUES
('resume_builder_enabled', 'true', 'Enable/disable AI Resume Builder feature'),
('maintenance_mode', 'false', 'Enable maintenance mode for the site')
ON CONFLICT (setting_key) DO NOTHING;

-- Create Index for Performance
CREATE INDEX IF NOT EXISTS idx_app_settings_key ON app_settings(setting_key);

