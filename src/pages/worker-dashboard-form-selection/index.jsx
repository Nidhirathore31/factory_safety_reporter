import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import FormSelectionCard from './components/FormSelectionCard';
import RecentSubmissionsTable from './components/RecentSubmissionsTable';
import QuickStatsPanel from './components/QuickStatsPanel';
import SafetyTipCard from './components/SafetyTipCard';
import ConnectionStatusCard from './components/ConnectionStatusCard';
import NotificationBadge from './components/NotificationBadge';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import HotWorkPermitCard from './components/HotWorkPermitCard';
import ElectricalPassCard from './components/ElectricalPassCard';

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Mock data for worker dashboard
  const workerInfo = {
    name: "John Martinez",
    employeeId: "EMP-2024-0156",
    department: "Log Yard",
    shift: "Day Shift A",
    startTime: "06:00 AM",
    endTime: "02:00 PM"
  };

  const quickStats = {
    totalSubmissions: 23,
    pendingApprovals: 2,
    safetyScore: 94,
    incidentFreeDays: 127
  };

  const recentSubmissions = [
    {
      id: 1,
      type: "operational",
      date: "Jan 08, 2025",
      time: "10:30 AM",
      status: "approved",
      supervisor: "Sarah Johnson",
      feedback: "Good attention to detail"
    },
    {
      id: 2,
      type: "maintenance",
      date: "Jan 07, 2025",
      time: "02:15 PM",
      status: "pending",
      supervisor: "Mike Chen",
      feedback: null
    },
    {
      id: 3,
      type: "operational",
      date: "Jan 06, 2025",
      time: "11:45 AM",
      status: "under_review",
      supervisor: "Sarah Johnson",
      feedback: "Reviewing hazard assessment"
    },
    {
      id: 4,
      type: "maintenance",
      date: "Jan 05, 2025",
      time: "09:20 AM",
      status: "approved",
      supervisor: "Mike Chen",
      feedback: "Excellent documentation"
    },
    {
      id: 5,
      type: "hot work permit",
      date: "Aug 18, 2025",
      time: "02:20 PM",
      status: "pending",
      supervisor: "Luke Fien",
      feedback: "Well maintained"
    }
  ];

  const safetyTips = [
    {
      title: "Proper Lifting Technique",
      description: "Always bend your knees and keep your back straight when lifting heavy objects. Get help for items over 50 pounds.",
      category: "Ergonomics"
    },
    {
      title: "PPE Inspection",
      description: "Check your personal protective equipment daily before starting work. Replace damaged items immediately.",
      category: "Safety Equipment"
    },
    {
      title: "Hazard Communication",
      description: "Report any unsafe conditions or near-miss incidents immediately to your supervisor. Your safety matters.",
      category: "Communication"
    },
    {
      title: "Lockout/Tagout Procedures",
      description: "Never bypass LOTO procedures. Verify energy isolation before beginning maintenance work on equipment.",
      category: "Maintenance Safety"
    }
  ];

  const mockNotifications = [
    {
      id: 1,
      type: "feedback",
      title: "Supervisor Feedback",
      message: "Your operational safety form from Jan 07 has been approved with commendations.",
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      type: "update",
      title: "Form Update Required",
      message: "Please update your emergency contact information in the system.",
      timestamp: "1 day ago"
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Keyboard shortcuts
    const handleKeyPress = (event) => {
      if (event?.key?.toLowerCase() === 'o') {
        handleFormSelection('operational');
      } else if (event?.key?.toLowerCase() === 'm') {
        handleFormSelection('maintenance');
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const handleFormSelection = (formType) => {
    // Navigate to safety form with form type parameter
    navigate('/pre-job-safety-survey-form', { 
      state: { 
        formType,
        workerInfo 
      } 
    });
  };

  const handleNotificationDismiss = (notificationId) => {
    setNotifications(prev => prev?.filter(n => n?.id !== notificationId));
  };

  const handleExportHistory = () => {
    // Mock export functionality
    const csvContent = recentSubmissions?.map(sub => 
      `${sub?.date},${sub?.time},${sub?.type},${sub?.status},${sub?.supervisor}`
    )?.join('\n');
    
    const blob = new Blob([`Date,Time,Type,Status,Supervisor\n${csvContent}`], 
      { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safety-forms-history-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole="worker" 
        userName={workerInfo?.name}
        factoryName="Aspen planers ltd. - Plant A"
        isOffline={!isOnline}
      />
      <div className="flex">
        <Sidebar 
          userRole="worker"
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className={`flex-1 transition-all duration-200 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'
        }`}>
          <div className="p-6 space-y-8">
            {/* Welcome Section */}
            <div className="bg-card rounded-lg border border-border p-6 industrial-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Welcome back, {workerInfo?.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="Badge" size={16} />
                      <span>{workerInfo?.employeeId}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Building" size={16} />
                      <span>{workerInfo?.department}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={16} />
                      <span>{workerInfo?.shift} ({workerInfo?.startTime} - {workerInfo?.endTime})</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={handleExportHistory}
                    iconName="Download"
                    iconPosition="left"
                  >
                    Export History
                  </Button>
                  <ConnectionStatusCard 
                    isOnline={isOnline}
                    lastSync={isOnline ? "Just now" : "2 hours ago"}
                    pendingForms={isOnline ? 0 : 1}
                  />
                </div>
              </div>
            </div>

            {/* Notifications */}
            {/* {notifications?.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
                <NotificationBadge 
                  notifications={notifications}
                  onDismiss={handleNotificationDismiss}
                />
              </div>
            )} */}

            {/* Quick Stats */}
            {/* <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Your Safety Metrics</h2>
              <QuickStatsPanel stats={quickStats} />
            </div> */}

            {/* Form Selection Cards */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Select Safety Form Type
                </h2>
                <p className="text-muted-foreground">
                  Choose the appropriate form for your current task or incident
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <FormSelectionCard
                  type="operational"
                  title="Operational"
                  description="For routine operations, production activities, and general workplace safety assessments"
                  icon="Settings"
                  color="bg-success"
                  bgColor="bg-success/5"
                  borderColor="border-success/20"
                  shortcut="O"
                  onClick={() => handleFormSelection('operational')}
                />
                
                <FormSelectionCard
                  type="maintenance"
                  title="Maintenance"
                  description="For equipment maintenance, repairs, and facility-related safety procedures"
                  icon="Wrench"
                  color="bg-warning"
                  bgColor="bg-warning/5"
                  borderColor="border-warning/20"
                  shortcut="M"
                  onClick={() => handleFormSelection('maintenance')}
                />

                <HotWorkPermitCard />
                <ElectricalPassCard />
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                <p>💡 Pro tip: Use keyboard shortcuts "O" for Operational or "M" for Maintenance</p>
              </div>
            </div>

            {/* Safety Tip */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SafetyTipCard tips={safetyTips} />
              </div>
              
              {/* <div className="bg-card rounded-lg border border-border p-6 industrial-shadow">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actionsss</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    iconName="FileText"
                    iconPosition="left"
                    onClick={() => navigate('/pre-job-safety-survey-form')}
                  >
                    New Safety Report
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    iconName="History"
                    iconPosition="left"
                  >
                    View All Submissions
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    iconName="HelpCircle"
                    iconPosition="left"
                  >
                    Safety Guidelines
                  </Button>
                </div>
              </div> */}
            </div>

            {/* Recent Submissions */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Form Submissions</h2>
              <RecentSubmissionsTable submissions={recentSubmissions} />
            </div>

            {/* Footer Info */}
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Emergency Contact: Safety Hotline (555) 123-SAFE | 
                Last Safety Training: December 15, 2024 | 
                Next Training Due: March 15, 2025
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkerDashboard;