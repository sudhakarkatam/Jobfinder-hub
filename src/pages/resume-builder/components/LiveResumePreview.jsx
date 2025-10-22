import React from 'react';
import Icon from '../../../components/AppIcon';

const LiveResumePreview = ({ data }) => {
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
    <div className="bg-white rounded-lg p-6 text-sm scale-90 origin-top-left">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {data.personalInfo?.firstName || 'Your'} {data.personalInfo?.lastName || 'Name'}
        </h1>
        <p className="text-base text-gray-600 mb-2">{data.personalInfo?.location || 'Your Location'}</p>
        <div className="flex justify-center flex-wrap gap-2 text-xs text-gray-600">
          {data.personalInfo?.email && (
            <span className="flex items-center">
              <Icon name="Mail" size={12} className="mr-1" />
              {data.personalInfo.email}
            </span>
          )}
          {data.personalInfo?.phone && (
            <span className="flex items-center">
              <Icon name="Phone" size={12} className="mr-1" />
              {data.personalInfo.phone}
            </span>
          )}
          {data.personalInfo?.linkedin && (
            <span className="flex items-center">
              <Icon name="Linkedin" size={12} className="mr-1" />
              LinkedIn
            </span>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">
            Professional Summary
          </h2>
          <p className="text-xs text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">
            Work Experience
          </h2>
          <div className="space-y-3">
            {data.experience.map((exp, index) => (
              <div key={index} className="border-l-2 border-blue-500 pl-2">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-semibold text-gray-900">{exp.title || 'Job Title'}</h3>
                  <span className="text-xs text-gray-600">
                    {exp.startDate ? formatDateRange(exp.startDate, exp.endDate, exp.current) : 'Date Range'}
                  </span>
                </div>
                <p className="text-xs text-gray-700 font-medium mb-1">{exp.company || 'Company'}</p>
                <p className="text-xs text-gray-600 mb-1">{exp.location || 'Location'}</p>
                <p className="text-xs text-gray-700 leading-relaxed">{exp.description || 'Job description...'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div key={index} className="border-l-2 border-green-500 pl-2">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-semibold text-gray-900">{edu.degree || 'Degree'}</h3>
                  <span className="text-xs text-gray-600">
                    {edu.startDate ? formatDateRange(edu.startDate, edu.endDate) : 'Date Range'}
                  </span>
                </div>
                <p className="text-xs text-gray-700 font-medium mb-1">{edu.school || 'School'}</p>
                <p className="text-xs text-gray-600 mb-1">{edu.location || 'Location'}</p>
                {edu.gpa && (
                  <p className="text-xs text-gray-600 mb-1">GPA: {edu.gpa}</p>
                )}
                {edu.description && (
                  <p className="text-xs text-gray-700 leading-relaxed">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">
            Skills
          </h2>
          <div className="space-y-2">
            {data.skills.map((skillGroup, index) => (
              <div key={index}>
                {skillGroup.category && (
                  <h3 className="text-xs font-semibold text-gray-900 mb-1">{skillGroup.category}</h3>
                )}
                <div className="flex flex-wrap gap-1">
                  {skillGroup.skills?.split(',').map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs"
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
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">
            Projects
          </h2>
          <div className="space-y-3">
            {data.projects.map((project, index) => (
              <div key={index} className="border-l-2 border-purple-500 pl-2">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{project.title || 'Project Title'}</h3>
                <p className="text-xs text-gray-700 mb-1">{project.description || 'Project description...'}</p>
                {project.technologies && (
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.split(',').map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-xs"
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
  );
};

export default LiveResumePreview;