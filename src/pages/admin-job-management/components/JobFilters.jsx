import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const JobFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending Approval' },
    { value: 'expired', label: 'Expired' },
    { value: 'draft', label: 'Draft' }
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'technology', label: 'Technology' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'finance', label: 'Finance' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'operations', label: 'Operations' }
  ];

  const companyOptions = [
    { value: '', label: 'All Companies' },
    { value: 'techcorp', label: 'TechCorp Solutions' },
    { value: 'innovate', label: 'Innovate Labs' },
    { value: 'designstudio', label: 'Design Studio Pro' },
    { value: 'marketingplus', label: 'Marketing Plus' },
    { value: 'financegroup', label: 'Finance Group LLC' }
  ];

  const dateRangeOptions = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value && value !== '');

  return (
    <div className="bg-surface border border-border rounded-lg p-6 elevation-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Filter" size={20} />
          <span>Filters</span>
        </h3>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {isExpanded ? 'Less' : 'More'} Filters
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {/* Always visible filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            label="Status"
            options={statusOptions}
            value={filters?.status || ''}
            onChange={(value) => handleFilterChange('status', value)}
            placeholder="Filter by status"
          />

          <Select
            label="Category"
            options={categoryOptions}
            value={filters?.category || ''}
            onChange={(value) => handleFilterChange('category', value)}
            placeholder="Filter by category"
          />

          <Select
            label="Company"
            options={companyOptions}
            value={filters?.company || ''}
            onChange={(value) => handleFilterChange('company', value)}
            placeholder="Filter by company"
            searchable
          />

          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={filters?.dateRange || ''}
            onChange={(value) => handleFilterChange('dateRange', value)}
            placeholder="Filter by date"
          />
        </div>

        {/* Expanded filters */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-border animate-slide-down">
            <Input
              label="Minimum Salary"
              type="number"
              placeholder="e.g. 50000"
              value={filters?.minSalary || ''}
              onChange={(e) => handleFilterChange('minSalary', e?.target?.value)}
            />

            <Input
              label="Maximum Salary"
              type="number"
              placeholder="e.g. 150000"
              value={filters?.maxSalary || ''}
              onChange={(e) => handleFilterChange('maxSalary', e?.target?.value)}
            />

            <Input
              label="Location"
              type="text"
              placeholder="City, State"
              value={filters?.location || ''}
              onChange={(e) => handleFilterChange('location', e?.target?.value)}
            />
          </div>
        )}

        {/* Custom date range */}
        {filters?.dateRange === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border animate-slide-down">
            <Input
              label="Start Date"
              type="date"
              value={filters?.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e?.target?.value)}
            />

            <Input
              label="End Date"
              type="date"
              value={filters?.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e?.target?.value)}
            />
          </div>
        )}
      </div>
      {/* Filter summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Icon name="Info" size={14} />
            <span>
              {Object.values(filters)?.filter(value => value && value !== '')?.length} filter(s) applied
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobFilters;