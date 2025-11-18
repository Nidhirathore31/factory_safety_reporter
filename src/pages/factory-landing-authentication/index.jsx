import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticationPanel from './components/AuthenticationPanel';
import FactoryHeader from './components/FactoryHeader';
import SystemStatusIndicators from './components/SystemStatusIndicators';
import SessionTimeoutWarning from './components/SessionTimeoutWarning';

const FactoryLandingAuthentication = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(300); // 5 minutes
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Session timeout simulation
  useEffect(() => {
    if (isAuthenticated) {
      const sessionTimer = setTimeout(() => {
        setShowSessionWarning(true);
      }, 25 * 60 * 1000); // Show warning after 25 minutes

      return () => clearTimeout(sessionTimer);
    }
  }, [isAuthenticated]);

  const handleAuthentication = async (role) => {
    setIsLoading(true);
    
    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsAuthenticated(true);
      setUserRole(role);
      
      // Store authentication state
      localStorage.setItem('userRole', role);
      localStorage.setItem('authTime', new Date()?.toISOString());
      
      // Navigate based on role
      const roleRoutes = {
        worker: '/worker-dashboard-form-selection',
        supervisor: '/supervisor-dashboard-approval-queue',
        admin: '/safety-analytics-reporting-dashboard'
      };
      
      setTimeout(() => {
        navigate(roleRoutes?.[role] || '/worker-dashboard-form-selection');
      }, 1000);
      
    } catch (error) {
      console.error('Authentication failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtendSession = () => {
    setShowSessionWarning(false);
    setSessionTimeRemaining(300);
    // In real app, would refresh auth token
    localStorage.setItem('authTime', new Date()?.toISOString());
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setShowSessionWarning(false);
    localStorage.removeItem('userRole');
    localStorage.removeItem('authTime');
    // In real app, would clear all auth tokens and redirect
  };

  // Check for existing authentication on mount
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const authTime = localStorage.getItem('authTime');
    
    if (storedRole && authTime) {
      const timeDiff = new Date() - new Date(authTime);
      const thirtyMinutes = 30 * 60 * 1000;
      
      if (timeDiff < thirtyMinutes) {
        setIsAuthenticated(true);
        setUserRole(storedRole);
        
        // Auto-navigate if still within session
        const roleRoutes = {
          worker: '/worker-dashboard-form-selection',
          supervisor: '/supervisor-dashboard-approval-queue',
          admin: '/safety-analytics-reporting-dashboard'
        };
        
        navigate(roleRoutes?.[storedRole] || '/worker-dashboard-form-selection');
      } else {
        // Session expired
        localStorage.removeItem('userRole');
        localStorage.removeItem('authTime');
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
          {/* Factory Header */}
          <FactoryHeader 
            factoryName="Aspen planers ltd. - Plant A"
            isOnline={isOnline}
          />

          {/* Authentication Panel */}
          {!isAuthenticated && (
            <AuthenticationPanel 
              onAuthenticate={handleAuthentication}
              isLoading={isLoading}
            />
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 text-primary">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="font-medium">Authenticating...</span>
              </div>
            </div>
          )}

          {/* Success State */}
          {isAuthenticated && !isLoading && (
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 text-success mb-4">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <span className="text-success-foreground text-sm">✓</span>
                </div>
                <span className="font-medium text-lg">Authentication Successful</span>
              </div>
              <p className="text-muted-foreground">
                Redirecting to {userRole} dashboard...
              </p>
            </div>
          )}

          {/* System Status Indicators */}
          <SystemStatusIndicators />
        </div>
      </div>
      {/* Session Timeout Warning Modal */}
      <SessionTimeoutWarning
        isVisible={showSessionWarning}
        timeRemaining={sessionTimeRemaining}
        onExtendSession={handleExtendSession}
        onLogout={handleLogout}
      />
      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80">
          <div className="bg-warning text-warning-foreground p-4 rounded-lg industrial-shadow">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-warning-foreground rounded-full"></div>
              <span className="font-medium">Offline Mode</span>
            </div>
            <p className="text-sm mt-1 opacity-90">
              Limited functionality available. Reconnect for full access.
            </p>
          </div>
        </div>
      )}
      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4 mb-2 md:mb-0">
              <span>© {new Date()?.getFullYear()} Aspen planers ltd.</span>
              <span>•</span>
              <span>Safety Management System v2.1.0</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Emergency: (555) 123-4567</span>
              <span>•</span>
              <span>IT Support: ext. 2847</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FactoryLandingAuthentication;