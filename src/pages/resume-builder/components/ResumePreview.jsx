import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ResumePreview = ({ data, onEdit, onDownload }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const formatDateRange = (startDate, endDate, current = false) => {
    const start = formatDate(startDate);
    const end = current ? 'Present' : formatDate(endDate);
    return `${start} - ${end}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-foreground">Resume Preview</h3>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onEdit} iconName="Edit">
            Edit Resume
          </Button>
          <Button onClick={onDownload} iconName="Download">
            Download PDF
          </Button>
        </div>
      </div>

      <div className="bg-white border border-border rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {data.personalInfo?.firstName} {data.personalInfo?.lastName}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{data.personalInfo?.location}</p>
          <div className="flex justify-center space-x-4 text-sm text-gray-600">
            {data.personalInfo?.email && (
              <span className="flex items-center">
                <Icon name="Mail" size={16} className="mr-1" />
                {data.personalInfo.email}
              </span>
            )}
            {data.personalInfo?.phone && (
              <span className="flex items-center">
                <Icon name="Phone" size={16} className="mr-1" />
                {data.personalInfo.phone}
              </span>
            )}
            {data.personalInfo?.linkedin && (
              <span className="flex items-center">
                <Icon name="Linkedin" size={16} className="mr-1" />
                LinkedIn
              </span>
            )}
          </div>
        </div>

        {/* Professional Summary */}
        {data.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-2">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{data.summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {data.experience && data.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">
              Work Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                    <span className="text-sm text-gray-600">
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  <p className="text-gray-700 font-medium mb-1">{exp.company}</p>
                  <p className="text-gray-600 text-sm mb-3">{exp.location}</p>
                  <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                    <span className="text-sm text-gray-600">
                      {formatDateRange(edu.startDate, edu.endDate)}
                    </span>
                  </div>
                  <p className="text-gray-700 font-medium mb-1">{edu.school}</p>
                  <p className="text-gray-600 text-sm mb-2">{edu.location}</p>
                  {edu.gpa && (
                    <p className="text-gray-600 text-sm mb-2">GPA: {edu.gpa}</p>
                  )}
                  {edu.description && (
                    <p className="text-gray-700 leading-relaxed">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">
              Skills
            </h2>
            <div className="space-y-4">
              {data.skills.map((skillGroup, index) => (
                <div key={index}>
                  {skillGroup.category && (
                    <h3 className="font-semibold text-gray-900 mb-2">{skillGroup.category}</h3>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.skills?.split(',').map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">
              Projects
            </h2>
            <div className="space-y-4">
              {data.projects.map((project, index) => (
                <div key={index} className="border-l-4 border-purple-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.title}</h3>
                  <p className="text-gray-700 mb-2">{project.description}</p>
                  {project.technologies && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.split(',').map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePreview; 