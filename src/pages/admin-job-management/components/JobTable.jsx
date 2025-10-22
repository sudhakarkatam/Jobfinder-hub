import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const JobTable = ({ 
  jobs, 
  selectedJobs, 
  onSelectJob, 
  onSelectAll, 
  onSort, 
  sortConfig, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onPreview,
  onStatusChange 
}) => {
  const [editingStatus, setEditingStatus] = useState(null);

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'expired', label: 'Expired' },
    { value: 'draft', label: 'Draft' }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success text-success-foreground', icon: 'CheckCircle' },
      inactive: { color: 'bg-secondary text-secondary-foreground', icon: 'XCircle' },
      pending: { color: 'bg-warning text-warning-foreground', icon: 'Clock' },
      expired: { color: 'bg-error text-error-foreground', icon: 'AlertCircle' },
      draft: { color: 'bg-muted text-muted-foreground', icon: 'Edit' }
    };

    const config = statusConfig?.[status] || statusConfig?.inactive;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} />
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  const handleSort = (column) => {
    const direction = sortConfig?.column === column && sortConfig?.direction === 'asc' ? 'desc' : 'asc';
    onSort({ column, direction });
  };

  const getSortIcon = (column) => {
    if (sortConfig?.column !== column) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const handleStatusEdit = (jobId, newStatus) => {
    onStatusChange(jobId, newStatus);
    setEditingStatus(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Not specified';
    if (min && max) return `$${min?.toLocaleString()} - $${max?.toLocaleString()}`;
    if (min) return `$${min?.toLocaleString()}+`;
    return `Up to $${max?.toLocaleString()}`;
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden elevation-2">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <Checkbox
                  checked={selectedJobs?.length === jobs?.length && jobs?.length > 0}
                  onChange={(e) => onSelectAll(e?.target?.checked)}
                  indeterminate={selectedJobs?.length > 0 && selectedJobs?.length < jobs?.length}
                />
              </th>
              
              {[
                { key: 'title', label: 'Job Title' },
                { key: 'company', label: 'Company' },
                { key: 'category', label: 'Category' },
                { key: 'location', label: 'Location' },
                { key: 'salary', label: 'Salary' },
                { key: 'postedDate', label: 'Posted' },
                { key: 'status', label: 'Status' }
              ]?.map((column) => (
                <th
                  key={column?.key}
                  className="px-4 py-3 text-left text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50 transition-micro"
                  onClick={() => handleSort(column?.key)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column?.label}</span>
                    <Icon name={getSortIcon(column?.key)} size={14} className="text-text-secondary" />
                  </div>
                </th>
              ))}
              
              <th className="px-4 py-3 text-right text-sm font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-border">
            {jobs?.map((job) => (
              <tr key={job?.id} className="hover:bg-muted/30 transition-micro">
                <td className="px-4 py-4">
                  <Checkbox
                    checked={selectedJobs?.includes(job?.id)}
                    onChange={(e) => onSelectJob(job?.id, e?.target?.checked)}
                  />
                </td>
                
                <td className="px-4 py-4">
                  <div>
                    <div className="font-medium text-foreground">{job?.title}</div>
                    <div className="text-sm text-text-secondary">{job?.type}</div>
                  </div>
                </td>
                
                <td className="px-4 py-4">
                  <div className="text-sm text-foreground">{job?.company}</div>
                </td>
                
                <td className="px-4 py-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {job?.category}
                  </span>
                </td>
                
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-1 text-sm text-text-secondary">
                    <Icon name="MapPin" size={12} />
                    <span>{job?.location}</span>
                  </div>
                </td>
                
                <td className="px-4 py-4">
                  <div className="text-sm text-foreground">
                    {formatSalary(job?.salaryMin, job?.salaryMax)}
                  </div>
                </td>
                
                <td className="px-4 py-4">
                  <div className="text-sm text-text-secondary">
                    {formatDate(job?.postedDate)}
                  </div>
                </td>
                
                <td className="px-4 py-4">
                  {editingStatus === job?.id ? (
                    <div className="w-32">
                      <Select
                        options={statusOptions}
                        value={job?.status}
                        onChange={(value) => handleStatusEdit(job?.id, value)}
                        placeholder="Select status"
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingStatus(job?.id)}
                      className="hover:opacity-80 transition-micro"
                    >
                      {getStatusBadge(job?.status)}
                    </button>
                  )}
                </td>
                
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPreview(job)}
                      iconName="Eye"
                      title="Preview"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(job)}
                      iconName="Edit"
                      title="Edit"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDuplicate(job)}
                      iconName="Copy"
                      title="Duplicate"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(job)}
                      iconName="Trash2"
                      title="Delete"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-border">
        {jobs?.map((job) => (
          <div key={job?.id} className="p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={selectedJobs?.includes(job?.id)}
                onChange={(e) => onSelectJob(job?.id, e?.target?.checked)}
                className="mt-1"
              />
              
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">{job?.title}</h3>
                    <p className="text-sm text-text-secondary">{job?.company}</p>
                  </div>
                  {getStatusBadge(job?.status)}
                </div>
                
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {job?.category}
                  </span>
                  <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full bg-muted text-muted-foreground">
                    <Icon name="MapPin" size={10} />
                    <span>{job?.location}</span>
                  </span>
                  <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full bg-muted text-muted-foreground">
                    <Icon name="Calendar" size={10} />
                    <span>{formatDate(job?.postedDate)}</span>
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-foreground">
                    {formatSalary(job?.salaryMin, job?.salaryMax)}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPreview(job)}
                      iconName="Eye"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(job)}
                      iconName="Edit"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(job)}
                      iconName="Trash2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobTable;