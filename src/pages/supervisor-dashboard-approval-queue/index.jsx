import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import TeamHierarchyPanel from './components/TeamHierarchyPanel';
import ApprovalQueueTable from './components/ApprovalQueueTable';
import FormPreviewPanel from './components/FormPreviewPanel';
import FilterToolbar from './components/FilterToolbar';
import NotificationCenter from './components/NotificationCenter';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const SupervisorDashboardApprovalQueue = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [filters, setFilters] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [integrationStatus, setIntegrationStatus] = useState({
    hris: 'connected',
    maintenance: 'connected',
    lastSync: new Date('2025-01-08T14:25:00')
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only handle shortcuts when not typing in input fields
      if (e?.target?.tagName === 'INPUT' || e?.target?.tagName === 'TEXTAREA') return;

      switch (e?.key?.toLowerCase()) {
        case 'j':
          // Move down in table
          e?.preventDefault();
          console.log('Move down');
          break;
        case 'k':
          // Move up in table
          e?.preventDefault();
          console.log('Move up');
          break;
        case 'a':
          if (selectedForm) {
            e?.preventDefault();
            handleApprove(selectedForm?.id, 'Quick approved via keyboard shortcut');
          }
          break;
        case 'r':
          if (selectedForm) {
            e?.preventDefault();
            handleReject(selectedForm?.id, 'Quick rejected via keyboard shortcut');
          }
          break;
        case 'n':
          e?.preventDefault();
          setShowNotifications(!showNotifications);
          break;
        case 'f':
          e?.preventDefault();
          document.querySelector('input[type="search"]')?.focus();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [selectedForm, showNotifications]);

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate WebSocket updates
      console.log('Checking for real-time updates...');
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (filterType, filterId) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (!newFilters?.[filterType]) {
        newFilters[filterType] = [];
      }
      
      if (newFilters?.[filterType]?.includes(filterId)) {
        newFilters[filterType] = newFilters?.[filterType]?.filter(id => id !== filterId);
      } else {
        newFilters[filterType] = [...newFilters?.[filterType], filterId];
      }
      
      return newFilters;
    });
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleFormSelect = (form) => {
    setSelectedForm(form);
  };

  const handleBulkAction = (selectedFormIds) => {
    setSelectedRows(selectedFormIds);
  };

  const handleApprove = (formId, comment) => {
    console.log('Approving form:', formId, 'with comment:', comment);
    // Here you would typically make an API call
    
    // Show success notification
    alert(`Form ${formId} approved successfully!`);
    
    // Reset selection
    setSelectedForm(null);
  };

  const handleReject = (formId, comment) => {
    console.log('Rejecting form:', formId, 'with comment:', comment);
    // Here you would typically make an API call
    
    // Show success notification
    alert(`Form ${formId} rejected with feedback.`);
    
    // Reset selection
    setSelectedForm(null);
  };

  const handleReassign = (formId) => {
    console.log('Reassigning form:', formId);
    // Here you would typically show a reassignment modal
    alert(`Reassignment dialog for form ${formId} would open here.`);
  };

  const handleNotificationClick = (formId) => {
    // Find and select the form from notification
    console.log('Navigating to form from notification:', formId);
    setShowNotifications(false);
  };

  const handleExportData = () => {
    console.log('Exporting filtered data...');
    // Generate and download report
    alert('Export functionality would generate a compliance report here.');
  };

  const getIntegrationStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getIntegrationStatusIcon = (status) => {
    switch (status) {
      case 'connected': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      default: return 'Circle';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        userRole="supervisor" 
        userName="Sarah Martinez" 
        factoryName="Aspen planers ltd. - Plant A"
        isOffline={false}
      />
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          userRole="supervisor"
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Content */}
        <main className={`flex-1 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'} industrial-transition`}>
          {/* Notifications Panel */}
          {showNotifications && (
            <NotificationCenter onNotificationClick={handleNotificationClick} />
          )}

          {/* Filter Toolbar */}
          <FilterToolbar 
            onFiltersChange={handleFiltersChange}
            activeFilters={filters}
          />

          {/* Three Panel Layout */}
          <div className="flex h-[calc(100vh-200px)]">
            {/* Left Panel - Team Hierarchy (25%) */}
            <div className="w-1/4 min-w-[300px]">
              <TeamHierarchyPanel 
                onFilterChange={handleFilterChange}
                selectedFilters={filters}
              />
            </div>

            {/* Center Panel - Approval Queue (50%) */}
            <div className="flex-1">
              <ApprovalQueueTable 
                filters={filters}
                onFormSelect={handleFormSelect}
                selectedForm={selectedForm}
                onBulkAction={handleBulkAction}
              />
            </div>

            {/* Right Panel - Form Preview (25%) */}
            <div className="w-1/4 min-w-[350px]">
              <FormPreviewPanel 
                selectedForm={selectedForm}
                onApprove={handleApprove}
                onReject={handleReject}
                onReassign={handleReassign}
              />
            </div>
          </div>

          {/* Status Bar */}
          <div className="bg-card border-t border-border p-3">
            <div className="flex items-center justify-between">
              {/* Integration Status */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={getIntegrationStatusIcon(integrationStatus?.hris)} 
                    size={16} 
                    className={getIntegrationStatusColor(integrationStatus?.hris)} 
                  />
                  <span className="text-sm text-muted-foreground">HRIS</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={getIntegrationStatusIcon(integrationStatus?.maintenance)} 
                    size={16} 
                    className={getIntegrationStatusColor(integrationStatus?.maintenance)} 
                  />
                  <span className="text-sm text-muted-foreground">Maintenance</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Last sync: {integrationStatus?.lastSync?.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center space-x-4">
                {/* Keyboard Shortcuts Help */}
                <div className="hidden lg:flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>J/K: Navigate</span>
                  <span>A: Approve</span>
                  <span>R: Reject</span>
                  <span>N: Notifications</span>
                  <span>F: Search</span>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowNotifications(!showNotifications)}
                  iconName="Bell"
                >
                  Notifications
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleExportData}
                  iconName="Download"
                >
                  Export
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => window.location?.reload()}
                  iconName="RefreshCw"
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SupervisorDashboardApprovalQueue;