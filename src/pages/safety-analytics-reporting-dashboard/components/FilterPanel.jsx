import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const FilterPanel = ({ onFiltersChange, userRole = 'admin' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: '30days',
    department: 'all',
    formType: 'all',
    status: 'all',
    worker: '',
    hazardCategory: 'all'
  });

  const dateRangeOptions = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'log-yard', label: 'Log Yard' },
    { value: 'veneer', label: 'Veneer' },
    { value: 'plywood', label: 'Plywood' },
    { value: 'lvl', label: 'LVL' },
    { value: 'other', label: 'Other' }
  ];

  const formTypeOptions = [
    { value: 'all', label: 'All Form Types' },
    { value: 'operational', label: 'Operational Forms' },
    { value: 'maintenance', label: 'Maintenance Forms' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'pending', label: 'Pending Review' }
  ];

  const hazardCategoryOptions = [
    { value: 'all', label: 'All Hazard Categories' },
    { value: 'physical', label: 'Physical Hazards' },
    { value: 'slip-trip-fall', label: 'Slip/Trip/Fall' },
    { value: 'sharp-edges', label: 'Cut by Sharp Edges' },
    { value: 'projectiles', label: 'Projectiles/Flying Debris' },
    { value: 'overhead', label: 'Overhead/Suspended' },
    { value: 'repetitive', label: 'Repetitive Strains' },
    { value: 'fall-height', label: 'Fall From Height' },
    { value: 'combustible', label: 'Combustible Dust' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      dateRange: '30days',
      department: 'all',
      formType: 'all',
      status: 'all',
      worker: '',
      hazardCategory: 'all'
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  return (
    <div className="bg-card border border-border rounded-lg industrial-shadow">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Filters & Analysis</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={20} />
          </Button>
        </div>
      </div>
      <div className="p-4">
        {/* Always visible filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={filters?.dateRange}
            onChange={(value) => handleFilterChange('dateRange', value)}
          />
          
          <Select
            label="Department"
            options={departmentOptions}
            value={filters?.department}
            onChange={(value) => handleFilterChange('department', value)}
          />
          
          <Select
            label="Form Type"
            options={formTypeOptions}
            value={filters?.formType}
            onChange={(value) => handleFilterChange('formType', value)}
          />
          
          <Select
            label="Status"
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => handleFilterChange('status', value)}
          />
        </div>

        {/* Expandable advanced filters */}
        {isExpanded && (
          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Advanced Filters</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userRole === 'admin' && (
                <Input
                  label="Worker Name/ID"
                  type="text"
                  placeholder="Search by worker name or ID"
                  value={filters?.worker}
                  onChange={(e) => handleFilterChange('worker', e?.target?.value)}
                />
              )}
              
              <Select
                label="Hazard Category"
                options={hazardCategoryOptions}
                value={filters?.hazardCategory}
                onChange={(value) => handleFilterChange('hazardCategory', value)}
              />
              
              {filters?.dateRange === 'custom' && (
                <>
                  <Input
                    label="Start Date"
                    type="date"
                    onChange={(e) => handleFilterChange('startDate', e?.target?.value)}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    onChange={(e) => handleFilterChange('endDate', e?.target?.value)}
                  />
                </>
              )}
            </div>
          </div>
        )}

        {/* Quick filter buttons */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterChange('status', 'pending')}
            iconName="Clock"
            iconPosition="left"
          >
            Pending Review
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterChange('hazardCategory', 'fall-height')}
            iconName="AlertTriangle"
            iconPosition="left"
          >
            High Risk
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterChange('dateRange', '7days')}
            iconName="Calendar"
            iconPosition="left"
          >
            This Week
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;