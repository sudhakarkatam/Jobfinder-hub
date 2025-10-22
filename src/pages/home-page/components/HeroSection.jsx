import React from 'react';
import LatestJobsCarousel from './LatestJobsCarousel';

const HeroSection = () => {

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 py-16 lg:py-24">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23e2e8f0%22%20fill-opacity%3D%220.3%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            Find Your Dream Job
            <span className="block text-primary">Today</span>
          </h1>
        </div>
        
        {/* Latest Jobs Carousel */}
        <LatestJobsCarousel />
      </div>
    </section>
  );
};

export default HeroSection;