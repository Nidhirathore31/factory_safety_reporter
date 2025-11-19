import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ApprovalQueueTable = ({ filters, onFormSelect, selectedForm, onBulkAction }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'submittedAt', direction: 'desc' });

  const mockForms = [
    {
      id: 'SF-2025-001',
      type: 'operational',
      title: 'Pre-Job Safety Survey - Log Yard Operations',
      worker: 'Mike Johnson',
      department: 'Log Yard',
      submittedAt: new Date('2025-01-08T14:30:00'),
      priority: 'high',
      slaRemaining: '2h 15m',
      status: 'pending',
      riskScore: 85,
      hasComments: true,
      complianceFlags: ['PPE Required', 'Height Work']
    },
    {
      id: 'SF-2025-002',
      type: 'maintenance',
      title: 'Equipment Maintenance Safety Check',
      worker: 'Sarah Chen',
      department: 'Log Yard',
      submittedAt: new Date('2025-01-08T13:45:00'),
      priority: 'medium',
      slaRemaining: '3h 45m',
      status: 'pending',
      riskScore: 72,
      hasComments: false,
      complianceFlags: ['Lockout Required']
    },
    {
      id: 'SF-2025-003',
      type: 'operational',
      title: 'Veneer Production Safety Assessment',
      worker: 'James Wilson',
      department: 'Veneer',
      submittedAt: new Date('2025-01-08T12:20:00'),
      priority: 'high',
      slaRemaining: 'OVERDUE',
      status: 'overdue',
      riskScore: 91,
      hasComments: true,
      complianceFlags: ['Chemical Exposure', 'Noise Level']
    },
    {
      id: 'SF-2025-004',
      type: 'maintenance',
      title: 'Plywood Press Safety Inspection',
      worker: 'Jennifer Lee',
      department: 'Plywood',
      submittedAt: new Date('2025-01-08T11:15:00'),
      priority: 'critical',
      slaRemaining: 'OVERDUE',
      status: 'overdue',
      riskScore: 95,
      hasComments: true,
      complianceFlags: ['High Temperature', 'Pressure Systems']
    },
    {
      id: 'SF-2025-005',
      type: 'operational',
      title: 'LVL Production Line Safety Check',
      worker: 'Kevin Anderson',
      department: 'LVL',
      submittedAt: new Date('2025-01-08T10:30:00'),
      priority: 'medium',
      slaRemaining: '1h 30m',
      status: 'pending',
      riskScore: 68,
      hasComments: false,
      complianceFlags: ['Dust Control']
    },
    {
      id: 'SF-2025-006',
      type: 'operational',
      title: 'Material Handling Safety Survey',
      worker: 'David Rodriguez',
      department: 'Log Yard',
      submittedAt: new Date('2025-01-08T09:45:00'),
      priority: 'low',
      slaRemaining: '5h 15m',
      status: 'pending',
      riskScore: 45,
      hasComments: false,
      complianceFlags: []
    },
    {
      id: 'SF-2025-007',
      type: 'maintenance',
      title: 'Conveyor System Safety Check',
      worker: 'Maria Garcia',
      department: 'Veneer',
      submittedAt: new Date('2025-01-08T09:00:00'),
      priority: 'medium',
      slaRemaining: '4h 00m',
      status: 'pending',
      riskScore: 76,
      hasComments: true,
      complianceFlags: ['Moving Parts', 'Electrical']
    },
    {
      id: 'SF-2025-008',
      type: 'operational',
      title: 'Quality Control Safety Assessment',
      worker: 'Robert Kim',
      department: 'Veneer',
      submittedAt: new Date('2025-01-08T08:30:00'),
      priority: 'low',
      slaRemaining: '6h 30m',
      status: 'pending',
      riskScore: 52,
      hasComments: false,
      complianceFlags: ['Chemical Testing']
    },
    {
      id: 'SF-2025-009',
      type: 'hot work permit',
      title: 'Quality Control Safety Assessment',
      worker: 'Jhon smith',
      department: 'Veneer',
      submittedAt: new Date('2025-11-19T08:30:00'),
      priority: 'high',
      slaRemaining: '6h 30m',
      status: 'pending',
      riskScore: 52,
      hasComments: false,
      complianceFlags: ['Chemical Testing']
    },
    {
      id: 'SF-2025-010',
      type: 'electrical pass',
      title: 'Quality Control Safety Assessment',
      worker: 'Robert Kim',
      department: 'Veneer',
      submittedAt: new Date('2025-11-19T08:30:00'),
      priority: 'medium',
      slaRemaining: '6h 30m',
      status: 'pending',
      riskScore: 52,
      hasComments: false,
      complianceFlags: ['Chemical Testing']
    },
  ];

  const filteredForms = mockForms?.filter(form => {
    if (filters?.status?.length && !filters?.status?.includes(form?.status)) return false;
    if (filters?.formType?.length && !filters?.formType?.includes(form?.type)) return false;
    if (filters?.department?.length && !filters?.department?.some(dept => 
      form?.department?.toLowerCase()?.replace(' ', '-') === dept)) return false;
    if (filters?.worker?.length && !filters?.worker?.some(workerId => {
      const workerNames = ['Mike Johnson', 'Sarah Chen', 'James Wilson', 'Jennifer Lee', 'Kevin Anderson', 'David Rodriguez', 'Maria Garcia', 'Robert Kim'];
      return workerNames?.includes(form?.worker);
    })) return false;
    return true;
  });

  const sortedForms = [...filteredForms]?.sort((a, b) => {
    if (sortConfig?.key === 'submittedAt') {
      return sortConfig?.direction === 'asc' 
        ? a?.submittedAt - b?.submittedAt 
        : b?.submittedAt - a?.submittedAt;
    }
    if (sortConfig?.key === 'priority') {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return sortConfig?.direction === 'asc'
        ? priorityOrder?.[a?.priority] - priorityOrder?.[b?.priority]
        : priorityOrder?.[b?.priority] - priorityOrder?.[a?.priority];
    }
    if (sortConfig?.key === 'riskScore') {
      return sortConfig?.direction === 'asc' 
        ? a?.riskScore - b?.riskScore 
        : b?.riskScore - a?.riskScore;
    }
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(sortedForms?.map(form => form?.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (formId, checked) => {
    if (checked) {
      setSelectedRows(prev => [...prev, formId]);
    } else {
      setSelectedRows(prev => prev?.filter(id => id !== formId));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-error';
      case 'high': return 'text-warning';
      case 'medium': return 'text-accent';
      case 'low': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical': return 'AlertTriangle';
      case 'high': return 'AlertCircle';
      case 'medium': return 'Clock';
      case 'low': return 'Minus';
      default: return 'Circle';
    }
  };

  const getRiskScoreColor = (score) => {
    if (score >= 90) return 'text-error';
    if (score >= 70) return 'text-warning';
    if (score >= 50) return 'text-accent';
    return 'text-success';
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  useEffect(() => {
    if (selectedRows?.length > 0) {
      onBulkAction(selectedRows);
    }
  }, [selectedRows, onBulkAction]);

  return (
    <div className="h-full bg-card flex flex-col">
      {/* Header with Bulk Actions */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Approval Queue</h2>
            <p className="text-sm text-muted-foreground">
              {sortedForms?.length} forms • {selectedRows?.length} selected
            </p>
          </div>
          
          {selectedRows?.length > 0 && (
            <div className="flex items-center space-x-2">
              <Button variant="success" size="sm" iconName="Check" iconPosition="left">
                Approve ({selectedRows?.length})
              </Button>
              <Button variant="destructive" size="sm" iconName="X" iconPosition="left">
                Reject ({selectedRows?.length})
              </Button>
              <Button variant="outline" size="sm" iconName="UserCheck" iconPosition="left">
                Reassign
              </Button>
            </div>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" iconName="Filter">
            All Forms
          </Button>
          <Button variant="ghost" size="sm" iconName="Clock">
            Overdue Only
          </Button>
          <Button variant="ghost" size="sm" iconName="AlertTriangle">
            High Risk
          </Button>
          <Button variant="ghost" size="sm" iconName="MessageSquare">
            With Comments
          </Button>
        </div>
      </div>
      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-muted sticky top-0">
            <tr>
              <th className="w-12 p-3 text-left">
                <Checkbox
                  checked={selectedRows?.length === sortedForms?.length && sortedForms?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="p-3 text-left text-sm font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('priority')}
                  className="flex items-center space-x-1 hover:text-foreground industrial-transition"
                >
                  <span>Priority</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="p-3 text-left text-sm font-medium text-muted-foreground">Form Details</th>
              <th className="p-3 text-left text-sm font-medium text-muted-foreground">Worker</th>
              <th className="p-3 text-left text-sm font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('submittedAt')}
                  className="flex items-center space-x-1 hover:text-foreground industrial-transition"
                >
                  <span>Submitted</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="p-3 text-left text-sm font-medium text-muted-foreground">SLA</th>
              <th className="p-3 text-left text-sm font-medium text-muted-foreground">
                <button 
                  onClick={() => handleSort('riskScore')}
                  className="flex items-center space-x-1 hover:text-foreground industrial-transition"
                >
                  <span>Risk</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="p-3 text-left text-sm font-medium text-muted-foreground">Compliance</th>
              <th className="w-24 p-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedForms?.map((form) => (
              <tr 
                key={form?.id}
                onClick={() => onFormSelect(form)}
                className={`border-b border-border hover:bg-muted industrial-transition cursor-pointer ${
                  selectedForm?.id === form?.id ? 'bg-accent/10' : ''
                }`}
              >
                <td className="p-3">
                  <Checkbox
                    checked={selectedRows?.includes(form?.id)}
                    onChange={(e) => {
                      e?.stopPropagation();
                      handleSelectRow(form?.id, e?.target?.checked);
                    }}
                  />
                </td>
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getPriorityIcon(form?.priority)} 
                      size={16} 
                      className={getPriorityColor(form?.priority)} 
                    />
                    <span className={`text-sm font-medium capitalize ${getPriorityColor(form?.priority)}`}>
                      {form?.priority}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-foreground">{form?.id}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        form?.type === 'operational' ? 'bg-success' : form.type ==="maintenace" ? 'bg-warning' : form.type === "electrical pass" ? 'bg-blue-500': 'bg-orange-400'
                      }`}></div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{form?.title}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">{form?.department}</span>
                      {form?.hasComments && (
                        <Icon name="MessageSquare" size={12} className="text-accent" />
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-xs font-medium">
                        {form?.worker?.split(' ')?.map(n => n?.[0])?.join('')}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{form?.worker}</span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="space-y-1">
                    <p className="text-sm text-foreground">
                      {form?.submittedAt?.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimeAgo(form?.submittedAt)}
                    </p>
                  </div>
                </td>
                <td className="p-3">
                  <span className={`text-sm font-medium ${
                    form?.slaRemaining === 'OVERDUE' ? 'text-error' : 'text-foreground'
                  }`}>
                    {form?.slaRemaining}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-bold ${getRiskScoreColor(form?.riskScore)}`}>
                      {form?.riskScore}
                    </span>
                    <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          form?.riskScore >= 90 ? 'bg-error' :
                          form?.riskScore >= 70 ? 'bg-warning' :
                          form?.riskScore >= 50 ? 'bg-accent' : 'bg-success'
                        }`}
                        style={{ width: `${form?.riskScore}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {form?.complianceFlags?.slice(0, 2)?.map((flag, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full"
                      >
                        {flag}
                      </span>
                    ))}
                    {form?.complianceFlags?.length > 2 && (
                      <span className="text-xs text-muted-foreground">
                        +{form?.complianceFlags?.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="icon" iconName="Eye" />
                    <Button variant="ghost" size="icon" iconName="MoreHorizontal" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {sortedForms?.length} of {mockForms?.length} forms
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" iconName="Download">
              Export
            </Button>
            <Button variant="ghost" size="sm" iconName="RefreshCw">
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalQueueTable;