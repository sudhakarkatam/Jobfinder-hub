import React from 'react';
import { Helmet } from 'react-helmet';

/**
 * SEO Component - Minimal Version
 * Stripped down to bare essentials to fix Helmet compatibility issues
 * TODO: Gradually add back features once working
 */
const SEO = ({ title, description }) => {
  const siteTitle = 'JobFinder Hub';
  const defaultDescription = 'Find your dream job with JobFinder Hub - Browse thousands of job listings, career advice, and interview tips.';
  
  const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const pageDescription = description || defaultDescription;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
    </Helmet>
  );
};

export default SEO;

