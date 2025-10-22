import React, { useState, useEffect } from 'react';
import { applicationsApi } from '../../../lib/database';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    date_from: '',
    date_to: '',
    job_id: '',
    company_id: '',
    search: ''
  });
  const [viewMode, setViewMode] = useState('table'); // table, grid, kanban
  const [sortBy, setSortBy] = useState('applied_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    loadApplications();
  }, [filters, sortBy, sortOrder]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const result = await applicationsApi.getApplications(filters);
      if (result.data) {
        let sortedData = [...result.data];
        
        // Apply sorting
        sortedData.sort((a, b) => {
          let aValue = a[sortBy];
          let bValue = b[sortBy];
          
          if (sortBy === 'applied_at') {
            aValue = new Date(a.applied_at);
            bValue = new Date(b.applied_at);
          }
          
          if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
        
        setApplications(sortedData);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedApplications.length === 0) return;
    
    try {
      const promises = selectedApplications.map(id => 
        applicationsApi.updateApplication(id, { status: action })
      );
      
      await Promise.all(promises);
      setSelectedApplications([]);
      loadApplications();
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedApplications(applications.map(app => app.id));
    } else {
      setSelectedApplications([]);
    }
  };

  const handleSelectApplication = (id, checked) => {
    if (checked) {
      setSelectedApplications(prev => [...prev, id]);
    } else {
      setSelectedApplications(prev => prev.filter(appId => appId !== id));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">
              <input
                type="checkbox"
                checked={selectedApplications.length === applications.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Applicant
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Job
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Applied
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {applications.map((application) => (
            <tr key={application.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedApplications.includes(application.id)}
                  onChange={(e) => handleSelectApplication(application.id, e.target.checked)}
                  className="rounded border-gray-300"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <Icon name="User" className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {application.users?.name || 'Unknown'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {application.users?.email || 'No email'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {application.jobs?.title || 'Unknown Job'}
                </div>
                <div className="text-sm text-gray-500">
                  {application.companies?.name || 'Unknown Company'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(application.applied_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(application.status)}`}>
                  {application.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Select
                    value={application.status}
                    onChange={(e) => {
                      applicationsApi.updateApplication(application.id, { status: e.target.value });
                      loadApplications();
                    }}
                    options={[
                      { value: 'pending', label: 'Pending' },
                      { value: 'reviewed', label: 'Reviewed' },
                      { value: 'accepted', label: 'Accepted' },
                      { value: 'rejected', label: 'Rejected' }
                    ]}
                    className="w-32"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {applications.map((application) => (
        <div key={application.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                <Icon name="User" className="w-6 h-6 text-gray-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">
                  {application.users?.name || 'Unknown'}
                </h3>
                <p className="text-sm text-gray-500">
                  {application.users?.email || 'No email'}
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={selectedApplications.includes(application.id)}
              onChange={(e) => handleSelectApplication(application.id, e.target.checked)}
              className="rounded border-gray-300"
            />
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                {application.jobs?.title || 'Unknown Job'}
              </h4>
              <p className="text-sm text-gray-500">
                {application.companies?.name || 'Unknown Company'}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Applied {formatDate(application.applied_at)}
              </span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(application.status)}`}>
                {application.status}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                View Details
              </Button>
              <Select
                value={application.status}
                onChange={(e) => {
                  applicationsApi.updateApplication(application.id, { status: e.target.value });
                  loadApplications();
                }}
                options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'reviewed', label: 'Reviewed' },
                  { value: 'accepted', label: 'Accepted' },
                  { value: 'rejected', label: 'Rejected' }
                ]}
                className="w-32"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderKanbanView = () => {
    const statuses = ['pending', 'reviewed', 'accepted', 'rejected'];
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statuses.map((status) => (
          <div key={status} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 capitalize">{status}</h3>
              <span className="bg-white px-2 py-1 rounded-full text-sm font-medium">
                {applications.filter(app => app.status === status).length}
              </span>
            </div>
            
            <div className="space-y-3">
              {applications
                .filter(app => app.status === status)
                .map((application) => (
                  <div key={application.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <Icon name="User" className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="ml-2">
                          <p className="text-sm font-medium text-gray-900">
                            {application.users?.name || 'Unknown'}
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedApplications.includes(application.id)}
                        onChange={(e) => handleSelectApplication(application.id, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-900">
                        {application.jobs?.title || 'Unknown Job'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {application.companies?.name || 'Unknown Company'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Applied {formatDate(application.applied_at)}
                      </p>
                    </div>
                    
                    <div className="mt-3 flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        View
                      </Button>
                      <Select
                        value={application.status}
                        onChange={(e) => {
                          applicationsApi.updateApplication(application.id, { status: e.target.value });
                          loadApplications();
                        }}
                        options={[
                          { value: 'pending', label: 'Pending' },
                          { value: 'reviewed', label: 'Reviewed' },
                          { value: 'accepted', label: 'Accepted' },
                          { value: 'rejected', label: 'Rejected' }
                        ]}
                        className="w-24"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Application Management</h2>
            <p className="text-sm text-gray-600">
              {applications.length} applications found
              {selectedApplications.length > 0 && ` • ${selectedApplications.length} selected`}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'table' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                <Icon name="List" className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                <Icon name="Grid" className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'kanban' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                <Icon name="Columns" className="w-4 h-4" />
              </button>
            </div>
            
            {/* Sort Controls */}
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: 'applied_at', label: 'Applied Date' },
                { value: 'status', label: 'Status' },
                { value: 'users.name', label: 'Applicant Name' }
              ]}
              className="w-40"
            />
            
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <Icon name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Input
            label="Search"
            placeholder="Search applicants..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'reviewed', label: 'Reviewed' },
              { value: 'accepted', label: 'Accepted' },
              { value: 'rejected', label: 'Rejected' }
            ]}
          />
          <Input
            label="Date From"
            type="date"
            value={filters.date_from}
            onChange={(e) => setFilters(prev => ({ ...prev, date_from: e.target.value }))}
          />
          <Input
            label="Date To"
            type="date"
            value={filters.date_to}
            onChange={(e) => setFilters(prev => ({ ...prev, date_to: e.target.value }))}
          />
          <div className="flex items-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setFilters({})}
              className="flex-1"
            >
              Clear
            </Button>
            <Button 
              onClick={loadApplications}
              className="flex-1"
            >
              Apply
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedApplications.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-900">
              {selectedApplications.length} application(s) selected
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('pending')}
              >
                Mark Pending
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('reviewed')}
              >
                Mark Reviewed
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('accepted')}
              >
                Accept
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('rejected')}
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Applications View */}
      <div className="bg-white rounded-lg border border-gray-200">
        {viewMode === 'table' && renderTableView()}
        {viewMode === 'grid' && renderGridView()}
        {viewMode === 'kanban' && renderKanbanView()}
        
        {applications.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Inbox" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No applications found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationManagement; 