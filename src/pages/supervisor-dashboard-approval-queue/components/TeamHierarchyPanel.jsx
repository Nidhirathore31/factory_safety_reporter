import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const TeamHierarchyPanel = ({ onFilterChange, selectedFilters }) => {
  const [expandedDepartments, setExpandedDepartments] = useState(['log-yard', 'veneer']);

  const teamHierarchy = [
    {
      id: 'log-yard',
      name: 'Log Yard',
      count: 12,
      workers: [
        { id: 'w1', name: 'Mike Johnson', pending: 3, overdue: 1 },
        { id: 'w2', name: 'Sarah Chen', pending: 2, overdue: 0 },
        { id: 'w3', name: 'David Rodriguez', pending: 4, overdue: 2 },
        { id: 'w4', name: 'Lisa Thompson', pending: 1, overdue: 0 }
      ]
    },
    {
      id: 'veneer',
      name: 'Veneer',
      count: 8,
      workers: [
        { id: 'w5', name: 'James Wilson', pending: 2, overdue: 1 },
        { id: 'w6', name: 'Maria Garcia', pending: 3, overdue: 0 },
        { id: 'w7', name: 'Robert Kim', pending: 1, overdue: 0 }
      ]
    },
    {
      id: 'plywood',
      name: 'Plywood',
      count: 15,
      workers: [
        { id: 'w8', name: 'Jennifer Lee', pending: 5, overdue: 1 },
        { id: 'w9', name: 'Michael Brown', pending: 3, overdue: 0 },
        { id: 'w10', name: 'Amanda Davis', pending: 4, overdue: 2 },
        { id: 'w11', name: 'Chris Martinez', pending: 2, overdue: 0 }
      ]
    },
    {
      id: 'lvl',
      name: 'LVL',
      count: 6,
      workers: [
        { id: 'w12', name: 'Kevin Anderson', pending: 2, overdue: 0 },
        { id: 'w13', name: 'Rachel White', pending: 3, overdue: 1 }
      ]
    }
  ];

  const statusFilters = [
    { id: 'pending', label: 'Pending Review', count: 28, color: 'text-warning' },
    { id: 'overdue', label: 'Overdue', count: 7, color: 'text-error' },
    { id: 'approved', label: 'Approved Today', count: 15, color: 'text-success' },
    { id: 'rejected', label: 'Rejected', count: 3, color: 'text-error' }
  ];

  const formTypeFilters = [
    { id: 'operational', label: 'Operational Forms', count: 22, color: 'text-success' },
    { id: 'maintenance', label: 'Maintenance Forms', count: 19, color: 'text-warning' }
  ];

  const toggleDepartment = (deptId) => {
    setExpandedDepartments(prev => 
      prev?.includes(deptId) 
        ? prev?.filter(id => id !== deptId)
        : [...prev, deptId]
    );
  };

  const handleFilterClick = (filterType, filterId) => {
    onFilterChange(filterType, filterId);
  };

  const isFilterActive = (filterType, filterId) => {
    return selectedFilters?.[filterType]?.includes(filterId);
  };

  return (
    <div className="h-full bg-card border-r border-border overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Team Overview</h2>
        <p className="text-sm text-muted-foreground">Filter by department, worker, or status</p>
      </div>
      {/* Status Filters */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-medium text-foreground mb-3">Approval Status</h3>
        <div className="space-y-2">
          {statusFilters?.map((filter) => (
            <button
              key={filter?.id}
              onClick={() => handleFilterClick('status', filter?.id)}
              className={`w-full flex items-center justify-between p-2 rounded-lg industrial-transition ${
                isFilterActive('status', filter?.id)
                  ? 'bg-primary text-primary-foreground' :'hover:bg-muted'
              }`}
            >
              <span className="text-sm font-medium">{filter?.label}</span>
              <span className={`text-sm font-semibold ${
                isFilterActive('status', filter?.id) ? 'text-primary-foreground' : filter?.color
              }`}>
                {filter?.count}
              </span>
            </button>
          ))}
        </div>
      </div>
      {/* Form Type Filters */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-medium text-foreground mb-3">Form Types</h3>
        <div className="space-y-2">
          {formTypeFilters?.map((filter) => (
            <button
              key={filter?.id}
              onClick={() => handleFilterClick('formType', filter?.id)}
              className={`w-full flex items-center justify-between p-2 rounded-lg industrial-transition ${
                isFilterActive('formType', filter?.id)
                  ? 'bg-primary text-primary-foreground' :'hover:bg-muted'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  filter?.id === 'operational' ? 'bg-success' : 'bg-warning'
                }`}></div>
                <span className="text-sm font-medium">{filter?.label}</span>
              </div>
              <span className={`text-sm font-semibold ${
                isFilterActive('formType', filter?.id) ? 'text-primary-foreground' : filter?.color
              }`}>
                {filter?.count}
              </span>
            </button>
          ))}
        </div>
      </div>
      {/* Team Hierarchy */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">Departments & Workers</h3>
        <div className="space-y-2">
          {teamHierarchy?.map((department) => (
            <div key={department?.id} className="space-y-1">
              <button
                onClick={() => toggleDepartment(department?.id)}
                className={`w-full flex items-center justify-between p-2 rounded-lg industrial-transition ${
                  isFilterActive('department', department?.id)
                    ? 'bg-primary text-primary-foreground' :'hover:bg-muted'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={expandedDepartments?.includes(department?.id) ? "ChevronDown" : "ChevronRight"} 
                    size={16} 
                  />
                  <span className="text-sm font-medium">{department?.name}</span>
                </div>
                <span className="text-sm font-semibold text-accent">
                  {department?.count}
                </span>
              </button>

              {expandedDepartments?.includes(department?.id) && (
                <div className="ml-6 space-y-1">
                  {department?.workers?.map((worker) => (
                    <button
                      key={worker?.id}
                      onClick={() => handleFilterClick('worker', worker?.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg industrial-transition text-left ${
                        isFilterActive('worker', worker?.id)
                          ? 'bg-accent text-accent-foreground' :'hover:bg-muted'
                      }`}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{worker?.name}</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-xs text-warning">
                            {worker?.pending} pending
                          </span>
                          {worker?.overdue > 0 && (
                            <span className="text-xs text-error">
                              {worker?.overdue} overdue
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Quick Stats */}
      <div className="p-4 border-t border-border bg-muted">
        <h3 className="text-sm font-medium text-foreground mb-3">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <p className="text-lg font-bold text-warning">28</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-error">7</p>
            <p className="text-xs text-muted-foreground">Overdue</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-success">15</p>
            <p className="text-xs text-muted-foreground">Today</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-accent">4.2h</p>
            <p className="text-xs text-muted-foreground">Avg SLA</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamHierarchyPanel;