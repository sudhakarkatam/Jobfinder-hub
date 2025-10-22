import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterChips = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeFilters = [];

  // Extract active filters from URL params
  const query = searchParams?.get('q');
  const location = searchParams?.get('location');
  const category = searchParams?.get('category');
  const type = searchParams?.get('type');
  const experience = searchParams?.get('experience');
  const salaryMin = searchParams?.get('salaryMin');
  const salaryMax = searchParams?.get('salaryMax');
  const remote = searchParams?.get('remote');
  const skills = searchParams?.get('skills');
  const education = searchParams?.get('education');
  const companySize = searchParams?.get('companySize');

  if (query) {
    activeFilters?.push({
      key: 'q',
      label: `Search: "${query}"`,
      value: query
    });
  }

  if (location) {
    activeFilters?.push({
      key: 'location',
      label: `Location: ${location}`,
      value: location
    });
  }

  if (category) {
    const categoryLabels = {
      'technology': 'Technology',
      'design': 'Design',
      'marketing': 'Marketing',
      'sales': 'Sales',
      'finance': 'Finance',
      'healthcare': 'Healthcare',
      'education': 'Education',
      'operations': 'Operations',
      'hr': 'Human Resources',
      'customer-service': 'Customer Service'
    };
    activeFilters?.push({
      key: 'category',
      label: `Category: ${categoryLabels?.[category] || category}`,
      value: category
    });
  }

  if (type) {
    const typeLabels = {
      'full-time': 'Full Time',
      'part-time': 'Part Time',
      'contract': 'Contract',
      'freelance': 'Freelance',
      'internship': 'Internship'
    };
    activeFilters?.push({
      key: 'type',
      label: `Type: ${typeLabels?.[type] || type}`,
      value: type
    });
  }

  if (experience) {
    const experienceLabels = {
      'entry': 'Entry Level',
      'mid': 'Mid Level',
      'senior': 'Senior Level',
      'executive': 'Executive'
    };
    activeFilters?.push({
      key: 'experience',
      label: `Experience: ${experienceLabels?.[experience] || experience}`,
      value: experience
    });
  }

  if (salaryMin || salaryMax) {
    let salaryLabel = 'Salary: ';
    if (salaryMin && salaryMax) {
      salaryLabel += `$${parseInt(salaryMin)?.toLocaleString()} - $${parseInt(salaryMax)?.toLocaleString()}`;
    } else if (salaryMin) {
      salaryLabel += `From $${parseInt(salaryMin)?.toLocaleString()}`;
    } else {
      salaryLabel += `Up to $${parseInt(salaryMax)?.toLocaleString()}`;
    }
    
    activeFilters?.push({
      key: 'salary',
      label: salaryLabel,
      value: `${salaryMin || ''}-${salaryMax || ''}`
    });
  }

  if (remote === 'true') {
    activeFilters?.push({
      key: 'remote',
      label: 'Remote Work',
      value: 'true'
    });
  }

  if (skills) {
    const skillsArray = skills?.split(',');
    skillsArray?.forEach(skill => {
      activeFilters?.push({
        key: 'skills',
        label: `Skill: ${skill}`,
        value: skill
      });
    });
  }

  if (education) {
    const educationLabels = {
      'high-school': 'High School',
      'associate': 'Associate Degree',
      'bachelor': 'Bachelor\'s Degree',
      'master': 'Master\'s Degree',
      'phd': 'PhD'
    };
    activeFilters?.push({
      key: 'education',
      label: `Education: ${educationLabels?.[education] || education}`,
      value: education
    });
  }

  if (companySize) {
    const sizeLabels = {
      'startup': 'Startup (1-50)',
      'small': 'Small (51-200)',
      'medium': 'Medium (201-1000)',
      'large': 'Large (1000+)'
    };
    activeFilters?.push({
      key: 'companySize',
      label: `Company: ${sizeLabels?.[companySize] || companySize}`,
      value: companySize
    });
  }

  const removeFilter = (filterKey, filterValue) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (filterKey === 'salary') {
      newParams?.delete('salaryMin');
      newParams?.delete('salaryMax');
    } else if (filterKey === 'skills') {
      const currentSkills = newParams?.get('skills');
      if (currentSkills) {
        const skillsArray = currentSkills?.split(',');
        const updatedSkills = skillsArray?.filter(skill => skill !== filterValue);
        if (updatedSkills?.length > 0) {
          newParams?.set('skills', updatedSkills?.join(','));
        } else {
          newParams?.delete('skills');
        }
      }
    } else {
      newParams?.delete(filterKey);
    }
    
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  if (activeFilters?.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-text-secondary font-medium">Active filters:</span>
          
          {activeFilters?.map((filter, index) => (
            <div
              key={`${filter?.key}-${filter?.value}-${index}`}
              className="flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
            >
              <span>{filter?.label}</span>
              <button
                onClick={() => removeFilter(filter?.key, filter?.value)}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-micro"
                title="Remove filter"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          ))}

          {activeFilters?.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              iconName="X"
              iconPosition="left"
              className="ml-2"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterChips;