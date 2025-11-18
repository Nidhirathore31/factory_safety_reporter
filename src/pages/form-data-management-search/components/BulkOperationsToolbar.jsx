import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkOperationsToolbar = ({ 
  selectedCount, 
  onBulkStatusUpdate, 
  onBulkReassign, 
  onBulkExport, 
  onBulkDelete,
  userRole 
}) => {
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [showReassign, setShowReassign] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [exportFormat, setExportFormat] = useState('');

  const statusOptions = [
    { value: 'pending', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'in-review', label: 'In Review' }
  ];

  const supervisorOptions = [
    { value: 'john-smith', label: 'John Smith' },
    { value: 'sarah-johnson', label: 'Sarah Johnson' },
    { value: 'mike-wilson', label: 'Mike Wilson' },
    { value: 'lisa-brown', label: 'Lisa Brown' }
  ];

  const exportOptions = [
    { value: 'csv', label: 'CSV File' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'pdf', label: 'PDF Report' }
  ];

  const handleStatusUpdate = () => {
    if (selectedStatus) {
      onBulkStatusUpdate(selectedStatus);
      setSelectedStatus('');
      setShowStatusUpdate(false);
    }
  };

  const handleReassign = () => {
    if (selectedSupervisor) {
      onBulkReassign(selectedSupervisor);
      setSelectedSupervisor('');
      setShowReassign(false);
    }
  };

  const handleExport = () => {
    if (exportFormat) {
      onBulkExport(exportFormat);
      setExportFormat('');
      setShowExport(false);
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-accent" />
            <span className="text-sm font-medium text-foreground">
              {selectedCount} form{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Status Update */}
          {userRole !== 'worker' && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowStatusUpdate(!showStatusUpdate)}
                iconName="Edit"
                iconPosition="left"
              >
                Update Status
              </Button>
              
              {showStatusUpdate && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-popover border border-border rounded-lg industrial-shadow z-200">
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-popover-foreground mb-3">Update Status</h4>
                    <Select
                      options={statusOptions}
                      value={selectedStatus}
                      onChange={setSelectedStatus}
                      placeholder="Select new status"
                      className="mb-3"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowStatusUpdate(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleStatusUpdate}
                        disabled={!selectedStatus}
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reassign */}
          {userRole === 'admin' && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReassign(!showReassign)}
                iconName="UserCheck"
                iconPosition="left"
              >
                Reassign
              </Button>
              
              {showReassign && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-popover border border-border rounded-lg industrial-shadow z-200">
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-popover-foreground mb-3">Reassign to Supervisor</h4>
                    <Select
                      options={supervisorOptions}
                      value={selectedSupervisor}
                      onChange={setSelectedSupervisor}
                      placeholder="Select supervisor"
                      className="mb-3"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowReassign(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleReassign}
                        disabled={!selectedSupervisor}
                      >
                        Reassign
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Export */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExport(!showExport)}
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>
            
            {showExport && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-popover border border-border rounded-lg industrial-shadow z-200">
                <div className="p-4">
                  <h4 className="text-sm font-medium text-popover-foreground mb-3">Export Selected Forms</h4>
                  <Select
                    options={exportOptions}
                    value={exportFormat}
                    onChange={setExportFormat}
                    placeholder="Select format"
                    className="mb-3"
                  />
                  <div className="text-xs text-muted-foreground mb-3">
                    Current filters will be preserved in the export.
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowExport(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleExport}
                      disabled={!exportFormat}
                    >
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Delete (Admin only) */}
          {userRole === 'admin' && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onBulkDelete}
              iconName="Trash2"
              iconPosition="left"
            >
              Delete
            </Button>
          )}

          {/* Performance Warning */}
          {selectedCount > 100 && (
            <div className="flex items-center space-x-2 px-3 py-2 bg-warning/20 text-warning-foreground rounded-md">
              <Icon name="AlertTriangle" size={16} />
              <span className="text-xs">
                Large selection may take longer to process
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Click outside handlers */}
      {(showStatusUpdate || showReassign || showExport) && (
        <div 
          className="fixed inset-0 z-100" 
          onClick={() => {
            setShowStatusUpdate(false);
            setShowReassign(false);
            setShowExport(false);
          }}
        />
      )}
    </div>
  );
};

export default BulkOperationsToolbar;