import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import JobCard from './JobCard';

const MapView = ({ jobs, onJobSelect, selectedJob }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // NYC default
  const [selectedJobId, setSelectedJobId] = useState(selectedJob?.id || null);

  // Mock job locations with coordinates
  const jobsWithCoordinates = jobs?.map(job => ({
    ...job,
    coordinates: {
      lat: 40.7128 + (Math.random() - 0.5) * 0.1, // Random positions around NYC
      lng: -74.0060 + (Math.random() - 0.5) * 0.1
    }
  }));

  const handleJobMarkerClick = (job) => {
    setSelectedJobId(job?.id);
    if (onJobSelect) {
      onJobSelect(job);
    }
  };

  const handleMapCenterChange = (location) => {
    // Mock geocoding - in real app, use Google Maps Geocoding API
    const mockCoordinates = {
      'New York, NY': { lat: 40.7128, lng: -74.0060 },
      'San Francisco, CA': { lat: 37.7749, lng: -122.4194 },
      'Los Angeles, CA': { lat: 34.0522, lng: -118.2437 },
      'Chicago, IL': { lat: 41.8781, lng: -87.6298 },
      'Boston, MA': { lat: 42.3601, lng: -71.0589 }
    };

    const coords = mockCoordinates?.[location] || mapCenter;
    setMapCenter(coords);
  };

  const selectedJobData = jobsWithCoordinates?.find(job => job?.id === selectedJobId);

  return (
    <div className="flex h-[calc(100vh-200px)]">
      {/* Map Container */}
      <div className="flex-1 relative bg-muted rounded-lg overflow-hidden">
        {/* Google Maps Embed */}
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Job Locations Map"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=12&output=embed`}
          className="border-0"
        />

        {/* Map Controls */}
        <div className="absolute top-4 left-4 space-y-2">
          <div className="bg-surface border border-border rounded-lg p-2 elevation-2">
            <input
              type="text"
              placeholder="Search location..."
              className="w-48 px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              onKeyDown={(e) => {
                if (e?.key === 'Enter') {
                  handleMapCenterChange(e?.target?.value);
                }
              }}
            />
          </div>

          <div className="bg-surface border border-border rounded-lg p-2 elevation-2">
            <div className="flex flex-col space-y-1">
              <Button
                variant="ghost"
                size="sm"
                iconName="Plus"
                onClick={() => {/* Zoom in */}}
                className="w-8 h-8 p-0"
              />
              <Button
                variant="ghost"
                size="sm"
                iconName="Minus"
                onClick={() => {/* Zoom out */}}
                className="w-8 h-8 p-0"
              />
            </div>
          </div>
        </div>

        {/* Job Markers Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {jobsWithCoordinates?.slice(0, 20)?.map((job, index) => (
            <div
              key={job?.id}
              className="absolute pointer-events-auto"
              style={{
                left: `${50 + (job?.coordinates?.lng - mapCenter?.lng) * 1000}%`,
                top: `${50 - (job?.coordinates?.lat - mapCenter?.lat) * 1000}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <button
                onClick={() => handleJobMarkerClick(job)}
                className={`w-8 h-8 rounded-full border-2 border-white elevation-2 transition-all duration-200 ${
                  selectedJobId === job?.id
                    ? 'bg-primary scale-125 z-10' :'bg-accent hover:bg-accent/80 hover:scale-110'
                }`}
                title={`${job?.title} at ${job?.company?.name}`}
              >
                <Icon name="MapPin" size={16} color="white" />
              </button>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-surface border border-border rounded-lg p-3 elevation-2">
          <div className="text-sm font-medium text-foreground mb-2">Legend</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span className="text-text-secondary">Job Location</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-text-secondary">Selected Job</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-border text-xs text-text-secondary">
            Showing {Math.min(jobsWithCoordinates?.length, 20)} of {jobsWithCoordinates?.length} jobs
          </div>
        </div>
      </div>
      {/* Job Details Sidebar */}
      <div className="w-96 bg-surface border-l border-border overflow-y-auto">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            {selectedJobData ? 'Job Details' : 'Select a Job'}
          </h3>
          <p className="text-sm text-text-secondary">
            {selectedJobData ? 'Click markers on the map to view job details' : 'Click on map markers to see job information'}
          </p>
        </div>

        {selectedJobData ? (
          <div className="p-4">
            <JobCard
              job={selectedJobData}
              onBookmark={() => {}}
              onShare={() => {}}
            />
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="MapPin" size={24} className="text-text-secondary" />
            </div>
            <h4 className="text-lg font-medium text-foreground mb-2">No Job Selected</h4>
            <p className="text-sm text-text-secondary mb-4">
              Click on any job marker on the map to view detailed information about the position.
            </p>
            
            {/* Quick Location Buttons */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground mb-2">Quick Locations:</p>
              {['New York, NY', 'San Francisco, CA', 'Los Angeles, CA', 'Chicago, IL']?.map((location) => (
                <Button
                  key={location}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMapCenterChange(location)}
                  className="w-full justify-start"
                  iconName="MapPin"
                  iconPosition="left"
                >
                  {location}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Map Statistics */}
        <div className="p-4 border-t border-border bg-muted/50">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-foreground">{jobsWithCoordinates?.length}</div>
              <div className="text-xs text-text-secondary">Total Jobs</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">
                {new Set(jobsWithCoordinates.map(job => job.location))?.size}
              </div>
              <div className="text-xs text-text-secondary">Locations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;