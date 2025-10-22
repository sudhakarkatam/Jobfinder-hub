import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Icon from '../../components/AppIcon';
import GlobalHeader from '../../components/ui/GlobalHeader';

const ComingSoon = () => {
  return (
    <>
      <Helmet>
        <title>AI Resume Builder - Coming Soon | JobFinder Hub</title>
        <meta name="description" content="Our AI Resume Builder is coming soon. Stay tuned for an amazing tool to create professional resumes." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <GlobalHeader />

        <main className="pt-16 min-h-screen flex items-center justify-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Icon */}
              <div className="flex justify-center mb-8">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center shadow-2xl"
                >
                  <Icon name="Sparkles" size={64} className="text-white" />
                </motion.div>
              </div>

              {/* Heading */}
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                AI Resume Builder
              </h1>
              
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-6">
                <span className="text-primary font-semibold text-lg">Coming Soon!</span>
              </div>

              {/* Description */}
              <p className="text-xl text-text-secondary mb-8 max-w-xl mx-auto">
                We're working on something amazing. Our AI-powered resume builder will help you create 
                professional, ATS-friendly resumes in minutes.
              </p>

              {/* Features Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-surface border border-border rounded-lg p-6"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Icon name="Zap" size={24} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">AI-Powered</h3>
                  <p className="text-sm text-text-secondary">
                    Intelligent suggestions and content optimization
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-surface border border-border rounded-lg p-6"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Icon name="FileText" size={24} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">ATS-Friendly</h3>
                  <p className="text-sm text-text-secondary">
                    Optimized for Applicant Tracking Systems
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-surface border border-border rounded-lg p-6"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Icon name="Palette" size={24} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Professional</h3>
                  <p className="text-sm text-text-secondary">
                    Beautiful templates and customization
                  </p>
                </motion.div>
              </div>

              {/* Call to Action */}
              <div className="bg-muted/30 rounded-lg p-8">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Want to be notified when we launch?
                </h3>
                <p className="text-text-secondary mb-4">
                  Check back soon or contact us for updates!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/job-search-results"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
                  >
                    <Icon name="Search" size={20} className="mr-2" />
                    Browse Jobs Instead
                  </a>
                  <a
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 bg-surface border border-border text-foreground rounded-md hover:bg-muted transition-colors font-medium"
                  >
                    <Icon name="Home" size={20} className="mr-2" />
                    Back to Home
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-surface border-t border-border mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-text-secondary text-sm">
              <p>&copy; 2024 JobBoard Pro. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ComingSoon;

