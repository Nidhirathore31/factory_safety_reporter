import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStatsPanel = ({ stats }) => {
  const statItems = [
    {
      label: 'Forms Submitted',
      value: stats?.totalSubmissions,
      icon: 'FileText',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      label: 'Pending Approval',
      value: stats?.pendingApprovals,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      label: 'Safety Score',
      value: `${stats?.safetyScore}%`,
      icon: 'Shield',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Days Incident-Free',
      value: stats?.incidentFreeDays,
      icon: 'Calendar',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems?.map((item, index) => (
        <div key={index} className="bg-card rounded-lg border border-border p-6 industrial-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">{item?.label}</p>
              <p className="text-2xl font-bold text-foreground">{item?.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg ${item?.bgColor} flex items-center justify-center`}>
              <Icon name={item?.icon} size={24} className={item?.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStatsPanel;