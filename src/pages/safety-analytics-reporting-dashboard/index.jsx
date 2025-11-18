import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import DashboardHeader from './components/DashboardHeader';
import MetricsCard from './components/MetricsCard';
import ChartWidget from './components/ChartWidget';
import FilterPanel from './components/FilterPanel';
import ReportGenerator from './components/ReportGenerator';
import TrendAnalysis from './components/TrendAnalysis';

const SafetyAnalyticsReportingDashboard = () => {
  const [userRole] = useState('admin'); // Can be 'admin', 'supervisor', or 'worker'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for metrics
  const metricsData = [
    {
      title: 'Total Incidents',
      value: '23',
      change: '-15% from last month',
      changeType: 'positive',
      icon: 'AlertTriangle',
      color: 'error'
    },
    {
      title: 'Compliance Score',
      value: '94.2%',
      change: '+2.1% from last month',
      changeType: 'positive',
      icon: 'CheckCircle',
      color: 'success'
    },
    {
      title: 'Forms Submitted',
      value: '1,247',
      change: '+8% from last month',
      changeType: 'positive',
      icon: 'FileText',
      color: 'primary'
    },
    {
      title: 'Pending Approvals',
      value: '15',
      change: '-5 from yesterday',
      changeType: 'positive',
      icon: 'Clock',
      color: 'warning'
    }
  ];

  // Mock data for charts
  const incidentsByDepartment = [
    { name: 'Log Yard', value: 8 },
    { name: 'Veneer', value: 5 },
    { name: 'Plywood', value: 6 },
    { name: 'LVL', value: 3 },
    { name: 'Other', value: 1 }
  ];

  const hazardCategories = [
    { name: 'Slip/Trip/Fall', value: 35 },
    { name: 'Sharp Edges', value: 20 },
    { name: 'Fall from Height', value: 15 },
    { name: 'Projectiles', value: 12 },
    { name: 'Physical Hazards', value: 10 },
    { name: 'Other', value: 8 }
  ];

  const monthlyTrends = [
    { name: 'Jan', value: 18 },
    { name: 'Feb', value: 22 },
    { name: 'Mar', value: 15 },
    { name: 'Apr', value: 28 },
    { name: 'May', value: 19 },
    { name: 'Jun', value: 23 }
  ];

  const complianceByDepartment = [
    { name: 'Log Yard', value: 92 },
    { name: 'Veneer', value: 96 },
    { name: 'Plywood', value: 94 },
    { name: 'LVL', value: 98 },
    { name: 'Other', value: 89 }
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Apply filters to data
    console.log('Filters applied:', newFilters);
  };

  const handleGenerateReport = (reportConfig) => {
    console.log('Generating report:', reportConfig);
    // Simulate report generation
    alert(`Report "${reportConfig?.reportName || 'Untitled'}" is being generated. You will receive an email when it's ready.`);
  };

  const handleExpandChart = (chartType) => {
    console.log('Expanding chart:', chartType);
    // Open chart in modal or navigate to detailed view
  };

  useEffect(() => {
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={userRole} userName="Sarah Johnson" factoryName="Aspen planers ltd. - Plant A" />
      <div className="flex">
        <Sidebar 
          userRole={userRole} 
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className={`flex-1 transition-all duration-200 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'}`}>
          <div className="p-6 space-y-6">
            {/* Dashboard Header */}
            <DashboardHeader 
              userRole={userRole}
              onRefresh={handleRefresh}
              lastUpdated={lastUpdated}
            />

            {/* Filters Panel */}
            <FilterPanel 
              onFiltersChange={handleFiltersChange}
              userRole={userRole}
            />

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metricsData?.map((metric, index) => (
                <MetricsCard
                  key={index}
                  title={metric?.title}
                  value={metric?.value}
                  change={metric?.change}
                  changeType={metric?.changeType}
                  icon={metric?.icon}
                  color={metric?.color}
                />
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartWidget
                title="Incidents by Department"
                type="bar"
                data={incidentsByDepartment}
                height={300}
                onExpand={() => handleExpandChart('incidents-department')}
              />
              
              <ChartWidget
                title="Hazard Categories Distribution"
                type="pie"
                data={hazardCategories}
                height={300}
                onExpand={() => handleExpandChart('hazard-categories')}
              />
              
              <ChartWidget
                title="Monthly Incident Trends"
                type="line"
                data={monthlyTrends}
                height={300}
                onExpand={() => handleExpandChart('monthly-trends')}
              />
              
              <ChartWidget
                title="Compliance Score by Department"
                type="bar"
                data={complianceByDepartment}
                height={300}
                onExpand={() => handleExpandChart('compliance-department')}
              />
            </div>

            {/* Report Generation */}
            <ReportGenerator onGenerateReport={handleGenerateReport} />

            {/* Trend Analysis */}
            <TrendAnalysis userRole={userRole} />

            {/* Footer */}
            <div className="text-center py-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                © {new Date()?.getFullYear()} Aspen planers ltd. All rights reserved. | 
                Safety Analytics Dashboard v2.1.0 | 
                Last system update: August 8, 2025
              </p>
            </div>
          </div>
        </main>
      </div>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-300">
          <div className="bg-card p-6 rounded-lg industrial-shadow">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-foreground">Refreshing data...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyAnalyticsReportingDashboard;