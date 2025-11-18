import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ isExpanded, onToggle, filters, onFilterChange, onClearFilters, onSaveSearch }) => {
  const [searchName, setSearchName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const departmentOptions = [
    { value: 'log-yard', label: 'Log Yard' },
    { value: 'veneer', label: 'Veneer' },
    { value: 'plywood', label: 'Plywood' },
    { value: 'lvl', label: 'LVL' },
    { value: 'other', label: 'Other' }
  ];

  const formTypeOptions = [
    { value: 'operational', label: 'Operational' },
    { value: 'maintenance', label: 'Maintenance' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'in-review', label: 'In Review' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'critical', label: 'Critical' }
  ];

  const hazardCategories = [
    'Physical hazards',
    'Slip/Trip/Fall',
    'Cut by Sharp Edges',
    'Projectiles/Flying Debris',
    'Overhead/Suspended',
    'Repetitive Strains',
    'Fall From Height',
    'Combustible Dust'
  ];

  const savedSearches = [
    { id: 1, name: 'Pending Maintenance Forms', count: 23 },
    { id: 2, name: 'High Priority This Week', count: 8 },
    { id: 3, name: 'Log Yard Incidents', count: 15 }
  ];

  const handleSaveSearch = () => {
    if (searchName?.trim()) {
      onSaveSearch(searchName?.trim());
      setSearchName('');
      setShowSaveDialog(false);
    }
  };

  return (
    <div className={`bg-card border-r border-border h-full transition-all duration-300 ${
      isExpanded ? 'w-80' : 'w-12'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {isExpanded && (
          <h3 className="font-semibold text-foreground">Filters & Search</h3>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="flex-shrink-0"
        >
          <Icon name={isExpanded ? "ChevronLeft" : "ChevronRight"} size={20} />
        </Button>
      </div>
      {isExpanded && (
        <div className="p-4 space-y-6 overflow-y-auto h-full">
          {/* Saved Searches */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Saved Searches</h4>
            <div className="space-y-2">
              {savedSearches?.map((search) => (
                <button
                  key={search?.id}
                  className="w-full flex items-center justify-between p-2 text-left text-sm text-muted-foreground hover:bg-muted rounded-md industrial-transition"
                >
                  <span className="truncate">{search?.name}</span>
                  <span className="bg-muted text-xs px-2 py-1 rounded-full ml-2">
                    {search?.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Date Range</h4>
            <div className="space-y-3">
              <Input
                label="From Date"
                type="date"
                value={filters?.dateFrom}
                onChange={(e) => onFilterChange('dateFrom', e?.target?.value)}
              />
              <Input
                label="To Date"
                type="date"
                value={filters?.dateTo}
                onChange={(e) => onFilterChange('dateTo', e?.target?.value)}
              />
            </div>
          </div>

          {/* Form Type */}
          <div>
            <Select
              label="Form Type"
              options={formTypeOptions}
              value={filters?.formType}
              onChange={(value) => onFilterChange('formType', value)}
              placeholder="All form types"
              clearable
            />
          </div>

          {/* Department */}
          <div>
            <Select
              label="Department"
              options={departmentOptions}
              value={filters?.department}
              onChange={(value) => onFilterChange('department', value)}
              placeholder="All departments"
              clearable
            />
          </div>

          {/* Status */}
          <div>
            <Select
              label="Approval Status"
              options={statusOptions}
              value={filters?.status}
              onChange={(value) => onFilterChange('status', value)}
              placeholder="All statuses"
              clearable
            />
          </div>

          {/* Priority */}
          <div>
            <Select
              label="Priority Level"
              options={priorityOptions}
              value={filters?.priority}
              onChange={(value) => onFilterChange('priority', value)}
              placeholder="All priorities"
              clearable
            />
          </div>

          {/* Worker Search */}
          <div>
            <Input
              label="Worker Name"
              type="text"
              placeholder="Search by worker name"
              value={filters?.workerName}
              onChange={(e) => onFilterChange('workerName', e?.target?.value)}
            />
          </div>

          {/* Hazard Categories */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Hazard Categories</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {hazardCategories?.map((category) => (
                <Checkbox
                  key={category}
                  label={category}
                  checked={filters?.hazardCategories?.includes(category) || false}
                  onChange={(e) => {
                    const current = filters?.hazardCategories || [];
                    const updated = e?.target?.checked
                      ? [...current, category]
                      : current?.filter(c => c !== category);
                    onFilterChange('hazardCategories', updated);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Compliance Score Range */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Compliance Score</h4>
            <div className="space-y-3">
              <Input
                label="Min Score"
                type="number"
                min="0"
                max="100"
                placeholder="0"
                value={filters?.minScore}
                onChange={(e) => onFilterChange('minScore', e?.target?.value)}
              />
              <Input
                label="Max Score"
                type="number"
                min="0"
                max="100"
                placeholder="100"
                value={filters?.maxScore}
                onChange={(e) => onFilterChange('maxScore', e?.target?.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowSaveDialog(true)}
              iconName="Save"
              iconPosition="left"
            >
              Save Search
            </Button>
            <Button
              variant="ghost"
              fullWidth
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear All Filters
            </Button>
          </div>

          {/* Save Search Dialog */}
          {showSaveDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-300">
              <div className="bg-card border border-border rounded-lg p-6 w-96 max-w-full mx-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">Save Search</h3>
                <Input
                  label="Search Name"
                  type="text"
                  placeholder="Enter search name"
                  value={searchName}
                  onChange={(e) => setSearchName(e?.target?.value)}
                  className="mb-4"
                />
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => setShowSaveDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleSaveSearch}
                    disabled={!searchName?.trim()}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;