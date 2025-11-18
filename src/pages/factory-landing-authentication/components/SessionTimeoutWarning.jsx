import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SessionTimeoutWarning = ({ isVisible, timeRemaining, onExtendSession, onLogout }) => {
  const [countdown, setCountdown] = useState(timeRemaining);

  useEffect(() => {
    if (isVisible && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            onLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isVisible, countdown, onLogout]);

  useEffect(() => {
    setCountdown(timeRemaining);
  }, [timeRemaining]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds?.toString()?.padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-300">
      <div className="bg-card border border-border rounded-lg industrial-shadow p-6 w-full max-w-md mx-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Clock" size={32} className="text-warning" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Session Timeout Warning</h3>
          <p className="text-muted-foreground">
            Your session will expire in <span className="font-bold text-warning">{formatTime(countdown)}</span>
          </p>
        </div>

        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-foreground font-medium mb-1">Security Notice</p>
              <p className="text-sm text-muted-foreground">
                For your security, sessions automatically expire after periods of inactivity. 
                Any unsaved work will be lost.
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            fullWidth
            onClick={onLogout}
            iconName="LogOut"
            iconPosition="left"
          >
            Sign Out Now
          </Button>
          <Button
            variant="default"
            fullWidth
            onClick={onExtendSession}
            iconName="RefreshCw"
            iconPosition="left"
          >
            Stay Signed In
          </Button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Session will be automatically extended for another 30 minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutWarning;