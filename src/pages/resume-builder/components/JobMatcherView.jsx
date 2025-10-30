import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import JobMatchCard from './JobMatchCard';
import { matchJobsLocally } from '../../../lib/jobMatcher';
import { jobsApi } from '../../../lib/database';

const JobMatcherView = ({ onBack }) => {
  const navigate = useNavigate();
  const [useManualEntry, setUseManualEntry] = useState(true); // Temporary: manual entry mode
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [resumeData, setResumeData] = useState(null);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [error, setError] = useState(null);
  
  // Manual entry form state
  const [manualData, setManualData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    totalExperience: '',
    jobTitles: '',
    education: ''
  });
  
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setError(null);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadedFile(file);
      setError(null);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleManualSubmit = async () => {
    // Validate manual entry
    if (!manualData.skills.trim()) {
      setError('Please enter at least your skills');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    setProgress(0);
    
    try {
      // Step 1: Parse manual data
      setProcessingStatus('Preparing your profile...');
      setProgress(25);
      
      const parsedData = {
        name: manualData.name || 'Job Seeker',
        email: manualData.email || '',
        phone: manualData.phone || '',
        skills: manualData.skills.split(',').map(s => s.trim()).filter(s => s),
        totalExperience: parseInt(manualData.totalExperience) || 0,
        jobTitles: manualData.jobTitles ? manualData.jobTitles.split(',').map(s => s.trim()) : [],
        education: manualData.education ? manualData.education.split(',').map(s => s.trim()) : [],
        summary: `Professional with ${manualData.totalExperience || 0} years of experience`
      };
      
      setResumeData(parsedData);
      
      // Step 2: Fetch all jobs (no category filter)
      setProcessingStatus('Finding matching jobs...');
      setProgress(50);
      
      const { data: jobs, error: jobsError } = await jobsApi.getJobs();
      
      if (jobsError || !jobs || jobs.length === 0) {
        throw new Error('No jobs found. Please try again later.');
      }
      
      // Step 3: Match jobs using local algorithm (instant, no API call!)
      setProcessingStatus('Scoring job matches...');
      setProgress(75);
      
      const matches = matchJobsLocally(parsedData, jobs);  // Instant matching!
      setMatchedJobs(matches);
      
      setProgress(100);
      setProcessingStatus('Done!');
      
    } catch (err) {
      console.error('Job matching error:', err);
      setError(err.message || 'Failed to match jobs. Please try again.');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProcessingStatus(''), 1000);
    }
  };
  
  const handleReset = () => {
    setUploadedFile(null);
    setResumeData(null);
    setMatchedJobs([]);
    setError(null);
    setProgress(0);
  };
  
  const handleViewAllMatches = () => {
    const skills = resumeData?.skills?.join(',') || '';
    navigate(`/job-search-results?matcher=true&skills=${encodeURIComponent(skills)}`);
  };
  
  // Manual Entry Section
  if (!resumeData) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={onBack}
              iconName="ArrowLeft"
              iconPosition="left"
              className="mb-4"
            >
              Back to Dashboard
            </Button>
            
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Find Your Perfect Job Match
            </h1>
            <p className="text-xl text-text-secondary">
              Enter your skills and let AI find matching jobs
            </p>
            
            <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <Icon name="Info" size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm text-foreground">
                  <strong>Note:</strong> PDF upload requires additional libraries. For now, use manual entry below.
                  <br />
                  <span className="text-text-secondary">To enable PDF upload, run: </span>
                  <code className="bg-muted px-2 py-0.5 rounded text-xs">npm install pdfjs-dist mammoth</code>
                </div>
              </div>
            </div>
          </div>
          
          {/* Manual Entry Form */}
          <div className="bg-surface border border-border rounded-lg p-8">
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <Icon name="Sparkles" size={24} className="text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">Enter Your Details</h2>
              </div>
              <p className="text-text-secondary">Fill in your information for AI-powered job matching</p>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g., John Doe"
                  value={manualData.name}
                  onChange={(e) => setManualData({...manualData, name: e.target.value})}
                />
              </div>

              {/* Skills (Required) */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Skills <span className="text-destructive">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g., React, Node.js, Python, MongoDB, AWS"
                  value={manualData.skills}
                  onChange={(e) => setManualData({...manualData, skills: e.target.value})}
                  className="font-mono"
                />
                <p className="text-xs text-text-secondary mt-1">
                  Separate multiple skills with commas
                </p>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Total Experience (Years)
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 3"
                  value={manualData.totalExperience}
                  onChange={(e) => setManualData({...manualData, totalExperience: e.target.value})}
                  min="0"
                  max="50"
                />
              </div>

              {/* Previous Job Titles */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Previous Job Titles (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Software Engineer, Developer"
                  value={manualData.jobTitles}
                  onChange={(e) => setManualData({...manualData, jobTitles: e.target.value})}
                />
                <p className="text-xs text-text-secondary mt-1">
                  Separate multiple titles with commas
                </p>
              </div>

              {/* Education */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Education (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g., B.S. Computer Science, M.Tech"
                  value={manualData.education}
                  onChange={(e) => setManualData({...manualData, education: e.target.value})}
                />
              </div>

              {/* Email & Phone (Optional) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email (Optional)
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={manualData.email}
                    onChange={(e) => setManualData({...manualData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone (Optional)
                  </label>
                  <Input
                    type="tel"
                    placeholder="Your phone number"
                    value={manualData.phone}
                    onChange={(e) => setManualData({...manualData, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertCircle" size={20} className="text-destructive mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-destructive mb-1">Error</h4>
                    <p className="text-sm text-destructive/80">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Processing Status */}
            {isProcessing && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <Icon name="Loader2" size={24} className="animate-spin text-primary" />
                  <span className="text-foreground font-medium">{processingStatus}</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center text-sm text-text-secondary">{progress}% complete</p>
              </div>
            )}
            
            {/* Action Buttons */}
            {!isProcessing && (
              <div className="mt-8 flex gap-3 justify-center">
                <Button
                  onClick={handleManualSubmit}
                  iconName="Sparkles"
                  iconPosition="left"
                  size="lg"
                  disabled={!manualData.skills.trim()}
                >
                  Find Matching Jobs with AI
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  iconName="X"
                >
                  Clear
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Results Section
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={onBack}
            iconName="ArrowLeft"
            iconPosition="left"
            className="mb-4"
          >
            Back to Dashboard
          </Button>
          
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Your Job Matches
          </h1>
          <p className="text-xl text-text-secondary">
            Found {matchedJobs.length} jobs matching your profile
          </p>
        </div>
        
        {/* Resume Summary Card */}
        <div className="resume-summary-card bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-6 mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                {resumeData.name || 'Your Profile'}
              </h3>
              <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                {resumeData.email && (
                  <div className="flex items-center space-x-1">
                    <Icon name="Mail" size={14} />
                    <span>{resumeData.email}</span>
                  </div>
                )}
                {resumeData.phone && (
                  <div className="flex items-center space-x-1">
                    <Icon name="Phone" size={14} />
                    <span>{resumeData.phone}</span>
                  </div>
                )}
                {resumeData.totalExperience > 0 && (
                  <div className="flex items-center space-x-1">
                    <Icon name="Briefcase" size={14} />
                    <span>{resumeData.totalExperience} years experience</span>
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleReset}
              iconName="Upload"
              iconPosition="left"
            >
              Upload Different Resume
            </Button>
          </div>
          
          {/* Skills */}
          {resumeData.skills && resumeData.skills.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center space-x-2">
                <Icon name="Code" size={16} />
                <span>Your Skills</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.slice(0, 15).map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1.5 bg-primary/20 text-primary rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {resumeData.skills.length > 15 && (
                  <span className="px-3 py-1.5 bg-muted text-text-secondary rounded-full text-sm">
                    +{resumeData.skills.length - 15} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Top 5 Matches */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Top Matching Jobs
          </h2>
          
          {matchedJobs.length === 0 ? (
            <div className="text-center py-12 bg-surface border border-border rounded-lg">
              <Icon name="Search" size={48} className="text-text-secondary mx-auto mb-4" />
              <p className="text-text-secondary">
                No matching jobs found. Try uploading a different resume.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {matchedJobs.slice(0, 5).map((job) => (
                <JobMatchCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
        
        {/* View All Button */}
        {matchedJobs.length > 5 && (
          <div className="text-center">
            <Button
              onClick={handleViewAllMatches}
              size="lg"
              iconName="ArrowRight"
              iconPosition="right"
            >
              View All {matchedJobs.length} Matching Jobs
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobMatcherView;

