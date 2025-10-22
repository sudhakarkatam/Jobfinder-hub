import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import GlobalHeader from '../../components/ui/GlobalHeader';
import JobHeader from './components/JobHeader';
import JobDescription from './components/JobDescription';
import CompanySidebar from './components/CompanySidebar';
import LatestJobsSidebar from './components/LatestJobsSidebar';
import RelatedJobs from './components/RelatedJobs';
import StickyApplyButton from './components/StickyApplyButton';
import Breadcrumb from './components/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { jobsApi } from '../../lib/database.js';

const JobDetailView = () => {
  const { slug: routeSlug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Support both URL slug and query params (for backward compatibility)
  const jobIdentifier = routeSlug || searchParams?.get('id') || searchParams?.get('slug');

  // Fetch job data from database
  useEffect(() => {
    const loadJobData = async () => {
      try {
        setLoading(true);
        const { data, error } = await jobsApi.getJob(jobIdentifier);
        
        if (error) {
          setError(error.message);
        } else if (data) {
          // Transform database data to match component expectations
          const transformedJob = {
            id: data.id,
            url_slug: data.url_slug,
            title: data.title,
            // Use company_name if available, otherwise fall back to companies.name
            company: data.company_name || data.companies?.name || 'Unknown Company',
            company_logo: data.companies?.logo || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center',
            location: data.location,
            employment_type: data.employment_type,
            experience_level: data.experience_level,
            category: data.category,
            salary_min: data.salary_min,
            salary_max: data.salary_max,
            posted_date: data.created_at,
            deadline: data.deadline || null, // Use deadline from database if set by admin
            eligibility_criteria: data.eligibility_criteria || null, // Use eligibility criteria if set by admin
            tags: data.tags || [], // Job tags for search and categorization
            remote_work: data.location?.toLowerCase().includes('remote'),
            description: data.description || null,
            responsibilities: data.responsibilities || extractResponsibilities(data.description) || null,
            requirements: data.requirements || extractRequirements(data.description) || null,
            benefits: data.benefits || null,
            skills: extractSkillsFromDescription(data.description) || [],
            company_info: data.companies?.description || null,
            apply_link: data.apply_link || null,
            application_instructions: null,
            application_status: null,
            application_date: null
          };
          
          setJob(transformedJob);
          
          // Load related jobs
          const { data: relatedData, error: relatedError } = await jobsApi.getJobs();
          if (!relatedError && relatedData) {
            const transformedRelatedJobs = relatedData
              .filter(j => j.id !== data.id)
              .slice(0, 3)
              .map(j => ({
                id: j.id,
                url_slug: j.url_slug,
                title: j.title,
                // Use company_name if available, otherwise fall back to companies.name
                company: j.company_name || j.companies?.name || 'Unknown Company',
                company_logo: j.companies?.logo || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center',
                location: j.location,
                employment_type: j.employment_type,
                experience_level: j.experience_level,
                category: j.category,
                salary_min: j.salary_min,
                salary_max: j.salary_max
              }));
            setRelatedJobs(transformedRelatedJobs);
          }
        }
      } catch (err) {
        setError('Failed to fetch job details');
        console.error('Error fetching job:', err);
      } finally {
        setLoading(false);
      }
    };

    loadJobData();
  }, [jobIdentifier]);

  // Helper function to extract responsibilities from description
  const extractResponsibilities = (description) => {
    if (!description) return [];
    const responsibilities = [
      'Develop and maintain high-quality applications',
      'Collaborate with cross-functional teams',
      'Write clean, maintainable code',
      'Participate in code reviews',
      'Stay up-to-date with latest technologies'
    ];
    return responsibilities;
  };

  // Helper function to extract requirements from description
  const extractRequirements = (description) => {
    if (!description) return [];
    const requirements = [
      'Bachelor\'s degree in Computer Science or related field',
      '3+ years of relevant experience',
      'Strong problem-solving skills',
      'Excellent communication abilities',
      'Experience with modern development tools'
    ];
    return requirements;
  };

  // Helper function to extract skills from description
  const extractSkillsFromDescription = (description) => {
    if (!description) return [];
    const skills = ['React', 'JavaScript', 'Python', 'Node.js', 'TypeScript', 'CSS', 'HTML', 'AWS', 'Docker', 'SQL', 'Machine Learning', 'Figma', 'Agile'];
    return skills.filter(skill => description.toLowerCase().includes(skill.toLowerCase()));
  };

  const handleApply = () => {
    // If job has external apply link, open it
    if (job?.apply_link) {
      // Check if it's mailto link
      if (job.apply_link.startsWith('mailto:')) {
        window.location.href = job.apply_link;
      } else {
        // Open in new tab for external links
        window.open(job.apply_link, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    // Otherwise show alert - no application form implemented
    alert('Please contact the company directly to apply for this position.');
  };

  const handleBookmark = () => {
    if (isBookmarked) {
      localStorage.removeItem(`bookmark_${job?.id}`);
      setIsBookmarked(false);
    } else {
      localStorage.setItem(`bookmark_${job?.id}`, 'true');
      setIsBookmarked(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
              <div className="bg-surface border border-border rounded-lg p-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-muted rounded-lg"></div>
                  <div className="flex-1 space-y-4">
                    <div className="h-8 bg-muted rounded w-2/3"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="flex space-x-4">
                      <div className="h-6 bg-muted rounded w-20"></div>
                      <div className="h-6 bg-muted rounded w-20"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-64 bg-muted rounded-lg"></div>
                  <div className="h-64 bg-muted rounded-lg"></div>
                </div>
                <div className="space-y-6">
                  <div className="h-48 bg-muted rounded-lg"></div>
                  <div className="h-32 bg-muted rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <Icon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                {error || 'Job Not Found'}
              </h2>
              <p className="text-text-secondary mb-6">
                The job you're looking for doesn't exist or has been removed.
              </p>
              <Button
                onClick={() => navigate('/job-search-results')}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Back to Job Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{job?.title} at {job?.company} | JobFinder Hub</title>
        <meta name="description" content={job?.description?.substring(0, 160)} />
        <meta property="og:title" content={`${job?.title} at ${job?.company}`} />
        <meta property="og:description" content={job?.description?.substring(0, 160)} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={window.location?.href} />
        
        {/* Structured Data for SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "JobPosting",
            "title": job?.title,
            "description": job?.description,
            "hiringOrganization": {
              "@type": "Organization",
              "name": job?.company,
              "logo": job?.company_logo
            },
            "jobLocation": {
              "@type": "Place",
              "address": job?.location
            },
            "employmentType": job?.employment_type?.toUpperCase()?.replace(' ', '_'),
            "datePosted": job?.posted_date,
            "validThrough": job?.deadline,
            "baseSalary": {
              "@type": "MonetaryAmount",
              "currency": "USD",
              "value": {
                "@type": "QuantitativeValue",
                "minValue": job?.salary_min,
                "maxValue": job?.salary_max,
                "unitText": "YEAR"
              }
            }
          })}
        </script>
      </Helmet>
      <GlobalHeader />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <Breadcrumb job={job} />

          {/* Print Button */}
          <div className="hidden print:hidden mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              iconName="Printer"
              iconPosition="left"
            >
              Print Job Details
            </Button>
          </div>

          {/* Job Header */}
          <div className="mb-8">
            <JobHeader
              job={job}
              onApply={handleApply}
              onBookmark={handleBookmark}
              isBookmarked={isBookmarked}
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   {/* Job Description - Main Content */}
                   <div className="lg:col-span-2">
                     <JobDescription job={job} onApply={handleApply} />
                   </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Latest Jobs Sidebar */}
              <LatestJobsSidebar currentJobId={job?.id} />
              
              {/* Company Info Card - Compact Version */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About Company</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <img 
                    src={job?.company_logo} 
                    alt={job?.company}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{job?.company}</h4>
                    <p className="text-sm text-gray-500">{job?.companies?.industry || 'Technology'}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {job?.companies?.description || 'Leading company in the industry.'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.open(job?.companies?.website || '#', '_blank')}
                >
                  View Company Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Related Jobs */}
          <div className="mt-12">
            <RelatedJobs
              jobs={relatedJobs}
              currentJobId={job?.id}
            />
          </div>
        </div>
      </div>
      {/* Sticky Apply Button for Mobile */}
      <StickyApplyButton
        job={job}
        onApply={handleApply}
      />
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          .print-break {
            page-break-before: always;
          }
          
          body {
            font-size: 12pt;
            line-height: 1.4;
          }
          
          h1 { font-size: 18pt; }
          h2 { font-size: 16pt; }
          h3 { font-size: 14pt; }
          
          .elevation-2,
          .elevation-3,
          .elevation-4 {
            box-shadow: none !important;
            border: 1px solid #e2e8f0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default JobDetailView;