import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ isOpen, onClose, onFiltersChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    location: searchParams?.get('location') || '',
    salaryMin: searchParams?.get('salaryMin') || '',
    salaryMax: searchParams?.get('salaryMax') || '',
    jobType: searchParams?.get('type') || '',
    experience: searchParams?.get('experience') || '',
    companySize: searchParams?.get('companySize') || '',
    remote: searchParams?.get('remote') === 'true',
    skills: searchParams?.get('skills')?.split(',') || [],
    education: searchParams?.get('education') || '',
    benefits: searchParams?.get('benefits')?.split(',') || []
  });

  const [expandedSections, setExpandedSections] = useState({
    location: true,
    salary: true,
    jobType: true,
    experience: false,
    companySize: false,
    skills: false,
    education: false,
    benefits: false
  });

  const jobTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'internship', label: 'Internship' }
  ];

  const experienceOptions = [
    { value: '', label: 'Any Experience' },
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-5 years)' },
    { value: 'senior', label: 'Senior Level (6-10 years)' },
    { value: 'executive', label: 'Executive (10+ years)' }
  ];

  const companySizeOptions = [
    { value: '', label: 'Any Size' },
    { value: 'startup', label: 'Startup (1-50)' },
    { value: 'small', label: 'Small (51-200)' },
    { value: 'medium', label: 'Medium (201-1000)' },
    { value: 'large', label: 'Large (1000+)' }
  ];

  const educationOptions = [
    { value: '', label: 'Any Education' },
    { value: 'high-school', label: 'High School' },
    { value: 'associate', label: 'Associate Degree' },
    { value: 'bachelor', label: 'Bachelor\'s Degree' },
    { value: 'master', label: 'Master\'s Degree' },
    { value: 'phd', label: 'PhD' }
  ];

  const skillsList = [
    'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS',
    'Docker', 'Git', 'TypeScript', 'MongoDB', 'GraphQL', 'Vue.js'
  ];

  const benefitsList = [
    'Health Insurance', 'Dental Insurance', 'Vision Insurance',
    '401(k)', 'Paid Time Off', 'Remote Work', 'Flexible Hours',
    'Stock Options', 'Professional Development', 'Gym Membership'
  ];

  const locationSuggestions = [
    'New York, NY', 'San Francisco, CA', 'Los Angeles, CA',
    'Chicago, IL', 'Boston, MA', 'Seattle, WA', 'Austin, TX',
    'Denver, CO', 'Remote', 'Hybrid'
  ];

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSkillToggle = (skill) => {
    setFilters(prev => ({
      ...prev,
      skills: prev?.skills?.includes(skill)
        ? prev?.skills?.filter(s => s !== skill)
        : [...prev?.skills, skill]
    }));
  };

  const handleBenefitToggle = (benefit) => {
    setFilters(prev => ({
      ...prev,
      benefits: prev?.benefits?.includes(benefit)
        ? prev?.benefits?.filter(b => b !== benefit)
        : [...prev?.benefits, benefit]
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      location: '',
      salaryMin: '',
      salaryMax: '',
      jobType: '',
      experience: '',
      companySize: '',
      remote: false,
      skills: [],
      education: '',
      benefits: []
    };
    setFilters(clearedFilters);
    
    // Update URL
    const newParams = new URLSearchParams(searchParams);
    Object.keys(clearedFilters)?.forEach(key => {
      newParams?.delete(key);
    });
    setSearchParams(newParams);
  };

  const applyFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(filters)?.forEach(([key, value]) => {
      if (value && value !== '' && value !== false) {
        if (Array.isArray(value) && value?.length > 0) {
          newParams?.set(key, value?.join(','));
        } else if (!Array.isArray(value)) {
          newParams?.set(key, value?.toString());
        }
      } else {
        newParams?.delete(key);
      }
    });
    
    setSearchParams(newParams);
    if (onClose) onClose();
  };

  const FilterSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="border-b border-border pb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <h3 className="font-medium text-foreground">{title}</h3>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="text-text-secondary" 
        />
      </button>
      {isExpanded && (
        <div className="mt-3 space-y-3 animate-slide-down">
          {children}
        </div>
      )}
    </div>
  );

  const sidebarContent = (
    <div className="h-full flex flex-col bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-text-secondary hover:text-foreground hover:bg-muted transition-micro"
          >
            <Icon name="X" size={20} />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Location */}
        <FilterSection
          title="Location"
          isExpanded={expandedSections?.location}
          onToggle={() => toggleSection('location')}
        >
          <Input
            type="text"
            placeholder="City, State or Remote"
            value={filters?.location}
            onChange={(e) => handleFilterChange('location', e?.target?.value)}
          />
          <div className="space-y-2">
            {locationSuggestions?.slice(0, 5)?.map((location) => (
              <button
                key={location}
                onClick={() => handleFilterChange('location', location)}
                className="block w-full text-left text-sm text-text-secondary hover:text-foreground hover:bg-muted px-2 py-1 rounded transition-micro"
              >
                {location}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Salary Range */}
        <FilterSection
          title="Salary Range"
          isExpanded={expandedSections?.salary}
          onToggle={() => toggleSection('salary')}
        >
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min ($)"
              value={filters?.salaryMin}
              onChange={(e) => handleFilterChange('salaryMin', e?.target?.value)}
            />
            <Input
              type="number"
              placeholder="Max ($)"
              value={filters?.salaryMax}
              onChange={(e) => handleFilterChange('salaryMax', e?.target?.value)}
            />
          </div>
        </FilterSection>

        {/* Job Type */}
        <FilterSection
          title="Job Type"
          isExpanded={expandedSections?.jobType}
          onToggle={() => toggleSection('jobType')}
        >
          <Select
            options={jobTypeOptions}
            value={filters?.jobType}
            onChange={(value) => handleFilterChange('jobType', value)}
            placeholder="Select job type"
          />
          <Checkbox
            label="Remote Work Available"
            checked={filters?.remote}
            onChange={(e) => handleFilterChange('remote', e?.target?.checked)}
          />
        </FilterSection>

        {/* Experience Level */}
        <FilterSection
          title="Experience Level"
          isExpanded={expandedSections?.experience}
          onToggle={() => toggleSection('experience')}
        >
          <Select
            options={experienceOptions}
            value={filters?.experience}
            onChange={(value) => handleFilterChange('experience', value)}
            placeholder="Select experience level"
          />
        </FilterSection>

        {/* Company Size */}
        <FilterSection
          title="Company Size"
          isExpanded={expandedSections?.companySize}
          onToggle={() => toggleSection('companySize')}
        >
          <Select
            options={companySizeOptions}
            value={filters?.companySize}
            onChange={(value) => handleFilterChange('companySize', value)}
            placeholder="Select company size"
          />
        </FilterSection>

        {/* Skills */}
        <FilterSection
          title="Skills"
          isExpanded={expandedSections?.skills}
          onToggle={() => toggleSection('skills')}
        >
          <div className="grid grid-cols-2 gap-2">
            {skillsList?.map((skill) => (
              <Checkbox
                key={skill}
                label={skill}
                checked={filters?.skills?.includes(skill)}
                onChange={() => handleSkillToggle(skill)}
                size="sm"
              />
            ))}
          </div>
        </FilterSection>

        {/* Education */}
        <FilterSection
          title="Education"
          isExpanded={expandedSections?.education}
          onToggle={() => toggleSection('education')}
        >
          <Select
            options={educationOptions}
            value={filters?.education}
            onChange={(value) => handleFilterChange('education', value)}
            placeholder="Select education level"
          />
        </FilterSection>

        {/* Benefits */}
        <FilterSection
          title="Benefits"
          isExpanded={expandedSections?.benefits}
          onToggle={() => toggleSection('benefits')}
        >
          <div className="space-y-2">
            {benefitsList?.map((benefit) => (
              <Checkbox
                key={benefit}
                label={benefit}
                checked={filters?.benefits?.includes(benefit)}
                onChange={() => handleBenefitToggle(benefit)}
                size="sm"
              />
            ))}
          </div>
        </FilterSection>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border space-y-3">
        <Button
          onClick={applyFilters}
          className="w-full"
          iconName="Filter"
          iconPosition="left"
        >
          Apply Filters
        </Button>
        <Button
          variant="ghost"
          onClick={clearAllFilters}
          className="w-full"
          iconName="X"
          iconPosition="left"
        >
          Clear All
        </Button>
      </div>
    </div>
  );

  // Desktop Sidebar
  if (!onClose) {
    return (
      <aside className="hidden lg:block lg:fixed lg:left-0 lg:top-16 lg:bottom-0 lg:w-80 border-r border-border z-40">
        {sidebarContent}
      </aside>
    );
  }

  // Mobile Drawer
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-80 z-60 lg:hidden transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default FilterSidebar;