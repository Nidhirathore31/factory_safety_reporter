import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CompletionSidebar = ({ 
  formData, 
  errors, 
  onSubmit, 
  isSubmitting, 
  formType 
}) => {
  const sections = [
    {
      id: 'employee',
      name: 'Employee Information',
      icon: 'User',
      required: true,
      fields: ['employeeNames', 'date', 'time', 'shift', 'department', 'jobTask', 'location']
    },
    {
      id: 'inspections',
      name: 'Inspections',
      // icon: 'User',
      required: true,
      fields: ['inspectionCategories']
    },
    {
      id: 'hazards',
      name: 'Hazard Assessment',
      icon: 'AlertTriangle',
      required: true,
      fields: ['hazardCategories']
    },
    {
      id: 'inspection',
      name: 'Inspection Checklist',
      icon: 'CheckSquare',
      required: true,
      fields: ['inspectionChecklist']
    },
    {
      id: 'spv',
      name: 'SPV Verification',
      icon: 'Shield',
      required: true,
      fields: ['spv']
    }
  ];

  const getSectionCompletion = (section) => {
    let completed = 0;
    let total = section?.fields?.length;

    section?.fields?.forEach(field => {
      if (field === 'hazardCategories') {
        // Check if at least one hazard category has selections
        const hasHazardSelections = Object.keys(formData)?.some(key => 
          key?.startsWith('physical') || key?.startsWith('slip') || key?.startsWith('sharp') ||
          key?.startsWith('projectiles') || key?.startsWith('overhead') || key?.startsWith('repetitive') ||
          key?.startsWith('fall') || key?.startsWith('combustible')
        );
        if (hasHazardSelections) completed++;
      } else if (field === 'inspectionCategories') {
        const hasInspactionSelections = Object.keys(formData)?.some(key => 
          key?.startsWith('ppe') || key?.startsWith('work_area') || key?.startsWith('standing_surface') ||
          key?.startsWith('tools') || key?.startsWith('equipment') || key?.startsWith('permits')
        );
        if (hasInspactionSelections) completed++;
      } else if (field === 'inspectionChecklist') {
        // Check if inspection checklist has some answers
        const hasInspectionAnswers = formData?.inspectionChecklist && 
          Object.keys(formData?.inspectionChecklist)?.length > 0;
        if (hasInspectionAnswers) completed++;
      } else if (field === 'spv') {
        // Check SPV section completion
        const spvData = formData?.spv || {};
        const hasRequiredSpvFields = spvData?.spvName && spvData?.spvEmployeeId && 
          spvData?.signature && spvData?.criticalQuestions;
        if (hasRequiredSpvFields) completed++;
      } else {
        // Regular field check
        if (formData?.[field]) completed++;
      }
    });

    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const getOverallCompletion = () => {
    let totalCompleted = 0;
    let totalFields = 0;

    sections?.forEach(section => {
      const completion = getSectionCompletion(section);
      totalCompleted += completion?.completed;
      totalFields += completion?.total;
    });

    return Math.round((totalCompleted / totalFields) * 100);
  };

  const getMandatoryFieldsStatus = () => {
    const mandatoryFields = [
      'employeeNames', 'date', 'time', 'shift', 'department', 
      'jobTask', 'location'
    ];

    const missing = mandatoryFields?.filter(field => !formData?.[field]);
    return {
      completed: mandatoryFields?.length - missing?.length,
      total: mandatoryFields?.length,
      missing
    };
  };

  const overallCompletion = getOverallCompletion();
  const mandatoryStatus = getMandatoryFieldsStatus();
  const canSubmit = overallCompletion >= 80 && mandatoryStatus?.missing?.length === 0;

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
      <div className="sticky top-0 bg-white pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Progress</h3>
        
        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Overall Completion</span>
            <span>{overallCompletion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                formType === 'operational' ? 'bg-green-600' : 'bg-orange-600'
              }`}
              style={{ width: `${overallCompletion}%` }}
            />
          </div>
        </div>

        {/* Section Progress */}
        <div className="space-y-4 mb-6">
          {sections?.map((section) => {
            const completion = getSectionCompletion(section);
            const isComplete = completion?.percentage === 100;
            const hasErrors = section?.fields?.some(field => errors?.[field]);

            return (
              <div key={section?.id} className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  hasErrors ? 'bg-red-100' :
                  isComplete ? 'bg-green-100' : 
                  completion?.percentage > 0 ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                  <Icon 
                    name={
                      hasErrors ? 'AlertCircle' :
                      isComplete ? 'CheckCircle' : section?.icon
                    } 
                    size={16} 
                    className={
                      hasErrors ? 'text-red-600' :
                      isComplete ? 'text-green-600' : 
                      completion?.percentage > 0 ? 'text-yellow-600' : 'text-gray-500'
                    }
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{section?.name}</span>
                    <span className="text-xs text-gray-500">{completion?.percentage}%</span>
                  </div>
                  {section?.required && (
                    <span className="text-xs text-gray-500">Required</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mandatory Fields Status */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Mandatory Fields</h4>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Completed:</span>
            <span className={mandatoryStatus?.missing?.length === 0 ? 'text-green-600' : 'text-red-600'}>
              {mandatoryStatus?.completed}/{mandatoryStatus?.total}
            </span>
          </div>
          {mandatoryStatus?.missing?.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-red-600 mb-1">Missing fields:</p>
              <ul className="text-xs text-red-600 space-y-1">
                {mandatoryStatus?.missing?.map(field => (
                  <li key={field}>• {field?.replace(/([A-Z])/g, ' $1')?.replace(/^./, str => str?.toUpperCase())}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="space-y-3">
          <Button
            variant={canSubmit ? "default" : "outline"}
            fullWidth
            disabled={!canSubmit || isSubmitting}
            loading={isSubmitting}
            onClick={onSubmit}
            iconName={canSubmit ? "Send" : "AlertCircle"}
            iconPosition="left"
          >
            {isSubmitting ? 'Submitting...' : canSubmit ?'Submit Safety Form' : 'Complete Required Fields'}
          </Button>

          {!canSubmit && (
            <p className="text-xs text-gray-500 text-center">
              Complete at least 80% of the form and all mandatory fields to submit
            </p>
          )}
        </div>

        {/* Form Info */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>Form Type:</span>
              <span className="capitalize font-medium">{formType}</span>
            </div>
            <div className="flex justify-between">
              <span>Last Saved:</span>
              <span>Auto-saved</span>
            </div>
            <div className="flex justify-between">
              <span>Version:</span>
              <span>Aspen planers ltd.-2025-v1.2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionSidebar;