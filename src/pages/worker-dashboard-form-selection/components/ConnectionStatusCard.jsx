import React from 'react';
import Icon from '../../../components/AppIcon';

const ConnectionStatusCard = ({ isOnline, lastSync, pendingForms }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6 industrial-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">System Status</h3>
        <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-success' : 'bg-warning'}`} />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon 
              name={isOnline ? 'Wifi' : 'WifiOff'} 
              size={16} 
              className={isOnline ? 'text-success' : 'text-warning'} 
            />
            <span className="text-sm text-foreground">
              {isOnline ? 'Connected' : 'Offline Mode'}
            </span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${
            isOnline ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
          }`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="RefreshCw" size={16} className="text-muted-foreground" />
            <span className="text-sm text-foreground">Last Sync</span>
          </div>
          <span className="text-xs text-muted-foreground">{lastSync}</span>
        </div>
        
        {pendingForms > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Upload" size={16} className="text-warning" />
              <span className="text-sm text-foreground">Pending Upload</span>
            </div>
            <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded-full">
              {pendingForms} forms
            </span>
          </div>
        )}
        
        <div className="pt-2 border-t border-border">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Database" size={12} />
            <span>HRIS Integration: Active</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
            <Icon name="Settings" size={12} />
            <span>Maintenance System: Synced</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatusCard;