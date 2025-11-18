import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const HazardCategory = ({ 
  category, 
  isExpanded, 
  onToggle, 
  formData, 
  onChange, 
  formType 
}) => {
  const [selectedHazards, setSelectedHazards] = useState(formData?.[category?.id] || {});

  const handleHazardChange = (hazardId, checked) => {
    const updated = {
      ...selectedHazards,
      [hazardId]: checked
    };
    setSelectedHazards(updated);
    onChange(category?.id, updated);
  };

  const handleControlMeasureChange = (hazardId, controlId, checked) => {
    const hazardKey = `${hazardId}_controls`;
    const currentControls = selectedHazards?.[hazardKey] || {};
    const updated = {
      ...selectedHazards,
      [hazardKey]: {
        ...currentControls,
        [controlId]: checked
      }
    };
    setSelectedHazards(updated);
    onChange(category?.id, updated);
  };

  const getCompletionStatus = () => {
    const selectedCount = Object.values(selectedHazards)?.filter(Boolean)?.length;
    const totalHazards = category?.hazards?.length;
    return { selected: selectedCount, total: totalHazards };
  };

  const status = getCompletionStatus();
  const isComplete = status?.selected > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-4">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isComplete ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            <Icon 
              name={category?.icon} 
              size={20} 
              className={isComplete ? 'text-green-600' : 'text-gray-500'}
            />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">{category?.name}</h3>
            <p className="text-sm text-gray-600">{category?.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {status?.selected}/{status?.total} Items
            </div>
            <div className={`text-xs ${isComplete ? 'text-green-600' : 'text-gray-500'}`}>
              {isComplete ? 'In Progress' : 'Not Started'}
            </div>
          </div>
          <Icon 
            name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
            size={20} 
            className="text-gray-400"
          />
        </div>
      </button>
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-100">
          <div className="mt-4 space-y-4">
            {category?.hazards?.map((hazard) => (
              <div key={hazard?.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  {hazard?.id !== "anything_changed" && (
                    <Checkbox
                      checked={selectedHazards?.[hazard?.id] || false}
                      onChange={(e) => handleHazardChange(hazard?.id, e?.target?.checked)}
                      className="mt-1"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{hazard?.name}</h4>
                      {hazard?.severity && (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          hazard?.severity === 'high' ? 'bg-red-100 text-red-700' :
                          hazard?.severity === 'medium'? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {hazard?.severity?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    {hazard?.id === "anything_changed" && (
                      <textarea
                        value={selectedHazards?.[hazard?.id + "_text"] || ""}
                        onChange={(e) => handleTextChange(hazard?.id + "_text", e.target.value)}
                        placeholder="Please describe the change..."
                        className="w-full border rounded-md p-2 text-sm text-gray-700 mt-2"
                        rows={3}
                      />
                    )}
                    <p className="text-sm text-gray-600 mt-1">{hazard?.description}</p>
                    
                    {selectedHazards?.[hazard?.id] && hazard?.controlMeasures && (
                      <div className="mt-4 pl-4 border-l-2 border-blue-200">
                        <h5 className="font-medium text-gray-900 mb-2">Required Control Measures:</h5>
                        <div className="space-y-2">
                          {hazard?.controlMeasures?.map((control) => (
                            <div key={control?.id} className="flex items-start space-x-2">
                              <Checkbox
                                checked={selectedHazards?.[`${hazard?.id}_controls`]?.[control?.id] || false}
                                onChange={(e) => handleControlMeasureChange(hazard?.id, control?.id, e?.target?.checked)}
                                size="sm"
                              />
                              <label className="text-sm text-gray-700">{control?.name}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HazardCategory;