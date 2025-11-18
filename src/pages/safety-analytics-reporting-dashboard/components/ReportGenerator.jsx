import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const ReportGenerator = ({ onGenerateReport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reportConfig, setReportConfig] = useState({
    type: 'compliance',
    format: 'pdf',
    schedule: 'manual',
    includeCharts: true,
    includeRawData: false,
    recipients: '',
    reportName: ''
  });

  const reportTypeOptions = [
    { value: 'compliance', label: 'OSHA Compliance Report' },
    { value: 'incident-summary', label: 'Incident Summary Report' },
    { value: 'department-analysis', label: 'Department Analysis Report' },
    { value: 'trend-analysis', label: 'Trend Analysis Report' },
    { value: 'worker-performance', label: 'Worker Performance Report' },
    { value: 'hazard-assessment', label: 'Hazard Assessment Report' },
    { value: 'custom', label: 'Custom Report' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'csv', label: 'CSV Data File' },
    { value: 'json', label: 'JSON Data Export' }
  ];

  const scheduleOptions = [
    { value: 'manual', label: 'Generate Now' },
    { value: 'daily', label: 'Daily Schedule' },
    { value: 'weekly', label: 'Weekly Schedule' },
    { value: 'monthly', label: 'Monthly Schedule' },
    { value: 'quarterly', label: 'Quarterly Schedule' }
  ];

  const handleConfigChange = (key, value) => {
    setReportConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerateReport = () => {
    onGenerateReport(reportConfig);
    setIsOpen(false);
  };

  const savedReports = [
    {
      id: 1,
      name: "Monthly OSHA Compliance",
      type: "compliance",
      lastGenerated: "2025-08-07",
      schedule: "monthly"
    },
    {
      id: 2,
      name: "Weekly Incident Summary",
      type: "incident-summary",
      lastGenerated: "2025-08-06",
      schedule: "weekly"
    },
    {
      id: 3,
      name: "Department Safety Analysis",
      type: "department-analysis",
      lastGenerated: "2025-08-05",
      schedule: "manual"
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg industrial-shadow">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Report Generation</h3>
        <Button
          variant="default"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          iconName="FileText"
          iconPosition="left"
        >
          Generate Report
        </Button>
      </div>
      {isOpen && (
        <div className="p-4 border-b border-border bg-muted">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Report Name"
              type="text"
              placeholder="Enter report name"
              value={reportConfig?.reportName}
              onChange={(e) => handleConfigChange('reportName', e?.target?.value)}
            />
            
            <Select
              label="Report Type"
              options={reportTypeOptions}
              value={reportConfig?.type}
              onChange={(value) => handleConfigChange('type', value)}
            />
            
            <Select
              label="Format"
              options={formatOptions}
              value={reportConfig?.format}
              onChange={(value) => handleConfigChange('format', value)}
            />
            
            <Select
              label="Schedule"
              options={scheduleOptions}
              value={reportConfig?.schedule}
              onChange={(value) => handleConfigChange('schedule', value)}
            />
          </div>

          <div className="space-y-3 mb-4">
            <Checkbox
              label="Include Charts and Visualizations"
              checked={reportConfig?.includeCharts}
              onChange={(e) => handleConfigChange('includeCharts', e?.target?.checked)}
            />
            <Checkbox
              label="Include Raw Data Tables"
              checked={reportConfig?.includeRawData}
              onChange={(e) => handleConfigChange('includeRawData', e?.target?.checked)}
            />
          </div>

          {reportConfig?.schedule !== 'manual' && (
            <Input
              label="Email Recipients"
              type="email"
              placeholder="Enter email addresses separated by commas"
              description="Reports will be automatically sent to these recipients"
              value={reportConfig?.recipients}
              onChange={(e) => handleConfigChange('recipients', e?.target?.value)}
              className="mb-4"
            />
          )}

          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleGenerateReport}
              iconName="Download"
              iconPosition="left"
            >
              Generate Report
            </Button>
          </div>
        </div>
      )}
      {/* Saved Reports */}
      <div className="p-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Recent Reports</h4>
        <div className="space-y-2">
          {savedReports?.map((report) => (
            <div key={report?.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="FileText" size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{report?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Last generated: {report?.lastGenerated} • {report?.schedule}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" title="Download">
                  <Icon name="Download" size={16} />
                </Button>
                <Button variant="ghost" size="icon" title="Edit">
                  <Icon name="Edit" size={16} />
                </Button>
                <Button variant="ghost" size="icon" title="Delete">
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;