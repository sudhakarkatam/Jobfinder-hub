import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import LiveResumePreview from './LiveResumePreview';

const CombinedResumeBuilder = ({ initialData, onUpdate, personalInfoFields }) => {
  const [resumeData, setResumeData] = useState(initialData || {
    personalInfo: {},
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: []
  });

  const [activeSection, setActiveSection] = useState('personalInfo');

  useEffect(() => {
    onUpdate(resumeData);
  }, [resumeData, onUpdate]);

  const handlePersonalInfoChange = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const handleSummaryChange = (value) => {
    setResumeData(prev => ({
      ...prev,
      summary: value
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          title: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        }
      ]
    }));
  };

  const updateExperience = (index, field, value) => {
    const updatedExperience = [...resumeData.experience];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    setResumeData(prev => ({
      ...prev,
      experience: updatedExperience
    }));
  };

  const removeExperience = (index) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          degree: '',
          school: '',
          location: '',
          startDate: '',
          endDate: '',
          gpa: '',
          description: ''
        }
      ]
    }));
  };

  const updateEducation = (index, field, value) => {
    const updatedEducation = [...resumeData.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setResumeData(prev => ({
      ...prev,
      education: updatedEducation
    }));
  };

  const removeEducation = (index) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    setResumeData(prev => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          category: '',
          skills: ''
        }
      ]
    }));
  };

  const updateSkill = (index, field, value) => {
    const updatedSkills = [...resumeData.skills];
    updatedSkills[index] = { ...updatedSkills[index], [field]: value };
    setResumeData(prev => ({
      ...prev,
      skills: updatedSkills
    }));
  };

  const removeSkill = (index) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-foreground">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {personalInfoFields.map((field) => (
          <Input
            key={field.name}
            label={field.label}
            type={field.type || 'text'}
            value={resumeData.personalInfo[field.name] || ''}
            onChange={(e) => handlePersonalInfoChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        ))}
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-foreground">Professional Summary</h3>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Summary
        </label>
        <textarea
          value={resumeData.summary || ''}
          onChange={(e) => handleSummaryChange(e.target.value)}
          placeholder="Write a professional summary highlighting your skills and experience..."
          className="w-full h-32 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-foreground">Work Experience</h3>
        <Button onClick={addExperience} size="sm" iconName="Plus">
          Add Experience
        </Button>
      </div>

      {resumeData.experience && resumeData.experience.length > 0 ? (
        <div className="space-y-4">
          {resumeData.experience.map((item, index) => (
            <div key={index} className="border border-border rounded-lg p-4 bg-surface">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-foreground">
                  Work Experience #{index + 1}
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeExperience(index)}
                  iconName="Trash2"
                >
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Job Title"
                  value={item.title || ''}
                  onChange={(e) => updateExperience(index, 'title', e.target.value)}
                  placeholder="e.g., Senior Software Engineer"
                />
                <Input
                  label="Company"
                  value={item.company || ''}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                  placeholder="e.g., TechCorp Inc"
                />
                <Input
                  label="Location"
                  value={item.location || ''}
                  onChange={(e) => updateExperience(index, 'location', e.target.value)}
                  placeholder="e.g., San Francisco, CA"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="month"
                    value={item.startDate || ''}
                    onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                  />
                  <Input
                    label="End Date"
                    type="month"
                    value={item.endDate || ''}
                    onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                    disabled={item.current}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={item.current || false}
                      onChange={(e) => updateExperience(index, 'current', e.target.checked)}
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
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    placeholder="Describe your responsibilities and achievements..."
                    className="w-full h-32 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-text-secondary">
          <Icon name="Briefcase" size={48} className="mx-auto mb-4 text-border" />
          <p>No experience added yet.</p>
          <p className="text-sm">Click "Add Experience" to get started.</p>
        </div>
      )}
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-foreground">Education</h3>
        <Button onClick={addEducation} size="sm" iconName="Plus">
          Add Education
        </Button>
      </div>

      {resumeData.education && resumeData.education.length > 0 ? (
        <div className="space-y-4">
          {resumeData.education.map((item, index) => (
            <div key={index} className="border border-border rounded-lg p-4 bg-surface">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-foreground">
                  Education #{index + 1}
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeEducation(index)}
                  iconName="Trash2"
                >
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Degree"
                  value={item.degree || ''}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  placeholder="e.g., Bachelor of Science in Computer Science"
                />
                <Input
                  label="School"
                  value={item.school || ''}
                  onChange={(e) => updateEducation(index, 'school', e.target.value)}
                  placeholder="e.g., University of California"
                />
                <Input
                  label="Location"
                  value={item.location || ''}
                  onChange={(e) => updateEducation(index, 'location', e.target.value)}
                  placeholder="e.g., Berkeley, CA"
                />
                <Input
                  label="GPA (Optional)"
                  value={item.gpa || ''}
                  onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                  placeholder="e.g., 3.8"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="month"
                    value={item.startDate || ''}
                    onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                  />
                  <Input
                    label="End Date"
                    type="month"
                    value={item.endDate || ''}
                    onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={item.description || ''}
                    onChange={(e) => updateEducation(index, 'description', e.target.value)}
                    placeholder="Relevant coursework, achievements, etc..."
                    className="w-full h-24 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-text-secondary">
          <Icon name="GraduationCap" size={48} className="mx-auto mb-4 text-border" />
          <p>No education added yet.</p>
          <p className="text-sm">Click "Add Education" to get started.</p>
        </div>
      )}
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-foreground">Skills</h3>
        <Button onClick={addSkill} size="sm" iconName="Plus">
          Add Skills
        </Button>
      </div>

      {resumeData.skills && resumeData.skills.length > 0 ? (
        <div className="space-y-4">
          {resumeData.skills.map((item, index) => (
            <div key={index} className="border border-border rounded-lg p-4 bg-surface">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-foreground">
                  Skills #{index + 1}
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSkill(index)}
                  iconName="Trash2"
                >
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Category"
                  value={item.category || ''}
                  onChange={(e) => updateSkill(index, 'category', e.target.value)}
                  placeholder="e.g., Programming Languages"
                />
                <Input
                  label="Skills"
                  value={item.skills || ''}
                  onChange={(e) => updateSkill(index, 'skills', e.target.value)}
                  placeholder="e.g., JavaScript, React, Node.js, Python"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-text-secondary">
          <Icon name="Code" size={48} className="mx-auto mb-4 text-border" />
          <p>No skills added yet.</p>
          <p className="text-sm">Click "Add Skills" to get started.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-8">
        <div className="flex overflow-x-auto pb-2 mb-4 border-b border-border">
          <button
            onClick={() => setActiveSection('personalInfo')}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeSection === 'personalInfo' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-foreground'}`}
          >
            Personal Info
          </button>
          <button
            onClick={() => setActiveSection('summary')}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeSection === 'summary' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-foreground'}`}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveSection('experience')}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeSection === 'experience' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-foreground'}`}
          >
            Experience
          </button>
          <button
            onClick={() => setActiveSection('education')}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeSection === 'education' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-foreground'}`}
          >
            Education
          </button>
          <button
            onClick={() => setActiveSection('skills')}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeSection === 'skills' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-foreground'}`}
          >
            Skills
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
          {activeSection === 'personalInfo' && renderPersonalInfo()}
          {activeSection === 'summary' && renderSummary()}
          {activeSection === 'experience' && renderExperience()}
          {activeSection === 'education' && renderEducation()}
          {activeSection === 'skills' && renderSkills()}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border p-6 h-fit sticky top-24">
        <h3 className="text-xl font-semibold text-foreground mb-4">Live Preview</h3>
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          <LiveResumePreview data={resumeData} />
        </div>
      </div>
    </div>
  );
};

export default CombinedResumeBuilder;