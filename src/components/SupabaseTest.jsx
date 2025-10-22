import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { jobsApi } from '../lib/database';

const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('Testing...');
  const [jobsCount, setJobsCount] = useState(0);
  const [companiesCount, setCompaniesCount] = useState(0);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState({});
  const [tableInfo, setTableInfo] = useState({});

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Check configuration
      const config = {
        url: supabase.supabaseUrl,
        hasKey: !!supabase.supabaseKey,
        isConfigured: supabase.supabaseUrl !== 'your_supabase_project_url'
      };
      setConfig(config);

      if (!config.isConfigured) {
        setConnectionStatus('❌ Not Configured');
        setError('Supabase credentials not configured. Please set up your .env file.');
        return;
      }

      // Test basic connection
      const { data, error } = await supabase.from('jobs').select('count').limit(1);
      
      if (error) {
        setConnectionStatus('❌ Connection Failed');
        setError(error.message);
        return;
      }

      setConnectionStatus('✅ Connected');

      // Test individual tables
      const tableTests = {};
      
      // Test jobs table
      try {
        const { data: jobs, error: jobsError } = await supabase.from('jobs').select('*').limit(1);
        tableTests.jobs = {
          exists: !jobsError,
          count: jobs?.length || 0,
          error: jobsError?.message
        };
        setJobsCount(jobs?.length || 0);
      } catch (err) {
        tableTests.jobs = { exists: false, error: err.message };
      }

      // Test companies table
      try {
        const { data: companies, error: companiesError } = await supabase.from('companies').select('*').limit(1);
        tableTests.companies = {
          exists: !companiesError,
          count: companies?.length || 0,
          error: companiesError?.message
        };
        setCompaniesCount(companies?.length || 0);
      } catch (err) {
        tableTests.companies = { exists: false, error: err.message };
      }

      // Test applications table
      try {
        const { data: applications, error: applicationsError } = await supabase.from('applications').select('*').limit(1);
        tableTests.applications = {
          exists: !applicationsError,
          count: applications?.length || 0,
          error: applicationsError?.message
        };
      } catch (err) {
        tableTests.applications = { exists: false, error: err.message };
      }

      setTableInfo(tableTests);

      // Test jobs API
      const { data: jobsData, error: jobsApiError } = await jobsApi.getJobs();
      
      if (jobsApiError) {
        setError(`Jobs API failed: ${jobsApiError}`);
      } else {
        setJobsCount(jobsData.data?.length || 0);
      }

    } catch (err) {
      setConnectionStatus('❌ Error');
      setError(err.message);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50 max-h-96 overflow-y-auto">
      <h3 className="font-semibold text-gray-900 mb-2">Database Connection Test</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">Status:</span> {connectionStatus}
        </div>
        
        <div>
          <span className="font-medium">Jobs in DB:</span> {jobsCount}
        </div>
        
        <div>
          <span className="font-medium">Companies in DB:</span> {companiesCount}
        </div>
        
        <div>
          <span className="font-medium">URL:</span> 
          <div className="text-xs text-gray-600 break-all">
            {config.url || 'Not set'}
          </div>
        </div>
        
        <div>
          <span className="font-medium">Has Key:</span> {config.hasKey ? '✅' : '❌'}
        </div>

        {/* Table Information */}
        {Object.keys(tableInfo).length > 0 && (
          <div className="mt-3">
            <span className="font-medium">Tables:</span>
            {Object.entries(tableInfo).map(([tableName, info]) => (
              <div key={tableName} className="ml-2 text-xs">
                <span className={info.exists ? 'text-green-600' : 'text-red-600'}>
                  {info.exists ? '✅' : '❌'} {tableName}
                </span>
                {info.exists && <span className="text-gray-500"> ({info.count} records)</span>}
                {info.error && <div className="text-red-500 ml-2">{info.error}</div>}
              </div>
            ))}
          </div>
        )}
        
        {error && (
          <div className="text-red-600 text-xs">
            <span className="font-medium">Error:</span> {error}
          </div>
        )}
      </div>
      
      <button 
        onClick={testConnection}
        className="mt-3 w-full bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
      >
        Test Again
      </button>
      
      {!config.isConfigured && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <strong>Setup Required:</strong> Create a .env file with your Supabase credentials.
          See DATABASE_SETUP.md for instructions.
        </div>
      )}
    </div>
  );
};

export default SupabaseTest; 