import React from 'react';
import Icon from '../../../components/AppIcon';

const SyncStatusIndicator = ({ syncStatus, lastSyncTime, pendingChanges }) => {
  const getSyncStatusConfig = () => {
    switch (syncStatus) {
      case 'synced':
        return {
          icon: 'CheckCircle',
          color: 'text-success',
          bgColor: 'bg-success/10',
          message: 'All data synchronized'
        };
      case 'syncing':
        return {
          icon: 'RefreshCw',
          color: 'text-accent',
          bgColor: 'bg-accent/10',
          message: 'Synchronizing data...',
          animate: 'animate-spin'
        };
      case 'error':
        return {
          icon: 'AlertCircle',
          color: 'text-error',
          bgColor: 'bg-error/10',
          message: 'Sync failed - Retry needed'
        };
      case 'offline':
        return {
          icon: 'WifiOff',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          message: 'Working offline'
        };
      default:
        return {
          icon: 'Clock',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          message: 'Checking sync status...'
        };
    }
  };

  const config = getSyncStatusConfig();

  const formatLastSyncTime = (timestamp) => {
    if (!timestamp) return 'Never';
    
    const now = new Date();
    const syncTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - syncTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return syncTime?.toLocaleDateString();
  };

  return (
    <div className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${config?.bgColor}`}>
      <div className="flex items-center space-x-2">
        <Icon 
          name={config?.icon} 
          size={16} 
          className={`${config?.color} ${config?.animate || ''}`} 
        />
        <span className={`text-sm font-medium ${config?.color}`}>
          {config?.message}
        </span>
      </div>
      <div className="text-xs text-muted-foreground">
        Last sync: {formatLastSyncTime(lastSyncTime)}
      </div>
      {pendingChanges > 0 && (
        <div className="flex items-center space-x-1">
          <Icon name="Upload" size={14} className="text-warning" />
          <span className="text-xs text-warning font-medium">
            {pendingChanges} pending
          </span>
        </div>
      )}
      {syncStatus === 'error' && (
        <button className="text-xs text-error hover:text-error/80 underline industrial-transition">
          Retry sync
        </button>
      )}
    </div>
  );
};

export default SyncStatusIndicator;