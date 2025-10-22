import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
import NotFound from "pages/NotFound";
import AdminDashboard from './pages/admin-dashboard';
import JobDetailView from './pages/job-detail-view';
import AdminJobManagement from './pages/admin-job-management';
import JobSearchResults from './pages/job-search-results';
import JobCategories from './pages/job-categories';
import HomePage from './pages/home-page';
import AdminLogin from './pages/admin-login';
import ResumeBuilder from './pages/resume-builder';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home-page" element={<HomePage />} />
        <Route path="/job-detail-view/:slug" element={<JobDetailView />} />
        <Route path="/job-detail-view" element={<JobDetailView />} />
        <Route path="/job-search-results" element={<JobSearchResults />} />
        <Route path="/job-categories" element={<JobCategories />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
        
        {/* Admin Login */}
        <Route path="/admin-login" element={<AdminLogin />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin-job-management" element={
          <ProtectedRoute>
            <AdminJobManagement />
          </ProtectedRoute>
        } />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
