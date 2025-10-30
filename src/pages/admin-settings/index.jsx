import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AdminNavigation from '../../components/ui/AdminNavigation';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { appSettingsApi } from '../../lib/database';

const AdminSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await appSettingsApi.getAllSettings();
      
      if (error) throw error;
      
      // Convert array to object for easier handling
      const settingsObj = {};
      if (data) {
        data.forEach(setting => {
          settingsObj[setting.setting_key] = setting.setting_value;
        });
      }
      
      setSettings(settingsObj);
    } catch (error) {
      console.error('Error loading settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSetting = async (settingKey, currentValue) => {
    try {
      setUpdating(true);
      setMessage(null);
      
      const newValue = currentValue === 'true' || currentValue === true ? 'false' : 'true';
      
      const { data, error } = await appSettingsApi.updateSetting(settingKey, newValue);
      
      if (error) throw error;
      
      // Update local state
      setSettings(prev => ({
        ...prev,
        [settingKey]: newValue
      }));
      
      setMessage({ type: 'success', text: 'Setting updated successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error updating setting:', error);
      setMessage({ type: 'error', text: 'Failed to update setting' });
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateSetting = async (settingKey, settingValue) => {
    try {
      setUpdating(true);
      setMessage(null);
      
      const { data, error } = await appSettingsApi.upsertSetting(settingKey, settingValue, 'Feature toggle');
      
      if (error) throw error;
      
      setSettings(prev => ({
        ...prev,
        [settingKey]: settingValue
      }));
      
      setMessage({ type: 'success', text: 'Setting created successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error creating setting:', error);
      // If setting doesn't exist, create it locally
      setSettings(prev => ({
        ...prev,
        [settingKey]: settingValue
      }));
    } finally {
      setUpdating(false);
    }
  };

  const initializeSetting = async (settingKey, defaultValue) => {
    if (!settings[settingKey]) {
      await handleCreateSetting(settingKey, defaultValue);
    }
  };

  const isEnabled = (key) => settings[key] === 'true' || settings[key] === true;

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Settings | Admin | JobFinder Hub</title>
        </Helmet>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
          <AdminNavigation />
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <Icon name="Loader2" size={48} className="animate-spin mx-auto text-primary mb-4" />
              <p className="text-text-secondary">Loading settings...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Settings | Admin | JobFinder Hub</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <AdminNavigation />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
            <p className="text-text-secondary mt-2">
              Manage platform features and configuration
            </p>
          </div>

          {/* Success/Error Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <div className="flex items-center space-x-2">
                <Icon 
                  name={message.type === 'success' ? 'CheckCircle' : 'AlertCircle'} 
                  size={20} 
                />
                <span>{message.text}</span>
              </div>
            </div>
          )}

          {/* Feature Toggles */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Feature Toggles
            </h2>

            {/* AI Resume Builder Toggle */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon name="Sparkles" size={24} className="text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">
                      AI Resume Builder
                    </h3>
                  </div>
                  <p className="text-text-secondary ml-9">
                    Enable or disable the AI-powered resume builder and job matching feature. 
                    When disabled, users will see a "Coming Soon" page.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (settings.resume_builder_enabled !== undefined) {
                      handleToggleSetting('resume_builder_enabled', settings.resume_builder_enabled);
                    } else {
                      initializeSetting('resume_builder_enabled', 'true');
                    }
                  }}
                  disabled={updating}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ml-6 ${
                    isEnabled('resume_builder_enabled') ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      isEnabled('resume_builder_enabled') ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="mt-4 ml-9">
                <div className="flex items-center space-x-2 text-sm">
                  <span className={`px-3 py-1 rounded-full font-medium ${
                    isEnabled('resume_builder_enabled')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {isEnabled('resume_builder_enabled') ? '✓ Enabled' : '✗ Disabled'}
                  </span>
                </div>
              </div>
            </div>

            {/* Maintenance Mode Toggle */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon name="Wrench" size={24} className="text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Maintenance Mode
                    </h3>
                  </div>
                  <p className="text-text-secondary ml-9">
                    Put the entire site in maintenance mode. Users will see a maintenance message.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (settings.maintenance_mode !== undefined) {
                      handleToggleSetting('maintenance_mode', settings.maintenance_mode);
                    } else {
                      initializeSetting('maintenance_mode', 'false');
                    }
                  }}
                  disabled={updating}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ml-6 ${
                    isEnabled('maintenance_mode') ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      isEnabled('maintenance_mode') ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="mt-4 ml-9">
                <div className="flex items-center space-x-2 text-sm">
                  <span className={`px-3 py-1 rounded-full font-medium ${
                    isEnabled('maintenance_mode')
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {isEnabled('maintenance_mode') ? '⚠ Active' : '✓ Normal'}
                  </span>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <div className="flex items-start space-x-3">
                <Icon name="Info" size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <strong>Note:</strong> Changes to settings take effect immediately. Users will see 
                  the "Coming Soon" page if AI Resume Builder is disabled.
                </div>
              </div>
            </div>
          </div>

          {/* Additional Settings Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Additional Settings
            </h2>
            <p className="text-text-secondary">
              More configuration options coming soon...
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSettings;

