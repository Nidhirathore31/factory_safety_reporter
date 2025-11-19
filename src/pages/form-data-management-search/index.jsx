import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';

import Button from '../../components/ui/Button';
import FilterSidebar from './components/FilterSidebar';
import SearchBar from './components/SearchBar';
import DataGrid from './components/DataGrid';
import BulkOperationsToolbar from './components/BulkOperationsToolbar';
import SyncStatusIndicator from './components/SyncStatusIndicator';
import KeyboardShortcuts from './components/KeyboardShortcuts';

const FormDataManagementSearch = () => {
  // User context
  const [userRole] = useState('supervisor'); // Can be 'worker', 'supervisor', 'admin'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filterSidebarExpanded, setFilterSidebarExpanded] = useState(true);

  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([
    'safety equipment malfunction',
    'slip hazard maintenance',
    'PPE compliance check'
  ]);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    formType: '',
    department: '',
    status: '',
    priority: '',
    workerName: '',
    hazardCategories: [],
    minScore: '',
    maxScore: ''
  });

  // Data grid state
  const [selectedRows, setSelectedRows] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'submissionDate', direction: 'desc' });

  // Sync status
  const [syncStatus, setSyncStatus] = useState('synced');
  const [lastSyncTime] = useState(new Date()?.toISOString());
  const [pendingChanges] = useState(0);

  // Mock data
  const mockData = [
    {
      id: 1,
      submissionDate: '2025-01-08T14:30:00Z',
      worker: 'John Martinez',
      department: 'Log Yard',
      formType: 'operational',
      status: 'pending',
      priority: 'high',
      supervisor: 'Sarah Johnson',
      complianceScore: 85,
      shift: 'Day Shift A',
      jobTask: 'Log sorting and grading',
      location: 'Yard Section B',
      hazardsCount: 3,
      lastUpdated: '2025-01-08T14:35:00Z',
      hazardCategories: ['Physical hazards', 'Slip/Trip/Fall']
    },
    {
      id: 2,
      submissionDate: '2025-01-08T13:15:00Z',
      worker: 'Maria Rodriguez',
      department: 'Veneer',
      formType: 'maintenance',
      status: 'approved',
      priority: 'medium',
      supervisor: 'Mike Wilson',
      complianceScore: 92,
      shift: 'Day Shift A',
      jobTask: 'Veneer dryer maintenance',
      location: 'Production Line 2',
      hazardsCount: 2,
      lastUpdated: '2025-01-08T15:20:00Z',
      hazardCategories: ['Cut by Sharp Edges', 'Overhead/Suspended']
    },
    {
      id: 3,
      submissionDate: '2025-01-08T12:45:00Z',
      worker: 'David Chen',
      department: 'Plywood',
      formType: 'operational',
      status: 'in-review',
      priority: 'low',
      supervisor: 'Lisa Brown',
      complianceScore: 78,
      shift: 'Day Shift A',
      jobTask: 'Press operation setup',
      location: 'Press Bay 3',
      hazardsCount: 4,
      lastUpdated: '2025-01-08T13:10:00Z',
      hazardCategories: ['Repetitive Strains', 'Physical hazards']
    },
    {
      id: 4,
      submissionDate: '2025-01-08T11:20:00Z',
      worker: 'Jennifer Smith',
      department: 'LVL',
      formType: 'maintenance',
      status: 'rejected',
      priority: 'critical',
      supervisor: 'John Smith',
      complianceScore: 65,
      shift: 'Day Shift A',
      jobTask: 'Beam assembly inspection',
      location: 'Assembly Area 1',
      hazardsCount: 5,
      lastUpdated: '2025-01-08T16:45:00Z',
      hazardCategories: ['Fall From Height', 'Projectiles/Flying Debris', 'Combustible Dust']
    },
    {
      id: 5,
      submissionDate: '2025-01-08T10:30:00Z',
      worker: 'Robert Johnson',
      department: 'Other',
      formType: 'operational',
      status: 'approved',
      priority: 'medium',
      supervisor: 'Sarah Johnson',
      complianceScore: 88,
      shift: 'Day Shift A',
      jobTask: 'Warehouse organization',
      location: 'Storage Area C',
      hazardsCount: 1,
      lastUpdated: '2025-01-08T11:15:00Z',
      hazardCategories: ['Slip/Trip/Fall']
    },
    {
      id: 6,
      submissionDate: '2025-11-19T08:30:00Z',
      worker: 'John Smith',
      department: 'Veneer',
      formType: 'hot work permit',
      status: 'pending',
      priority: 'high',
      supervisor: 'Not Assigned',
      complianceScore: 52,   // mapped from riskScore
      shift: 'Day Shift B',
      jobTask: 'Quality Control Safety Assessment',
      location: 'Main Production Floor',
      hazardsCount: 1,
      lastUpdated: '2025-11-19T09:00:00Z',
      hazardCategories: ['Chemical Testing'],
      hasComments: false
    },
    
    {
      id: 7,
      submissionDate: '2025-11-19T08:30:00Z',
      worker: 'Robert Kim',
      department: 'Veneer',
      formType: 'electrical pass',
      status: 'pending',
      priority: 'medium',
      supervisor: 'Not Assigned',
      complianceScore: 52,   // mapped from riskScore
      shift: 'Day Shift B',
      jobTask: 'Quality Control Safety Assessment',  // mapped from title
      location: 'Main Production Floor',
      hazardsCount: 1,
      lastUpdated: '2025-11-19T08:30:00Z',
      hazardCategories: ['Chemical Testing'],  // mapped from complianceFlags
      hasComments: false
    }
    
  ];

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = mockData?.filter(item => {
      // Role-based filtering
      if (userRole === 'worker') {
        // Workers only see their own forms (mock: filter by current user)
        // In real app, this would filter by actual user ID
      }

      // Search query filter
      if (searchQuery) {
        const searchLower = searchQuery?.toLowerCase();
        const matchesSearch = 
          item?.worker?.toLowerCase()?.includes(searchLower) ||
          item?.jobTask?.toLowerCase()?.includes(searchLower) ||
          item?.location?.toLowerCase()?.includes(searchLower) ||
          item?.department?.toLowerCase()?.includes(searchLower) ||
          item?.hazardCategories?.some(h => h?.toLowerCase()?.includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Date range filter
      if (filters?.dateFrom) {
        const itemDate = new Date(item.submissionDate);
        const fromDate = new Date(filters.dateFrom);
        if (itemDate < fromDate) return false;
      }
      if (filters?.dateTo) {
        const itemDate = new Date(item.submissionDate);
        const toDate = new Date(filters.dateTo);
        toDate?.setHours(23, 59, 59, 999);
        if (itemDate > toDate) return false;
      }

      // Other filters
      if (filters?.formType && item?.formType !== filters?.formType) return false;
      if (filters?.department && item?.department !== filters?.department) return false;
      if (filters?.status && item?.status !== filters?.status) return false;
      if (filters?.priority && item?.priority !== filters?.priority) return false;
      if (filters?.workerName && !item?.worker?.toLowerCase()?.includes(filters?.workerName?.toLowerCase())) return false;

      // Hazard categories filter
      if (filters?.hazardCategories && filters?.hazardCategories?.length > 0) {
        const hasMatchingHazard = filters?.hazardCategories?.some(category =>
          item?.hazardCategories?.includes(category)
        );
        if (!hasMatchingHazard) return false;
      }

      // Compliance score range
      if (filters?.minScore && item?.complianceScore < parseInt(filters?.minScore)) return false;
      if (filters?.maxScore && item?.complianceScore > parseInt(filters?.maxScore)) return false;

      return true;
    });

    // Sort data
    filtered?.sort((a, b) => {
      let aValue = a?.[sortConfig?.key];
      let bValue = b?.[sortConfig?.key];

      // Handle date sorting
      if (sortConfig?.key === 'submissionDate' || sortConfig?.key === 'lastUpdated') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Handle string sorting
      if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [mockData, searchQuery, filters, sortConfig, userRole]);

  // Event handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      formType: '',
      department: '',
      status: '',
      priority: '',
      workerName: '',
      hazardCategories: [],
      minScore: '',
      maxScore: ''
    });
  };

  const handleSaveSearch = (name) => {
    console.log('Saving search:', name);
    // In real app, save to backend
  };

  const handleSearch = (query = searchQuery) => {
    if (query && !searchHistory?.includes(query)) {
      setSearchHistory(prev => [query, ...prev?.slice(0, 9)]);
    }
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
  };

  const handleRowSelect = (id, selected) => {
    setSelectedRows(prev => 
      selected 
        ? [...prev, id]
        : prev?.filter(rowId => rowId !== id)
    );
  };

  const handleSelectAll = (selected) => {
    setSelectedRows(selected ? filteredAndSortedData?.map(item => item?.id) : []);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleRowExpand = (id) => {
    setExpandedRows(prev =>
      prev?.includes(id)
        ? prev?.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const handleBulkStatusUpdate = (status) => {
    console.log('Updating status to:', status, 'for rows:', selectedRows);
    // In real app, make API call
    setSelectedRows([]);
  };

  const handleBulkReassign = (supervisor) => {
    console.log('Reassigning to:', supervisor, 'for rows:', selectedRows);
    // In real app, make API call
    setSelectedRows([]);
  };

  const handleBulkExport = (format) => {
    console.log('Exporting as:', format, 'for rows:', selectedRows);
    // In real app, generate and download file
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedRows?.length} selected forms? This action cannot be undone.`)) {
      console.log('Deleting rows:', selectedRows);
      // In real app, make API call
      setSelectedRows([]);
    }
  };

  // Keyboard shortcuts
  const handleKeyboardSelectAll = () => {
    handleSelectAll(selectedRows?.length !== filteredAndSortedData?.length);
  };

  const handleKeyboardClearSelection = () => {
    setSelectedRows([]);
  };

  const handleKeyboardToggleFilters = () => {
    setFilterSidebarExpanded(!filterSidebarExpanded);
  };

  const handleKeyboardExport = (format) => {
    if (selectedRows?.length > 0) {
      handleBulkExport(format);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole={userRole}
        userName="Sarah Johnson"
        factoryName="Aspen planers ltd. - Plant A"
      />
      <div className="flex">
        <Sidebar 
          userRole={userRole}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className={`flex-1 transition-all duration-200 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'
        }`}>
          <div className="flex h-[calc(100vh-64px)]">
            {/* Filter Sidebar */}
            <FilterSidebar
              isExpanded={filterSidebarExpanded}
              onToggle={() => setFilterSidebarExpanded(!filterSidebarExpanded)}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              onSaveSearch={handleSaveSearch}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header Section */}
              <div className="p-6 border-b border-border bg-card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Form Data Management</h1>
                    <p className="text-muted-foreground mt-1">
                      Search, filter, and manage safety form submissions
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <SyncStatusIndicator
                      syncStatus={syncStatus}
                      lastSyncTime={lastSyncTime}
                      pendingChanges={pendingChanges}
                    />
                    
                    <Button
                      variant="default"
                      iconName="Plus"
                      iconPosition="left"
                      onClick={() => window.location.href = '/pre-job-safety-survey-form'}
                    >
                      New Form
                    </Button>
                  </div>
                </div>

                {/* Search Bar */}
                <SearchBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onSearch={handleSearch}
                  searchHistory={searchHistory}
                  onClearHistory={handleClearHistory}
                />

                {/* Results Summary */}
                <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                  <div>
                    Showing {filteredAndSortedData?.length} of {mockData?.length} forms
                    {searchQuery && (
                      <span> for "{searchQuery}"</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span>Sort by: {sortConfig?.key} ({sortConfig?.direction})</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="RefreshCw"
                      iconPosition="left"
                      onClick={() => setSyncStatus('syncing')}
                    >
                      Refresh
                    </Button>
                  </div>
                </div>
              </div>

              {/* Bulk Operations Toolbar */}
              <BulkOperationsToolbar
                selectedCount={selectedRows?.length}
                onBulkStatusUpdate={handleBulkStatusUpdate}
                onBulkReassign={handleBulkReassign}
                onBulkExport={handleBulkExport}
                onBulkDelete={handleBulkDelete}
                userRole={userRole}
              />

              {/* Data Grid */}
              <div className="flex-1 p-6 pt-0 overflow-hidden">
                <DataGrid
                  data={filteredAndSortedData}
                  selectedRows={selectedRows}
                  onRowSelect={handleRowSelect}
                  onSelectAll={handleSelectAll}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  onRowExpand={handleRowExpand}
                  expandedRows={expandedRows}
                  userRole={userRole}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Keyboard Shortcuts Handler */}
      <KeyboardShortcuts
        onSearch={() => handleSearch()}
        onSelectAll={handleKeyboardSelectAll}
        onClearSelection={handleKeyboardClearSelection}
        onToggleFilters={handleKeyboardToggleFilters}
        onExport={handleKeyboardExport}
        selectedRows={selectedRows}
        data={filteredAndSortedData}
      />
    </div>
  );
};

export default FormDataManagementSearch;