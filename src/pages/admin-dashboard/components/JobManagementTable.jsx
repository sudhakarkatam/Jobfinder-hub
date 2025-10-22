import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const JobManagementTable = () => {
  const navigate = useNavigate();
  const [selectedJobs, setSelectedJobs] = useState([]);

  const jobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'Full Time',
      status: 'active',
      applications: 24,
      posted: new Date(Date.now() - 86400000),
      expires: new Date(Date.now() + 2592000000)
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'StartupXYZ',
      location: 'New York, NY',
      type: 'Full Time',
      status: 'active',
      applications: 18,
      posted: new Date(Date.now() - 172800000),
      expires: new Date(Date.now() + 2505600000)
    },
    {
      id: 3,
      title: 'UX Designer',
      company: 'DesignStudio',
      location: 'Remote',
      type: 'Contract',
      status: 'draft',
      applications: 0,
      posted: new Date(Date.now() - 259200000),
      expires: new Date(Date.now() + 2419200000)
    },
    {
      id: 4,
      title: 'Data Scientist',
      company: 'DataCorp',
      location: 'Boston, MA',
      type: 'Full Time',
      status: 'expired',
      applications: 31,
      posted: new Date(Date.now() - 2592000000),
      expires: new Date(Date.now() - 86400000)
    },
    {
      id: 5,
      title: 'Marketing Manager',
      company: 'GrowthCo',
      location: 'Chicago, IL',
      type: 'Part Time',
      status: 'active',
      applications: 12,
      posted: new Date(Date.now() - 345600000),
      expires: new Date(Date.now() + 2332800000)
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success text-success-foreground', label: 'Active' },
      draft: { color: 'bg-warning text-warning-foreground', label: 'Draft' },
      expired: { color: 'bg-error text-error-foreground', label: 'Expired' }
    };

    const config = statusConfig?.[status] || statusConfig?.draft;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const handleSelectJob = (jobId) => {
    setSelectedJobs(prev => 
      prev?.includes(jobId) 
        ? prev?.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleSelectAll = () => {
    setSelectedJobs(selectedJobs?.length === jobs?.length ? [] : jobs?.map(job => job?.id));
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk ${action} for jobs:`, selectedJobs);
    setSelectedJobs([]);
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="bg-surface border border-border rounded-lg elevation-2">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent Job Listings</h2>
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={() => navigate('/admin-job-management')}
          >
            New Job
          </Button>
        </div>
        
        {selectedJobs?.length > 0 && (
          <div className="flex items-center space-x-2 mt-4 p-3 bg-muted rounded-lg">
            <span className="text-sm text-foreground">{selectedJobs?.length} selected</span>
            <Button
              variant="ghost"
              size="sm"
              iconName="Edit"
              onClick={() => handleBulkAction('edit')}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Trash2"
              onClick={() => handleBulkAction('delete')}
            >
              Delete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Archive"
              onClick={() => handleBulkAction('archive')}
            >
              Archive
            </Button>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4">
                <input
                  type="checkbox"
                  checked={selectedJobs?.length === jobs?.length}
                  onChange={handleSelectAll}
                  className="rounded border-border"
                />
              </th>
              <th className="text-left p-4 text-sm font-medium text-foreground">Job Title</th>
              <th className="text-left p-4 text-sm font-medium text-foreground">Company</th>
              <th className="text-left p-4 text-sm font-medium text-foreground">Location</th>
              <th className="text-left p-4 text-sm font-medium text-foreground">Type</th>
              <th className="text-left p-4 text-sm font-medium text-foreground">Status</th>
              <th className="text-left p-4 text-sm font-medium text-foreground">Applications</th>
              <th className="text-left p-4 text-sm font-medium text-foreground">Posted</th>
              <th className="text-left p-4 text-sm font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs?.map((job) => (
              <tr key={job?.id} className="border-t border-border hover:bg-muted/30 transition-micro">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedJobs?.includes(job?.id)}
                    onChange={() => handleSelectJob(job?.id)}
                    className="rounded border-border"
                  />
                </td>
                <td className="p-4">
                  <div>
                    <h3 className="text-sm font-medium text-foreground">{job?.title}</h3>
                    <p className="text-xs text-text-secondary">ID: {job?.id}</p>
                  </div>
                </td>
                <td className="p-4 text-sm text-foreground">{job?.company}</td>
                <td className="p-4 text-sm text-text-secondary">{job?.location}</td>
                <td className="p-4 text-sm text-text-secondary">{job?.type}</td>
                <td className="p-4">{getStatusBadge(job?.status)}</td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="Users" size={14} className="text-text-secondary" />
                    <span className="text-sm text-foreground">{job?.applications}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-text-secondary">{formatDate(job?.posted)}</td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => navigate('/job-detail-view')}
                      className="p-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      onClick={() => navigate('/admin-job-management')}
                      className="p-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      onClick={() => console.log('Delete job', job?.id)}
                      className="p-1 text-error hover:text-error"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between text-sm text-text-secondary">
          <span>Showing 5 of 247 job listings</span>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" iconName="ChevronLeft">Previous</Button>
            <Button variant="ghost" size="sm" iconName="ChevronRight">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobManagementTable;