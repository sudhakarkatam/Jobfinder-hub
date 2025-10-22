import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import LiveResumePreview from './LiveResumePreview';

const ResumeFormWithPreview = ({ data, onUpdate, title, fields, type }) => {
  const [formData, setFormData] = useState(data || {});
  const [previewData, setPreviewData] = useState({
    personalInfo: {},
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: []
  });

  // Update preview data when form data changes
  useEffect(() => {
    if (type === 'experience' || type === 'education' || type === 'skills') {
      setPreviewData(prev => ({
        ...prev,
        [type]: formData
      }));
    } else {
      // For personal info
      setPreviewData(prev => ({
        ...prev,
        personalInfo: formData
      }));
    }
  }, [formData, type]);

  const handleInputChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onUpdate(updatedData);
  };

  const addItem = () => {
    const newItem = type === 'experience' ? {
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    } : type === 'education' ? {
      degree: '',
      school: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: ''
    } : type === 'skills' ? {
      category: '',
      skills: ''
    } : {};

    const updatedData = [...(formData || []), newItem];
    setFormData(updatedData);
    onUpdate(updatedData);
  };

  const removeItem = (index) => {
    const updatedData = formData.filter((_, i) => i !== index);
    setFormData(updatedData);
    onUpdate(updatedData);
  };

  const updateItem = (index, field, value) => {
    const updatedData = [...formData];
    updatedData[index] = { ...updatedData[index], [field]: value };
    setFormData(updatedData);
    onUpdate(updatedData);
  };

  const renderForm = () => {
    if (type === 'experience' || type === 'education' || type === 'skills') {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            <Button onClick={addItem} size="sm" iconName="Plus">
              Add {type === 'experience' ? 'Experience' : type === 'education' ? 'Education' : 'Skills'}
            </Button>
          </div>

          {formData && formData.length > 0 ? (
            <div className="space-y-4">
              {formData.map((item, index) => (
                <div key={index} className="border border-border rounded-lg p-4 bg-surface">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-foreground">
                      {type === 'experience' ? 'Work Experience' : type === 'education' ? 'Education' : 'Skills'} #{index + 1}
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      iconName="Trash2"
                    >
                      Remove
                    </Button>
                  </div>

                  {type === 'experience' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Job Title"
                        value={item.title || ''}
                        onChange={(e) => updateItem(index, 'title', e.target.value)}
                        placeholder="e.g., Senior Software Engineer"
                      />
                      <Input
                        label="Company"
                        value={item.company || ''}
                        onChange={(e) => updateItem(index, 'company', e.target.value)}
                        placeholder="e.g., TechCorp Inc"
                      />
                      <Input
                        label="Location"
                        value={item.location || ''}
                        onChange={(e) => updateItem(index, 'location', e.target.value)}
                        placeholder="e.g., San Francisco, CA"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Start Date"
                          type="month"
                          value={item.startDate || ''}
                          onChange={(e) => updateItem(index, 'startDate', e.target.value)}
                        />
                        <Input
                          label="End Date"
                          type="month"
                          value={item.endDate || ''}
                          onChange={(e) => updateItem(index, 'endDate', e.target.value)}
                          disabled={item.current}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={item.current || false}
                            onChange={(e) => updateItem(index, 'current', e.target.checked)}
                            className="rounded border-border"
                          />
                          <span className="text-sm text-foreground">Currently working here</span>
                        </label>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Description
                        </label>
                        <textarea
                          value={item.description || ''}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          placeholder="Describe your responsibilities and achievements..."
                          className="w-full h-32 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  {type === 'education' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Degree"
                        value={item.degree || ''}
                        onChange={(e) => updateItem(index, 'degree', e.target.value)}
                        placeholder="e.g., Bachelor of Science in Computer Science"
                      />
                      <Input
                        label="School"
                        value={item.school || ''}
                        onChange={(e) => updateItem(index, 'school', e.target.value)}
                        placeholder="e.g., University of California"
                      />
                      <Input
                        label="Location"
                        value={item.location || ''}
                        onChange={(e) => updateItem(index, 'location', e.target.value)}
                        placeholder="e.g., Berkeley, CA"
                      />
                      <Input
                        label="GPA (Optional)"
                        value={item.gpa || ''}
                        onChange={(e) => updateItem(index, 'gpa', e.target.value)}
                        placeholder="e.g., 3.8"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Start Date"
                          type="month"
                          value={item.startDate || ''}
                          onChange={(e) => updateItem(index, 'startDate', e.target.value)}
                        />
                        <Input
                          label="End Date"
                          type="month"
                          value={item.endDate || ''}
                          onChange={(e) => updateItem(index, 'endDate', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Description (Optional)
                        </label>
                        <textarea
                          value={item.description || ''}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          placeholder="Relevant coursework, achievements, etc..."
                          className="w-full h-24 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  {type === 'skills' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Category"
                        value={item.category || ''}
                        onChange={(e) => updateItem(index, 'category', e.target.value)}
                        placeholder="e.g., Programming Languages"
                      />
                      <Input
                        label="Skills"
                        value={item.skills || ''}
                        onChange={(e) => updateItem(index, 'skills', e.target.value)}
                        placeholder="e.g., JavaScript, React, Node.js, Python"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text-secondary">
              <Icon name={type === 'experience' ? 'Briefcase' : type === 'education' ? 'GraduationCap' : 'Code'} size={48} className="mx-auto mb-4 text-border" />
              <p>No {type === 'experience' ? 'experience' : type === 'education' ? 'education' : 'skills'} added yet.</p>
              <p className="text-sm">Click "Add" to get started.</p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <Input
              key={field.name}
              label={field.label}
              type={field.type || 'text'}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        {renderForm()}
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-border p-6 h-fit sticky top-24">
        <h3 className="text-xl font-semibold text-foreground mb-4">Live Preview</h3>
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          <LiveResumePreview data={previewData} />
        </div>
      </div>
    </div>
  );
};

export default ResumeFormWithPreview;