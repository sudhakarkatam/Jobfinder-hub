import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ResumeDashboard = ({ onSelectResume, onCreateNew, onImportResume, onJobMatcher }) => {
  const [resumes, setResumes] = useState([
    {
      id: 1,
      title: "Sudhakar's Resume",
      template: "classic",
      lastUpdated: "Updated just now",
      preview: {
        name: "SUDHAKAR REDDY KATAM",
        email: "sudhakarkatam777@gmail.com",
        phone: "6302195437",
        location: "Hyderabad",
        jobTitle: "Computer Science Student"
      }
    },
    {
      id: 2,
      title: "Sudhakar's Resume",
      template: "modern",
      lastUpdated: "2 hours ago",
      preview: {
        name: "SUDHAKAR REDDY KATAM",
        email: "sudhakarkatam777@gmail.com",
        education: "B.Tech in Computer Science, MallaReddy University"
      }
    }
  ]);

  const handleCreateNew = () => {
    const newResume = {
      id: Date.now(),
      title: "New Resume",
      template: "modern",
      lastUpdated: "Just created",
      preview: {}
    };
    setResumes([...resumes, newResume]);
    onCreateNew(newResume);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-gray-900">Resume Builder</div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Dashboard</span>
              <Icon name="ChevronRight" size={16} />
              <span>Resume Builder</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onImportResume} iconName="Upload">
              Import Resume
            </Button>
            <Button onClick={handleCreateNew} className="bg-green-600 hover:bg-green-700">
              Create New
            </Button>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-white px-6 py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Sudhakar!</h1>
          <p className="text-gray-600">Create and manage your professional resumes</p>
        </div>
      </div>

      {/* Resume Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Existing Resumes */}
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelectResume(resume)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{resume.title}</h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" iconName="Share" />
                    <Button variant="ghost" size="sm" iconName="MoreVertical" />
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-2">{resume.lastUpdated}</div>
                  <div className="bg-gray-50 rounded p-4 min-h-[120px]">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 mb-1">
                        {resume.preview.name || "YOUR NAME"}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {resume.preview.email || "your.email@example.com"}
                      </div>
                      {resume.preview.jobTitle && (
                        <div className="text-sm text-gray-700 font-medium">
                          {resume.preview.jobTitle}
                        </div>
                      )}
                      {resume.preview.education && (
                        <div className="text-xs text-gray-600 mt-2">
                          {resume.preview.education}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" iconName="Eye">
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" iconName="Download">
                      Download
                    </Button>
                  </div>
                  <Button size="sm" iconName="Edit">
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Find Matching Jobs Card */}
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer flex items-center justify-center min-h-[300px]">
            <div className="text-center p-6" onClick={onJobMatcher}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="FileSearch" size={32} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Matching Jobs</h3>
              <p className="text-gray-600 text-sm">Upload your resume and discover jobs that match your skills</p>
              <div className="mt-4 inline-flex items-center space-x-2 text-sm text-primary font-medium">
                <Icon name="Sparkles" size={16} />
                <span>AI-Powered Matching</span>
              </div>
            </div>
          </div>

          {/* Create New Resume Card */}
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer flex items-center justify-center min-h-[300px]">
            <div className="text-center" onClick={handleCreateNew}>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Plus" size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Resume</h3>
              <p className="text-gray-600 text-sm">Start with a fresh template</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeDashboard; 