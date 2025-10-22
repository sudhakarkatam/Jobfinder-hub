import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const AnalyticsWidget = () => {
  const applicationData = [
    { month: 'Jan', applications: 145 },
    { month: 'Feb', applications: 189 },
    { month: 'Mar', applications: 234 },
    { month: 'Apr', applications: 198 },
    { month: 'May', applications: 267 },
    { month: 'Jun', applications: 312 },
    { month: 'Jul', applications: 289 }
  ];

  const categoryData = [
    { name: 'Technology', value: 35, color: '#2563EB' },
    { name: 'Marketing', value: 22, color: '#059669' },
    { name: 'Sales', value: 18, color: '#D97706' },
    { name: 'Design', value: 15, color: '#DC2626' },
    { name: 'Other', value: 10, color: '#64748B' }
  ];

  const trafficSources = [
    { source: 'Direct', visitors: 2847, percentage: 42 },
    { source: 'Google Search', visitors: 1923, percentage: 28 },
    { source: 'Social Media', visitors: 1245, percentage: 18 },
    { source: 'Referrals', visitors: 823, percentage: 12 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Application Trends */}
      <div className="bg-surface border border-border rounded-lg p-6 elevation-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Application Trends</h3>
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span>+12% this month</span>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={applicationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="applications" 
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Job Categories */}
      <div className="bg-surface border border-border rounded-lg p-6 elevation-2">
        <h3 className="text-lg font-semibold text-foreground mb-4">Popular Job Categories</h3>
        
        <div className="flex items-center space-x-6">
          <div className="h-48 w-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex-1 space-y-3">
            {categoryData?.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category?.color }}
                  />
                  <span className="text-sm text-foreground">{category?.name}</span>
                </div>
                <span className="text-sm font-medium text-text-secondary">{category?.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Traffic Sources */}
      <div className="bg-surface border border-border rounded-lg p-6 elevation-2 lg:col-span-2">
        <h3 className="text-lg font-semibold text-foreground mb-4">Traffic Sources</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {trafficSources?.map((source, index) => (
            <div key={index} className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{source?.source}</span>
                <span className="text-xs text-text-secondary">{source?.percentage}%</span>
              </div>
              
              <div className="mb-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${source?.percentage}%` }}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={14} className="text-text-secondary" />
                <span className="text-sm text-foreground">{source?.visitors?.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsWidget;