import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const TrendAnalysis = ({ userRole = 'admin' }) => {
  const [selectedMetric, setSelectedMetric] = useState('incidents');
  const [timeframe, setTimeframe] = useState('6months');

  const trendData = {
    incidents: [
      { month: 'Mar', value: 12, target: 10 },
      { month: 'Apr', value: 8, target: 10 },
      { month: 'May', value: 15, target: 10 },
      { month: 'Jun', value: 6, target: 10 },
      { month: 'Jul', value: 9, target: 10 },
      { month: 'Aug', value: 4, target: 10 }
    ],
    compliance: [
      { month: 'Mar', value: 85, target: 95 },
      { month: 'Apr', value: 92, target: 95 },
      { month: 'May', value: 88, target: 95 },
      { month: 'Jun', value: 96, target: 95 },
      { month: 'Jul', value: 94, target: 95 },
      { month: 'Aug', value: 98, target: 95 }
    ],
    hazards: [
      { month: 'Mar', value: 45, target: 30 },
      { month: 'Apr', value: 38, target: 30 },
      { month: 'May', value: 52, target: 30 },
      { month: 'Jun', value: 28, target: 30 },
      { month: 'Jul', value: 31, target: 30 },
      { month: 'Aug', value: 22, target: 30 }
    ]
  };

  const metrics = [
    { id: 'incidents', label: 'Safety Incidents', icon: 'AlertTriangle', color: '#D32F2F' },
    { id: 'compliance', label: 'Compliance Score', icon: 'CheckCircle', color: '#2E7D32' },
    { id: 'hazards', label: 'Hazards Identified', icon: 'Shield', color: '#E65100' }
  ];

  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Increasing Trend Detected',
      message: 'Slip/Trip/Fall incidents have increased by 25% in the last 30 days',
      department: 'Log Yard',
      severity: 'medium'
    },
    {
      id: 2,
      type: 'success',
      title: 'Improvement Noted',
      message: 'Compliance scores have consistently exceeded targets for 3 consecutive months',
      department: 'Plywood',
      severity: 'low'
    },
    {
      id: 3,
      type: 'error',
      title: 'Critical Pattern',
      message: 'Fall from height incidents show concerning pattern during night shifts',
      department: 'Veneer',
      severity: 'high'
    }
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case 'success': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      default: return 'Info';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-primary';
    }
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      high: 'bg-error text-error-foreground',
      medium: 'bg-warning text-warning-foreground',
      low: 'bg-success text-success-foreground'
    };
    return colors?.[severity] || colors?.low;
  };

  return (
    <div className="space-y-6">
      {/* Trend Chart */}
      <div className="bg-card border border-border rounded-lg p-6 industrial-shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Safety Trend Analysis</h3>
          <div className="flex items-center space-x-2">
            {metrics?.map((metric) => (
              <Button
                key={metric?.id}
                variant={selectedMetric === metric?.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMetric(metric?.id)}
                iconName={metric?.icon}
                iconPosition="left"
              >
                {metric?.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData?.[selectedMetric]}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="month" stroke="#616161" fontSize={12} />
              <YAxis stroke="#616161" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#2E7D32" 
                fillOpacity={1} 
                fill="url(#colorValue)"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#E65100" 
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center mt-4 space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-sm text-muted-foreground">Actual Values</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-1 bg-secondary rounded-full"></div>
            <span className="text-sm text-muted-foreground">Target Line</span>
          </div>
        </div>
      </div>
      {/* Pattern Alerts */}
      <div className="bg-card border border-border rounded-lg industrial-shadow">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Pattern Alerts & Insights</h3>
          <Button variant="outline" size="sm" iconName="Settings" iconPosition="left">
            Configure Alerts
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {alerts?.map((alert) => (
            <div key={alert?.id} className="flex items-start space-x-4 p-4 bg-muted rounded-lg">
              <div className={`p-2 rounded-lg ${getAlertColor(alert?.type)}`}>
                <Icon name={getAlertIcon(alert?.type)} size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">{alert?.title}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityBadge(alert?.severity)}`}>
                      {alert?.severity?.toUpperCase()}
                    </span>
                    <span className="text-xs text-muted-foreground">{alert?.department}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{alert?.message}</p>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" iconName="Eye" iconPosition="left">
                    View Details
                  </Button>
                  <Button variant="ghost" size="sm" iconName="Bell" iconPosition="left">
                    Set Reminder
                  </Button>
                  <Button variant="ghost" size="sm" iconName="X">
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Last analysis run: August 8, 2025 at 7:00 AM
            </p>
            <Button variant="outline" size="sm" iconName="RefreshCw" iconPosition="left">
              Run Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendAnalysis;