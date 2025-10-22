import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AdminNavigation from '../../components/ui/AdminNavigation';
import JobFilters from './components/JobFilters';
import JobTable from './components/JobTable';
import BulkActions from './components/BulkActions';
import JobPreviewModal from './components/JobPreviewModal';
import CreateJobModal from './components/CreateJobModal';
import { jobsApi } from '../../lib/database.js';

const AdminJobManagement = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ column: 'postedDate', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [previewJob, setPreviewJob] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmJob, setDeleteConfirmJob] = useState(null);

  // Fetch jobs from database
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await jobsApi.getJobs();
        
        if (error) {
          setError(error.message);
        } else {
          // Transform database data to match component expectations
          const transformedJobs = data?.map(job => ({
            id: job.id,
            title: job.title,
            url_slug: job.url_slug,
            company: job.companies?.name || 'Unknown Company',
            category: job.category,
            location: job.location,
            type: job.employment_type,
            salaryMin: job.salary_min,
            salaryMax: job.salary_max,
            experience: job.experience_level,
            status: job.status,
            postedDate: job.created_at,
            description: job.description,
            requirements: job.requirements,
            responsibilities: job.responsibilities,
            benefits: job.benefits,
            apply_link: job.apply_link,
            featured: job.featured,
            urgent: job.urgent
          })) || [];
          
          setJobs(transformedJobs);
          setFilteredJobs(transformedJobs);
        }
      } catch (err) {
        setError('Failed to fetch jobs');
        console.error('Error fetching jobs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, []);

  useEffect(() => {
    let filtered = [...jobs];

    // Apply search filter
    if (searchQuery?.trim()) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(job =>
        job?.title?.toLowerCase()?.includes(query) ||
        job?.company?.toLowerCase()?.includes(query) ||
        job?.location?.toLowerCase()?.includes(query)
      );
    }

    // Apply filters
    Object.entries(filters)?.forEach(([key, value]) => {
      if (value && value !== '') {
        if (key === 'dateRange') {
          const now = new Date();
          const jobDate = new Date();
          
          switch (value) {
            case 'today':
              jobDate?.setDate(now?.getDate());
              break;
            case 'week':
              jobDate?.setDate(now?.getDate() - 7);
              break;
            case 'month':
              jobDate?.setMonth(now?.getMonth() - 1);
              break;
            case 'quarter':
              jobDate?.setMonth(now?.getMonth() - 3);
              break;
            default:
              break;
          }
          
          filtered = filtered?.filter(job => new Date(job.postedDate) >= jobDate);
        } else if (key === 'minSalary') {
          filtered = filtered?.filter(job => job?.salaryMin >= parseInt(value));
        } else if (key === 'maxSalary') {
          filtered = filtered?.filter(job => job?.salaryMax <= parseInt(value));
        } else if (key === 'location') {
          filtered = filtered?.filter(job => 
            job?.location?.toLowerCase()?.includes(value?.toLowerCase())
          );
        } else {
          filtered = filtered?.filter(job => job?.[key] === value);
        }
      }
    });

    // Apply sorting
    filtered?.sort((a, b) => {
      let aValue = a?.[sortConfig?.column];
      let bValue = b?.[sortConfig?.column];

      if (sortConfig?.column === 'postedDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortConfig?.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig?.direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [jobs, searchQuery, filters, sortConfig]);

  const handleSelectJob = (jobId, isSelected) => {
    if (isSelected) {
      setSelectedJobs(prev => [...prev, jobId]);
    } else {
      setSelectedJobs(prev => prev?.filter(id => id !== jobId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      const currentPageJobs = getCurrentPageJobs()?.map(job => job?.id);
      setSelectedJobs(currentPageJobs);
    } else {
      setSelectedJobs([]);
    }
  };

  const handleSort = (newSortConfig) => {
    setSortConfig(newSortConfig);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const handleBulkAction = async (action) => {
    console.log(`Performing bulk action: ${action} on jobs:`, selectedJobs);
    
    switch (action) {
      case 'activate':
        setJobs(prev => prev?.map(job => 
          selectedJobs?.includes(job?.id) ? { ...job, status: 'active' } : job
        ));
        break;
      case 'deactivate':
        setJobs(prev => prev?.map(job => 
          selectedJobs?.includes(job?.id) ? { ...job, status: 'inactive' } : job
        ));
        break;
      case 'delete':
        setJobs(prev => prev?.filter(job => !selectedJobs?.includes(job?.id)));
        break;
      case 'export':
        // Simulate export
        console.log('Exporting selected jobs...');
        break;
      case 'duplicate':
        const jobsToDuplicate = jobs?.filter(job => selectedJobs?.includes(job?.id));
        const duplicatedJobs = jobsToDuplicate?.map(job => ({
          ...job,
          id: `${job?.id}-copy-${Date.now()}`,
          title: `${job?.title} (Copy)`,
          status: 'draft',
          postedDate: new Date()?.toISOString()
        }));
        setJobs(prev => [...prev, ...duplicatedJobs]);
        break;
      case 'archive':
        setJobs(prev => prev?.map(job => 
          selectedJobs?.includes(job?.id) ? { ...job, status: 'archived' } : job
        ));
        break;
    }
    
    setSelectedJobs([]);
  };

  const handleEditClick = (job) => {
    setEditingJob(job);
    setIsEditModalOpen(true);
  };

  const handleUpdateJob = async (jobData) => {
    try {
      const { data, error } = await jobsApi.updateJob(editingJob.id, jobData);

      if (error) {
        setError(error.message || 'Failed to update job');
        return;
      }

      // Reload jobs from database to get fresh data
      const { data: allJobs } = await jobsApi.getJobs();
      const transformedJobs = allJobs?.map(job => ({
        id: job.id,
        title: job.title,
        url_slug: job.url_slug,
        company: job.companies?.name || 'Unknown Company',
        category: job.category,
        location: job.location,
        type: job.employment_type,
        salaryMin: job.salary_min,
        salaryMax: job.salary_max,
        experience: job.experience_level,
        status: job.status,
        postedDate: job.created_at,
        description: job.description,
        requirements: job.requirements,
        responsibilities: job.responsibilities,
        benefits: job.benefits,
        apply_link: job.apply_link,
        featured: job.featured,
        urgent: job.urgent
      })) || [];

      setJobs(transformedJobs);
      setFilteredJobs(transformedJobs);
      setIsEditModalOpen(false);
      setEditingJob(null);
      
      setError(null);
      setSuccess('Job updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update job');
      console.error('Error updating job:', err);
    }
  };

  const handleDelete = async (job) => {
    try {
      const { error } = await jobsApi.deleteJob(job.id);
      
      if (error) {
        setError(error);
        return;
      }

      // Update state immediately
      setJobs(prev => prev.filter(j => j.id !== job.id));
      setFilteredJobs(prev => prev.filter(j => j.id !== job.id));
      setDeleteConfirmJob(null);
      
      // Clear any errors and show success
      setError(null);
      setSuccess('Job deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to delete job');
      console.error('Error deleting job:', err);
    }
  };

  const confirmDelete = async () => {
    if (deleteConfirmJob) {
      try {
        const { error } = await jobsApi.deleteJob(deleteConfirmJob.id);
        
        if (error) {
          setError(error.message || 'Failed to delete job');
          setDeleteConfirmJob(null);
          return;
        }

        // Update state after successful deletion
        setJobs(prev => prev?.filter(j => j?.id !== deleteConfirmJob?.id));
        setFilteredJobs(prev => prev?.filter(j => j?.id !== deleteConfirmJob?.id));
        setDeleteConfirmJob(null);
        
        setError(null);
        setSuccess('Job deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError('Failed to delete job');
        console.error('Error deleting job:', err);
        setDeleteConfirmJob(null);
      }
    }
  };

  const handleDuplicate = (job) => {
    const duplicatedJob = {
      ...job,
      id: `${job?.id}-copy-${Date.now()}`,
      title: `${job?.title} (Copy)`,
      status: 'draft',
      postedDate: new Date()?.toISOString()
    };
    setJobs(prev => [...prev, duplicatedJob]);
    setFilteredJobs(prev => [...prev, duplicatedJob]);
  };

  const handlePreview = (job) => {
    setPreviewJob(job);
    setIsPreviewOpen(true);
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      const { data, error } = await jobsApi.updateJob(jobId, { status: newStatus });
      
      if (error) {
        setError(error);
        return;
      }

      // Update state immediately
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
      ));
      setFilteredJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
      ));
      
      // Clear any errors and show success
      setError(null);
      setSuccess('Job status updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update job status');
      console.error('Error updating job status:', err);
    }
  };

  const handleCreateJob = async (jobData) => {
    try {
      const { data, error } = await jobsApi.createJob(jobData);
      
      if (error) {
        setError(error.message || 'Failed to create job');
        return;
      }

      // Transform the new job to match component format
      const newJob = {
        id: data.id,
        title: data.title,
        url_slug: data.url_slug,
        company: data.companies?.name || 'Unknown Company',
        category: data.category,
        location: data.location,
        type: data.employment_type,
        salaryMin: data.salary_min,
        salaryMax: data.salary_max,
        experience: data.experience_level,
        status: data.status,
        postedDate: data.created_at,
        description: data.description,
        requirements: data.requirements,
        responsibilities: data.responsibilities,
        benefits: data.benefits,
        apply_link: data.apply_link,
        featured: data.featured,
        urgent: data.urgent
      };

      // Update state immediately
      setJobs(prev => [newJob, ...prev]);
      setFilteredJobs(prev => [newJob, ...prev]);
      setIsCreateModalOpen(false);
      
      // Clear any errors and show success
      setError(null);
      setSuccess('Job created successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to create job');
      console.error('Error creating job:', err);
    }
  };

  const getCurrentPageJobs = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredJobs?.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredJobs?.length / itemsPerPage);

  const getJobStats = () => {
    return {
      total: jobs?.length,
      active: jobs?.filter(job => job?.status === 'active')?.length,
      pending: jobs?.filter(job => job?.status === 'pending')?.length,
      draft: jobs?.filter(job => job?.status === 'draft')?.length
    };
  };

  const stats = getJobStats();

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />
      <div className="ml-64 p-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Icon name="AlertCircle" className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-800 font-medium">Error:</span>
                <span className="text-red-700 ml-2">{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800"
              >
                <Icon name="X" className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Success Display */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Icon name="CheckCircle" className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">Success:</span>
                <span className="text-green-700 ml-2">{success}</span>
              </div>
              <button
                onClick={() => setSuccess(null)}
                className="text-green-600 hover:text-green-800"
              >
                <Icon name="X" className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-6">
          <Link to="/admin-dashboard" className="hover:text-foreground transition-micro">
            Dashboard
          </Link>
          <Icon name="ChevronRight" size={14} />
          <span className="text-foreground font-medium">Job Management</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Job Management</h1>
            <p className="text-text-secondary">
              Manage your job postings, review applications, and track performance
            </p>
          </div>
          
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            iconName="Plus"
            iconPosition="left"
            size="lg"
          >
            Create New Job
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-surface border border-border rounded-lg p-6 elevation-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Total Jobs</p>
                <p className="text-2xl font-bold text-foreground">{stats?.total}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="Briefcase" size={24} className="text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6 elevation-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Active Jobs</p>
                <p className="text-2xl font-bold text-success">{stats?.active}</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <Icon name="CheckCircle" size={24} className="text-success" />
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6 elevation-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Pending Approval</p>
                <p className="text-2xl font-bold text-warning">{stats?.pending}</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                <Icon name="Clock" size={24} className="text-warning" />
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6 elevation-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Draft Jobs</p>
                <p className="text-2xl font-bold text-text-secondary">{stats?.draft}</p>
              </div>
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Icon name="Edit" size={24} className="text-text-secondary" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-md">
              <Input
                type="search"
                placeholder="Search jobs by title, company, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
              >
                Export All
              </Button>
              
              <Button
                variant="outline"
                iconName="RefreshCw"
                onClick={() => window.location?.reload()}
              >
                Refresh
              </Button>
            </div>
          </div>

          <JobFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Bulk Actions */}
        <BulkActions
          selectedCount={selectedJobs?.length}
          onBulkAction={handleBulkAction}
          onClearSelection={() => setSelectedJobs([])}
        />

        {/* Job Table */}
        {isLoading ? (
          <div className="bg-surface border border-border rounded-lg p-8 text-center elevation-2">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading jobs...</p>
          </div>
        ) : (
          <>
            <JobTable
              jobs={getCurrentPageJobs()}
              selectedJobs={selectedJobs}
              onSelectJob={handleSelectJob}
              onSelectAll={handleSelectAll}
              onSort={handleSort}
              sortConfig={sortConfig}
              onEdit={handleEditClick}
              onDelete={(job) => setDeleteConfirmJob(job)}
              onDuplicate={handleDuplicate}
              onPreview={handlePreview}
              onStatusChange={handleStatusChange}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center space-x-2 text-sm text-text-secondary">
                  <span>Show</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(parseInt(e?.target?.value))}
                    className="border border-border rounded px-2 py-1 bg-input text-foreground"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span>of {filteredJobs?.length} jobs</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    iconName="ChevronLeft"
                  />
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    iconName="ChevronRight"
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Modals */}
        <JobPreviewModal
          job={previewJob}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          onEdit={handleEditClick}
        />

        <CreateJobModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateJob}
        />

        <CreateJobModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingJob(null);
          }}
          onSave={handleUpdateJob}
          editJob={editingJob}
          isEditMode={true}
        />

        {/* Delete Confirmation */}
        {deleteConfirmJob && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-surface border border-border rounded-lg p-6 max-w-md w-full mx-4 elevation-4 animate-slide-up">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
                  <Icon name="Trash2" size={20} className="text-error" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Delete Job</h3>
                  <p className="text-sm text-text-secondary">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-foreground mb-6">
                Are you sure you want to delete "{deleteConfirmJob?.title}"? This will permanently remove the job posting and all associated data.
              </p>

              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => setDeleteConfirmJob(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  iconName="Trash2"
                  iconPosition="left"
                >
                  Delete Job
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminJobManagement;