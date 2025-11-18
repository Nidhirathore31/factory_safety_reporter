import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const DashboardHeader = ({ userRole = 'admin', onRefresh, lastUpdated }) => {
  const [selectedView, setSelectedView] = useState('overview');

  const viewOptions = [
    { value: 'overview', label: 'Overview Dashboard' },
    { value: 'compliance', label: 'Compliance View' },
    { value: 'incidents', label: 'Incident Analysis' },
    { value: 'departments', label: 'Department Comparison' },
    { value: 'workers', label: 'Worker Performance' }
  ];

  const savedDashboards = [
    { value: 'default', label: 'Default Dashboard' },
    { value: 'executive', label: 'Executive Summary' },
    { value: 'supervisor', label: 'Supervisor View' },
    { value: 'custom1', label: 'Monthly Review' }
  ];

  const getRoleTitle = () => {
    switch (userRole) {
      case 'admin':
        return 'Safety Analytics & Reporting Dashboard';
      case 'supervisor':
        return 'Team Safety Analytics Dashboard';
      case 'worker':
        return 'Personal Safety Dashboard';
      default:
        return 'Safety Analytics Dashboard';
    }
  };

  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 industrial-shadow mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Title and Status */}
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary rounded-lg">
            <Icon name="BarChart3" size={24} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{getRoleTitle()}</h1>
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Live Data</span>
              </div>
              <span className="text-sm text-muted-foreground">
                Last updated: {formatLastUpdated(lastUpdated)}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <Select
            options={viewOptions}
            value={selectedView}
            onChange={setSelectedView}
            className="min-w-[200px]"
          />
          
          <Select
            options={savedDashboards}
            value="default"
            onChange={() => {}}
            className="min-w-[180px]"
          />

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              iconName="RefreshCw"
              iconPosition="left"
            >
              Refresh
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              iconName="Settings"
              iconPosition="left"
            >
              Configure
            </Button>
            
            <Button
              variant="default"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">98.2%</p>
          <p className="text-sm text-muted-foreground">System Uptime</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">1,247</p>
          <p className="text-sm text-muted-foreground">Forms Processed</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">15</p>
          <p className="text-sm text-muted-foreground">Active Alerts</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">5</p>
          <p className="text-sm text-muted-foreground">Departments</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;