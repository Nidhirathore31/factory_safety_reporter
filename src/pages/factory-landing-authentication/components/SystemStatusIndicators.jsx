import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SystemStatusIndicators = () => {
  const [systemStatus, setSystemStatus] = useState({
    hris: { status: 'online', lastSync: new Date(Date.now() - 300000) },
    maintenance: { status: 'online', lastSync: new Date(Date.now() - 180000) },
    safety: { status: 'online', lastSync: new Date(Date.now() - 60000) },
    network: { status: 'online', latency: 45 }
  });

  const [announcements] = useState([
    {
      id: 1,
      type: 'maintenance',
      title: 'Scheduled System Maintenance',
      message: 'Safety reporting system will be offline for maintenance on Sunday, August 11th from 2:00 AM - 4:00 AM PST.',
      priority: 'medium',
      timestamp: new Date(Date.now() - 7200000)
    },
    {
      id: 2,
      type: 'safety',
      title: 'New Safety Protocol Update',
      message: 'Updated PPE requirements for Log Yard operations effective immediately. Please review the new guidelines.',
      priority: 'high',
      timestamp: new Date(Date.now() - 3600000)
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-success';
      case 'warning': return 'text-warning';
      case 'offline': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'offline': return 'XCircle';
      default: return 'Circle';
    }
  };

  const formatLastSync = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-error bg-error/5 text-error';
      case 'medium': return 'border-warning bg-warning/5 text-warning';
      case 'low': return 'border-primary bg-primary/5 text-primary';
      default: return 'border-border bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">    
      {/* Compliance Badges */}
      <div className="flex flex-wrap items-center justify-center gap-6 py-4">
        <div className="flex items-center space-x-2 text-success">
          <Icon name="Shield" size={20} />
          <span className="text-sm font-medium">OSHA Certified</span>
        </div>
        <div className="flex items-center space-x-2 text-success">
          <Icon name="Lock" size={20} />
          <span className="text-sm font-medium">SSL Secured</span>
        </div>
        <div className="flex items-center space-x-2 text-success">
          <Icon name="Database" size={20} />
          <span className="text-sm font-medium">SOC 2 Compliant</span>
        </div>
        <div className="flex items-center space-x-2 text-success">
          <Icon name="CheckCircle" size={20} />
          <span className="text-sm font-medium">ISO 45001</span>
        </div>
      </div>
    </div>
  );
};

export default SystemStatusIndicators;