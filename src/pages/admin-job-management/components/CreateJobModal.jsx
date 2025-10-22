import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CreateJobModal = ({ isOpen, onClose, onSave, editJob = null, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    url_slug: '',
    company_name: '',
    category: '',
    location: '',
    employment_type: '',
    salary_min: '',
    salary_max: '',
    experience_level: '',
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    apply_link: '',
    status: 'active',
    featured: false,
    urgent: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form with edit job data
  React.useEffect(() => {
    if (isEditMode && editJob) {
      setFormData({
        title: editJob.title || '',
        url_slug: editJob.url_slug || '',
        company_name: editJob.company || '',
        category: editJob.category || '',
        location: editJob.location || '',
        employment_type: editJob.type || '',
        salary_min: editJob.salaryMin || '',
        salary_max: editJob.salaryMax || '',
        experience_level: editJob.experience || '',
        description: editJob.description || '',
        requirements: editJob.requirements || '',
        responsibilities: editJob.responsibilities || '',
        benefits: editJob.benefits || '',
        apply_link: editJob.apply_link || '',
        status: editJob.status || 'active',
        featured: editJob.featured || false,
        urgent: editJob.urgent || false
      });
    } else {
      // Reset form when creating new job
      setFormData({
        title: '',
        url_slug: '',
        company_name: '',
        category: '',
        location: '',
        employment_type: '',
        salary_min: '',
        salary_max: '',
        experience_level: '',
        description: '',
        requirements: '',
        responsibilities: '',
        benefits: '',
        apply_link: '',
        status: 'active',
        featured: false,
        urgent: false
      });
    }
    setErrors({});
  }, [isEditMode, editJob, isOpen]);

  const categoryOptions = [
    { value: '', label: 'Select Category' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Development', label: 'Development' },
    { value: 'Design', label: 'Design' },
    { value: 'Data Science', label: 'Data Science' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Banking Jobs', label: 'Banking Jobs' },
    { value: 'Government Jobs', label: 'Government Jobs' }
  ];

  const typeOptions = [
    { value: '', label: 'Select Job Type' },
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Internship', label: 'Internship' }
  ];

  const experienceOptions = [
    { value: '', label: 'Select Experience Level' },
    { value: 'Entry Level', label: 'Entry Level' },
    { value: 'Mid Level', label: 'Mid Level' },
    { value: 'Senior Level', label: 'Senior Level' },
    { value: 'Executive', label: 'Executive' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData?.title?.trim()) newErrors.title = 'Job title is required';
    if (!formData?.company_name?.trim()) newErrors.company_name = 'Company name is required';
    if (!formData?.category) newErrors.category = 'Category is required';
    if (!formData?.location?.trim()) newErrors.location = 'Location is required';
    if (!formData?.employment_type) newErrors.employment_type = 'Job type is required';
    if (!formData?.description?.trim()) newErrors.description = 'Job description is required';

    // Salary validation removed - now optional and can be text or number

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const jobData = {
        title: formData.title,
        url_slug: formData.url_slug || generateSlug(formData.title),
        description: formData.description,
        location: formData.location,
        employment_type: formData.employment_type,
        experience_level: formData.experience_level || 'Mid Level',
        category: formData.category,
        // Salary can be text or number, or null if empty
        salary_min: formData.salary_min?.trim() || null,
        salary_max: formData.salary_max?.trim() || null,
        requirements: formData.requirements || null,
        responsibilities: formData.responsibilities || null,
        benefits: formData.benefits || null,
        apply_link: formData.apply_link || null,
        status: formData.status,
        featured: formData.featured,
        urgent: formData.urgent
      };

      // Only include company_name for new jobs (create mode)
      if (!isEditMode) {
        jobData.company_name = formData.company_name;
      }

      await onSave(jobData);
      handleClose();
    } catch (error) {
      console.error('Error saving job:', error);
      setErrors({ submit: error.message || 'Failed to save job' });
    } finally {
      setIsSubmitting(false);
    }
  };

  //Auto-generate URL slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .substring(0, 60); // Limit length
  };

  // Handle title blur to auto-generate slug
  const handleTitleBlur = () => {
    if (formData.title && !formData.url_slug) {
      const autoSlug = generateSlug(formData.title);
      setFormData(prev => ({ ...prev, url_slug: autoSlug }));
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      url_slug: '',
      company_name: '',
      category: '',
      location: '',
      employment_type: '',
      salary_min: '',
      salary_max: '',
      experience_level: '',
      description: '',
      requirements: '',
      responsibilities: '',
      benefits: '',
      apply_link: '',
      status: 'active',
      featured: false,
      urgent: false
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-surface border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden elevation-4 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name={isEditMode ? "Edit" : "Plus"} size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {isEditMode ? 'Edit Job' : 'Create New Job'}
              </h2>
              <p className="text-sm text-text-secondary">
                {isEditMode ? 'Update job posting details' : 'Add a new job posting to your listings'}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            onClick={handleClose}
            iconName="X"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
              
              <Input
                label="Job Title"
                type="text"
                placeholder="e.g. Senior Software Engineer"
                value={formData?.title}
                onChange={(e) => handleInputChange('title', e?.target?.value)}
                onBlur={handleTitleBlur}
                error={errors?.title}
                required
              />

              <div className="space-y-2">
                <Input
                  label="URL Slug (for job link)"
                  type="text"
                  placeholder="e.g. senior-software-engineer"
                  value={formData?.url_slug}
                  onChange={(e) => handleInputChange('url_slug', e?.target?.value)}
                  error={errors?.url_slug}
                />
                {formData?.url_slug && (
                  <div className="flex items-center space-x-2 text-xs">
                    <Icon name="Link" size={12} className="text-primary" />
                    <span className="text-text-secondary">
                      Preview: <span className="text-primary font-mono">/job-detail-view/{formData.url_slug}</span>
                    </span>
                  </div>
                )}
                <p className="text-xs text-text-secondary">
                  Auto-generated from job title. You can customize it for SEO-friendly URLs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Company Name"
                  type="text"
                  placeholder="e.g. TechCorp Solutions"
                  value={formData?.company_name}
                  onChange={(e) => handleInputChange('company_name', e?.target?.value)}
                  error={errors?.company_name}
                  required
                />

                <Select
                  label="Category"
                  options={categoryOptions}
                  value={formData?.category}
                  onChange={(value) => handleInputChange('category', value)}
                  error={errors?.category}
                  required
                />

                <Select
                  label="Job Type"
                  options={typeOptions}
                  value={formData?.employment_type}
                  onChange={(value) => handleInputChange('employment_type', value)}
                  error={errors?.employment_type}
                  required
                />

                <Input
                  label="Location"
                  type="text"
                  placeholder="e.g. New York, NY or Remote"
                  value={formData?.location}
                  onChange={(e) => handleInputChange('location', e?.target?.value)}
                  error={errors?.location}
                  required
                />

                <Select
                  label="Experience Level"
                  options={experienceOptions}
                  value={formData?.experience_level}
                  onChange={(value) => handleInputChange('experience_level', value)}
                  error={errors?.experience_level}
                />
              </div>
            </div>

            {/* Salary Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Salary Information 
                <span className="text-xs text-text-secondary ml-2">(Optional - can be text or number)</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Minimum Salary (Optional)"
                  type="text"
                  placeholder="e.g. 80000 or $80k or Negotiable"
                  value={formData?.salary_min}
                  onChange={(e) => handleInputChange('salary_min', e?.target?.value)}
                  error={errors?.salary_min}
                />

                <Input
                  label="Maximum Salary (Optional)"
                  type="text"
                  placeholder="e.g. 120000 or $120k"
                  value={formData?.salary_max}
                  onChange={(e) => handleInputChange('salary_max', e?.target?.value)}
                  error={errors?.salary_max}
                />
              </div>
              <p className="text-xs text-text-secondary">
                You can enter numbers (e.g., 80000), formatted text (e.g., $80k-$120k), or leave blank if salary is not disclosed.
              </p>
            </div>

            {/* Job Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Job Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Job Description *
                  </label>
                  <textarea
                    placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                    value={formData?.description}
                    onChange={(e) => handleInputChange('description', e?.target?.value)}
                    rows={6}
                    className={`w-full px-3 py-2 border rounded-md bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-micro ${
                      errors?.description ? 'border-error' : 'border-border'
                    }`}
                  />
                  {errors?.description && (
                    <p className="mt-1 text-sm text-error">{errors?.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Responsibilities
                  </label>
                  <textarea
                    placeholder="List the key responsibilities for this role..."
                    value={formData?.responsibilities}
                    onChange={(e) => handleInputChange('responsibilities', e?.target?.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-micro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Requirements
                  </label>
                  <textarea
                    placeholder="List the required skills, experience, and qualifications..."
                    value={formData?.requirements}
                    onChange={(e) => handleInputChange('requirements', e?.target?.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-micro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Benefits
                  </label>
                  <textarea
                    placeholder="Describe the benefits, perks, and what makes your company great..."
                    value={formData?.benefits}
                    onChange={(e) => handleInputChange('benefits', e?.target?.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-micro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Application Link
                    <span className="text-xs text-text-secondary ml-2">(Optional - Where "Apply Now" button should redirect)</span>
                  </label>
                  <Input
                    type="url"
                    placeholder="https://example.com/apply or mailto:hr@company.com"
                    value={formData?.apply_link}
                    onChange={(e) => handleInputChange('apply_link', e?.target?.value)}
                    error={errors?.apply_link}
                  />
                  <p className="mt-1 text-xs text-text-secondary">
                    Enter a URL (job application page, Google Form, etc.) or email (mailto:hr@company.com)
                  </p>
                </div>
              </div>
            </div>

            {/* Publishing Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Publishing Options</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Status"
                  options={statusOptions}
                  value={formData?.status}
                  onChange={(value) => handleInputChange('status', value)}
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData?.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-foreground">
                    Featured Job
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="urgent"
                    checked={formData?.urgent}
                    onChange={(e) => handleInputChange('urgent', e.target.checked)}
                    className="w-4 h-4 text-error border-border rounded focus:ring-error"
                  />
                  <label htmlFor="urgent" className="text-sm font-medium text-foreground">
                    Urgent Hiring
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted/30">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              iconName="Save"
              iconPosition="left"
            >
              {isEditMode ? 'Update Job' : 'Create Job'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobModal;