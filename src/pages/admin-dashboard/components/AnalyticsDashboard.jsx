import React, { useState, useEffect } from 'react';
import { applicationsApi, jobsApi, companiesApi } from '../../../lib/database';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
    applications: {},
    jobs: {},
    companies: {},
    trends: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [applicationsResult, jobsResult, companiesResult] = await Promise.all([
        applicationsApi.getApplicationStats(),
        jobsApi.getJobs(),
        companiesApi.getCompanies()
      ]);

      const applications = applicationsResult.data || {};
      const jobs = jobsResult.data || [];
      const companies = companiesResult.data || [];

      // Calculate job statistics
      const jobStats = {
        total: jobs.length,
        active: jobs.filter(job => job.status === 'active').length,
        featured: jobs.filter(job => job.featured).length,
        byCategory: {},
        byLocation: {},
        byEmploymentType: {}
      };

      // Calculate category distribution
      jobs.forEach(job => {
        if (job.category) {
          jobStats.byCategory[job.category] = (jobStats.byCategory[job.category] || 0) + 1;
        }
        if (job.location) {
          jobStats.byLocation[job.location] = (jobStats.byLocation[job.location] || 0) + 1;
        }
        if (job.employment_type) {
          jobStats.byEmploymentType[job.employment_type] = (jobStats.byEmploymentType[job.employment_type] || 0) + 1;
        }
      });

      // Calculate company statistics
      const companyStats = {
        total: companies.length,
        byIndustry: {},
        bySize: {}
      };

      companies.forEach(company => {
        if (company.industry) {
          companyStats.byIndustry[company.industry] = (companyStats.byIndustry[company.industry] || 0) + 1;
        }
        if (company.size) {
          companyStats.bySize[company.size] = (companyStats.bySize[company.size] || 0) + 1;
        }
      });

      // Calculate trends (mock data for now)
      const trends = generateTrendData(timeRange);

      setAnalytics({
        applications,
        jobs: jobStats,
        companies: companyStats,
        trends
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTrendData = (days) => {
    const trends = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      trends.push({
        date: date.toISOString().split('T')[0],
        applications: Math.floor(Math.random() * 20) + 5,
        jobs: Math.floor(Math.random() * 10) + 2,
        users: Math.floor(Math.random() * 15) + 3
      });
    }
    
    return trends;
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const getPercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  const renderMetricCard = (title, value, change, icon, color) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{formatNumber(value)}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon name={icon} className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const renderChartCard = (title, data, type = 'bar') => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {Object.entries(data).slice(0, 5).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{key}</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${getPercentage(value, Math.max(...Object.values(data)))}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900">{value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTrendChart = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Trends (Last {timeRange} days)</h3>
        <Select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          options={[
            { value: '7', label: '7 days' },
            { value: '30', label: '30 days' },
            { value: '90', label: '90 days' }
          ]}
          className="w-32"
        />
      </div>
      
      <div className="space-y-4">
        {analytics.trends.slice(-7).map((trend, index) => (
          <div key={trend.date} className="flex items-center space-x-4">
            <div className="w-20 text-sm text-gray-500">
              {new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <div className="flex-1 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">{trend.applications}</div>
                <div className="text-xs text-gray-500">Applications</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">{trend.jobs}</div>
                <div className="text-xs text-gray-500">Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">{trend.users}</div>
                <div className="text-xs text-gray-500">Users</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Comprehensive insights into your job board performance</p>
          </div>
          <Button variant="outline" iconName="Download">
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderMetricCard(
          'Total Applications',
          analytics.applications.total || 0,
          12,
          'FileText',
          'bg-blue-500'
        )}
        {renderMetricCard(
          'Active Jobs',
          analytics.jobs.active || 0,
          8,
          'Briefcase',
          'bg-green-500'
        )}
        {renderMetricCard(
          'Total Companies',
          analytics.companies.total || 0,
          15,
          'Building',
          'bg-purple-500'
        )}
        {renderMetricCard(
          'Featured Jobs',
          analytics.jobs.featured || 0,
          5,
          'Star',
          'bg-yellow-500'
        )}
      </div>

      {/* Application Status Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Pending</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {analytics.applications.pending || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Reviewed</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {analytics.applications.reviewed || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Accepted</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {analytics.applications.accepted || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Rejected</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {analytics.applications.rejected || 0}
              </span>
            </div>
          </div>
        </div>

        {renderChartCard('Jobs by Category', analytics.jobs.byCategory || {})}
        {renderChartCard('Jobs by Location', analytics.jobs.byLocation || {})}
      </div>

      {/* Trends and Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderTrendChart()}
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Type Distribution</h3>
          <div className="space-y-3">
            {Object.entries(analytics.jobs.byEmploymentType || {}).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">{type}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${getPercentage(count, analytics.jobs.total)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Company Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Companies by Industry</h3>
          <div className="space-y-3">
            {Object.entries(analytics.companies.byIndustry || {}).slice(0, 5).map(([industry, count]) => (
              <div key={industry} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{industry}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${getPercentage(count, analytics.companies.total)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Companies by Size</h3>
          <div className="space-y-3">
            {Object.entries(analytics.companies.bySize || {}).map(([size, count]) => (
              <div key={size} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">{size}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full" 
                      style={{ width: `${getPercentage(count, analytics.companies.total)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="justify-start" iconName="Plus">
            Post New Job
          </Button>
          <Button variant="outline" className="justify-start" iconName="Users">
            View All Applications
          </Button>
          <Button variant="outline" className="justify-start" iconName="Settings">
            Manage Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 