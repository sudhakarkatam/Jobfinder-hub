import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import GlobalHeader from '../../components/ui/GlobalHeader';
import HeroSection from './components/HeroSection';
import FeaturedJobs from './components/FeaturedJobs';
import JobCategories from './components/JobCategories';
import ITSoftwareJobs from './components/ITSoftwareJobs';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  const handleNewsletterSubmit = (e) => {
    e?.preventDefault();
    if (email?.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setIsSubscribed(false);
      }, 3000);
    }
  };

  return (
    <>
      <Helmet>
        <title>JobFinder Hub - Find Your Dream Job Today</title>
        <meta 
          name="description" 
          content="Discover thousands of job opportunities from top companies worldwide. Search jobs by title, location, and company. Your next career move is just a search away." 
        />
        <meta name="keywords" content="jobs, careers, employment, job search, hiring, remote jobs, full-time jobs" />
        <meta property="og:title" content="JobFinder Hub - Find Your Dream Job Today" />
        <meta property="og:description" content="Discover thousands of job opportunities from top companies worldwide." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/home-page" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <GlobalHeader />
        
        <main className="pt-12 md:pt-16">
          {/* Hero Section with Latest Jobs Carousel */}
          <HeroSection />

          {/* Featured Jobs */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <FeaturedJobs />
          </div>

          {/* Job Categories */}
          <JobCategories />

          {/* IT/Software Jobs */}
          <ITSoftwareJobs />
        </main>

        {/* Footer */}
        <footer className="bg-surface border-t border-border mt-12 md:mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {/* Company Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">JF</span>
                  </div>
                  <span className="text-xl font-semibold text-foreground">JobFinder Hub</span>
                </div>
                <p className="text-text-secondary text-sm">
                  Connecting talented professionals with amazing opportunities worldwide.
                </p>
                <div className="flex space-x-4">
                  <a href="https://twitter.com/your_handle" className="text-text-secondary hover:text-primary transition-micro">
                    <span className="sr-only">Twitter</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/in/your_profile" className="text-text-secondary hover:text-primary transition-micro">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* For Job Seekers */}
              <div className="space-y-4">
                <h4 className="text-foreground font-semibold">For Job Seekers</h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li><a href="#" className="hover:text-primary transition-micro">Browse Jobs</a></li>
                  <li><a href="#" className="hover:text-primary transition-micro">Create Profile</a></li>
                  <li><a href="#" className="hover:text-primary transition-micro">Job Alerts</a></li>
                  <li><a href="#" className="hover:text-primary transition-micro">Career Advice</a></li>
                </ul>
              </div>

              {/* Company */}
              <div className="space-y-4">
                <h4 className="text-foreground font-semibold">Company</h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li><a href="#" className="hover:text-primary transition-micro">About Us</a></li>
                  <li><a href="mailto:sudhakarkatam777@gmail.com?subject=JobFinder%20Hub%20inquiry" className="hover:text-primary transition-micro">Contact</a></li>
                  <li><a href="#" className="hover:text-primary transition-micro">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-primary transition-micro">Terms of Service</a></li>
                </ul>
              </div>

              {/* Job Alerts */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-lg p-6">
                  <div className="text-center mb-4">
                    <Icon name="Mail" size={24} className="text-primary mx-auto mb-2" />
                    <h4 className="text-lg font-semibold text-foreground mb-2">
                      Job Alerts
                    </h4>
                    <p className="text-sm text-text-secondary">
                      Get notified about new jobs matching your preferences
                    </p>
                  </div>

                  {!isSubscribed ? (
                    <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e?.target?.value)}
                        required
                        className="text-sm"
                      />
                      <Button
                        type="submit"
                        size="sm"
                        className="w-full"
                        iconName="Bell"
                        iconPosition="left"
                      >
                        Subscribe to Alerts
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-4">
                      <div className="inline-flex items-center space-x-2 text-accent mb-2">
                        <Icon name="CheckCircle" size={20} />
                        <span className="font-medium">Subscribed!</span>
                      </div>
                      <p className="text-sm text-text-secondary">
                        You'll receive job alerts in your inbox
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-border mt-8 pt-8 text-center">
              <p className="text-text-secondary text-sm">
                © 2024 JobFinder Hub. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;