import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FormPreviewPanel = ({ selectedForm, onApprove, onReject, onReassign }) => {
  const [comment, setComment] = useState('');
  const [showCommentHistory, setShowCommentHistory] = useState(true);

  if (!selectedForm) {
    return (
      <div className="h-full bg-card border-l border-border flex items-center justify-center">
        <div className="text-center space-y-4">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-medium text-foreground">No Form Selected</h3>
            <p className="text-sm text-muted-foreground">
              Select a form from the queue to view details and take action
            </p>
          </div>
        </div>
      </div>
    );
  }

  const mockComments = [
    {
      id: 1,
      author: 'System',
      timestamp: new Date('2025-01-08T14:30:00'),
      type: 'system',
      content: 'Form submitted for review'
    },
    {
      id: 2,
      author: 'Mike Johnson',
      timestamp: new Date('2025-01-08T14:32:00'),
      type: 'worker',
      content: 'Added additional notes about the crane operation safety concerns. Please review the height work section carefully.'
    },
    {
      id: 3,
      author: 'Sarah Martinez',
      timestamp: new Date('2025-01-08T14:45:00'),
      type: 'supervisor',
      content: 'Reviewed initial submission. Need clarification on PPE requirements for this specific task.'
    }
  ];

  const mockFormData = {
    basicInfo: {
      date: '2025-01-08',
      time: '14:30',
      shift: 'Day Shift',
      department: selectedForm?.department,
      jobTask: 'Log yard crane operation and material handling',
      location: 'Log Yard - Section A, Crane Bay 2'
    },
    hazards: [
      { category: 'Physical Hazards', identified: true, controls: 'Hard hat, safety vest, steel-toed boots' },
      { category: 'Fall From Height', identified: true, controls: 'Safety harness, fall arrest system' },
      { category: 'Overhead/Suspended', identified: true, controls: 'Exclusion zone, spotter assigned' },
      { category: 'Cut by Sharp Edges', identified: false, controls: 'N/A' }
    ],
    ergonomics: {
      helpAvailable: true,
      surroundingsChecked: true,
      standingPosition: true,
      toolsInspected: true,
      peopleInformed: true,
      pathwaysClear: true,
      weightManageable: true,
      positionComfortable: true,
      ppeWorn: true,
      lockoutApplied: true
    },
    spvSignature: 'Pending Review',
    riskAssessment: selectedForm?.riskScore
  };

  const handleApprove = () => {
    onApprove(selectedForm?.id, comment);
    setComment('');
  };

  const handleReject = () => {
    onReject(selectedForm?.id, comment);
    setComment('');
  };

  const formatTimestamp = (date) => {
    return date?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCommentIcon = (type) => {
    switch (type) {
      case 'system': return 'Settings';
      case 'worker': return 'User';
      case 'supervisor': return 'UserCheck';
      default: return 'MessageSquare';
    }
  };

  const getCommentColor = (type) => {
    switch (type) {
      case 'system': return 'text-muted-foreground';
      case 'worker': return 'text-primary';
      case 'supervisor': return 'text-accent';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="h-full bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">{selectedForm?.id}</h2>
            <p className="text-sm text-muted-foreground">{selectedForm?.title}</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  selectedForm?.type === 'operational' ? 'bg-success' : 'bg-warning'
                }`}></div>
                <span className="text-sm capitalize">{selectedForm?.type}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={14} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {selectedForm?.slaRemaining}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" iconName="Download" />
            <Button variant="ghost" size="icon" iconName="Printer" />
            <Button variant="ghost" size="icon" iconName="ExternalLink" />
          </div>
        </div>

        {/* Risk Score and Compliance */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Risk Score</p>
            <div className="flex items-center space-x-2">
              <span className={`text-2xl font-bold ${
                selectedForm?.riskScore >= 90 ? 'text-error' :
                selectedForm?.riskScore >= 70 ? 'text-warning' :
                selectedForm?.riskScore >= 50 ? 'text-accent' : 'text-success'
              }`}>
                {selectedForm?.riskScore}
              </span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    selectedForm?.riskScore >= 90 ? 'bg-error' :
                    selectedForm?.riskScore >= 70 ? 'bg-warning' :
                    selectedForm?.riskScore >= 50 ? 'bg-accent' : 'bg-success'
                  }`}
                  style={{ width: `${selectedForm?.riskScore}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Compliance Flags</p>
            <div className="flex flex-wrap gap-1">
              {selectedForm?.complianceFlags?.map((flag, index) => (
                <span 
                  key={index}
                  className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full"
                >
                  {flag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Basic Information */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Date:</span>
              <span className="ml-2 text-foreground">{mockFormData?.basicInfo?.date}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Time:</span>
              <span className="ml-2 text-foreground">{mockFormData?.basicInfo?.time}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Shift:</span>
              <span className="ml-2 text-foreground">{mockFormData?.basicInfo?.shift}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Department:</span>
              <span className="ml-2 text-foreground">{mockFormData?.basicInfo?.department}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-muted-foreground text-sm">Job/Task:</span>
              <p className="text-foreground text-sm mt-1">{mockFormData?.basicInfo?.jobTask}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-sm">Location:</span>
              <p className="text-foreground text-sm mt-1">{mockFormData?.basicInfo?.location}</p>
            </div>
          </div>
        </div>

        {/* Hazards Assessment */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Hazards Assessment</h3>
          <div className="space-y-2">
            {mockFormData?.hazards?.map((hazard, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                <Icon 
                  name={hazard?.identified ? "CheckCircle" : "Circle"} 
                  size={16} 
                  className={hazard?.identified ? "text-success" : "text-muted-foreground"} 
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{hazard?.category}</p>
                  <p className="text-sm text-muted-foreground mt-1">{hazard?.controls}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ergonomics Checklist */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Ergonomics Checklist</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(mockFormData?.ergonomics)?.map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <Icon 
                  name={value ? "CheckCircle" : "XCircle"} 
                  size={14} 
                  className={value ? "text-success" : "text-error"} 
                />
                <span className="text-sm text-foreground capitalize">
                  {key?.replace(/([A-Z])/g, ' $1')?.trim()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Comments Section */}
      <div className="border-t border-border">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Comments & History</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowCommentHistory(!showCommentHistory)}
              iconName={showCommentHistory ? "ChevronUp" : "ChevronDown"}
            >
              {showCommentHistory ? 'Hide' : 'Show'}
            </Button>
          </div>

          {showCommentHistory && (
            <div className="space-y-3 mb-4 max-h-32 overflow-y-auto">
              {mockComments?.map((comment) => (
                <div key={comment?.id} className="flex items-start space-x-3">
                  <Icon 
                    name={getCommentIcon(comment?.type)} 
                    size={16} 
                    className={getCommentColor(comment?.type)} 
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{comment?.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(comment?.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment?.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3">
            <Input
              label="Add Comment"
              type="text"
              placeholder="Add your review comments..."
              value={comment}
              onChange={(e) => setComment(e?.target?.value)}
              className="mb-3"
            />

            <div className="flex items-center space-x-2">
              <Button 
                variant="success" 
                size="sm" 
                iconName="Check" 
                iconPosition="left"
                onClick={handleApprove}
                disabled={!comment?.trim()}
              >
                Approve
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                iconName="X" 
                iconPosition="left"
                onClick={handleReject}
                disabled={!comment?.trim()}
              >
                Reject
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                iconName="UserCheck" 
                iconPosition="left"
                onClick={() => onReassign(selectedForm?.id)}
              >
                Reassign
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPreviewPanel;