import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import GlobalHeader from '../../components/ui/GlobalHeader';
import ResumeDashboard from './components/ResumeDashboard';
import ModernResumeBuilder from './components/ModernResumeBuilder';
import ComingSoon from './ComingSoon';
import { downloadPDF } from '../../utils/pdfGenerator';

const ResumeBuilder = () => {
  // Resume Builder is disabled by default - show Coming Soon page
  const isResumeBuilderEnabled = false; // Change to true to enable full builder
  
  // If disabled, show Coming Soon page
  if (!isResumeBuilderEnabled) {
    return <ComingSoon />;
  }
  
  // Full builder code below (only runs if enabled)
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or 'builder'
  const [selectedResume, setSelectedResume] = useState(null);
  const [resumeData, setResumeData] = useState({
    title: "Sudhakar's Resume",
    firstName: 'Sudhakar',
    lastName: 'Reddy Katam',
    email: 'sudhakarkatam777@gmail.com',
    phone: '6302195437',
    location: 'Hyderabad',
    jobTitle: 'Computer Science Student',
    linkedin: 'linkedin.com/in/sudhakar-reddy',
    github: 'github.com/sudhakar-reddy',
    objective: 'Enthusiastic and highly motivated Computer Science Student seeking an entry-level position to apply my programming skills and knowledge of software development. I am interested in exploring different things.',
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'MallaReddy University',
        location: 'Hyderabad',
        startDate: '2021',
        endDate: '2025',
        grade: '8.58'
      },
      {
        degree: 'Intermediate',
        institution: 'Narayana Jr College',
        location: 'Vijayawada',
        startDate: '2019',
        endDate: '2021',
        grade: '96.3%'
      },
      {
        degree: 'SSC',
        institution: 'Havya High School',
        location: 'Ongole',
        startDate: '2018',
        endDate: '2019',
        grade: '9.8'
      }
    ],
    experience: [
      {
        title: 'Software Engineer Intern',
        company: 'Tech Solutions Inc.',
        location: 'Hyderabad',
        startDate: '2023',
        endDate: 'Present',
        workType: 'Internship',
        description: '• Developed web applications using React and Node.js\n• Collaborated with cross-functional teams on project delivery\n• Optimized database queries improving performance by 30%'
      }
    ],
    skills: [
      {
        category: 'Programming Languages',
        skills: 'Python, Java'
      },
      {
        category: 'Databases',
        skills: 'MySQL, Supabase'
      },
      {
        category: 'Web Technologies',
        skills: 'JavaScript, React.js, Node.js'
      },
      {
        category: 'IoT Technologies',
        skills: 'Arduino IDE'
      },
      {
        category: 'Tools/Others',
        skills: 'GitHub, Git, Salesforce'
      }
    ],
    projects: [
      {
        title: 'AI Flora Care Advisor',
        technologies: 'ChatGPT API, Arduino IDE, Sensors',
        description: 'Developed a plant monitoring system using sensor data (soil moisture, temperature, sunlight, and humidity) to provide real-time plant care suggestions. Integrated ChatGPT API to analyze sensor data and deliver personalized recommendations for optimal plant health.',
        link: 'https://github.com/sudhakar/flora-care'
      },
      {
        title: 'Stock Price Prediction with Machine Learning',
        technologies: 'Python, Machine Learning Models',
        description: 'Developed a predictive model for stock prices using historical data and machine learning techniques. Implemented KNN and Random Forest algorithms to improve the accuracy of predictions.',
        link: 'https://github.com/sudhakar/stock-prediction'
      },
      {
        title: 'PureValuePicks - Product Discovery Web App',
        technologies: 'React.js, JavaScript, HTML/CSS, Supabase',
        description: 'Built a React-based frontend platform to showcase valuable product recommendations and reviews. Included filtering, honest product picks, and a clean UI experience.',
        link: 'https://purevaluepicks.com'
      }
    ],
    certifications: [
      {
        title: 'Salesforce Developer Virtual Internship',
        organization: 'Smart Internz, Salesforce',
        date: '2023'
      },
      {
        title: 'AWS Cloud Virtual Internship',
        organization: 'AWS Academy, AICTE',
        date: '2023'
      },
      {
        title: 'Adobe Analytics Foundations',
        organization: 'Adobe',
        date: '2023'
      },
      {
        title: 'Docker for Java Developers',
        organization: 'Udemy',
        date: '2023'
      },
      {
        title: 'IoT Workshop',
        organization: 'Indian Institute of Technology (BHU), Varanasi',
        date: '2023'
      }
    ],
    languages: [
      {
        name: 'English',
        proficiency: 'Fluent'
      },
      {
        name: 'Telugu',
        proficiency: 'Native'
      },
      {
        name: 'Hindi',
        proficiency: 'Intermediate'
      }
    ],
    achievements: [
      {
        title: 'Best Student Award',
        organization: 'MallaReddy University',
        date: '2023',
        description: 'Recognized for outstanding academic performance and leadership'
      },
      {
        title: 'Hackathon Winner',
        organization: 'TechFest 2023',
        date: '2023',
        description: 'First place in the AI/ML category for innovative project development'
      }
    ],
    hackathons: [
      {
        name: 'TechFest 2023',
        organizer: 'MallaReddy University',
        date: '2023',
        result: '1st Place - AI/ML Category'
      },
      {
        name: 'CodeFest',
        organizer: 'IEEE Student Branch',
        date: '2023',
        result: '2nd Place - Web Development'
      }
    ],
    template: 'modern',
    lastUpdated: 'Updated just now'
  });


  const handleSelectResume = (resume) => {
    setSelectedResume(resume);
    setResumeData({
      ...resumeData,
      title: resume.title,
      template: resume.template,
      lastUpdated: resume.lastUpdated
    });
    setCurrentView('builder');
  };

  const handleCreateNew = (resume) => {
    setSelectedResume(resume);
    setResumeData({
      ...resumeData,
      title: resume.title,
      template: resume.template,
      lastUpdated: resume.lastUpdated
    });
    setCurrentView('builder');
  };

  const handleImportResume = () => {
    // TODO: Implement resume import functionality
    console.log('Import resume clicked');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedResume(null);
  };

  const handleUpdateResume = (updatedData) => {
    setResumeData(updatedData);
  };

  const handleDownloadPDF = async (data = resumeData) => {
    try {
      const filename = `${data.firstName || 'resume'}_${data.lastName || 'data'}.pdf`;
      const success = downloadPDF(data, filename, data.template || 'modern');
      
      if (!success) {
        alert('PDF generation failed. Please try again.');
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('PDF download failed. Please try again.');
    }
  };



  const renderContent = () => {
    if (currentView === 'dashboard') {
      return (
        <ResumeDashboard
          onSelectResume={handleSelectResume}
          onCreateNew={handleCreateNew}
          onImportResume={handleImportResume}
        />
      );
    }

    return (
      <ModernResumeBuilder
        resumeData={resumeData}
        onUpdate={handleUpdateResume}
        onSave={() => console.log('Save resume')}
        onDownload={handleDownloadPDF}
        onBack={handleBackToDashboard}
      />
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>AI Resume Builder - JobBoard Pro</title>
        <meta name="description" content="Create professional resumes with AI assistance" />
      </Helmet>
      
      {currentView === 'dashboard' && <GlobalHeader />}
      
      {renderContent()}


    </div>
  );
};

export default ResumeBuilder;