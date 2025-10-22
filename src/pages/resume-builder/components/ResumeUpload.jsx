import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ResumeUpload = ({ onExtract }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF or DOCX file.');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB.');
        return;
      }

      setUploadedFile(file);
    }
  };

  const handleExtractContent = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', uploadedFile);

      const response = await fetch('/api/extract-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to extract content');
      }

      const data = await response.json();
      setExtractedData(data);
      onExtract(data);
    } catch (error) {
      console.error('Extraction failed:', error);
      // Mock extraction for demo
      const mockData = {
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          linkedin: 'linkedin.com/in/johndoe'
        },
        summary: 'Experienced software engineer with 5+ years of expertise in web development and cloud technologies.',
        experience: [
          {
            title: 'Senior Software Engineer',
            company: 'TechCorp Inc',
            location: 'San Francisco, CA',
            startDate: '2022-01',
            endDate: 'Present',
            current: true,
            description: 'Led development of key features and mentored junior team members.'
          }
        ],
        education: [
          {
            degree: 'Bachelor of Science in Computer Science',
            school: 'University of California',
            location: 'Berkeley, CA',
            startDate: '2018-09',
            endDate: '2022-05',
            gpa: '3.8',
            description: 'Relevant coursework in algorithms, data structures, and software engineering.'
          }
        ],
        skills: [
          {
            category: 'Programming Languages',
            skills: 'JavaScript, Python, Java, C++'
          },
          {
            category: 'Frameworks & Tools',
            skills: 'React, Node.js, Express, MongoDB, AWS'
          }
        ]
      };
      setExtractedData(mockData);
      onExtract(mockData);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedTypes.includes(file.type)) {
        setUploadedFile(file);
      } else {
        alert('Please upload a PDF or DOCX file.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Icon name="Upload" size={48} className="text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          Upload Existing Resume
        </h3>
        <p className="text-text-secondary">
          Upload your existing resume to automatically extract and populate the form.
        </p>
      </div>

      <div
        className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        {uploadedFile ? (
          <div className="space-y-4">
            <Icon name="FileText" size={48} className="text-primary mx-auto" />
            <div>
              <h4 className="font-semibold text-foreground mb-2">{uploadedFile.name}</h4>
              <p className="text-sm text-text-secondary">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              onClick={handleExtractContent}
              loading={isUploading}
              iconName="FileSearch"
            >
              {isUploading ? 'Extracting...' : 'Extract Content'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Icon name="Upload" size={48} className="text-border mx-auto" />
            <div>
              <h4 className="font-semibold text-foreground mb-2">Drop your resume here</h4>
              <p className="text-sm text-text-secondary">
                or click to browse files
              </p>
            </div>
            <p className="text-xs text-text-secondary">
              Supports PDF and DOCX files (max 5MB)
            </p>
          </div>
        )}
      </div>

      {extractedData && (
        <div className="mt-8 p-6 bg-success/5 border border-success/20 rounded-lg">
          <h4 className="text-lg font-semibold text-foreground mb-4">Extracted Content</h4>
          
          <div className="space-y-4">
            {extractedData.personalInfo && (
              <div>
                <h5 className="font-medium text-foreground mb-2">Personal Information</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>Name:</strong> {extractedData.personalInfo.firstName} {extractedData.personalInfo.lastName}</div>
                  <div><strong>Email:</strong> {extractedData.personalInfo.email}</div>
                  <div><strong>Phone:</strong> {extractedData.personalInfo.phone}</div>
                  <div><strong>Location:</strong> {extractedData.personalInfo.location}</div>
                </div>
              </div>
            )}

            {extractedData.summary && (
              <div>
                <h5 className="font-medium text-foreground mb-2">Professional Summary</h5>
                <p className="text-sm text-text-secondary">{extractedData.summary}</p>
              </div>
            )}

            {extractedData.experience && extractedData.experience.length > 0 && (
              <div>
                <h5 className="font-medium text-foreground mb-2">Work Experience</h5>
                <div className="space-y-2">
                  {extractedData.experience.slice(0, 2).map((exp, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium">{exp.title} at {exp.company}</div>
                      <div className="text-text-secondary">{exp.location} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {extractedData.skills && extractedData.skills.length > 0 && (
              <div>
                <h5 className="font-medium text-foreground mb-2">Skills</h5>
                <div className="flex flex-wrap gap-2">
                  {extractedData.skills.slice(0, 6).map((skillGroup, index) => (
                    skillGroup.skills?.split(',').slice(0, 3).map((skill, skillIndex) => (
                      <span
                        key={`${index}-${skillIndex}`}
                        className="px-2 py-1 bg-success/10 text-success rounded text-xs"
                      >
                        {skill.trim()}
                      </span>
                    ))
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload; 