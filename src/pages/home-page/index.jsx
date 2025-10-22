import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GlobalHeader from '../../components/ui/GlobalHeader';
import HeroSection from './components/HeroSection';
import FeaturedJobs from './components/FeaturedJobs';
import LatestJobs from './components/LatestJobs';
import Sidebar from './components/Sidebar';

const HomePage = () => {
  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

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
        
        <main className="pt-16">
          {/* Hero Section with Latest Jobs Carousel */}
          <HeroSection />

          {/* Main Content Area */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Featured Jobs - Full Width */}
            <div className="mb-12">
              <FeaturedJobs />
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="flex-1">
                {/* Latest Jobs */}
                <LatestJobs />
              </div>

              {/* Sidebar - Hidden on mobile, visible on desktop */}
              <div className="hidden lg:block">
                <Sidebar />
              </div>
            </div>
          </div>

          {/* Mobile Sidebar - Shown as separate section on mobile */}
          <div className="lg:hidden bg-muted/20 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <Sidebar />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-surface border-t border-border mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Company Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">JP</span>
                  </div>
                  <span className="text-xl font-semibold text-foreground">JobBoard Pro</span>
                </div>
                <p className="text-text-secondary text-sm">
                  Connecting talented professionals with amazing opportunities worldwide.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-text-secondary hover:text-primary transition-micro">
                    <span className="sr-only">Twitter</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-text-secondary hover:text-primary transition-micro">
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
                  <li><a href="#" className="hover:text-primary transition-micro">Contact</a></li>
                  <li><a href="#" className="hover:text-primary transition-micro">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-primary transition-micro">Terms of Service</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border mt-8 pt-8 text-center">
              <p className="text-text-secondary text-sm">
                © 2024 JobBoard Pro. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;