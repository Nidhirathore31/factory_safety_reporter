import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import SafetyAnalyticsReportingDashboard from './pages/safety-analytics-reporting-dashboard';
import FactoryLandingAuthentication from './pages/factory-landing-authentication';
import SupervisorDashboardApprovalQueue from './pages/supervisor-dashboard-approval-queue';
import FormDataManagementSearch from './pages/form-data-management-search';
import WorkerDashboard from './pages/worker-dashboard-form-selection';
import PreJobSafetySurveyForm from './pages/pre-job-safety-survey-form';
import HotWorkPermitForm from "pages/worker-dashboard-form-selection/components/HotWorkPermitForm";
import ElectricalPass from "pages/worker-dashboard-form-selection/components/ElectricalPass";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<FactoryLandingAuthentication />} />
        <Route path="/safety-analytics-reporting-dashboard" element={<SafetyAnalyticsReportingDashboard />} />
        <Route path="/factory-landing-authentication" element={<FactoryLandingAuthentication />} />
        <Route path="/supervisor-dashboard-approval-queue" element={<SupervisorDashboardApprovalQueue />} />
        <Route path="/form-data-management-search" element={<FormDataManagementSearch />} />
        <Route path="/worker-dashboard-form-selection" element={<WorkerDashboard />} />
        <Route path="/pre-job-safety-survey-form" element={<PreJobSafetySurveyForm />} />
        <Route path="/hot-work-permit" element={<HotWorkPermitForm />} />
        <Route path="/electrical-pass" element={<ElectricalPass/>}/>
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
