import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const DataGrid = ({ 
  data, 
  selectedRows, 
  onRowSelect, 
  onSelectAll, 
  sortConfig, 
  onSort, 
  onRowExpand, 
  expandedRows,
  userRole 
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { color: 'bg-warning text-warning-foreground', label: 'Pending Review' },
      'approved': { color: 'bg-success text-success-foreground', label: 'Approved' },
      'rejected': { color: 'bg-error text-error-foreground', label: 'Rejected' },
      'in-review': { color: 'bg-accent text-accent-foreground', label: 'In Review' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'low': { color: 'bg-muted text-muted-foreground', icon: 'ArrowDown' },
      'medium': { color: 'bg-warning text-warning-foreground', icon: 'Minus' },
      'high': { color: 'bg-error text-error-foreground', icon: 'ArrowUp' },
      'critical': { color: 'bg-destructive text-destructive-foreground', icon: 'AlertTriangle' }
    };
    
    const config = priorityConfig?.[priority] || priorityConfig?.low;
    return (
      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} />
        <span className="capitalize">{priority}</span>
      </div>
    );
  };

  const getFormTypeColor = (type) => {
    return type === "operational"
    ? "text-green-600"
    : type === "maintenance"
    ? "text-orange-500"
    : type === "electrical pass"
    ? "text-blue-600"
    :  "text-yellow-500";
      
  };

  const getComplianceScore = (score) => {
    const color = score >= 90 ? 'text-success' : score >= 70 ? 'text-warning' : 'text-error';
    return (
      <div className={`font-medium ${color}`}>
        {score}%
      </div>
    );
  };

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-foreground" />
      : <Icon name="ArrowDown" size={14} className="text-foreground" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = [
    { key: 'select', label: '', width: 'w-12', sortable: false },
    { key: 'submissionDate', label: 'Submitted', width: 'w-40', sortable: true },
    { key: 'worker', label: 'Worker', width: 'w-48', sortable: true },
    { key: 'department', label: 'Department', width: 'w-32', sortable: true },
    { key: 'formType', label: 'Type', width: 'w-28', sortable: true },
    { key: 'status', label: 'Status', width: 'w-36', sortable: true },
    { key: 'priority', label: 'Priority', width: 'w-32', sortable: true },
    ...(userRole !== 'worker' ? [
      { key: 'supervisor', label: 'Supervisor', width: 'w-40', sortable: true },
      { key: 'complianceScore', label: 'Score', width: 'w-24', sortable: true }
    ] : []),
    { key: 'actions', label: '', width: 'w-20', sortable: false }
  ];

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="bg-muted border-b border-border">
        <div className="flex items-center">
          {columns?.map((column) => (
            <div key={column?.key} className={`${column?.width} px-4 py-3`}>
              {column?.key === 'select' ? (
                <Checkbox
                  checked={selectedRows?.length === data?.length && data?.length > 0}
                  onChange={(e) => onSelectAll(e?.target?.checked)}
                  indeterminate={selectedRows?.length > 0 && selectedRows?.length < data?.length}
                />
              ) : column?.sortable ? (
                <button
                  onClick={() => onSort(column?.key)}
                  className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground industrial-transition"
                >
                  <span>{column?.label}</span>
                  {getSortIcon(column?.key)}
                </button>
              ) : (
                <span className="text-sm font-medium text-muted-foreground">{column?.label}</span>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Table Body */}
      <div className="divide-y divide-border max-h-[calc(100vh-300px)] overflow-y-auto">
        {data?.map((row) => (
          <React.Fragment key={row?.id}>
            <div
              className={`flex items-center hover:bg-muted industrial-transition ${
                selectedRows?.includes(row?.id) ? 'bg-accent/10' : ''
              }`}
              onMouseEnter={() => setHoveredRow(row?.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              {/* Select */}
              <div className="w-12 px-4 py-4">
                <Checkbox
                  checked={selectedRows?.includes(row?.id)}
                  onChange={(e) => onRowSelect(row?.id, e?.target?.checked)}
                />
              </div>

              {/* Submission Date */}
              <div className="w-40 px-4 py-4">
                <div className="text-sm text-foreground">{formatDate(row?.submissionDate)}</div>
              </div>

              {/* Worker */}
              <div className="w-48 px-4 py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-xs font-medium">
                      {row?.worker?.split(' ')?.map(n => n?.[0])?.join('')}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{row?.worker}</div>
                    <div className="text-xs text-muted-foreground">{row?.shift}</div>
                  </div>
                </div>
              </div>

              {/* Department */}
              <div className="w-32 px-4 py-4">
                <span className="text-sm text-foreground">{row?.department}</span>
              </div>

              {/* Form Type */}
              <div className="w-28 px-4 py-4">
                <span className={`text-sm font-medium capitalize ${getFormTypeColor(row?.formType)}`}>
                  {row?.formType}
                </span>
              </div>

              {/* Status */}
              <div className="w-36 px-4 py-4">
                {getStatusBadge(row?.status)}
              </div>

              {/* Priority */}
              <div className="w-32 px-4 py-4">
                {getPriorityBadge(row?.priority)}
              </div>

              {/* Supervisor (if not worker role) */}
              {userRole !== 'worker' && (
                <div className="w-40 px-4 py-4">
                  <span className="text-sm text-foreground">{row?.supervisor || 'Unassigned'}</span>
                </div>
              )}

              {/* Compliance Score (if not worker role) */}
              {userRole !== 'worker' && (
                <div className="w-24 px-4 py-4">
                  {getComplianceScore(row?.complianceScore)}
                </div>
              )}

              {/* Actions */}
              <div className="w-20 px-4 py-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRowExpand(row?.id)}
                  className="opacity-0 group-hover:opacity-100 industrial-transition"
                >
                  <Icon 
                    name={expandedRows?.includes(row?.id) ? "ChevronUp" : "ChevronDown"} 
                    size={16} 
                  />
                </Button>
              </div>
            </div>

            {/* Expanded Row Details */}
            {expandedRows?.includes(row?.id) && (
              <div className="bg-muted/50 border-t border-border">
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Form Summary */}
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-3">Form Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Job/Task:</span>
                          <span className="text-foreground">{row?.jobTask}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Location:</span>
                          <span className="text-foreground">{row?.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Hazards Identified:</span>
                          <span className="text-foreground">{row?.hazardsCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Updated:</span>
                          <span className="text-foreground">{formatDate(row?.lastUpdated)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-3">Quick Actions</h4>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" iconName="Eye" iconPosition="left">
                          View Details
                        </Button>
                        {userRole !== 'worker' && (
                          <>
                            <Button variant="outline" size="sm" iconName="Edit" iconPosition="left">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
                              Export
                            </Button>
                            {row?.status === 'pending' && (
                              <Button variant="success" size="sm" iconName="Check" iconPosition="left">
                                Approve
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hazard Categories */}
                  {row?.hazardCategories && row?.hazardCategories?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <h4 className="text-sm font-medium text-foreground mb-2">Identified Hazards</h4>
                      <div className="flex flex-wrap gap-2">
                        {row?.hazardCategories?.map((hazard, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-warning/20 text-warning-foreground text-xs rounded-md"
                          >
                            {hazard}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Empty State */}
      {data?.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="FileX" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No forms found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default DataGrid;