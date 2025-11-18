import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterToolbar = ({ onFiltersChange, activeFilters }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState('today');
  const [selectedPreset, setSelectedPreset] = useState('');

  const filterPresets = [
    { value: '', label: 'No Preset Selected' },
    { value: 'overdue-high-risk', label: 'Overdue & High Risk' },
    { value: 'pending-operational', label: 'Pending Operational Forms' },
    { value: 'maintenance-critical', label: 'Critical Maintenance Forms' },
    { value: 'my-department', label: 'My Department Only' },
    { value: 'today-submissions', label: 'Today\'s Submissions' }
  ];

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'this-week', label: 'This Week' },
    { value: 'last-week', label: 'Last Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const departmentOptions = [
    { value: 'log-yard', label: 'Log Yard' },
    { value: 'veneer', label: 'Veneer' },
    { value: 'plywood', label: 'Plywood' },
    { value: 'lvl', label: 'LVL' },
    { value: 'other', label: 'Other' }
  ];

  const priorityOptions = [
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    onFiltersChange({ ...activeFilters, search: query });
  };

  const handlePresetChange = (preset) => {
    setSelectedPreset(preset);
    
    // Apply preset filters
    const presetFilters = {
      'overdue-high-risk': {
        status: ['overdue'],
        priority: ['critical', 'high'],
        riskScore: { min: 80 }
      },
      'pending-operational': {
        status: ['pending'],
        formType: ['operational']
      },
      'maintenance-critical': {
        formType: ['maintenance'],
        priority: ['critical']
      },
      'my-department': {
        department: ['log-yard'] // This would be dynamic based on supervisor's department
      },
      'today-submissions': {
        dateRange: 'today'
      }
    };

    if (preset && presetFilters?.[preset]) {
      onFiltersChange({ ...activeFilters, ...presetFilters?.[preset] });
    } else {
      onFiltersChange({});
    }
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    onFiltersChange({ ...activeFilters, dateRange: range });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedPreset('');
    setDateRange('today');
    onFiltersChange({});
  };

  const getActiveFilterCount = () => {
    return Object.keys(activeFilters)?.filter(key => 
      activeFilters?.[key] && 
      (Array.isArray(activeFilters?.[key]) ? activeFilters?.[key]?.length > 0 : true)
    )?.length;
  };

  return (
    <div className="bg-card border-b border-border p-4 space-y-4">
      {/* Main Filter Row */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search forms, workers, or content..."
              value={searchQuery}
              onChange={(e) => handleSearch(e?.target?.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filter Presets */}
        <div className="w-64">
          <Select
            placeholder="Quick Filters"
            options={filterPresets}
            value={selectedPreset}
            onChange={handlePresetChange}
          />
        </div>

        {/* Date Range */}
        <div className="w-40">
          <Select
            options={dateRangeOptions}
            value={dateRange}
            onChange={handleDateRangeChange}
          />
        </div>

        {/* Advanced Filters Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          iconName={showAdvancedFilters ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
        >
          Advanced
        </Button>

        {/* Clear Filters */}
        {getActiveFilterCount() > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            iconName="X"
            iconPosition="left"
          >
            Clear ({getActiveFilterCount()})
          </Button>
        )}
      </div>
      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="grid grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
          <div>
            <Select
              label="Department"
              placeholder="All Departments"
              options={departmentOptions}
              multiple
              value={activeFilters?.department || []}
              onChange={(value) => onFiltersChange({ ...activeFilters, department: value })}
            />
          </div>
          
          <div>
            <Select
              label="Priority"
              placeholder="All Priorities"
              options={priorityOptions}
              multiple
              value={activeFilters?.priority || []}
              onChange={(value) => onFiltersChange({ ...activeFilters, priority: value })}
            />
          </div>

          <div>
            <Input
              label="Min Risk Score"
              type="number"
              placeholder="0"
              min="0"
              max="100"
              value={activeFilters?.riskScore?.min || ''}
              onChange={(e) => onFiltersChange({ 
                ...activeFilters, 
                riskScore: { ...activeFilters?.riskScore, min: e?.target?.value } 
              })}
            />
          </div>

          <div>
            <Input
              label="Max Risk Score"
              type="number"
              placeholder="100"
              min="0"
              max="100"
              value={activeFilters?.riskScore?.max || ''}
              onChange={(e) => onFiltersChange({ 
                ...activeFilters, 
                riskScore: { ...activeFilters?.riskScore, max: e?.target?.value } 
              })}
            />
          </div>
        </div>
      )}
      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <div className="flex items-center space-x-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {activeFilters?.search && (
            <span className="inline-flex items-center space-x-1 bg-accent/10 text-accent px-2 py-1 rounded-full text-sm">
              <span>Search: "{activeFilters?.search}"</span>
              <button onClick={() => handleSearch('')}>
                <Icon name="X" size={12} />
              </button>
            </span>
          )}

          {activeFilters?.status?.map(status => (
            <span key={status} className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
              <span>Status: {status}</span>
              <button onClick={() => onFiltersChange({ 
                ...activeFilters, 
                status: activeFilters?.status?.filter(s => s !== status) 
              })}>
                <Icon name="X" size={12} />
              </button>
            </span>
          ))}

          {activeFilters?.formType?.map(type => (
            <span key={type} className="inline-flex items-center space-x-1 bg-secondary/10 text-secondary px-2 py-1 rounded-full text-sm">
              <span>Type: {type}</span>
              <button onClick={() => onFiltersChange({ 
                ...activeFilters, 
                formType: activeFilters?.formType?.filter(t => t !== type) 
              })}>
                <Icon name="X" size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
      {/* Quick Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center space-x-6">
          <span>Total: 41 forms</span>
          <span>Filtered: 28 forms</span>
          <span>Selected: 0 forms</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" iconName="Download">
            Export Filtered
          </Button>
          <Button variant="ghost" size="sm" iconName="Save">
            Save Filter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterToolbar;