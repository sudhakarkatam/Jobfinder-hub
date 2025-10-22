import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ModernResumeBuilder = ({ resumeData, onUpdate, onSave, onDownload, onBack }) => {
  const [activeSection, setActiveSection] = useState('personal');
  const [selectedTemplate, setSelectedTemplate] = useState(resumeData.template || 'modern');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const templates = [
    { id: 'modern', name: 'Modern', preview: 'Clean and professional' },
    { id: 'classic', name: 'Classic', preview: 'Traditional layout' },
    { id: 'creative', name: 'Creative', preview: 'Stand out design' },
    { id: 'minimal', name: 'Minimal', preview: 'Simple and elegant' }
  ];

  const sections = [
    { id: 'personal', name: 'Personal Information', icon: 'User' },
    { id: 'objective', name: 'Career Objective', icon: 'Target' },
    { id: 'education', name: 'Education', icon: 'GraduationCap' },
    { id: 'experience', name: 'Work Experience', icon: 'Briefcase' },
    { id: 'skills', name: 'Skills', icon: 'Code' },
    { id: 'projects', name: 'Projects', icon: 'FolderOpen' },
    { id: 'certifications', name: 'Certifications', icon: 'Award' },
    { id: 'languages', name: 'Languages', icon: 'Globe' },
    { id: 'achievements', name: 'Achievements', icon: 'Trophy' },
    { id: 'hackathons', name: 'Hackathons', icon: 'Zap' }
  ];

  const handleInputChange = (field, value) => {
    onUpdate({
      ...resumeData,
      [field]: value
    });
  };

  const handleArrayUpdate = (field, index, value) => {
    const currentArray = resumeData[field] || [];
    const updatedArray = [...currentArray];
    updatedArray[index] = { ...updatedArray[index], ...value };
    handleInputChange(field, updatedArray);
  };

  const addArrayItem = (field, defaultItem = {}) => {
    const currentArray = resumeData[field] || [];
    const newItem = { ...defaultItem };
    handleInputChange(field, [...currentArray, newItem]);
  };

  const removeArrayItem = (field, index) => {
    const currentArray = resumeData[field] || [];
    const updatedArray = currentArray.filter((_, i) => i !== index);
    handleInputChange(field, updatedArray);
  };

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={resumeData.firstName || ''}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          placeholder="Sudhakar"
        />
        <Input
          label="Last Name"
          value={resumeData.lastName || ''}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          placeholder="Reddy"
        />
      </div>
      <Input
        label="Professional Title"
        value={resumeData.jobTitle || ''}
        onChange={(e) => handleInputChange('jobTitle', e.target.value)}
        placeholder="Full-Stack Web Developer"
      />
      <Input
        label="Email"
        type="email"
        value={resumeData.email || ''}
        onChange={(e) => handleInputChange('email', e.target.value)}
        placeholder="sudhakarkatam777@gmail.com"
      />
      <Input
        label="Phone"
        value={resumeData.phone || ''}
        onChange={(e) => handleInputChange('phone', e.target.value)}
        placeholder="6302195437"
      />
      <Input
        label="Location"
        value={resumeData.location || ''}
        onChange={(e) => handleInputChange('location', e.target.value)}
        placeholder="Hyderabad"
      />
      <Input
        label="LinkedIn Profile"
        value={resumeData.linkedin || ''}
        onChange={(e) => handleInputChange('linkedin', e.target.value)}
        placeholder="linkedin.com/in/yourprofile"
      />
      <Input
        label="GitHub/Portfolio"
        value={resumeData.github || ''}
        onChange={(e) => handleInputChange('github', e.target.value)}
        placeholder="github.com/yourusername"
      />
    </div>
  );

  const renderObjective = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Career Objective</h4>
      </div>
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={4}
        value={resumeData.objective || ''}
        onChange={(e) => handleInputChange('objective', e.target.value)}
        placeholder="Enthusiastic and highly motivated Computer Science Student seeking an entry-level position to apply my programming skills and knowledge of software development. I am interested in exploring different things."
      />
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Education</h4>
        <Button variant="outline" size="sm" iconName="Plus" onClick={() => addArrayItem('education', {})}>
          Add Education
        </Button>
      </div>
      {(resumeData.education || []).map((edu, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <h5 className="font-medium text-gray-900">Education #{index + 1}</h5>
            <Button variant="ghost" size="sm" iconName="Trash2" onClick={() => removeArrayItem('education', index)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Degree"
              value={edu.degree || ''}
              onChange={(e) => handleArrayUpdate('education', index, { degree: e.target.value })}
              placeholder="B.Tech in Computer Science"
            />
            <Input
              label="Institution"
              value={edu.institution || ''}
              onChange={(e) => handleArrayUpdate('education', index, { institution: e.target.value })}
              placeholder="MallaReddy University"
            />
            <Input
              label="Location"
              value={edu.location || ''}
              onChange={(e) => handleArrayUpdate('education', index, { location: e.target.value })}
              placeholder="Hyderabad"
            />
            <Input
              label="Start Date"
              value={edu.startDate || ''}
              onChange={(e) => handleArrayUpdate('education', index, { startDate: e.target.value })}
              placeholder="2021"
            />
            <Input
              label="End Date"
              value={edu.endDate || ''}
              onChange={(e) => handleArrayUpdate('education', index, { endDate: e.target.value })}
              placeholder="2025"
            />
            <Input
              label="CGPA/Percentage"
              value={edu.grade || ''}
              onChange={(e) => handleArrayUpdate('education', index, { grade: e.target.value })}
              placeholder="8.58"
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Work Experience</h4>
        <Button variant="outline" size="sm" iconName="Plus" onClick={() => addArrayItem('experience', {})}>
          Add Experience
        </Button>
      </div>
      {(resumeData.experience || []).map((exp, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <h5 className="font-medium text-gray-900">Experience #{index + 1}</h5>
            <Button variant="ghost" size="sm" iconName="Trash2" onClick={() => removeArrayItem('experience', index)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Job Title"
              value={exp.title || ''}
              onChange={(e) => handleArrayUpdate('experience', index, { title: e.target.value })}
              placeholder="Software Engineer"
            />
            <Input
              label="Company"
              value={exp.company || ''}
              onChange={(e) => handleArrayUpdate('experience', index, { company: e.target.value })}
              placeholder="Tech Company"
            />
            <Input
              label="Location"
              value={exp.location || ''}
              onChange={(e) => handleArrayUpdate('experience', index, { location: e.target.value })}
              placeholder="Hyderabad"
            />
            <Select
              label="Work Type"
              value={exp.workType || 'Full-Time'}
              onChange={(e) => handleArrayUpdate('experience', index, { workType: e.target.value })}
              options={[
                { value: 'Full-Time', label: 'Full-Time' },
                { value: 'Part-Time', label: 'Part-Time' },
                { value: 'Internship', label: 'Internship' },
                { value: 'Contract', label: 'Contract' },
                { value: 'Freelance', label: 'Freelance' }
              ]}
            />
            <Input
              label="Start Date"
              value={exp.startDate || ''}
              onChange={(e) => handleArrayUpdate('experience', index, { startDate: e.target.value })}
              placeholder="2022"
            />
            <Input
              label="End Date"
              value={exp.endDate || ''}
              onChange={(e) => handleArrayUpdate('experience', index, { endDate: e.target.value })}
              placeholder="Present"
            />
          </div>
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              value={exp.description || ''}
              onChange={(e) => handleArrayUpdate('experience', index, { description: e.target.value })}
              placeholder="• Developed web applications using React and Node.js&#10;• Optimized backend APIs reducing response time by 40%&#10;• Collaborated with cross-functional teams..."
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Skills</h4>
        <Button variant="outline" size="sm" iconName="Plus" onClick={() => addArrayItem('skills', {})}>
          Add Skill Category
        </Button>
      </div>
      {(resumeData.skills || []).map((skillGroup, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <h5 className="font-medium text-gray-900">Skill Category #{index + 1}</h5>
            <Button variant="ghost" size="sm" iconName="Trash2" onClick={() => removeArrayItem('skills', index)} />
          </div>
          <div className="space-y-3">
            <Input
              label="Category"
              value={skillGroup.category || ''}
              onChange={(e) => handleArrayUpdate('skills', index, { category: e.target.value })}
              placeholder="Programming Languages"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                value={skillGroup.skills || ''}
                onChange={(e) => handleArrayUpdate('skills', index, { skills: e.target.value })}
                placeholder="Python, Java, JavaScript, React, Node.js"
              />
              <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Projects</h4>
        <Button variant="outline" size="sm" iconName="Plus" onClick={() => addArrayItem('projects', {})}>
          Add Project
        </Button>
      </div>
      {(resumeData.projects || []).map((project, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <h5 className="font-medium text-gray-900">Project #{index + 1}</h5>
            <Button variant="ghost" size="sm" iconName="Trash2" onClick={() => removeArrayItem('projects', index)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Project Title"
              value={project.title || ''}
              onChange={(e) => handleArrayUpdate('projects', index, { title: e.target.value })}
              placeholder="AI Flora Care Advisor"
            />
            <Input
              label="Technologies"
              value={project.technologies || ''}
              onChange={(e) => handleArrayUpdate('projects', index, { technologies: e.target.value })}
              placeholder="React, Node.js, Python"
            />
            <Input
              label="Live Link"
              value={project.link || ''}
              onChange={(e) => handleArrayUpdate('projects', index, { link: e.target.value })}
              placeholder="https://project-link.com"
            />
          </div>
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              value={project.description || ''}
              onChange={(e) => handleArrayUpdate('projects', index, { description: e.target.value })}
              placeholder="Developed a plant monitoring system using sensor data to provide real-time plant care suggestions..."
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderCertifications = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Certifications</h4>
        <Button variant="outline" size="sm" iconName="Plus" onClick={() => addArrayItem('certifications', {})}>
          Add Certification
        </Button>
      </div>
      {(resumeData.certifications || []).map((cert, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <h5 className="font-medium text-gray-900">Certification #{index + 1}</h5>
            <Button variant="ghost" size="sm" iconName="Trash2" onClick={() => removeArrayItem('certifications', index)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Certificate Title"
              value={cert.title || ''}
              onChange={(e) => handleArrayUpdate('certifications', index, { title: e.target.value })}
              placeholder="Salesforce Developer Virtual Internship"
            />
            <Input
              label="Issuing Organization"
              value={cert.organization || ''}
              onChange={(e) => handleArrayUpdate('certifications', index, { organization: e.target.value })}
              placeholder="Smart Internz, Salesforce"
            />
            <Input
              label="Date Issued"
              value={cert.date || ''}
              onChange={(e) => handleArrayUpdate('certifications', index, { date: e.target.value })}
              placeholder="2023"
            />
            <Input
              label="Credential ID/URL"
              value={cert.credentialId || ''}
              onChange={(e) => handleArrayUpdate('certifications', index, { credentialId: e.target.value })}
              placeholder="Optional"
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderLanguages = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Languages</h4>
        <Button variant="outline" size="sm" iconName="Plus" onClick={() => addArrayItem('languages', {})}>
          Add Language
        </Button>
      </div>
      {(resumeData.languages || []).map((lang, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <h5 className="font-medium text-gray-900">Language #{index + 1}</h5>
            <Button variant="ghost" size="sm" iconName="Trash2" onClick={() => removeArrayItem('languages', index)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Language"
              value={lang.name || ''}
              onChange={(e) => handleArrayUpdate('languages', index, { name: e.target.value })}
              placeholder="English"
            />
            <Select
              label="Proficiency"
              value={lang.proficiency || 'Fluent'}
              onChange={(e) => handleArrayUpdate('languages', index, { proficiency: e.target.value })}
              options={[
                { value: 'Native', label: 'Native' },
                { value: 'Fluent', label: 'Fluent' },
                { value: 'Intermediate', label: 'Intermediate' },
                { value: 'Basic', label: 'Basic' }
              ]}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Achievements & Awards</h4>
        <Button variant="outline" size="sm" iconName="Plus" onClick={() => addArrayItem('achievements', {})}>
          Add Achievement
        </Button>
      </div>
      {(resumeData.achievements || []).map((achievement, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <h5 className="font-medium text-gray-900">Achievement #{index + 1}</h5>
            <Button variant="ghost" size="sm" iconName="Trash2" onClick={() => removeArrayItem('achievements', index)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Award Title"
              value={achievement.title || ''}
              onChange={(e) => handleArrayUpdate('achievements', index, { title: e.target.value })}
              placeholder="Best Student Award"
            />
            <Input
              label="Issuing Organization"
              value={achievement.organization || ''}
              onChange={(e) => handleArrayUpdate('achievements', index, { organization: e.target.value })}
              placeholder="University"
            />
            <Input
              label="Date"
              value={achievement.date || ''}
              onChange={(e) => handleArrayUpdate('achievements', index, { date: e.target.value })}
              placeholder="2023"
            />
          </div>
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              value={achievement.description || ''}
              onChange={(e) => handleArrayUpdate('achievements', index, { description: e.target.value })}
              placeholder="Brief description of the achievement..."
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderHackathons = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Hackathons & Competitions</h4>
        <Button variant="outline" size="sm" iconName="Plus" onClick={() => addArrayItem('hackathons', {})}>
          Add Hackathon
        </Button>
      </div>
      {(resumeData.hackathons || []).map((hackathon, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <h5 className="font-medium text-gray-900">Hackathon #{index + 1}</h5>
            <Button variant="ghost" size="sm" iconName="Trash2" onClick={() => removeArrayItem('hackathons', index)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Event Name"
              value={hackathon.name || ''}
              onChange={(e) => handleArrayUpdate('hackathons', index, { name: e.target.value })}
              placeholder="Hack the Valley"
            />
            <Input
              label="Organizer"
              value={hackathon.organizer || ''}
              onChange={(e) => handleArrayUpdate('hackathons', index, { organizer: e.target.value })}
              placeholder="Tech University"
            />
            <Input
              label="Date"
              value={hackathon.date || ''}
              onChange={(e) => handleArrayUpdate('hackathons', index, { date: e.target.value })}
              placeholder="2023"
            />
            <Input
              label="Result/Role"
              value={hackathon.result || ''}
              onChange={(e) => handleArrayUpdate('hackathons', index, { result: e.target.value })}
              placeholder="1st Place / Team Lead"
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'personal':
        return renderPersonalInfo();
      case 'objective':
        return renderObjective();
      case 'education':
        return renderEducation();
      case 'experience':
        return renderExperience();
      case 'skills':
        return renderSkills();
      case 'projects':
        return renderProjects();
      case 'certifications':
        return renderCertifications();
      case 'languages':
        return renderLanguages();
      case 'achievements':
        return renderAchievements();
      case 'hackathons':
        return renderHackathons();
      default:
        return renderPersonalInfo();
    }
  };

  const renderResumePreview = () => {
    const fullName = `${resumeData.firstName || ''} ${resumeData.lastName || ''}`.trim();
    
    const getTemplateStyles = () => {
      switch (selectedTemplate) {
        case 'modern':
          return 'bg-white border border-gray-200 rounded-lg p-8 h-full overflow-y-auto';
        case 'classic':
          return 'bg-white border-2 border-gray-300 rounded-none p-6 h-full overflow-y-auto';
        case 'creative':
          return 'bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-8 h-full overflow-y-auto';
        case 'minimal':
          return 'bg-white border border-gray-100 rounded-lg p-6 h-full overflow-y-auto';
        default:
          return 'bg-white border border-gray-200 rounded-lg p-8 h-full overflow-y-auto';
      }
    };

    const getHeaderStyles = () => {
      switch (selectedTemplate) {
        case 'modern':
          return 'text-center mb-8';
        case 'classic':
          return 'text-left mb-6 border-b-2 border-gray-300 pb-4';
        case 'creative':
          return 'text-center mb-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg -m-6 mb-6';
        case 'minimal':
          return 'text-center mb-6';
        default:
          return 'text-center mb-8';
      }
    };

    const getNameStyles = () => {
      switch (selectedTemplate) {
        case 'modern':
          return 'text-3xl font-bold text-gray-900 mb-2';
        case 'classic':
          return 'text-2xl font-bold text-gray-900 mb-2';
        case 'creative':
          return 'text-3xl font-bold text-white mb-2';
        case 'minimal':
          return 'text-2xl font-light text-gray-900 mb-2';
        default:
          return 'text-3xl font-bold text-gray-900 mb-2';
      }
    };

    const getSectionStyles = () => {
      switch (selectedTemplate) {
        case 'modern':
          return 'text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-2';
        case 'classic':
          return 'text-lg font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-2';
        case 'creative':
          return 'text-xl font-semibold text-purple-800 mb-3 border-b-2 border-purple-300 pb-2';
        case 'minimal':
          return 'text-lg font-medium text-gray-900 mb-3 border-b border-gray-200 pb-1';
        default:
          return 'text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-2';
      }
    };
    
    return (
      <div className={getTemplateStyles()} data-testid="resume-preview">
        {/* Header */}
        <div className={getHeaderStyles()}>
          <h1 className={getNameStyles()}>
            {fullName || 'YOUR NAME'}
          </h1>
          <p className="text-lg text-gray-600 mb-3">
            {resumeData.jobTitle || 'Your Job Title'}
          </p>
          <div className="flex justify-center space-x-4 text-sm text-gray-600 mb-2">
            {resumeData.email && (
              <span>{resumeData.email}</span>
            )}
            {resumeData.phone && (
              <span>{resumeData.phone}</span>
            )}
            {resumeData.location && (
              <span>{resumeData.location}</span>
            )}
          </div>
          <div className="flex justify-center space-x-4 text-sm text-blue-600">
            {resumeData.linkedin && <span>LinkedIn</span>}
            {resumeData.github && <span>GitHub</span>}
            {resumeData.portfolio && <span>Portfolio</span>}
          </div>
        </div>

        {/* Objective */}
        {resumeData.objective && (
          <div className="mb-6">
            <h2 className={getSectionStyles()}>
              OBJECTIVE
            </h2>
            <p className="text-gray-700 leading-relaxed">{resumeData.objective}</p>
          </div>
        )}

        {/* Education */}
        {resumeData.education?.length > 0 && (
          <div className="mb-6">
            <h2 className={getSectionStyles()}>
              EDUCATION
            </h2>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-700">{edu.institution}, {edu.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">{edu.startDate} - {edu.endDate}</p>
                    {edu.grade && <p className="text-gray-600">CGPA: {edu.grade}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {resumeData.skills?.length > 0 && (
          <div className="mb-6">
            <h2 className={getSectionStyles()}>
              SKILLS
            </h2>
            {resumeData.skills.map((skillGroup, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{skillGroup.category}:</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.skills?.split(',').map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {resumeData.projects?.length > 0 && (
          <div className="mb-6">
            <h2 className={getSectionStyles()}>
              PROJECTS
            </h2>
            {resumeData.projects.map((project, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{project.title}</h3>
                  {project.link && <span className="text-blue-600 text-sm">Link</span>}
                </div>
                {project.technologies && (
                  <p className="text-sm text-gray-600 mb-2">Technologies: {project.technologies}</p>
                )}
                <p className="text-gray-700">{project.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Experience */}
        {resumeData.experience?.length > 0 && (
          <div className="mb-6">
            <h2 className={getSectionStyles()}>
              EXPERIENCE
            </h2>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                  <span className="text-gray-600">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-gray-700 mb-2">{exp.company}, {exp.location}</p>
                <p className="text-gray-700 whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {resumeData.certifications?.length > 0 && (
          <div className="mb-6">
            <h2 className={getSectionStyles()}>
              CERTIFICATIONS
            </h2>
            <ul className="list-disc list-inside space-y-1">
              {resumeData.certifications.map((cert, index) => (
                <li key={index} className="text-gray-700">
                  {cert.title} - {cert.organization} ({cert.date})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages */}
        {resumeData.languages?.length > 0 && (
          <div className="mb-6">
            <h2 className={getSectionStyles()}>
              LANGUAGES
            </h2>
            <div className="flex flex-wrap gap-4">
              {resumeData.languages.map((lang, index) => (
                <span key={index} className="text-gray-700">
                  {lang.name} ({lang.proficiency})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {resumeData.achievements?.length > 0 && (
          <div className="mb-6">
            <h2 className={getSectionStyles()}>
              ACHIEVEMENTS
            </h2>
            {resumeData.achievements.map((achievement, index) => (
              <div key={index} className="mb-2">
                <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                <p className="text-gray-700">{achievement.organization} ({achievement.date})</p>
                {achievement.description && (
                  <p className="text-gray-600 text-sm">{achievement.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Hackathons */}
        {resumeData.hackathons?.length > 0 && (
          <div className="mb-6">
            <h2 className={getSectionStyles()}>
              HACKATHONS & COMPETITIONS
            </h2>
            {resumeData.hackathons.map((hackathon, index) => (
              <div key={index} className="mb-2">
                <h3 className="font-semibold text-gray-900">{hackathon.name}</h3>
                <p className="text-gray-700">{hackathon.organizer} ({hackathon.date})</p>
                <p className="text-gray-600">{hackathon.result}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} iconName="ArrowLeft">
              Back to Dashboard
            </Button>
            <div className="text-2xl font-bold text-gray-900">
              {resumeData.title || "Sudhakar's Resume"}
            </div>
            <div className="text-sm text-gray-500">
              {resumeData.lastUpdated || "Updated just now"}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" iconName="Palette" onClick={() => setShowTemplateSelector(true)}>
              Change Template
            </Button>
            <Button variant="outline" iconName="Share" />
            <Button variant="outline" iconName="Sparkles">
              Try AI Review
            </Button>
            <Button onClick={() => onDownload({ ...resumeData, template: selectedTemplate })} className="bg-green-600 hover:bg-green-700" iconName="Download">
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {/* Section Navigation */}
              <div className="mb-6">
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon name={section.icon} size={20} />
                      <span className="text-sm font-medium">{section.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section Content */}
              <div className="border-t border-gray-200 pt-6">
                {renderSectionContent()}
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Resume Preview</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" iconName="Eye">
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" iconName="Download" onClick={() => onDownload({ ...resumeData, template: selectedTemplate })}>
                    Download
                  </Button>
                </div>
              </div>
              <div className="h-[800px]">
                {renderResumePreview()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Choose Template</h2>
              <Button variant="ghost" onClick={() => setShowTemplateSelector(false)} iconName="X" />
            </div>

            {/* Template Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {template.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {template.preview}
                        </p>
                      </div>
                      {selectedTemplate === template.id && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Icon name="Check" size={16} className="text-white" />
                        </div>
                      )}
                    </div>

                    {/* Template Preview */}
                    <div className="bg-gray-50 rounded p-4 h-32 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 mb-1">
                          {resumeData.firstName || 'YOUR'} {resumeData.lastName || 'NAME'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {resumeData.jobTitle || 'Your Job Title'}
                        </div>
                      </div>
                    </div>

                    {/* Template Features */}
                    <div className="mt-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Icon name="CheckCircle" size={16} className="text-green-500" />
                        <span>Professional layout</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Icon name="CheckCircle" size={16} className="text-green-500" />
                        <span>ATS friendly</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Icon name="CheckCircle" size={16} className="text-green-500" />
                        <span>Print ready</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <Button variant="outline" onClick={() => setShowTemplateSelector(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                onUpdate({ ...resumeData, template: selectedTemplate });
                setShowTemplateSelector(false);
              }}>
                Apply Template
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernResumeBuilder; 